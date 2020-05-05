import "./polyfill"
import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";
import * as serviceWorker from "./serviceWorker";

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
