import React, { useState } from "react"
import { Link } from "react-router-dom"
import YellowBtn from "../common/YellowBtn/YellowBtn"
import GreyBtn from "../common/GreyBtn/GreyBtn"
import BlackBtn from "../common/BlackBtn/BlackBtn"
import Logo from "../../assets/image/logo.svg"
import HeaderNav from "./HeaderNav/HeaderNav"
import vkIcon from "../../assets/image/vk.svg"
import twitterIcon from "../../assets/image/twitter.svg"
import discordIcon from "../../assets/image/discord.svg"
import telegramIcon from "../../assets/image/telegram.svg"
import noticeIcon from "../../assets/image/notice_bell.svg"
import steamYellow from "../../assets/image/steamYellow.svg"
import bananaIcon from "../../assets/image/bananaIcn.svg"
import whitePlus from "../../assets/image/whitePlus.svg"
import arrowIcn from "../../assets/image/arrowIcn.svg"
import settingsIcn from "../../assets/image/settingsIcn.svg"
import logoutIcn from "../../assets/image/logoutIcn.svg"

import langEng from "../../assets/image/langEng.svg"
import langRu from "../../assets/image/langRu.png"

import DropMenu from "../common/DropMenu/DropMenu"
import Checkbox from "../common/Checkbox/Checkbox"
import AddFunds from "../AddFunds/AddFunds"

import { useMedia } from "react-media"
import { GLOBAL_MEDIA_QUERIES } from "../../utils/mediaQueries"
import { MenuBurgerBtn } from "../MenuBurger/MenuBurgerBtn"
import { MenuBurger } from "../MenuBurger/MenuBurger"
import { useTranslation } from "react-i18next"
import i18n from "../../utils/i18next"
import "./Header.scss"

const LoginCheckItem = ({ title, onChange, checked }) => {
    return (
        <div className='login-check__item login-check-item'>
            <Checkbox
                style={{ marginLeft: "0px" }}
                onChange={onChange}
                checked={checked}
                className={"login-check-item__check"}
            />
            <h2 className='login-check-item__title'>{title}</h2>
        </div>
    )
}

const LoginCheck = (props) => {
    const initValidators = props.checkList.map(() => false) // заполнение все fals'ами

    const [validators, setValidators] = useState(initValidators)

    return (
        <div className='login-check'>
            {props.checkList.map((title, i) => (
                <LoginCheckItem
                    onChange={() => {
                        const newValidators = [...validators] // anti mutable
                        newValidators[i] = !newValidators[i]
                        setValidators(newValidators)
                    }}
                    checked={validators[i]}
                    title={title}
                />
            ))}
            <YellowBtn
                classNameAdd={["login-check__btn"]}
                onClick={() => {
                    window.location.href = "/auth/steam"
                }}
                disabled={!validators.every((elem) => elem === true)}
            >
                Login
            </YellowBtn>
        </div>
    )
}

const LoginSteam = ({
    toggleShowModalWindow,
    setModalChild,
    checkList,
    loginText,
}) => {
    const setLoginToModal = (checkList) => {
        setModalChild(
            <LoginCheck checkList={checkList} />, //child
            " ", // title
            false, // withBtnBefore
            () => {}, // onBtnBefore
            false, // withFade
            {
                //otherProps
                ignoreTitle: true,
                className: "modal-login-check",
            }
        )
    }

    const onClick = () => {
        setLoginToModal(checkList)
        toggleShowModalWindow()
    }

    return (
        <div className='header-login__with-steam login-with-steam'>
            <YellowBtn classAdd={["login-with-steam__btn"]} onClick={onClick}>
                <img src={steamYellow} alt='steamYellow' />
                {loginText}
            </YellowBtn>
        </div>
    )
}

const HeaderNotice = ({ notifications, onClose, isShow, style }) => {
    return (
        <DropMenu
            closeDropMenu={onClose}
            isOpen={isShow}
            containerStyle={style}
            className={"header__notice"}
            oprtionStyle={{ padding: "8px", fontWeight: "400" }}
        >
            {notifications.map((notice) => {
                return <span>{notice.msg}</span>
            })}
        </DropMenu>
    )
}

const HeaderDropDown = ({ className, steamid }) => {
    const { t } = useTranslation()

    const [isShowMore, setShowMore] = useState(false)

    return (
        <div
            className={className}
            className='header-login__more'
            onClick={() => setShowMore(true)}
        >
            <button
                className={`header-login__more-btn ${isShowMore ? "open" : ""}`}
            >
                <img src={arrowIcn} alt='arrowIcn' />
            </button>

            <DropMenu
                closeDropMenu={() => setShowMore(false)}
                isOpen={isShowMore}
            >
                <Link to={`/profile/${steamid}`}>
                    <img src={settingsIcn} alt='settingsIcn' />
                    {t("header.dropDown.Settings")}
                </Link>

                <Link to='/logout'>
                    <img src={logoutIcn} alt='logoutIcn' />
                    {t("header.dropDown.Sign out")}
                </Link>
            </DropMenu>
        </div>
    )
}

