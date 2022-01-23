import React from "react";
import "./GreyBtn.scss";

const GreyBtn = ({
    children,
    style,
    onClick,
    notButton = false,
    circle = false,
    classAdd = [],
}) => {
    return (
        <button
            style={
                !style ? (circle ? { padding: "13px" } : { padding: "13px 18px" }) : style
            }
            disabled={notButton}
            onClick={onClick}
            className={["grey-btn", ...classAdd].join(" ")}
        >
            {children}
        </button>
    );
};

export default GreyBtn;
