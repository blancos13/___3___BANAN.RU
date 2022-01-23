import React, { useState } from "react";
import "./SwitchToggleBtn.scss";

const SwitchToggleBtn = ({ onChange = () => {}, checked = false, disabled = false }) => {
    //const [x, setX] = useState(false);
    return (
        <div class="switch-toggle-btn">
            <label class="form-switch">
                <input
                    //checked={checked}
                    //onChange={onChange}
                    disabled={disabled}
                    type="checkbox"
                    checked={checked} //checked={checked}
                    onChange={onChange}
                />
                <i></i>
            </label>
        </div>
    );
};

export default SwitchToggleBtn;
