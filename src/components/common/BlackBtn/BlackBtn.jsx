import React from "react";
import "./BlackBtn.scss";

const BlackBtn = ({ style, children, onClick, notButton = false, classAdd = [] }) => {
    return (
        <button
            style={style}
            disabled={notButton}
            onClick={onClick}
            className={["black-btn", ...classAdd].join(" ")}
        >
            {children}
        </button>
    );
};

export default BlackBtn;
