import React, { useState } from "react"
import "./Checkbox.scss"

const Checkbox = ({
    className,
    style = {},
    children,
    onChange = () => {},
    checked = false,
}) => {
    return (
        <div style={style} className={`main-checkbox ${className}`}>
            <label class="custom-checkbox">
                <input
                    type="checkbox"
                    name="main-checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <span
                    style={checked ? { color: "#fff" } : { color: "#ffffff58" }}
                >
                    {children}
                </span>
            </label>
        </div>
    )
}

export default Checkbox
