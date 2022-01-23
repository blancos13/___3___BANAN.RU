import React from "react"
import "./YellowBtn.scss"

const YellowBtn = ({
    style = {},
    children,
    onClick = () => {},
    classAdd = [],
    disabled = false,
}) => {
    return (
        <button
            style={style}
            disabled={disabled}
            onClick={onClick}
            className={["yellow-btn", ...classAdd].join(" ")}
        >
            {children}
        </button>
    )
}

export default YellowBtn
