import React, { Component } from "react"
import { Transition } from "react-transition-group"
import onClickOutside from "react-onclickoutside"

const defaultStyle = {
    transition: `opacity ${300}ms, transform ${300}ms,`,
    display: "none",
    opacity: 0,
}

const transitionStyles = {
    entering: { opacity: 1, transform: "scale(100%)", display: "flex" },
    entered: { opacity: 1, transform: "scale(100%)", display: "flex" },
    exiting: { opacity: 0, transform: "scale(90%)", display: "flex" },
    exited: { opacity: 0, transform: "scale(90%)", display: "none" },
}

class DropMenu extends Component {
    handleClickOutside = (e) => {
        this.props.closeDropMenu()
    }

    render() {
        const {
            className,
            isOpen = true,
            containerStyle,
            oprtionStyle,
            children,
            ...props
        } = this.props

        return (
            <Transition in={isOpen} timeout={300}>
                {(state) => (
                    <button
                        style={{
                            ...containerStyle,
                            ...defaultStyle,
                            ...transitionStyles[state],
                        }}
                        {...props}
                        className={`header-login__more-options ${className}`}
                    >
                        {Array.isArray(children) ? (
                            children.map((child, i) => (
                                <li
                                    style={oprtionStyle}
                                    key={i}
                                    className='header-login__more-option'
                                >
                                    {child}
                                </li>
                            ))
                        ) : (
                            <div
                                style={oprtionStyle}
                                className='header-login__more-option'
                            >
                                {children}
                            </div>
                        )}
                    </button>
                )}
            </Transition>
        )
    }
}

export default onClickOutside(DropMenu)
