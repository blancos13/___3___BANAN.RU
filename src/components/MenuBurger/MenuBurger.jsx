import React from "react"
import { Link } from "react-router-dom"
import classnames from "classnames"
import HeaderNav from "../Header/HeaderNav/HeaderNav"
import { Contacts } from "../Header/Header"
import settingsIcn from "../../assets/image/settingsIcn.svg"
import logoutIcn from "../../assets/image/logoutIcn.svg"
import "../../utils/i18next"
import { useTranslation } from "react-i18next"
import { LangSelector } from "../Header/Header"
import "./MenuBurger.scss"

const MenuBurger = ({
    className,
    isOpen,
    isAuth,
    avatar,
    nickName,
    steamid,
    ...props
}) => {
    const { t } = useTranslation()

    const menuStyles = classnames(className, {
        "menu-burger": true,
        "--open": isOpen,
    })

    return (
        <div className={menuStyles} {...props}>
            <div className="menu-burger__body">
                <div className="menu-burger__row">
                    {isAuth && (
                        <>
                            <Link
                                to={`/profile/${steamid}`}
                                className="menu-burger__header"
                            >
                                <div className="menu-burger__avatar">
                                    <img
                                        className="menu-burger__avatar-img"
                                        src={avatar}
                                        alt="ava"
                                    />
                                </div>
                                <h2 className="menu-burger__user-name">{nickName}</h2>
                            </Link>
                            <hr className="menu-burger__separator" />
                        </>
                    )}

                    <HeaderNav />

                    {isAuth && (
                        <>
                            <hr className="menu-burger__separator" />

                            <Link
                                className="menu-burger__settings"
                                to={`/profile/${steamid}`}
                            >
                                <img src={settingsIcn} alt="settingsIcn" />
                                <span className="menu-burger__settings-text">
                                    {t("header.dropDown.Settings")}
                                </span>
                            </Link>

                            <hr className="menu-burger__separator" />

                            <Link className="menu-burger__logout" to="/logout">
                                <img src={logoutIcn} alt="logoutIcn" />
                                <span className="menu-burger__logout-text">
                                    {t("header.dropDown.Sign out")}
                                </span>
                            </Link>
                        </>
                    )}

                    <LangSelector className="menu-burger__lang-selector" />
                </div>

                <Contacts />
            </div>
        </div>
    )
}

export { MenuBurger }
