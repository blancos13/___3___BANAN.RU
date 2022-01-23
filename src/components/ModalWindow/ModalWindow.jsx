import React from "react"
import closeIcn from "../../assets/image/closeIcn.svg"
import arrowIcn from "../../assets/image/arrowIcn.svg"
import "./ModalWindow.scss"
const ModalWindow = ({
    onClick,
    title,
    withBtnBefore,
    onBtnBefore,
    children = "",
    withFade = true,
    otherProps,
}) => {
    const [closing, setClosing] = React.useState(false)

    let onClose = () => {
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            onClick()
        }, 400)
    }

    React.useEffect(() => {
        return () => {
            onClose = null
        }
    }, [])

    return (
        <div
            class={`app__modal-window modal-window ${
                closing ? "modal-window-closing" : ""
            } ${otherProps?.className}`}
            onClick={onClose}
        >
            <div
                class='modal-window__body'
                onClick={(event) => event.stopPropagation()}
            >
                <div class='modal-window__head'>
                    <div class='modal-window__title'>
                        {withBtnBefore && (
                            <button
                                onClick={onBtnBefore}
                                class='modal-window__before-btn'
                            >
                                <img src={arrowIcn} alt='arrowIcn' />
                            </button>
                        )}
                        {title}
                    </div>

                    <button onClick={onClose} class='modal-window__close-btn'>
                        <img src={closeIcn} alt='closeIcn' />
                    </button>
                </div>
                <div class='modal-window__content'>{children}</div>
                {withFade ? <div class='modal-window__fade'></div> : ""}
            </div>
        </div>
    )
}

export default ModalWindow
