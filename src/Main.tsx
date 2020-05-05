import React, { useEffect } from 'react';
import { IonApp, IonPage, IonRouterOutlet, IonContent, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, RouteComponentProps, Redirect } from 'react-router';
import App from './App';
import Auth from './pages/Auth';
import { Storage } from '@capacitor/core';
import "./pages/Tab.css";



const Main: React.FC = () => {
    // useEffect(() => {
    //     Storage.get({ key: "userCred" }).then(({ value }) => {
    //         if (value) {
    //             return (
    //                 <Route
    //                     path="/"
    //                     render={() => <Redirect to="/app" />}
    //                     exact={true}
    //                 />
    //             )
    //         } else {
    //             throw new Error("No user")
    //         }
    //     }).catch(err => {
    //         return <Route
    //             path="/"
    //             render={() => <Redirect to="/auth" />}
    //             exact={true}
    //         />
    //     })
    // }, [])
    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route path="/auth" component={Auth} exact={true} />
                    <Route path="/spinner" component={Spinner} exact={true} />
                    <Route path="/app" component={App} />
                    <Route path="/" render={() => <Redirect to="/spinner" />} />
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    )
}

const Spinner: React.FC<RouteComponentProps> = ({ history }) => {
    useEffect(() => {
        Storage.get({ key: "userCred" }).then(({ value }) => {
            if (value) {
                history.replace("/app")
            } else {
                throw new Error("No user")
            }
        }).catch(err => {
            history.replace("/auth")
        })
    }, [])

    return (
        <IonPage>
            <IonContent>
                <div style={{ flex: 1 }}>
                    <IonSpinner />
                    <p>Hello</p>
                </div>
            </IonContent>
        </IonPage>
    )
}
export default Main;