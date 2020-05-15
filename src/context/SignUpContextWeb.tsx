import React, { createContext, useRef, useEffect } from 'react';
import { SignUpContextWebInterface } from '../interface/TypeInterface';
import { auth, firebase, messaging } from '../modules/firebase'
import { Storage } from '@capacitor/core';
import request from '../modules/request';
import Constant from '../Constant';
declare global {
    interface Window {
        recaptchaVerifier: any;
        confirmationResult: any;
        signingIn: boolean;
        recaptchaWidgetId: any;
    }
}
export const SignUpContextWeb = createContext<SignUpContextWebInterface | null>(null);

export const SignUpContextWebProvider = (props: { children: any }) => {
    const signInCallBack = useRef<(() => void)>(() => { });

    // const setClassId = (id: string) => {
    //     classId.current = id;
    // }
    const updateUserData = async (data: { user_exists: boolean, name?: string, batchId: string, phone: string }) => {
        // alert(messaging)
        function updateAPIFunction(data: { user_exists: boolean, name?: string, batchId: string, phone: string }, token: string, resolve: any, reject: any) {
            if (data.user_exists) {
                if (token) {
                    const { requestPromise } = request(`/api/student/update-device-token/${data.phone}?token=${token}&batchId=${data.batchId}`, { method: "GET" })
                    requestPromise.then(val => {
                        if (val.status === 200) {
                            resolve();
                            // alert("Token registered successfully");
                        } else {
                            reject();
                            // alert("Token registeration failed");
                        }
                    })
                } else {
                    // alert("No token");
                    reject();
                }
            } else {
                fetch(`${Constant.url}/api/student/create-user/`, {
                    method: "POST", body: JSON.stringify({
                        name: data.name,
                        batchId: data.batchId,
                        phone: data.phone,
                        token
                    })
                })
                    .then(val => val.text())
                    .then(val => {
                        // alert(val)
                        resolve();
                    }).catch(err => {
                        // alert(err);
                        reject();

                    })
            }

        }

        return new Promise((resolve, reject) => {
            let token = "";
            if (messaging) {
                messaging.getToken().then(tokenVal => {
                    token = tokenVal
                }).catch(err => {
                    console.log(err);
                    // alert("Token fetch failed")
                }).finally(() => {
                    // alert(token);
                    updateAPIFunction(data, token, resolve, reject);
                    Storage.set({ key: "batchId", value: data.batchId });

                })
            } else {
                updateAPIFunction(data, token, resolve, reject);
                Storage.set({ key: "batchId", value: data.batchId });
            }



        })
    }
    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log(user);

                Storage.set({ key: "userCred", value: JSON.stringify(user) }).then(() => {
                    // console.log(signInCallBack["current"]);
                    signInCallBack["current"]();
                });
            }
        })
        return () => {
            if (unsubscribe) unsubscribe();
        }
    }, []);
    const setSignInCallBack = (callback: () => void) => {
        console.log("Seettttt signincallback");

        signInCallBack.current = callback;
    }
    // const tempLogin = () => {
    //     console.log(signInCallBack);
    //     signInCallBack["current"]();
    // }
    const confirmationResult = useRef<firebase.auth.ConfirmationResult | null>(null);
    const sendOtpWeb = (phoneNum: string) => {

        return new Promise((resolve, reject) => {
            const phone: string = phoneNum.trim();
            try {
                if (phone.length !== 10 || (!phone.match(/^[0-9]+$/))) {
                    throw new Error("Enter a valid phone number");
                } else {
                    window.signingIn = true;
                    // auth.settings.appVerificationDisabledForTesting = true;
                    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
                    //     "recaptcha-container",
                    //     {
                    //         size: "invisible",
                    //     }
                    // );
                    // var appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
                    auth.signInWithPhoneNumber(`+91${phone}`, window.recaptchaVerifier)
                        .then(function (confirmationResultSignIn) {
                            window.confirmationResult = confirmationResultSignIn;
                            confirmationResult.current = confirmationResultSignIn;
                            window.signingIn = false;
                            window.recaptchaVerifier.reset();
                            resolve();
                        })
                        .catch(err => {
                            window.signingIn = false;
                            reject(err)
                        });
                    // FirebaseAuthentication.verifyPhoneNumber(`+91${phone}`, 60000).then((verificationId) => {
                    //     verifIdFirebase.current = verificationId;
                    //     resolve();
                    //})
                }
            } catch (err) {
                window.signingIn = false;
                reject(err);
            }
        })
    }
    const verifyOtpWeb = (otp: string) => {
        return new Promise((resolve, reject) => {
            try {
                if (window.confirmationResult) {
                    console.log("window.confirmationResult");
                    console.log(window.confirmationResult);

                    var credential = firebase.auth.PhoneAuthProvider.credential(window.confirmationResult.verificationId, otp);
                    firebase.auth().signInWithCredential(credential);
                    resolve();
                } else {
                    throw new Error("No phone number found.")
                }
            } catch (err) {
                reject(err);
            }
        })
    }
    const resetAuth = () => {
        confirmationResult.current = null;
    }
    return (
        <SignUpContextWeb.Provider value={{ setSignInCallBack, sendOtpWeb, verifyOtpWeb, updateUserData }}>
            {props.children}
        </SignUpContextWeb.Provider>
    )
}