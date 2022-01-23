import React from "react"
import { NavLink } from "react-router-dom"
import { compose } from "redux"
import withToggleShowModalWindow from "../../../hoc/withToggleShowModalWindow"
import GamesHistory from "../../GamesHistory/GamesHistory"
import ProvablyFair from "../../ProvablyFair/ProvablyFair"
import CrashIcn from "../../../assets/image/crashIcn.svg"
import "../../../utils/i18next"
import { useTranslation } from "react-i18next"
import "./HeaderNav.scss"

const HeaderNav = ({ toggleShowModalWindow, setModalChild, AccessAdmin }) => {
    const { t } = useTranslation()
    // let showAdminka = false

    // for (const key in AccessAdmin) {
    //     if (~key.indexOf("Access") && AccessAdmin[key]) showAdminka = true
    // }
    const onClickHistory = (e) => {
        e.preventDefault()
        toggleShowModalWindow()
        setModalChild(<GamesHistory />, "Games History")
    }
    const onClickProvably = () => {
        toggleShowModalWindow()
        setModalChild(
            <ProvablyFair
                id={0}
                game={0}
                setModalOnBtnBefore={() => {}}
                setModalChild={() => {}}
            />,
            "Provably fair",
            false,
            null,
            false
        )
    }

    return (
        <div class='navbar'>
            <ul class='navbar__grid'>
                <li className='navbar__item'>
                    <NavLink
                        className={"navbar__link"}
                        activeClassName={"current-nav-page"}
                        to='/crash'
                    >
                        <img src={CrashIcn} alt='CrashIcn' /> Crash
                    </NavLink>
                </li>

                <li className='navbar__item'>
                    <button className='navbar__link' onClick={onClickHistory}>
                        {t("header.History")}
                    </button>
                </li>

                <li className='navbar__item'>
                    <NavLink
                        className={"navbar__link"}
                        activeClassName={"current-nav-page"}
                        to='/support'
                    >
                        {t("header.Support")}
                    </NavLink>
                </li>

                <li className='navbar__item'>
                    <button className={"navbar__link"} onClick={onClickProvably}>
                        Provably fair
                    </button>
                </li>

                <li className='navbar__item'>
                    <NavLink
                        className={"navbar__link"}
                        activeClassName={"current-nav-page"}
                        to='/faq'
                    >
                        FAQ
                    </NavLink>
                </li>
                {/* {showAdminka ? <li
                    class="navbar__link"
                >
                    <a href="/panel">Админка</a>
                </li> : ""} */}
            </ul>
        </div>
    )
}

export default compose(withToggleShowModalWindow)(HeaderNav)
