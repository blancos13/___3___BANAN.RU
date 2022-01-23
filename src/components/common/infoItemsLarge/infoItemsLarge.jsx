import React from "react";
import "./infoItemsLarge.scss";

const infoItemsLarge = ({ children, onClick, classAdd = [] }) => {
    return <div className={[...classAdd, "infoItemsLarge"].join(" ")}>{children}</div>;
};

export default infoItemsLarge;
