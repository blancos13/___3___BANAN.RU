import React from "react"
import "./Options.scss"

const Options = ({
    editMode = false,
    setOptionX = () => {},

    currentOptionsWidth = 0,
    value = "",
    children,
    classAdd = [],
    handleChange = () => {},
}) => {
    return (
        <div
            style={{
                width: `${
                    editMode
                        ? currentOptionsWidth.toString() + "px"
                        : "fit-content"
                }`,
            }}
            className={["options", ...classAdd].join(" ")}
            onChange={handleChange}
        >
            {children.map((child, index) => {
                return (
                    <div
                        key={index}
                        class={`form_radio_btn ${
                            editMode ? "form_radio_btn-edit" : ""
                        }`}
                    >
                        {editMode ? (
                            <div class='options__input-edit'>
                                <input
                                    onChange={(e) => e.stopPropagation()}
                                    autoFocus={index === 0}
                                    type='text'
                                    style={{
                                        width: `${
                                            editMode
                                                ? (
                                                      currentOptionsWidth / 4 -
                                                      3
                                                  ).toString() + "px"
                                                : "fit-content"
                                        }`,
                                    }}
                                    onBlur={(e) => {
                                        e.target.value &&
                                            setOptionX(e.target.value, index)
                                    }}
                                    id={`radio-${index}`}
                                    type='number'
                                    name='option'
                                    min={1.01}
                                    max={999}
                                    step={0.1}
                                    defaultValue={child.slice(1)}
                                />
                            </div>
                        ) : (
                            <>
                                <input
                                    checked={value == child}
                                    id={`radio-${
                                        index + JSON.stringify(child)
                                    }`}
                                    type='radio'
                                    name='radio'
                                    value={child}
                                />
                                <label
                                    htmlFor={`radio-${
                                        index + JSON.stringify(child)
                                    }`}
                                >
                                    {child}
                                </label>
                            </>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default Options
