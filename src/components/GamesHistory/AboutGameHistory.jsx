import React from "react"
import { connect } from "react-redux"
import provablyfairIcn_2 from "../../assets/image/provablyfairIcn_2.svg"
import bananaIcn from "../../assets/image/bananaIcn.svg"
import weaponIcn from "../../assets/image/weaponIcn.svg"
import playerIcn from "../../assets/image/playerIcn.svg"
import copyIcn from "../../assets/image/copyIcn.svg"
import BlackBtn from "../common/BlackBtn/BlackBtn"
import GamesHistory, { kofxColor } from "./GamesHistory"
import {
    setModalOnBtnBefore,
    setModalChild,
} from "../../redux/reducers/ModalWindowReducer"
import { CrashAllBetsItem } from "../CrashPage/CrashAllBets"
import ProvablyFair from "../ProvablyFair/ProvablyFair"
import "../../utils/i18next"
import { useTranslation } from "react-i18next"
import { useMedia } from "react-media"
import { GLOBAL_MEDIA_QUERIES } from "../../utils/mediaQueries"
import "./AboutGameHistory.scss"

export const AboutGameHistoryHead = ({
    game,
    id,
    verifyInner,
    setModalOnBtnBefore,
    setModalChild,
    children,
    withoutProvablyFair = false,
}) => {
    const { t } = useTranslation()

    if (!game)
        game = {
            kofX: 1.71,
            hash: "25f2502865c258049bc3889feb73bc25ebda4e9f7d16fd8b096deac5aa6a401b",
            salt: "6505a15facbb1245685108ff60d78c35",
        }

    return (
        <div class='about-game-history__head'>
            <div class={`about-game-history__kof-x ${kofxColor(game.kofX)}`}>
                {game.kofX}x
            </div>
            <div class='about-game-history__sub-kof-x'>
                {t("history.Multiplier outcome")}
            </div>
            {!withoutProvablyFair && (
                <div class='about-game-history__provably-fair'>
                    <img src={provablyfairIcn_2} alt='1' />
                    <span
                        onClick={() =>
                            setModalChild(
                                <ProvablyFair
                                    id={id}
                                    game={game}
                                    setModalOnBtnBefore={setModalOnBtnBefore}
                                    setModalChild={setModalChild}
                                />,
                                "Provably fair",
                                true
                            )
                        }
                    >
                        Provably fair
                    </span>
                </div>
            )}
            <div class='about-game-history__hash about-game-history-hash'>
                <span class='about-game-history-hash__title'>
                    {t("crash.Hash")}:
                </span>
                <span class='about-game-history-hash__body'>{game.hash}</span>
                <button
                    class='about-game-history-hash__copy'
                    onClick={() => navigator.clipboard.writeText(game.hash)}
                >
                    <img src={copyIcn} alt='copyIcn' />
                </button>
            </div>
            <div class='about-game-history__salt about-game-history-salt'>
                <span class='about-game-history-salt__title'>Salt:</span>
                <span class='about-game-history-salt__body'>{game.salt}</span>
                <button
                    class='about-game-history-salt__copy'
                    onClick={() => navigator.clipboard.writeText(game.salt)}
                >
                    <img src={copyIcn} alt='copyIcn' />
                </button>
            </div>
            <a
                href='https://emn178.github.io/online-tools/sha256.html'
                class='about-game-history__verify-btn'
                target='_blank'
            >
                {verifyInner}
            </a>
            {children}
        </div>
    )
}

const AboutGameHistory = ({ id, game, setModalOnBtnBefore, setModalChild }) => {
    const { t } = useTranslation()

    const { mobileL } = useMedia({ queries: GLOBAL_MEDIA_QUERIES })

    const {
        allBets,
        amountOfPlayers,
        hash,
        kofX,
        salt,
        totalBetsSumma,
        weaponsValue,
    } = game

    setModalOnBtnBefore(() => {
        setModalChild(<GamesHistory />, "Games History", false)
    })

    return (
        <div class='about-game-history'>
            <div className='about-game-history__container'>
                <AboutGameHistoryHead
                    translate={t}
                    id={id}
                    game={game}
                    verifyInner={t("provably-fair.Verify the outcome")}
                    setModalOnBtnBefore={setModalOnBtnBefore}
                    setModalChild={setModalChild}
                />

                <div class='about-game-history__line-info'>
                    <BlackBtn
                        style={{ padding: "8px 12px" }}
                        classAdd={["games-history-item__btn"]}
                        notButton={true}
                    >
                        <img src={playerIcn} alt='playerIcn' />
                        {amountOfPlayers} {!mobileL && t("crash.players")}
                    </BlackBtn>
                    <BlackBtn
                        style={{ padding: "8px 12px" }}
                        classAdd={["games-history-item__btn"]}
                        notButton={true}
                    >
                        <img src={bananaIcn} alt='bananIcn' />$
                        {totalBetsSumma.stringNice()}{" "}
                        {!mobileL && t("crash.bets value")}
                    </BlackBtn>
                    <BlackBtn
                        style={{ padding: "8px 12px" }}
                        classAdd={["games-history-item__btn"]}
                        notButton={true}
                    >
                        <img src={weaponIcn} alt='weaponIcn' />
                        {weaponsValue} {!mobileL && t("crash.skins placed")}
                    </BlackBtn>
                </div>

                <div class='about-game-history__all-bets'>
                    {allBets.map((bet) => {
                        return (
                            <CrashAllBetsItem
                                {...bet}
                                crashed={!Object.keys(bet.skinsVictory).length}
                                inAboutGame={!mobileL}
                                inGame={false}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    game: state.GamesHistory.gameActive,
})

const mapDispatchToProps = {
    setModalOnBtnBefore,
    setModalChild,
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutGameHistory)
