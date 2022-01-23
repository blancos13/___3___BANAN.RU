import React, { Component } from "react"
import { connect } from "react-redux"
import { setMessageAll, setNewMessage } from "../../redux/reducers/SupportReducer"
import Support from "./Support"
import socket from "../../api/api"
import { newNotificationTC } from "../../redux/reducers/NotificationsReducer"
import { withRouter } from "react-router"
import { compose } from "redux"

export class SupportContainer extends Component {
    state = { showPreloader: true }
    componentDidMount() {
        socket.on("LOAD_SUPPORT_ALLMESSAGE", ({ message, data, messageNum }) => {
            if (!message)
                this.props.setMessageAll(
                    data.map((v) => ({ ...v, time: new Date(v.time).toLocaleString() }))
                )
            else this.props.newNotificationTC(message, messageNum)

            this.setState({ showPreloader: false })
            const chatMsgsBody = document.getElementById("supportmessage")
            chatMsgsBody.scrollTop = chatMsgsBody.scrollHeight
        })
        socket.on("NEW_MESSAGE_SUPPORT", ({ data, message, messageNum }) => {
            if (!message)
                this.props.setNewMessage({
                    ...data,
                    time: new Date(data.time).toLocaleString(),
                })
            else this.props.newNotificationTC(message, messageNum)

            const chatMsgsBody = document.getElementById("supportmessage")
            chatMsgsBody.scrollTop = chatMsgsBody.scrollHeight
        })
        // socket.on("ASSISTENT_JOIN", ({ photo, nick }) => {
        //     this.props.setAssistent({ photo, nick })
        // });
        socket.emit("LOAD_SUPPORT_ALLMESSAGE", this.props.match?.params?.userIdSender)
    }
    componentWillUnmount() {
        socket.off("LOAD_SUPPORT_ALLMESSAGE")
        socket.off("NEW_MESSAGE_SUPPORT")
        // socket.off("ASSISTENT_JOIN");
    }
    render() {
        return (
            <Support
                showPreloader={this.state.showPreloader}
                Support={this.props.Support}
                steamid={this.props.steamid}
                userIdSender={this.props.match?.params?.userIdSender}
                openSupport={this.props.openSupport}
                openOrClose={this.props.openOrClose}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    Support: state.Support,
    steamid: state.AuthData.steamid,
    openOrClose: state.AuthData.openOrClose,
    openSupport: state.AdminModerPanel.supportMes,
})

const mapDispatchToProps = {
    setMessageAll,
    setNewMessage,
    newNotificationTC,
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(SupportContainer)
