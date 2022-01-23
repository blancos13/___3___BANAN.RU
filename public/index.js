import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import "../src/assets/style/index.scss";

import reduxStore from "../src/redux/reduxStore";
import App from "../src/components/App";

render(
    <Provider store={reduxStore}>
        <App />
    </Provider>,
    document.getElementById("root")
);
