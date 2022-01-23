import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import withToggleShowModalWindow from "../../hoc/withToggleShowModalWindow"
import { newNotificationTC } from "../../redux/reducers/NotificationsReducer"
import { setUserAuthData } from "../../redux/reducers/UserAuthDataReducer"
import socket from "../../api/api"
import Header from "./Header"
import { withRouter } from "react-router"

class HeaderContainer extends Component {
    componentDidMount() {
        socket.on("LOAD_USER_INFO", (data) => {
            if (data.code == "succes") this.props.setUserAuthData(data)
            this.props.newNotificationTC(data.message, data.messageNum)
        })
        socket.on("MESSAGE", ({ message, messageNum, reloadUrl }) => {
            this.props.newNotificationTC(message, messageNum)
            if(reloadUrl) window.location.href = reloadUrl;
        })
    }

    render() {
        const { toggleShowModalWindow, setModalChild, history } = this.props
        return (
            <Header
                {...this.props.AuthData}
                goTo={(path) => {
                    history.push(path)
                }}
                toggleShowModalWindow={toggleShowModalWindow}
                setModalChild={setModalChild}
                AccessAdmin={this.props.AccessAdmin}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    AuthData: state.AuthData,
    AccessAdmin: state.AdminModerPanel,
})

const mapDispatchToProps = {
    setUserAuthData,
    newNotificationTC,
}

export default compose(
    withRouter,
    withToggleShowModalWindow,
    connect(mapStateToProps, mapDispatchToProps)
)(HeaderContainer)
