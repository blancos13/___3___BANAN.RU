export const SELECT_SHOP_ITEM = "SELECT_SHOP_ITEM"
export const CANCEL_SHOP_ITEM = "CANCEL_SHOP_ITEM"
export const SET_SHOP_ITEMS = "SET_SHOP_ITEMS"
export const CLEAR_ITEMS = "CLEAR_ITEMS"
export const TOGGLE_SELECT_ALL = "TOGGLE_SELECT_ALL"
export const CHANGE_TOTAL_SELECTED_PRICE_SHOP =
    "CHANGE_TOTAL_SELECTED_PRICE_SHOP"
export const SORT_WEAPONS_BY = "SORT_WEAPONS_BY"
export const UPDATE_INPUT_VALUE = "UPDATE_INPUT_VALUE"
export const UPDATE_MAX_INPUT_VALUE = "UPDATE_MAX_INPUT_VALUE"
export const UPDATE_MIN_INPUT_VALUE = "UPDATE_MIN_INPUT_VALUE"
export const TOGGLE_CONTINUE_SCROLL = "TOGGLE_CONTINUE_SCROLL"
export const TOGGLE_STOCK_ONLY = "TOGGLE_STOCK_ONLY"
export const TOGGLE_DISABLE_EXCHANGE_BTN = "TOGGLE_DISABLE_EXCHANGE_BTN"
import socket from "../../api/api"

const defaultState = {
    weapons: [],
    weaponsAmount: 0,
    selectedWeaponsAmount: 0,
    totalSelectedPrice: 0,
    searchInputValue: "",
    continueHandleScroll: true,
    pageCounter: 0,
    sortType: -1,
    minPrice: "",
    maxPrice: "",
    stockOnly: true,
    DisableExchangeBtn: false,
}

const ShopItemsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case TOGGLE_DISABLE_EXCHANGE_BTN:
            return {
                ...state,
                DisableExchangeBtn: action.flag,
            }
        case UPDATE_MAX_INPUT_VALUE:
            return {
                ...state,
                maxPrice: action.maxPrice,
            }
        case UPDATE_MIN_INPUT_VALUE:
            return {
                ...state,
                minPrice: action.minPrice,
            }
        case TOGGLE_CONTINUE_SCROLL:
            return {
                ...state,
                continueHandleScroll: !state.continueHandleScroll,
            }
        case TOGGLE_STOCK_ONLY:
            return {
                ...state,
                stockOnly: !state.stockOnly,
            }
        case SORT_WEAPONS_BY:
            return {
                ...state,
                sortType: action.sortType,
                pageCounter: state.pageCounter + 60,
            }
        case CLEAR_ITEMS:
            return {
                ...state,
                weapons: [],
                weaponsAmount: 0,
                selectedWeaponsAmount: 0,
                totalSelectedPrice: 0,
                //searchInputValue: "",
                pageCounter: 0,
                DisableExchangeBtn: false,
            }
        case UPDATE_INPUT_VALUE:
            return {
                ...state,
                searchInputValue: action.value,
            }

        case CHANGE_TOTAL_SELECTED_PRICE_SHOP:
            let newTotalSelectedPrice = 0
            state.weapons.forEach((weapon) => {
                if (weapon.isSelected)
                    newTotalSelectedPrice += Number(weapon.price)
            })

            return {
                ...state,
                totalSelectedPrice: newTotalSelectedPrice,
            }
        case SELECT_SHOP_ITEM:
            return {
                ...state,
                weapons: state.weapons.map((item) =>
                    action.itemId == item.id
                        ? { ...item, isSelected: true }
                        : item
                ),
                selectedWeaponsAmount: state.selectedWeaponsAmount + 1,
            }

        case CANCEL_SHOP_ITEM:
            return {
                ...state,
                weapons: state.weapons.map((item) =>
                    action.itemId == item.id
                        ? { ...item, isSelected: false }
                        : item
                ),
                selectedWeaponsAmount: state.selectedWeaponsAmount - 1,
            }

        case SET_SHOP_ITEMS:
            let temp_selectedWeaponsAmount = 0
            return {
                ...state,
                weapons: [
                    ...state.weapons,
                    ...action.items.map(
                        ({ idItem, price, imgSrc, weaponName, rarity }, i) => {
                            let exterior = weaponName.splitBrackets()
                            weaponName = weaponName.deleteBrackets()
                            var isSelected = state.weapons.find(
                                (e) =>
                                    e.id == i &&
                                    weaponName == e.weaponName &&
                                    e.exterior == exterior &&
                                    e.isSelected
                            )
                            if (isSelected) {
                                temp_selectedWeaponsAmount++
                            }
                            return {
                                ...{ idItem, price, imgSrc, rarity },
                                id: i + state.pageCounter,
                                weaponName: weaponName,
                                exterior: exterior,
                                isSelected: Boolean(isSelected),
                            }
                        }
                    ),
                ],
                weaponsAmount: state.weaponsAmount + action.items.length,

                selectedWeaponsAmount: temp_selectedWeaponsAmount,
            }

        default:
            return state
    }
}

export const setDisableExchangeBtn = (flag) => ({
    type: TOGGLE_DISABLE_EXCHANGE_BTN,
    flag,
})
export const updateMinPrice = (minPrice) => ({
    type: UPDATE_MIN_INPUT_VALUE,
    minPrice,
})

export const updateMaxPrice = (maxPrice) => ({
    type: UPDATE_MAX_INPUT_VALUE,
    maxPrice,
})

export const selectSortOption =
    (sortType, minPrice, maxPrice, stockOnly, name) => (dispatch) => {
        dispatch(clearItems())
        dispatch(sortWeaponsBy(sortType))

        socket.emit("LOAD_ALLSKINS", {
            skip: 0,
            sort: sortType,
            minPrice: Number(minPrice),
            maxPrice: Number(maxPrice),
            stockOnly: stockOnly,
            name,
        })

        dispatch(toggleContinueScroll())
        setTimeout(() => dispatch(toggleContinueScroll()), 3000)
    }

export const sortWeaponsBy = (sortType, balance = 0) => ({
    type: SORT_WEAPONS_BY,
    sortType,
    balance,
})
export const toggleStockOnly = () => ({
    type: TOGGLE_STOCK_ONLY,
})
export const toggleContinueScroll = () => ({
    type: TOGGLE_CONTINUE_SCROLL,
})

export const clearItems = () => {
    return { type: CLEAR_ITEMS }
}

export const setShopItems = (items) => {
    return { type: SET_SHOP_ITEMS, items: items }
}

export const updateSearchInputValue = (value) => ({
    type: UPDATE_INPUT_VALUE,
    value,
})

export const changeTotalSelectedPriceShop = () => ({
    type: CHANGE_TOTAL_SELECTED_PRICE_SHOP,
})

export const selectShopItem = (itemId) => ({
    type: SELECT_SHOP_ITEM,
    itemId: itemId,
})

export const cancelShopItem = (itemId) => ({
    type: CANCEL_SHOP_ITEM,
    itemId: itemId,
})

export default ShopItemsReducer
