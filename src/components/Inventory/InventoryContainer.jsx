import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import {
    setInventoryItems,
    selectItem,
    cancelItem,
    toggleSelectAll,
    changeTotalSelectedPrice,
} from "../../redux/reducers/inventoryReducer"
import Inventory from "./Inventory"
import socket from "../../api/api"
import withToggleShowModalWindow from "../../hoc/withToggleShowModalWindow"
import { InventoryHeadForMobile } from "./InventoryHeadForMobile/InventoryHeadForMobile"

export class InventoryContainer extends Component {
    state = {
        isInventoryOpen: false,
    }

    componentDidMount() {
        socket.on("LOAD_INVENTORY", ({ code, inventory }) => {
            if (code != "no_auth") this.props.setInventoryItems(inventory)
        })
    }
    render() {
        return (
            <>
                <Inventory
                    closeInventory={() => this.setState({ isInventoryOpen: false })}
                    isInventoryOpen={this.state.isInventoryOpen}
                    weapons={this.props.inventory.weapons}
                    isAllSelected={this.props.inventory.isAllSelected}
                    totalSelectedPrice={this.props.inventory.totalSelectedPrice}
                    totalPrice={this.props.inventory.totalPrice}
                    weaponsAmount={this.props.inventory.weaponsAmount}
                    selectItem={this.props.selectItem}
                    cancelItem={this.props.cancelItem}
                    toggleSelectAll={this.props.toggleSelectAll}
                    selectedWeaponsAmount={this.props.inventory.selectedWeaponsAmount}
                    changeTotalSelectedPrice={this.props.changeTotalSelectedPrice}
                    setModalChild={this.props.setModalChild}
                    openModalWindow={this.props.toggleShowModalWindow}
                />

                <InventoryHeadForMobile
                    openInventory={() => this.setState({ isInventoryOpen: true })}
                    totalSelectedPrice={this.props.inventory.totalSelectedPrice}
                />
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    inventory: state.inventory,
})

const mapDispatchToProps = {
    setInventoryItems,
    selectItem,
    cancelItem,
    toggleSelectAll,
    changeTotalSelectedPrice,
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withToggleShowModalWindow
)(InventoryContainer)