export const Contacts = ({ className }) => {
    return (
        <ul className={className} className='header__contacts'>
            <li className='header__contact'>
                <a href='#'>
                    <img src={vkIcon} alt='vkIcon' />
                </a>
            </li>
            <li className='header__contact'>
                <a href='#'>
                    <img src={twitterIcon} alt='twitterIcon' />
                </a>
            </li>
            <li className='header__contact'>
                <a href='#'>
                    <img src={discordIcon} alt='discordIcon' />
                </a>
            </li>
            <li className='header__contact'>
                <a href='#'>
                    <img src={telegramIcon} alt='telegramIcon' />
                </a>
            </li>
        </ul>
    )
}

export const LangSelector = (props) => {
    const storageLang = localStorage.getItem("i18nextLng")
    const [currLang, setCurrLang] = useState(storageLang || "en")

    const changeLang = (lang) => {
        i18n.changeLanguage(lang)
        setCurrLang(lang)
    }

    if (currLang === "ru")
        return (
            <button
                {...props}
                className={`header-login__lang ${props.className}`}
                onClick={() => changeLang("en")}
            >
                <img src={langRu} alt='ru' />
            </button>
        )

    return (
        <button
            {...props}
            className={`header-login__lang ${props.className}`}
            onClick={() => changeLang("ru")}
        >
            <img src={langEng} alt='en' />
        </button>
    )
}

const Header = ({
    balance,
    photo,
    nickName,
    isAuth,
    steamid,
    toggleShowModalWindow,
    setModalChild,
    AccessAdmin,
}) => {
    const { t } = useTranslation()

    const [noticesPosition, setNoticesPos] = useState(null)

    const [showNotice, setShowNotice] = useState(false)
    const [isMenuOpen, setMenuOpen] = useState(false)

    const prettyBalance = balance.stringNice()
    // хук для медиа запросов
    const mediaQueries = useMedia({ queries: GLOBAL_MEDIA_QUERIES })

    // --> TEMP NOTIFICATIONS
    const notifications = [
        { msg: "Something notification" },
        { msg: "Aomething notification" },
        {
            msg: "Asdfs thing notifica tion thingasdf noti fi ation thing notification thing notifi cation",
        },
        { msg: "Tomething notification" },
    ] // <--

    return (
        <>
            {mediaQueries.laptop && (
                <MenuBurger
                    steamid={steamid}
                    onClick={() => setMenuOpen(false)}
                    isAuth={isAuth}
                    nickName={nickName}
                    avatar={photo}
                    isOpen={isMenuOpen}
                />
            )}

            <header className='header'>
                <div className='header__body'>
                    <div className='header__grid'>
                        <div className='header__logo'>
                            <img src={Logo} alt='Logo' />
                        </div>

                        {mediaQueries.large && (
                            <nav className='header__nav'>
                                <HeaderNav AccessAdmin={AccessAdmin} />
                            </nav>
                        )}

                        <HeaderNotice
                            onClose={() => setShowNotice(false)}
                            style={{
                                left: `${
                                    noticesPosition -
                                    (mediaQueries.mobileL ? 50 : 200)
                                }px`,
                            }}
                            isShow={showNotice}
                            notifications={notifications}
                        />

                        <button
                            onClick={(e) => {
                                setNoticesPos(e.clientX)
                                setShowNotice(true)
                            }}
                            className='header__contact header-notice-btn'
                        >
                            <img src={noticeIcon} alt='notice' />
                        </button>

                        {mediaQueries.large && <Contacts />}

                        <div className='header__login header-login'>
                            <div className='header-login__body'>
                                {mediaQueries.large && <LangSelector />}
                                {isAuth ? (
                                    <>
                                        <div className='header-login__balance'>
                                            <BlackBtn notButton={true}>
                                                <div className='weapon-item__price'>
                                                    <img
                                                        src={bananaIcon}
                                                        alt='bananaIcon'
                                                    />
                                                    {prettyBalance
                                                        .toString()
                                                        .slice(0, -3)}
                                                    <span className='weapon-item__kopecki'>
                                                        {prettyBalance
                                                            .toString()
                                                            .substr(-3, 3)}
                                                    </span>
                                                </div>
                                            </BlackBtn>
                                        </div>

                                        <div className='header-login__top-up-balance'>
                                            <GreyBtn
                                                onClick={() => {
                                                    setModalChild(
                                                        <AddFunds />,
                                                        "Add funds",
                                                        false,
                                                        () => {},
                                                        false,
                                                        {
                                                            className:
                                                                "modal-add-funds",
                                                        }
                                                    )
                                                    toggleShowModalWindow()
                                                }}
                                                circle={true}
                                            >
                                                <img
                                                    src={whitePlus}
                                                    alt='whitePlus'
                                                />
                                            </GreyBtn>
                                        </div>

                                        {mediaQueries.large && (
                                            <>
                                                <Link
                                                    to={`/profile/${steamid}`}
                                                >
                                                    <div className='header-login__photo'>
                                                        <img
                                                            src={photo}
                                                            alt='photo'
                                                        />
                                                    </div>
                                                </Link>

                                                <HeaderDropDown
                                                    steamid={steamid}
                                                />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <LoginSteam
                                        loginText={t("login.Log in with Steam")}
                                        checkList={t("login.checkList", {
                                            returnObjects: true,
                                        })}
                                        toggleShowModalWindow={
                                            toggleShowModalWindow
                                        }
                                        setModalChild={setModalChild}
                                    />
                                )}
                            </div>
                        </div>
                        {mediaQueries.laptop && (
                            <MenuBurgerBtn
                                isOpen={isMenuOpen}
                                onClick={() => setMenuOpen(!isMenuOpen)}
                            />
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
