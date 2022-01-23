import React, { Component } from "react"
import { connect } from "react-redux"
import {
    setAccess,
    setSupportMes,
    setAllUsers,
    setAllWithdrawItems,
} from "../../redux/reducers/AdminModerReducer"
import AdminModer from "./AdminModer"
import socket from "../../api/api"
import { compose } from "redux"
import { newNotificationTC } from "../../redux/reducers/NotificationsReducer"

export class AdminModerContainer extends Component {
    state = { showPreloader: true }
    componentDidMount() {
        socket.emit(
            "GET_ACCESS_METHOD",
            prompt("Введите логин"),
            prompt("Введите пароль")
        )
        console.log("АВТОРИЗАЦИЯ")

        socket.on("GET_ACCESS_METHOD", ({ message, messageNum, data }) => {
            try {
                if (data.isEmpty()) window.location = "/"
                this.props.setAccess(data)
                this.props.newNotificationTC(message, messageNum)
                this.setState({ showPreloader: false })
            } catch (error) {
                //window.location = "/"
            }
        })
        if (!socket.hasListeners("UPDATE_COUNT_MESSOPENSUPPORT"))
            socket.on("UPDATE_COUNT_MESSOPENSUPPORT", (data) => {
                this.props.setSupportMes(data)
            })
        if (!socket.hasListeners("GET_ALLUSERS"))
            socket.on("GET_ALLUSERS", (data) => {
                this.props.setAllUsers(data)
            })
        if (!socket.hasListeners("GET_ALLWITHDRAW"))
            socket.on("GET_ALLWITHDRAW", (data) => {
                this.props.setAllWithdrawItems(data)
            })
    }

    componentWillUnmount() {
        socket.off("GET_ACCESS_METHOD")
    }

    render() {
        return <AdminModer newNotificationTC={this.props.newNotificationTC} showPreloader={this.state.showPreloader} state={this.props} />
    }
}

const mapStateToProps = (state) => ({
    ...state.AdminModerPanel,
})

const mapDispatchToProps = {
    setAccess,
    newNotificationTC,
    setSupportMes,
    setAllUsers,
    setAllWithdrawItems,
}
export default compose(connect(mapStateToProps, mapDispatchToProps))(AdminModerContainer)
