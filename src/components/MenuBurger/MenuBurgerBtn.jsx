import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./MenuBurgerBtn.scss"

const MenuBurgerBtn = ({ isOpen, onClick }) => {
    const menuStyles = classNames("menu-burger-btn", {
        "--opened": isOpen,
    })

    return (
        <div className={menuStyles} onClick={onClick}>
            <div className="menu-burger-btn__container">
                <div className="menu-burger-btn__top-row" />
                <div className="menu-burger-btn__mid-row" />
                <div className="menu-burger-btn__bottom-row" />
            </div>
        </div>
    )
}

MenuBurgerBtn.propTypes = {
    isOpen: PropTypes.bool,
}

export { MenuBurgerBtn }
