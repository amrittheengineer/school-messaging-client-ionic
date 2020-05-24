import "./polyfill"
import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";
import * as serviceWorker from "./serviceWorker";
import { isPlatform } from "@ionic/react";
import { Plugins } from "@capacitor/core";

// setupConfig({
//     animated: false
// })



if (isPlatform("capacitor")) {
    const { PushNotifications } = Plugins
    PushNotifications.requestPermission().then(({ granted }) => {
        if (granted) {
            PushNotifications.register().catch(err => {
                // alert(err);
                console.log(err)
            }
            )
        }
    }).catch(err => {
        console.log(err);

    })
}

// setupConfig({
//     hardwareBackButton: true,
// });
// setupConfig({
//   animated: false,
// });

ReactDOM.render(<Main />, document.getElementById("root"));

// If you want your Main to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();