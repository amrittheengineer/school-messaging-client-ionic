import React, { useEffect, useContext, useState, useReducer, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, IonCard, IonLoading, IonButton, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonIcon } from '@ionic/react';
import { SignUpContextProvider, SignUpContext } from '../context/SignUpContext';
import classRoom from '../images/classroom.svg';
import introAvatar from '../images/get_started.svg';
const Auth: React.FC<RouteComponentProps> = ({ history }) => {
    const onSignIn = () => {
        history.replace("/app/tab2")
    }
    return (
        <SignUpContextProvider>
            <AuthCore onSignIn={onSignIn} />
        </SignUpContextProvider>
    )

}
interface State {
    screenNumber: number;
    screenType?: string;
    timer?: number;
    message?: string;
}
interface Action {
    type: "get_started_clicked" | "otp_sent" | "otp_resent" | "on_verification"
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