import React, { createContext, useRef, useEffect } from 'react';
import { SignUpContextInterface } from '../interface/TypeInterface';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication'
import { Storage } from '@capacitor/core';

export const SignUpContext = createContext<SignUpContextInterface | null>(null);

export const SignUpContextProvider = (props: { children: any }) => {
    const signInCallBack = useRef<(() => void)>(() => { });
    useEffect(() => {
        const checkUser = FirebaseAuthentication.onAuthStateChanged().subscribe((user) => {
            if (user) {
                Storage.set({ key: "userCred", value: JSON.stringify(user) }).then(() => {
                    signInCallBack["current"]();
                });
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
        <SignUpContext.Provider value={{ setSignInCallBack, sendOtpCapacitor, verifyOtpCapacitor }}>
            {props.children}
        </SignUpContext.Provider>
    )
}