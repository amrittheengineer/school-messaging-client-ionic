import React, { useEffect, useContext, useState, useReducer, useRef, useLayoutEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, IonCard, IonLoading, IonButton, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonIcon, isPlatform, useIonViewDidEnter, IonToast, } from '@ionic/react';
import { SignUpContextProvider, SignUpContext } from '../context/SignUpContext';
import { SignUpContextWebProvider, SignUpContextWeb } from '../context/SignUpContextWeb';
import { firebase } from '../modules/firebase';

// import classRoom from '../images/classroom.svg';
import introAvatar from '../images/get_started.svg';
import request from '../modules/request';
import { Toast } from '@capacitor/core';
const Auth: React.FC<RouteComponentProps> = ({ history }) => {
    const onSignIn = () => {
        history.replace("/app/tab2")
    }
    if (isPlatform("capacitor") || isPlatform("cordova")) {
        return (
            <SignUpContextProvider>
                <AuthCore onSignIn={onSignIn} />
            </SignUpContextProvider>
        )
    } else {
        return (
            <SignUpContextWebProvider>
                <AuthCoreWeb onSignIn={onSignIn} />
            </SignUpContextWebProvider>
        )
    }
}
interface State {
    screenNumber: number;
    screenType?: string;
    timer?: number;
    message?: string;
}
interface Action {
    type: "get_started_clicked" | "otp_sent" | "otp_resent" | "on_verification" | "otp_btn_clicked" | "otp_resend_clicked"
}

