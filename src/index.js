import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

import "../src/assets/style/index.scss"

import reduxStore from "../src/redux/reduxStore"

import App from "../src/components/App"

render(
    <Provider store={reduxStore}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
)
