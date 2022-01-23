import React, { Component } from "react"
import { connect } from "react-redux"
import socket from "../../api/api"
import CrashHistoryLine from "./CrashHistoryLine"
import CrashYourBet from "./CrashYourBet"
import CrashAllBets from "./CrashAllBets"
import CrashCraph from "./CrashCraph"
import {
    upadteAllBets,
    clearAllBets,
    crashedAllItems,
} from "../../redux/reducers/crashAllBets_Reducer"
import { addNewHistory, changeHash } from "../../redux/reducers/crashInfo_Reducer"
import {
    chashedGame,
    updateKofX,
    updateTimer,
    newGame,
} from "../../redux/reducers/crashGraph_Reducer"
import {
    setAnimation,
    clearAnimation,
    setMyBets,
} from "../../redux/reducers/crashBlockBet_Reducer"
import { setInventoryItems } from "../../redux/reducers/inventoryReducer"
import { newNotificationTC } from "../../redux/reducers/NotificationsReducer"
import Preloader from "../common/Preloader/Preloader"
import useSound from "use-sound" // for sound on new game
import newGameSound from "./sounds/crashStart.mp3"

import "./CrashPage.scss"

export class CrashPageContainer extends Component {
    state = { showPreloader: true }

    componentDidMount() {
        socket.on("LOAD_GAME", (data) => {
            this.props.changeHash(data.hash)
            this.props.addNewHistory(data.XsHistory)
            this.props.upadteAllBets(data.allBets)

            let skin = data.allBets.find((v) => v.steamId == this.props.steamid)
            if (skin) this.props.setMyBets(skin.totalBetsSumma, skin.betsValueWin)
            else this.props.setMyBets(0, 0)

            this.setState({ showPreloader: false })
        })
        socket.on("ADD_TAKE_BET", (data) => {
            if (data.messageNum == 1) this.props.setInventoryItems(data.inventory)
            this.props.newNotificationTC(data.message, data.messageNum)
        })
        socket.on("UPDATE_bets", (data) => {
            this.props.upadteAllBets(data)

            let skin = data.find((v) => v.steamId == this.props.steamid)
            if (skin) this.props.setMyBets(skin.totalBetsSumma, skin.betsValueWin)
            else this.props.setMyBets(0, 0)
        })
        socket.on("SEND_ANIMATION_WINSKINS", (skin) => {
            this.props.setAnimation(skin)
        })
        socket.on("UPDATE_time", (data) => {
            this.props.updateTimer(data.timer)
        })
        socket.on("UPDATE_kofX", (data) => {
            this.props.updateKofX(data.kofX)
        })
        socket.on("NEW_GAME", (data) => {
            this.props.playSound()
            this.props.newGame()
            this.props.clearAllBets()
            this.props.addNewHistory(data.XsHistory)
            this.props.changeHash(data.hash)
        })
        socket.on("CRASH_GAME", (data) => {
            this.props.chashedGame(data.kofX)
            this.props.clearAnimation()
            this.props.crashedAllItems()
        })
        socket.emit("JOIN_CRASH")
    }
    componentWillUnmount() {
        socket.off("LOAD_GAME")
        socket.off("ADD_TAKE_BET")
        socket.off("UPDATE_kofX")
        socket.off("UPDATE_bets")
        socket.off("NEW_GAME")
        socket.off("UPDATE_time")
        socket.off("CRASH_GAME")
        socket.off("SEND_ANIMATION_WINSKINS")
    }

    render() {
        if (this.state.showPreloader) return <Preloader />
        else
            return (
                <div class='app__crash crash'>
                    <div class='crash__grid'>
                        <CrashCraph
                            isMuted={this.props.isMuted}
                            toggleMute={this.props.toggleMute}
                        />

                        <CrashHistoryLine />

                        <CrashYourBet />

                        <CrashAllBets />
                    </div>
                </div>
            )
    }
}
const mapDispatchToProps = {
    changeHash,
    addNewHistory,
    chashedGame,
    updateKofX,
    updateTimer,
    newGame,
    upadteAllBets,
    clearAllBets,
    crashedAllItems,
    setInventoryItems,
    newNotificationTC,
    setAnimation,
    clearAnimation,
    setMyBets,
}

const mapStateToProps = (state) => ({
    steamid: state.AuthData.steamid,
})

const CrashPageContainerConnected = connect(
    mapStateToProps,
    mapDispatchToProps
)(CrashPageContainer)

const CrashPageWithSound = () => {
    const [playbackRate, setPlaybackRate] = React.useState(1)

    const toggleMute = () => setPlaybackRate(+!playbackRate)

    const [playSound] = useSound(newGameSound, { playbackRate })

    return (
        <CrashPageContainerConnected
            isMuted={!playbackRate}
            toggleMute={toggleMute}
            playSound={playSound}
        />
    )
}

export default CrashPageWithSound
