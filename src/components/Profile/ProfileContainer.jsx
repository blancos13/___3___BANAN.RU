import React, { Component } from "react"
import { connect } from "react-redux"
import { setDataUserFull, setUrl } from "../../redux/reducers/UserDataReducer"
import Profile from "./Profile"
import socket from "../../api/api"
import { ADD_WITHDRAW } from "../../redux/reducers/withdrawHistoryReduce.js"
import { compose } from "redux"
import { withRouter } from "react-router"
import { newNotificationTC } from "../../redux/reducers/NotificationsReducer"
import { setGoToQuestionId } from "../../redux/reducers/FaqReducer"

export class ProfileContainer extends Component {
    state = { showPreloader: true }

    componentDidMount() {
        socket.on("LOAD_USER_INFO_FULL", ({ profile, code }) => {
            if (profile.allWithdraw && profile.allWithdraw.length != 0)
                this.props.ADD_WITHDRAW(profile.allWithdraw)
            this.props.setDataUserFull({ profile, code })

            this.setState({ showPreloader: false })
        })
        socket.on("UPDATE_TRADEURL", (data) => {
            if (data.messageNum == 1) this.props.setUrl(data.url)
            this.props.newNotificationTC(data.message, data.messageNum)
        })
        socket.on("UPDATE_REFCODE", (data) => {
            this.props.newNotificationTC(data.message, data.messageNum)
        })

        socket.emit("LOAD_USER_INFO_FULL", {
            witdrawLoad: !Boolean(this.props.Withdraw.length),
            steamId: this.props.match.params.userId,
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            this.setState({ showPreloader: true })

            socket.emit("LOAD_USER_INFO_FULL", {
                witdrawLoad: !Boolean(this.props.Withdraw.length),
                steamId: this.props.match.params.userId,
            })
        }
    }

    componentWillUnmount() {
        socket.off("LOAD_USER_INFO_FULL")
        socket.off("UPDATE_TRADEURL")
    }
    render() {
        return (
            <Profile
                showPreloader={this.state.showPreloader}
                isMyProfile={this.props.UserData.isMyProfile}
                data={{ ...this.props.UserData, balance: this.props.myBalance }}
                Withdraw={this.props.Withdraw}
                showAnswer={this.props.setGoToQuestionId}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    UserData: state.UserData,
    mySteamId: state.AuthData.steamid,
    myBalance: state.AuthData.balance,
    Withdraw: state.Withdraw,
})

const mapDispatchToProps = {
    setDataUserFull,
    setUrl,
    ADD_WITHDRAW,
    newNotificationTC,
    setGoToQuestionId,
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(ProfileContainer)
