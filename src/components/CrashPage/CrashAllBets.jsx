import { connect } from "react-redux"
import React from "react"
import BlackBtn from "../common/BlackBtn/BlackBtn"
import WeaponItem from "../Weapon-item/WeaponItem"
import bananIcn from "../../assets/image/bananIcnNoPd.svg"
import playerIcn from "../../assets/image/playerIcn.svg"
import weaponIcn from "../../assets/image/weaponIcn.svg"
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "../../utils/i18next"
import classNames from "classnames"
import "./CrashAllBetsItem.scss"

export const CrashAllBetsItem = ({
    avatar,
    steamId,
    items = [],
    totalBetsSumma = NaN,
    kofX,
    betsValueWin,
    skinsVictory,
    inGame = true,
    crashed = false,
    inAboutGame = false,
    withoutAvatar = false,
    weapoinItemContainerStyle = null,
    isMsgBlur,
}) => {
    const styles = classNames({
        "crash-all-bets__item": true,
        "crash-all-bets-item": true,
        "crash-all-bets-item-in-game": inGame && !crashed,
        "crash-all-bets-item-crashed": crashed,
        "crash-all-bets-item-in-about-game": inAboutGame,
        "crash-all-bets-item-without-avatar": withoutAvatar,
    })

    return (
        <div class={styles}>
            {!withoutAvatar && (
                <NavLink
                    class='crash-all-bets-item__avatar-link'
                    to={`/profile/${steamId}`}
                >
                    <div class='crash-all-bets-item__avatar'>
                        <img
                            style={isMsgBlur ? { filter: "blur(5px)" } : {}}
                            src={avatar}
                            alt='avatar'
                        />
                    </div>
                </NavLink>
            )}

            <div class='crash-all-bets-item__weapons-in-bet'>
                {items.map((weapon, i) => {
                    if (i > (inAboutGame ? 1 : 2)) return
                    return (
                        <WeaponItem
                            containerStyle={weapoinItemContainerStyle}
                            key={i + weapon.rarity}
                            onlyImage={true}
                            isClickable={false}
                            imgSrc={weapon.imgSrc}
                            rarity={weapon.rarity}
                        />
                    )
                })}
                {items.length > (inAboutGame ? 2 : 3) && (
                    <BlackBtn
                        style={
                            !inGame && !crashed
                                ? {
                                      backgroundColor: "#3D3E42",
                                  }
                                : {}
                        }
                        notButton={true}
                        classAdd={["crash-all-bets-item__items-plus"]}
                    >
                        +{items.length - (inAboutGame ? 2 : 3)}
                    </BlackBtn>
                )}
            </div>

            <div class='crash-all-bets-item__bets-value'>
                <img src={bananIcn} alt='bananIcn' />
                {totalBetsSumma.stringNice().length > 3 ? (
                    <>
                        {totalBetsSumma.stringNice().slice(0, -3)}
                        <span class='weapon-item__kopecki'>
                            {totalBetsSumma.stringNice().substr(-3, 3)}
                        </span>
                    </>
                ) : (
                    totalBetsSumma.stringNice()
                )}
            </div>

            <div
                class='crash-all-bets-item__bet-x'
                style={{
                    padding: "11px 16px",
                    justifySelf: "center",
                    borderRadius: "27px",
                    fontWeight: "bold",
                    fontSize: "15px",
                    lineHeight: "17px",
                    color: `${
                        inGame && !crashed
                            ? "#fff"
                            : crashed
                            ? "#FF4B32"
                            : "#FFC632"
                    }`,
                    backgroundColor: `${
                        inGame && !crashed
                            ? "#3D3E42"
                            : crashed
                            ? "#ff4a3225"
                            : "#615128"
                    }`,
                }}
            >
                {inGame && !crashed ? (
                    "In game"
                ) : crashed ? (
                    "Crashed"
                ) : (
                    <>x{kofX}</>
                )}
            </div>

            {!inGame && !crashed ? (
                <>
                    <div class='crash-all-bets-item__bets-value-win'>
                        <img src={bananIcn} alt='bananIcn' />
                        {betsValueWin.stringNice().length >
                        (inAboutGame ? 2 : 3) ? (
                            <>
                                {betsValueWin.stringNice().slice(0, -3)}
                                <span class='weapon-item__kopecki'>
                                    {betsValueWin.stringNice().substr(-3, 3)}
                                </span>
                            </>
                        ) : (
                            betsValueWin.stringNice()
                        )}
                    </div>
                    <div className='crash-all-bets-item__win-weapon'>
                        <WeaponItem
                            containerStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.03)",
                            }}
                            onlyImage={true}
                            isClickable={false}
                            imgSrc={skinsVictory.imgSrc}
                            rarity={skinsVictory.rarity}
                        />
                    </div>
                </>
            ) : (
                ""
            )}
        </div>
    )
}

const CrashAllBets = ({ crashAllbetsData, isMsgBlur }) => {
    const { t } = useTranslation()

    const { amountOfPlayers, amountOfSkinsPlaced, betsValue, allBets } =
        crashAllbetsData

    return (
        <div class='crash__all-bets crash-all-bets'>
            <div class='crash-all-bets__title'>{t("crash.All bets")}</div>
            <div class='crash-all-bets__info all-bets-info'>
                <BlackBtn
                    classAdd={["all-bets-info__players"]}
                    notButton={true}
                >
                    <img src={playerIcn} alt='playerIcn' />
                    {amountOfPlayers} {t("crash.players")}
                </BlackBtn>
                <BlackBtn
                    classAdd={["all-bets-info__bets-value"]}
                    notButton={true}
                >
                    <img src={bananIcn} alt='bananIcn' />
                    {`${betsValue && betsValue.stringNice()} ${t(
                        "crash.bets value"
                    )}`}
                </BlackBtn>
                <BlackBtn
                    classAdd={["all-bets-info__options"]}
                    notButton={true}
                >
                    <img src={weaponIcn} alt='weaponIcn' />
                    {amountOfSkinsPlaced} {t("crash.skins placed")}
                </BlackBtn>
            </div>

            <div class='crash-all-bets__items'>
                {allBets.map((bet, i) => (
                    <CrashAllBetsItem
                        key={bet.steamId}
                        {...bet}
                        isMsgBlur={isMsgBlur}
                    />
                ))}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    crashAllbetsData: state.crashAllBets,
    isMsgBlur: state.Chat.blurMessages,
})

export default connect(mapStateToProps, {})(CrashAllBets)
