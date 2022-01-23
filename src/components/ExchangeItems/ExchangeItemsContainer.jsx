import React, { Component } from "react"
import { compose } from "redux"
import { connect } from "react-redux"
import ExchangeItems from "./ExchangeItems"
import {
    setShopItems,
    updateSearchInputValue,
    clearItems,
    sortWeaponsBy,
    toggleContinueScroll,
    selectShopItem,
    cancelShopItem,
    selectSortOption,
    updateMinPrice,
    updateMaxPrice,
    toggleStockOnly,
    changeTotalSelectedPriceShop,
    setDisableExchangeBtn,
} from "../../redux/reducers/ShopItemsReducer"
import withToggleShowModalWindow from "../../hoc/withToggleShowModalWindow"
import socket from "../../api/api"
import { updateBalance } from "../../redux/reducers/UserAuthDataReducer"
import { setInventoryItems } from "../../redux/reducers/inventoryReducer"
import { newNotificationTC } from "../../redux/reducers/NotificationsReducer"

class ExchangeItemsContainer extends Component {
    state = { showPreloader: true }
    componentDidMount() {
        document
            .getElementById("exchange-items-container")
            .addEventListener("scroll", this.handleScroll)

        socket.on("LOAD_ALLSKINS", (items) => {
            this.props.setShopItems(items)
            setTimeout(() => {
                this.setState({ showPreloader: false })
            }, 500)
        })

        socket.on(
            "EXCHANGE_ITEM",
            ({ message, inventory, balance, messageNum }) => {
                this.props.newNotificationTC(message, messageNum)

                if (messageNum == 1) {
                    this.props.updateBalance(balance)
                    this.props.setInventoryItems(inventory)
                    this.props.toggleShowModalWindow()
                }
            }
        )

        this.props.sortWeaponsBy(this.props.Shop.sortType)

        socket.emit("LOAD_ALLSKINS", {
            skip: this.props.Shop.pageCounter,
            sort: this.props.Shop.sortType,
            minPrice: Number(this.props.Shop.minPrice),
            maxPrice: Number(this.props.Shop.maxPrice),
            stockOnly: this.props.Shop.stockOnly,
            name: this.props.Shop.searchInputValue,
        })
    }

    componentDidUpdate() {}

    componentWillUnmount() {
        document
            .getElementById("exchange-items-container")
            .removeEventListener("scroll", this.handleScroll)

        socket.off("EXCHANGE_ITEM")
        socket.off("LOAD_ALLSKINS")
        this.props.clearItems()
    }

    handleScroll = (event) => {
        if (
            this.props.Shop.weaponsAmount == this.props.Shop.pageCounter &&
            this.props.Shop.continueHandleScroll &&
            event.target.scrollHeight -
                window.innerHeight / 4 -
                event.target.scrollTop <
                600
        ) {
            this.props.sortWeaponsBy(this.props.Shop.sortType)

            socket.emit("LOAD_ALLSKINS", {
                skip: this.props.Shop.pageCounter,
                sort: this.props.Shop.sortType,
                minPrice: Number(this.props.Shop.minPrice),
                maxPrice: Number(this.props.Shop.maxPrice),
                stockOnly: this.props.Shop.stockOnly,
                name: this.props.Shop.searchInputValue,
            })

            this.props.toggleContinueScroll()
            setTimeout(this.props.toggleContinueScroll, 1000)
        }
    }

    onExchange = () => {
        const selectItemsId = this.props.inventory.weapons
            .filter((v) => v.isSelected)
            .map((v) => v.idItem)

        socket.emit(
            "EXCHANGE_ITEM",
            this.props.Shop.weapons
                .filter((v) => v.isSelected)
                .map((v) => v.idItem),
            selectItemsId
        )
    }

    render() {
        return (
            <ExchangeItems
                onExchange={this.onExchange}
                toggleShowModalWindow={this.props.toggleShowModalWindow}
                showPreloader={this.state.showPreloader}
                setDisableExchangeBtn={this.props.setDisableExchangeBtn}
                DisableExchangeBtn={this.props.Shop.DisableExchangeBtn}
                changeTotalSelectedPriceShop={
                    this.props.changeTotalSelectedPriceShop
                }
                stockOnly={this.props.Shop.stockOnly}
                updateMinPrice={this.props.updateMinPrice}
                updateMaxPrice={this.props.updateMaxPrice}
                selectSortOption={this.props.selectSortOption}
                toggleContinueScroll={this.props.toggleContinueScroll}
                toggleStockOnly={this.props.toggleStockOnly}
                pageCounter={this.props.Shop.pageCounter}
                sortType={this.props.Shop.sortType}
                sortWeaponsBy={this.props.sortWeaponsBy}
                selectShopItem={this.props.selectShopItem}
                cancelShopItem={this.props.cancelShopItem}
                clearItems={this.props.clearItems}
                weapons={this.props.Shop.weapons}
                totalSelectedPrice={this.props.Shop.totalSelectedPrice}
                minPrice={this.props.Shop.minPrice}
                maxPrice={this.props.Shop.maxPrice}
                selectItemsId={this.props.inventory.weapons
                    .filter((v) => v.isSelected)
                    .map((v) => v.idItem)}
                totalBalance={
                    Number(this.props.inventory.totalSelectedPrice) +
                    Number(this.props.balance)
                }
                updateSearchInputValue={this.props.updateSearchInputValue}
                searchInputValue={this.props.searchInputValue}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    inventory: state.inventory,
    Shop: state.Shop,
    balance: state.AuthData.balance.toString(),
    searchInputValue: state.Shop.searchInputValue,
})

const mapDispatchToProps = {
    setShopItems,
    updateSearchInputValue,
    clearItems,
    sortWeaponsBy,
    toggleContinueScroll,
    selectShopItem,
    cancelShopItem,
    selectSortOption,
    updateMinPrice,
    updateMaxPrice,
    toggleStockOnly,
    changeTotalSelectedPriceShop,
    setDisableExchangeBtn,
    updateBalance,
    setInventoryItems,
    newNotificationTC,
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withToggleShowModalWindow
)(ExchangeItemsContainer)
