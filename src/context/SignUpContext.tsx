import React, { createContext, useRef, useEffect } from 'react';
import { SignUpContextInterface, UserDataRef } from '../interface/TypeInterface';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication'
import { Storage } from '@capacitor/core';
import Constant from '../Constant';
import { Plugins, PushNotificationToken } from "@capacitor/core";
import request from '../modules/request';

const { PushNotifications } = Plugins

export const SignUpContext = createContext<SignUpContextInterface | null>(null);

export const SignUpContextProvider = (props: { children: any }) => {
    const signInCallBack = useRef<(() => void)>(() => { });
    const classId = useRef<string>("");
    const setClassId = (id: string) => {
        classId.current = id;
    }
    const dataRef = useRef<UserDataRef | null>(null);
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
                    // .then(val => val.text())
                    .then(resolve).catch(reject);
            }

        }

        return new Promise((resolve, reject) => {
            PushNotifications.addListener(
                "registration",
                (token: PushNotificationToken) => {
                    updateAPIFunction(data, token.value, resolve, reject);
                    Storage.set({ key: "batchId", value: data.batchId });
                    alert(token.value);
                }
            )
        })
    }
    const getDataRef = () => {
        return dataRef.current;
    }
    const setDataRef = (data: UserDataRef) => {
        dataRef.current = data;
    }
    useEffect(() => {
        const checkUser = FirebaseAuthentication.onAuthStateChanged().subscribe((user) => {
            const dataReference = getDataRef();
            // alert(JSON.stringify(dataReference))
            // FirebaseAuthentication.signOut();
            alert(user)
            if (user && dataReference) {
                updateUserData(dataReference).finally(() => {
                    Storage.set({ key: "userCred", value: JSON.stringify(user) }).then(() => {
                        signInCallBack["current"]();
                    });
                })
            }
        })
        return () => {
            checkUser.unsubscribe();
        }
    }, []);
    const setSignInCallBack = (callback: () => void) => {
        signInCallBack.current = callback;
    }

    const verifIdFirebase = useRef<string>("");
    const sendOtpCapacitor = (phoneNum: string) => {
        return new Promise((resolve, reject) => {
            const phone: string = phoneNum.trim();
            try {
                if (phone.length !== 10 || (!phone.match(/^[0-9]+$/))) {
                    throw new Error("Enter a valid phone number");
                } else {
                    FirebaseAuthentication.verifyPhoneNumber(`+91${phone}`, 60000).then((verificationId) => {
                        verifIdFirebase.current = verificationId;
                        resolve();
                    }).catch(err => reject(err));
                }
            } catch (err) {
                reject(err);
            }
        })
    }
    const verifyOtpCapacitor = (otp: string) => {
        return new Promise((resolve, reject) => {
            try {
                alert(verifIdFirebase.current)
                if (verifIdFirebase.current.length) {
                    FirebaseAuthentication.signInWithVerificationId(
                        verifIdFirebase.current,
                        otp.trim()
                    )
                        .then((verificationResponse) => {
                            resolve(verificationResponse)
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    throw new Error("No phone number found.")
                }
            } catch (err) {
                reject(err);
            }
        })
    }
    const resetAuth = () => {
        verifIdFirebase.current = "";
    }
    return (
        <SignUpContext.Provider value={{ setSignInCallBack, sendOtpCapacitor, verifyOtpCapacitor, setClassId, updateUserData, setDataRef }}>
            {props.children}
        </SignUpContext.Provider>
    )
}