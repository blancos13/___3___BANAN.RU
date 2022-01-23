import React, { Component } from "react"
import { connect } from "react-redux"
import WithdrawItems from "./WithdrawItems"
import {
    // LOAD_ALLWITHDRAW,
    UPDATE_STATUS,
    ADD_WITHDRAW,
} from "../../redux/reducers/withdrawHistoryReduce.js"
import { setInventoryItems, toggleSelectAll } from "../../redux/reducers/inventoryReducer"
import socket from "../../api/api"
import { newNotificationTC } from "../../redux/reducers/NotificationsReducer"

export class WithdrawItemsContainer extends Component {
    componentDidMount() {
        if (!socket.hasListeners("UPDATE_STATUS"))
            socket.on("UPDATE_STATUS", (items) => {
                this.props.UPDATE_STATUS(items)
            })
        if (!socket.hasListeners("ADD_WITHDRAW"))
            socket.on("ADD_WITHDRAW", ({ message, items, inventory }) => {
                this.props.toggleSelectAll(true)
                this.props.setInventoryItems(inventory)
                if (!message) this.props.ADD_WITHDRAW(items)
            })
        socket.emit("GET_WITHDRAW")
    }

    render() {
        return (
            <WithdrawItems
                newNotification={this.props.newNotificationTC}
                weapons={this.props.Withdraw.withdraw}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    Withdraw: state.Withdraw,
    //Notifications: state.Notifications,
})

const mapDispatchToProps = {
    //LOAD_ALLWITHDRAW,
    UPDATE_STATUS,
    ADD_WITHDRAW,
    setInventoryItems,
    toggleSelectAll,
    newNotificationTC,
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawItemsContainer)
