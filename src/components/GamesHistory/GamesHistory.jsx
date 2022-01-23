import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import GreyBtn from "../common/GreyBtn/GreyBtn"
import withToggleShowModalWindow from "../../hoc/withToggleShowModalWindow"
import AboutGameHistory from "./AboutGameHistory"
import {
    setNewHistory,
    loadGame,
    setGameType,
} from "../../redux/reducers/GamesHistoryReducer"
import socket from "../../api/api"
import { newNotificationTC } from "../../redux/reducers/NotificationsReducer"
import Preloader from "../common/Preloader/Preloader"
import Options from "../common/Options/Options"
import playerIcn from "../../assets/image/playerIcn.svg"
import bananaIcn from "../../assets/image/bananaIcn.svg"
import i18n from "../../utils/i18next"
import { useTranslation } from "react-i18next"
import "./GamesHistory.scss"

export const kofxColor = (x) => {
    if (x < 1.3) return "red-x-in-history"
    if (x >= 2) return "yellow-x-in-history"
    return "grey-x-in-history"
}

const GamesHistoryItem = ({
    kofX,
    betsValue,
    time,
    amountOfPlayers,
    id,
    setModalChild,
    gameText,
    betsValueText,
    playersText,
}) => {
    const showAboutGame = () => {
        socket.emit("LOAD_HISTORY_GAME", id)

        setModalChild(<AboutGameHistory id={id} />, `${gameText} #${id}`, true)
    }

    return (
        <div onClick={showAboutGame} class='games-history__item games-history-item'>
            <div class='games-history-item__grid'>
                <div class={`games-history-item__kof-x ${kofxColor(kofX)}`}>
                    {kofX + "x"}
                </div>
                <div class='games-history-item__game-number'>
                    {gameText} #{id}
                </div>
                <div class='games-history-item__time'>{time}</div>
                <div class='games-history-item__bottom'>
                    <GreyBtn
                        style={{ padding: "8px 12px" }}
                        classAdd={["games-history-item__btn"]}
                        notButton={true}
                    >
                        <img src={bananaIcn} alt='bananIcn' />
                        {betsValue.stringNice()} {betsValueText}
                    </GreyBtn>
                    <GreyBtn
                        style={{ padding: "8px 12px" }}
                        classAdd={["games-history-item__btn"]}
                        notButton={true}
                    >
                        <img src={playerIcn} alt='playerIcn' />
                        {amountOfPlayers} {playersText}
                    </GreyBtn>
                </div>
            </div>
        </div>
    )
}
const GamesHistoryItemWithModalControl = withToggleShowModalWindow(GamesHistoryItem)

const CrashHistory = ({ games, translate }) => (
    <div class='games-history__column'>
        {games.map((game) => (
            <GamesHistoryItemWithModalControl
                gameText={translate("history.Game")}
                betsValueText={translate("crash.bets value")}
                playersText={translate("crash.players")}
                key={game.id}
                {...game}
            />
        ))}
    </div>
)

const GamesHistory = ({ games, setNewHistory, loadGame, setGameType, gameType }) => {
    // const gameTypes = ["Crash", "Soon"]
    const { t } = useTranslation()

    const gameTypes = [
        { type: "Crash", nameText: "Crash" },
        { type: "Soon", nameText: t("history.Soon") },
    ]
    const [showPreloader, setShowPreloader] = useState(true)
    const type = "Crash"

    useEffect(() => {
        socket.emit("LOAD_HISTORY_ALLGAMES", type)

        socket.on("LOAD_HISTORY_ALLGAMES", (data) => {
            if (!data.message) setNewHistory(data)
            else this.props.newNotificationTC(data.message, data.messageNum)

            setShowPreloader(false)
        })
        if (!socket.hasListeners("LOAD_HISTORY_GAME"))
            socket.on("LOAD_HISTORY_GAME", (data) => {
                if (!data.message) loadGame(data)
                else this.props.newNotificationTC(data.message, data.messageNum)
            })

        return () => {
            socket.off("LOAD_HISTORY_ALLGAMES")
        }
    }, [setNewHistory, newNotificationTC, loadGame])

    return (
        <div className='games-history'>
            <div className='games-history__options'>
                <Options
                    handleChange={(e) => {
                        setGameType(e.target.value)
                    }}
                    value={gameType}
                >
                    {gameTypes.map(({ nameText }) => nameText)}
                </Options>
            </div>

            <div class='games-history__body'>
                {showPreloader ? (
                    <Preloader />
                ) : (
                    <>
                        {gameType === "Crash" ? (
                            <CrashHistory translate={t} games={games} />
                        ) : (
                            <h1 class='games-history__soon'>{t("history.Soon")}...</h1>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    games: state.GamesHistory.games,
    gameType: state.GamesHistory.currentGameType,
})

export default connect(mapStateToProps, {
    setNewHistory,
    loadGame,
    newNotificationTC,
    setGameType,
})(GamesHistory)
