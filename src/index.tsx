import "./polyfill"
import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";
import * as serviceWorker from "./serviceWorker";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then(function (registration) {
            console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(function (err) {
            console.log("Service worker registration failed, error:", err);
        });
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
serviceWorker.unregister();
