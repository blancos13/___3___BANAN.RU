import React, { useState, useMemo } from "react"
import calculateTextWidth from "calculate-text-width"

import "./SendInput.scss"
import sendIcn from "../../../assets/image/sendIcn.svg"

const SendInput = ({
    onChange = () => {},
    type = "text",
    innerInput = "",
    submit = () => {},
    updateNewText = () => {},
    placeholder = "",
    sendBtn = true,
    classAddDiv = [],
    disabled = false,
    option = false,
}) => {
    let newTextRef = React.createRef()

    const [value, setvalue] = useState(innerInput)

    React.useEffect(() => {
        value !== innerInput && setvalue(innerInput)
    }, [innerInput])

    const calculatedTextWidth = useMemo(
        () => calculateTextWidth(innerInput),
        [innerInput]
    )

    const onSumbit = (e) => {
        if (e.key == "Enter" || e.code == "Enter") {
            submit(value)
            onChange("")
        }
    }

    return (
        <div class={["send", ...classAddDiv].join(" ")}>
            <div onKeyDown={onSumbit} class='send__body'>
                {option ? (
                    <select
                        onChange={(e) => {
                            submit(e.target.value)
                        }}
                    >
                        <option selected={innerInput} value='true'>
                            Да (true)
                        </option>
                        <option selected={!innerInput} value='false'>
                            Нет (false)
                        </option>
                    </select>
                ) : (
                    <input
                        disabled={disabled}
                        value={value}
                        placeholder={placeholder}
                        type={type}
                        class={sendBtn ? "send__input" : "send__input send-input-no-btn"}
                        style={{
                            width: `${calculatedTextWidth}px`,
                            minWidth: "100%",
                        }}
                        ref={newTextRef}
                        onChange={(e) => {
                            setvalue(e.target.value)
                            updateNewText(newTextRef.current.value)
                            onChange(newTextRef.current.value)
                        }}
                    />
                )}

                {sendBtn ? (
                    <div className='send__btn'>
                        <input type='submit' value='Отправить' />
                        <button
                            onClick={() => {
                                submit(value)
                                onChange("")
                            }}
                        >
                            <img src={sendIcn} alt='sendIcn' />
                        </button>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    )
}

export default SendInput
