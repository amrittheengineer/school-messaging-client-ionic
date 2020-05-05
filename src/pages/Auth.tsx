import React, { useEffect, useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, IonCard, IonSegment, IonSegmentButton, IonButton, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonIcon } from '@ionic/react';
import { SignUpContextProvider, SignUpContext } from '../context/SignUpContext';
import user from '../images/user.svg';
const Auth: React.FC<RouteComponentProps> = ({ history }) => {
    const onSignIn = () => {
        history.replace("/app")
    }
    return (
        <SignUpContextProvider>
            <AuthCore onSignIn={onSignIn} />
        </SignUpContextProvider>
    )

}

const AuthCore: React.FC<{ onSignIn: () => void; }> = ({ onSignIn }) => {
    const setCallBack = useContext(SignUpContext)?.setSignInCallBack
    useEffect(() => {
        if (onSignIn && setCallBack) setCallBack(onSignIn);
    }, [])
    return (
        <IonPage>
            <IonContent>
                <div className="page-container">
                    <div className="header">
                        <div className="screen-name">
                            <div className="title">Welcome to St. Marys App</div>
                            <div className="description">Log in to get updates</div>
                        </div>
                    </div>
                    <div className="body">
                        <IonCard className="sign-in-card">
                            <IonIcon icon={user} className="user-avatar" />
                            <IonGrid className="form-container-grid">
                                <IonRow>
                                    <IonCol>
                                        <IonItem>
                                            <IonLabel position="floating">Phone Number</IonLabel>
                                            <IonInput type="tel" maxlength={10} minlength={10}></IonInput>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonItem>
                                            <IonLabel position="floating">Class Id</IonLabel>
                                            <IonInput type="text" ></IonInput>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonButton>
                                    Log In
                                </IonButton>
                            </IonGrid>
                        </IonCard>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Auth; 