const AuthCoreWeb: React.FC<{ onSignIn: () => void; }> = ({ onSignIn }) => {

    const { sendOtpWeb, verifyOtpWeb, setSignInCallBack, updateUserData } = useContext(SignUpContextWeb)!;
    const [timer, setTimer] = useState<number>(0);
    const [inputDisabled, setInputDisabled] = useState<boolean>(false);
    const [progressScreen, setProgressScreen] = useReducer((prevstate: State, action: Action) => {
        if (action.type === "get_started_clicked") {
            return { screenNumber: 1, screenType: "get_started_clicked", message: "Sending OTP" };
        } else if (action.type === "otp_sent") {
            setTimer(30);
            return { screenNumber: prevstate.screenNumber, screenType: "otp_sent", };
        } else if (action.type === "otp_resent") {
            return { screenNumber: prevstate.screenNumber, screenType: prevstate.screenType, message: "Sending OTP" };
        } else if (action.type === "on_verification") {
            return { screenNumber: prevstate.screenNumber, screenType: prevstate.screenType, message: "On Verification" };
        }
        else if (action.type === "otp_btn_clicked") {
            return Object.assign({}, prevstate, { screenType: action.type, message: "Sending OTP" });
        }
        else if (action.type === "otp_resend_clicked") {
            return Object.assign({}, prevstate, { screenType: action.type, message: "Sending OTP again" });
        }
        else {
            return prevstate;
        }
    }, { screenNumber: 0 });
    const [loadingVisibility, setLoadingVisibility] = useState<boolean>(false);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const phone_string = useRef<string>("");
    const [user_exists, setUserExists] = useState<boolean>(false);
    const otp_string = useRef<string>("");
    const student_name_string = useRef<string>("");
    const class_id_string = useRef<string>("");
    const [toastMessage, setToastMessage] = useState<string>("");
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage("");
        }, 1000);
    }

    // const [verifyCaptcha, setVerifyCaptcha] = useState<firebase.auth.RecaptchaVerifier | null>(null);
    // const [verifyCaptcha, setVerifyCaptcha] = useState<firebase.auth.RecaptchaVerifier | null>(null);
    // useEffect(() => {
    //     // window.recaptchaVerifier = 
    //     // let ver = new firebase.auth.RecaptchaVerifier(
    //     //     "recaptcha-sign-in",
    //     //     {
    //     //         size: "invisible",
    //     //         callback: (res: any) => {
    //     //             console.log(res);
    //     //             setLoadingVisibility(true);
    //     //             sendOtpWeb(phone_string.current || "").then(() => {
    //     //                 setProgressScreen({ type: "otp_sent" })
    //     //             }).catch(err => {
    //     //                 // Error in sending OTP
    //     //                 alert(err);
    //     //             }).finally(() => {
    //     //                 setLoadingVisibility(false);
    //     //             })
    //     //         }
    //     //     }
    //     // );
    //     // ver
    //     // verifyCaptcha.current = ver;

    // }, []);
    useEffect(() => {
        if (timer === 0 && timerInterval.current !== null) {
            clearInterval(timerInterval.current!);
        } else if (timer > 0) {
            timerInterval.current = setInterval(() => {
                setTimer(timer - 1);
            }, 1000)
        }
        return () => {
            if (timerInterval.current) clearInterval(timerInterval.current!);
        }
    }, [timer])
    // const setCallBack = useContext(SignUpContext)?.setSignInCallBack
    useEffect(() => {
        if (onSignIn && setSignInCallBack) setSignInCallBack(onSignIn);
    }, []);

    const recaptchaRender = () => {
        // console.log(verifyCaptcha);
        // console.log(window.recaptchaVerifier);
        if (phone_string.current.length !== 10) {
            showToast("Please enter a valid phone number.")
            return;
        } else if (!class_id_string.current) {
            showToast("Please enter the Class ID.")
            return;

        }
        const { requestPromise } = request(`/api/student/verify-section/${class_id_string.current.trim()}?phone=${phone_string.current}`, { method: "GET" });
        requestPromise.then(({ data }) => {
            const { classExists, userExists } = data;
            setUserExists(userExists);
            // alert(data);
            if (!classExists) {
                showToast("No class exists.");

                // Toast.show({ text: "No class exists.", duration: "long" });
            } else {
                setInputDisabled(true);


                setProgressScreen({ type: "otp_btn_clicked" });
            }
        }).catch(err => {
            console.error(err);
            showToast("Try again later.")

            // Toast.show({ text: "Try again later", duration: "long" });
        })
        // setTimeout(() => {

        //     setLoadingVisibility(false);
        //     // setProgressScreen({ type: "otp_sent" });
        // }, 1000);
        // tempLogin();
        // onSignIn();
        // console.log(setSignInCallBack);


        // verifyCaptcha.current?.render();
        // verifyCaptcha
    }
    const otpSendFunction = (callback: () => void) => {

        setLoadingVisibility(true);
        console.log(phone_string.current);
        sendOtpWeb(phone_string.current || "").then(() => {
            callback();
            showToast("OTP Sent")
        }).catch(err => {
            // Error in sending OTP
            alert("Problem in sending OTP. Try again later. " + err);
        }).finally(() => {
            setLoadingVisibility(false);
        })
    }
    // const verifyClick = () => {
    //     console.log(verifyCaptcha.current);
    //     verifyCaptcha.current?.render();
    // }
    return (
        <IonPage>
            <IonLoading isOpen={loadingVisibility} message={progressScreen.message} />
            <IonContent>
                <IonToast
                    isOpen={toastMessage !== ""}
                    onDidDismiss={() => setToastMessage("")}
                    message={toastMessage}
                    duration={1000}
                    color="primary"
                />
                <div className="page-container">

                    {

                        (function () {
                            if (progressScreen.screenNumber === 0) {
                                return (
                                    <>
                                        <div className="intro-avatar-container">
                                            <div className="intro-title">Welcome!</div>
                                            <div className="intro-subtitle">to new St. Marys App</div>
                                            <IonIcon className="intro-avatar" icon={introAvatar} />
                                        </div>
                                        <div className="get-started-container">
                                            <div className="get-started-message">Log in to get started.</div>
                                            <IonButton className="get-started-btn" onClick={() => {
                                                setProgressScreen({ type: "get_started_clicked" })
                                            }}>Get Started</IonButton>
                                        </div>
                                    </>
                                )
                            } else if (progressScreen.screenNumber === 1) {
                                return (
                                    <>
                                        <div className="login-header">
                                            <div className="screen-name">
                                                <div className="title">Enter the details</div>
                                            </div>
                                        </div>
                                        <div className="login-body">
                                            <IonCard className="sign-in-card">
                                                <IonGrid className="form-container-grid">

                                                    {
                                                        progressScreen.screenType === "otp_sent"
                                                            ?
                                                            <IonRow className="form-input">
                                                                <IonCol>
                                                                    <IonItem>
                                                                        <IonLabel position="floating">Enter OTP</IonLabel>

                                                                        <IonInput onInput={e => {
                                                                            otp_string.current = e.currentTarget.value?.toString().trim() || "";
                                                                        }} type="tel" maxlength={6} minlength={6}></IonInput>
                                                                    </IonItem>
                                                                </IonCol>
                                                            </IonRow>
                                                            :
                                                            <>
                                                                <IonRow style={!inputDisabled ? {} : { display: "none" }} className="form-input">
                                                                    <IonCol>
                                                                        <IonItem>
                                                                            <IonLabel position="floating">Phone Number</IonLabel>
                                                                            <IonInput disabled={inputDisabled} onInput={e => {
                                                                                phone_string.current = e.currentTarget.value?.toString().trim() || "";
                                                                            }} type="tel" maxlength={10} minlength={10}></IonInput>
                                                                        </IonItem>
                                                                    </IonCol>
                                                                </IonRow>
                                                                <IonRow style={!inputDisabled ? {} : { display: "none" }} className="form-input">
                                                                    <IonCol>
                                                                        <IonItem>
                                                                            <IonLabel position="floating">Class Id</IonLabel>
                                                                            <IonInput disabled={inputDisabled} onInput={e => {
                                                                                class_id_string.current = e.currentTarget.value?.toString().trim() || "";
                                                                            }} type="text" ></IonInput>
                                                                        </IonItem>
                                                                    </IonCol>
                                                                </IonRow>
                                                                <IonRow style={inputDisabled && !user_exists ? {} : { display: "none" }} className="form-input">
                                                                    <IonCol>
                                                                        <IonItem>
                                                                            <IonLabel position="floating">Student Name</IonLabel>
                                                                            <IonInput onInput={e => {
                                                                                student_name_string.current = e.currentTarget.value?.toString().trim() || "";
                                                                            }} type="text" ></IonInput>
                                                                        </IonItem>
                                                                    </IonCol>
                                                                </IonRow>
                                                            </>
                                                    }
                                                    <div className="btn-actions">
                                                        {
                                                            (progressScreen.screenType === "get_started_clicked") ?
                                                                (
                                                                    <IonButton className="action-btn"
                                                                        // onClick={() => {
                                                                        //     updateUserData({
                                                                        //         user_exists: user_exists,
                                                                        //         batchId: "7c",
                                                                        //         phone: phone_string.current,
                                                                        //         name: "Amrit"
                                                                        //     }).then(() => { }).catch(err => {
                                                                        //         showToast("Error updating data.")
                                                                        //     }).finally(() => {
                                                                        //         setLoadingVisibility(false);
                                                                        //     })
                                                                        // }}
                                                                        onClick={recaptchaRender}
                                                                    >
                                                                        Send OTP
                                                                    </IonButton>
                                                                )
                                                                :
                                                                (progressScreen.screenType === "otp_btn_clicked") ?
                                                                    <AuthRecaptchaComponent callback={(res) => {
                                                                        console.log(res);
                                                                        // setProgressScreen({ type: "otp_sent" });
                                                                        setLoadingVisibility(true);
                                                                        otpSendFunction(() => {
                                                                            setProgressScreen({ type: "otp_sent" });
                                                                            setLoadingVisibility(false);
                                                                        })
                                                                    }} />
                                                                    :
                                                                    (progressScreen.screenType === "otp_sent") ?
                                                                        (
                                                                            <>
                                                                                <IonButton disabled={timer > 0} fill="outline" className="action-btn" onClick={() => {
                                                                                    setProgressScreen({ type: "otp_resend_clicked" })
                                                                                }}>
                                                                                    {timer === 0 ? `Send OTP Again` : `${timer} seconds`}
                                                                                </IonButton>
                                                                                <IonButton className="action-btn" onClick={() => {
                                                                                    setProgressScreen({ type: "on_verification" });
                                                                                    setLoadingVisibility(true);
                                                                                    console.log(otp_string.current);

                                                                                    verifyOtpWeb(otp_string.current || "").then(() => {
                                                                                        updateUserData({
                                                                                            user_exists: user_exists,
                                                                                            batchId: class_id_string.current,
                                                                                            phone: phone_string.current,
                                                                                            name: student_name_string.current
                                                                                        }).then(() => {
                                                                                            showToast("Logging in...")
                                                                                        }).catch(err => {
                                                                                            showToast("Error updating data.")
                                                                                        }).finally(() => {
                                                                                            setLoadingVisibility(false);
                                                                                        })


                                                                                    }).catch(err => {
                                                                                        // Error in sending OTP
                                                                                        alert(err);
                                                                                    })
                                                                                }}>
                                                                                    Verify OTP
                                                                            </IonButton>
                                                                            </>
                                                                        )
                                                                        :
                                                                        (progressScreen.screenType === "otp_resend_clicked") ?
                                                                            <AuthRecaptchaComponent callback={(res) => {
                                                                                console.log(res);
                                                                                // setProgressScreen({ type: "otp_sent" });
                                                                                setLoadingVisibility(true);
                                                                                otpSendFunction(() => {
                                                                                    setProgressScreen({ type: "otp_sent" });
                                                                                    setLoadingVisibility(false);
                                                                                })
                                                                            }} />
                                                                            :
                                                                            <div></div>

                                                        }
                                                    </div>

                                                </IonGrid>
                                            </IonCard>
                                        </div>
                                    </>
                                )
                            }
                        })()
                    }



                </div>
            </IonContent>
        </IonPage>
    )
}
const AuthRecaptchaComponent: React.FC<{ callback: (res: any) => void; }> = ({ callback }) => {
    const id = "recaptcha-sign-in" + (Math.random() * 5);
    useLayoutEffect(() => {
        console.log("Mounted");

        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            id,
            {
                size: "normal",
                callback
            }
        );
        window.recaptchaVerifier?.render().then(function (widgetId: any) {
            console.log("widgetId", widgetId);

            window.recaptchaWidgetId = widgetId;
        });
    }, [])
    return (
        <div id={id}
        // style={{ visibility: screenType === "get_started_clicked" ? "visible" : "hidden" }}
        />
    )
}
const AuthCore: React.FC<{ onSignIn: () => void; }> = ({ onSignIn }) => {
    const { sendOtpCapacitor, verifyOtpCapacitor } = useContext(SignUpContext)!;
    const [timer, setTimer] = useState<number>(0);
    const [progressScreen, setProgressScreen] = useReducer((prevstate: State, action: Action) => {
        if (action.type === "get_started_clicked") {
            return { screenNumber: 1, screenType: "get_started_clicked", message: "Sending OTP" };
        } else if (action.type === "otp_sent") {
            setTimer(30);
            return { screenNumber: prevstate.screenNumber, screenType: "otp_sent", };
        } else if (action.type === "otp_resent") {
            return { screenNumber: prevstate.screenNumber, screenType: prevstate.screenType, message: "Sending OTP" };
        } else if (action.type === "on_verification") {
            return { screenNumber: prevstate.screenNumber, screenType: prevstate.screenType, message: "Verifying OTP" };
        }
        else {
            return prevstate;
        }
    }, { screenNumber: 0 });
    const [loadingVisibility, setLoadingVisibility] = useState<boolean>(false);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const phone_string = useRef<string>("");
    const otp_string = useRef<string>("");
    const class_id_string = useRef<string>("");
    useEffect(() => {
        if (timer === 0 && timerInterval.current !== null) {
            clearInterval(timerInterval.current!);
        } else if (timer > 0) {
            timerInterval.current = setInterval(() => {
                setTimer(timer - 1);
            }, 1000)
        }
        return () => {
            if (timerInterval.current) clearInterval(timerInterval.current!);
        }
    }, [timer])
    const setCallBack = useContext(SignUpContext)?.setSignInCallBack
    useEffect(() => {
        if (onSignIn && setCallBack) setCallBack(onSignIn);
    }, [])
    return (
        <IonPage>
            <IonLoading isOpen={loadingVisibility} message={progressScreen.message} />
            <IonContent>
                <div className="page-container">
                    {
                        (function () {
                            if (progressScreen.screenNumber === 0) {
                                return (
                                    <>
                                        <div className="intro-avatar-container">
                                            <div className="intro-title">Welcome!</div>
                                            <div className="intro-subtitle">to new St. Marys App</div>
                                            <IonIcon className="intro-avatar" icon={introAvatar} />
                                        </div>
                                        <div className="get-started-container">
                                            <div className="get-started-message">Log in to get started.</div>
                                            <IonButton className="get-started-btn" onClick={() => {
                                                setProgressScreen({ type: "get_started_clicked" })
                                            }}>Get Started</IonButton>
                                        </div>
                                    </>
                                )
                            } else if (progressScreen.screenNumber === 1) {
                                return (
                                    <>
                                        <div className="login-header">
                                            <div className="screen-name">
                                                <div className="title">Enter the details</div>
                                            </div>
                                        </div>
                                        <div className="login-body">
                                            <IonCard className="sign-in-card">
                                                {/* <IonIcon icon={classRoom} className="user-avatar" /> */}
                                                <IonGrid className="form-container-grid">
                                                    {
                                                        progressScreen.screenType === "otp_sent"
                                                            ?
                                                            <IonRow className="form-input">
                                                                <IonCol>
                                                                    <IonItem>
                                                                        <IonLabel position="floating">Enter OTP</IonLabel>

                                                                        <IonInput onInput={e => {
                                                                            otp_string.current = e.currentTarget.value?.toString().trim() || "";
                                                                        }} type="tel" maxlength={6} minlength={6}></IonInput>
                                                                    </IonItem>
                                                                </IonCol>
                                                            </IonRow>
                                                            :
                                                            <>
                                                                <IonRow className="form-input">
                                                                    <IonCol>
                                                                        <IonItem>
                                                                            <IonLabel position="floating">Phone Number</IonLabel>
                                                                            <IonInput onInput={e => {
                                                                                phone_string.current = e.currentTarget.value?.toString().trim() || "";
                                                                                // alert(phone_string.current)

                                                                            }} type="tel" maxlength={10} minlength={10}></IonInput>
                                                                        </IonItem>
                                                                    </IonCol>
                                                                </IonRow>
                                                                <IonRow className="form-input">
                                                                    <IonCol>
                                                                        <IonItem>
                                                                            <IonLabel position="floating">Class Id</IonLabel>
                                                                            <IonInput onInput={e => {
                                                                                class_id_string.current = e.currentTarget.value?.toString().trim() || "";
                                                                            }} type="text" ></IonInput>
                                                                        </IonItem>
                                                                    </IonCol>
                                                                </IonRow>
                                                            </>
                                                    }
                                                    <div className="btn-actions">
                                                        {
                                                            (function () {
                                                                if (progressScreen.screenType === "get_started_clicked") {
                                                                    return (<IonButton className="action-btn" onClick={() => {
                                                                        setLoadingVisibility(true);
                                                                        sendOtpCapacitor(phone_string.current || "").then(() => {
                                                                            setProgressScreen({ type: "otp_sent" })
                                                                        }).catch(err => {
                                                                            // Error in sending OTP
                                                                            alert(err);
                                                                        }).finally(() => {
                                                                            setLoadingVisibility(false);

                                                                        })
                                                                    }}>
                                                                        Send OTP
                                                                    </IonButton>)
                                                                } else if (progressScreen.screenType === "otp_sent")

                                                                    return (
                                                                        <>
                                                                            <IonButton disabled={timer > 0} fill="outline" className="action-btn" onClick={() => {
                                                                                setLoadingVisibility(true);
                                                                                sendOtpCapacitor(phone_string.current || "").then(() => {
                                                                                    setTimer(30);
                                                                                }).catch(err => {
                                                                                    // Error in sending OTP
                                                                                    alert(err);
                                                                                }).finally(() => {
                                                                                    setLoadingVisibility(false);

                                                                                })
                                                                            }}>
                                                                                {timer === 0 ? `Send OTP Again` : `${timer} seconds`}
                                                                            </IonButton>
                                                                            <IonButton className="action-btn" onClick={() => {
                                                                                setLoadingVisibility(true);
                                                                                verifyOtpCapacitor(otp_string.current || "").then(() => {

                                                                                }).catch(err => {
                                                                                    // Error in sending OTP
                                                                                    alert(err);
                                                                                }).finally(() => {
                                                                                    setLoadingVisibility(false);

                                                                                })
                                                                            }}>
                                                                                Verify OTP
                                                                        </IonButton>
                                                                        </>
                                                                    )
                                                                else {
                                                                    return <div></div>
                                                                }
                                                            })()
                                                        }
                                                    </div>
                                                </IonGrid>
                                            </IonCard>
                                        </div>
                                    </>
                                )
                            }
                        })()
                    }

                </div>
            </IonContent>
        </IonPage>
    )
}

export default Auth; 