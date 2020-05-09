import React, { useEffect } from 'react';
import { IonApp, IonPage, IonRouterOutlet, IonContent, IonSpinner, useIonViewWillEnter, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, RouteComponentProps, Redirect } from 'react-router';
import { GlobalStateContextProvider } from './context/GlobalStateContext'
import { GalleryContextProvider } from './context/GalleryContext'
import App from './App';
import Auth from './pages/Auth';
import { Storage } from '@capacitor/core';
import "./pages/Tab.css";
import { firebase } from "./modules/firebase";

// const AppWrapper: React.FC = () => {
//     return (
//         <GlobalStateContextProvider>
//             <GalleryContextProvider>
//                 <App />
//             </GalleryContextProvider>
//         </GlobalStateContextProvider>
//     );
// };


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
        <GlobalStateContextProvider>
            <GalleryContextProvider>
                <IonApp>
                    <IonReactRouter>
                        <Route path="/auth" component={Auth} exact={true} />
                        <Route path="/spinner" component={Spinner} exact={true} />
                        <Route path="/" render={() => <Redirect to="/spinner" />} />
                        <Route path="/app/:tab" component={App} />
                        {/* <Route path="/album/:id" component={Album} />
                        <Route
                            path="/video-player"
                            component={VideoPlayer}
                            exact={true}
                        />
                        <Route
                            path="/image-gallery/:index"
                            component={Gallery}
                            exact={true}
                        />
                        <Route
                            path="/post-images-gallery/:index"
                            component={PostGallery}
                            exact={true}
                        /> */}
                    </IonReactRouter>
                </IonApp>
            </GalleryContextProvider>
        </GlobalStateContextProvider>
    )
}
// Storage.set({ key: "userCred", value: "" })
const Spinner: React.FC<RouteComponentProps> = ({ history }) => {
    useEffect(() => {
        Storage.get({ key: "userCred" }).then(({ value }) => {
            if (value) {
                history.replace("/app/tab2")
            } else {
                throw new Error("No user")
            }
        }).catch(err => {
            history.replace("/auth")
        })
    }, [])

    // useIonViewWillEnter(() => {
    //     Storage.get({ key: "userCred" }).then(({ value }) => {
    //         if (value) {
    //             history.replace("/app")
    //         } else {
    //             throw new Error("No user")
    //         }
    //     }).catch(err => {
    //         history.replace("/auth")
    //     })
    // }, [])

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