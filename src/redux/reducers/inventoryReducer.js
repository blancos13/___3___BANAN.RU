export const SELECT = "inventory/SELECT"
export const CANCEL = "inventory/CANCEL"
export const UPDATE_ITEMS = "inventory/UPDATE_ITEMS"
export const SET_ITEMS_INVENTORY = "inventory/SET_ITEMS_INVENTORY"
export const TOGGLE_SELECT_ALL = "inventory/TOGGLE_SELECT_ALL"
export const CHANGE_TOTAL_SELECTED_PRICE = "inventory/CHANGE_TOTAL_SELECTED_PRICE"

const defaultState = {
    weapons: [],
    weaponsAmount: 0,
    lastSelectedItemId: 0,
    selectedWeaponsAmount: 0,
    isAllSelected: false,
    totalSelectedPrice: "0",
    totalPrice: 0,
}

const inventoryReducer = (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_TOTAL_SELECTED_PRICE:
            let newTotalSelectedPrice = 0
            state.weapons.forEach((weapon) => {
                if (weapon.isSelected) newTotalSelectedPrice += Number(weapon.price)
            })

            return {
                ...state,
                totalSelectedPrice: newTotalSelectedPrice,
            }
        case SELECT:
            return {
                ...state,
                weapons: state.weapons.map((item) =>
                    action.itemId == item.id ? { ...item, isSelected: true } : item
                ),
                selectedWeaponsAmount: state.selectedWeaponsAmount + 1,
                lastSelectedItemId: action.itemId,
            }

        case TOGGLE_SELECT_ALL:
            return {
                ...state,
                weapons: state.weapons.map((item) =>
                    action.removeAll
                        ? { ...item, isSelected: false }
                        : state.isAllSelected
                        ? { ...item, isSelected: false }
                        : { ...item, isSelected: true }
                ),
                selectedWeaponsAmount: action.removeAll
                    ? 0
                    : !state.isAllSelected
                    ? state.weaponsAmount
                    : 0,
                lastSelectedItemId: action.removeAll
                    ? 0
                    : !state.isAllSelected
                    ? state.weaponsAmount - 1
                    : 0,
                isAllSelected: action.removeAll ? false : !state.isAllSelected,
                totalSelectedPrice: action.removeAll ? "0" : state.totalPrice,
            }
        case CANCEL:
            return {
                ...state,
                weapons: state.weapons.map((item) =>
                    action.itemId == item.id ? { ...item, isSelected: false } : item
                ),
                selectedWeaponsAmount: state.selectedWeaponsAmount - 1,
            }
        case SET_ITEMS_INVENTORY:
            let newTotalPrice = 0

            return {
                ...state,
                weapons: action.items.map(
                    ({ idItem, price, imgSrc, weaponName, rarity }, i) => {
                        newTotalPrice += Number(price)

                        let exterior = weaponName.splitBrackets()
                        weaponName = weaponName.deleteBrackets()

                        return {
                            ...{ idItem, price, imgSrc, rarity },
                            id: i,
                            weaponName: weaponName,
                            exterior: exterior,
                            isSelected: false, //Boolean(isSelected)
                        }
                    }
                ),
                weaponsAmount: action.items.length,
                lastSelectedItemId: 0, //temp_lastSelectedId
                selectedWeaponsAmount: 0, //temp_selectedWeaponsAmount
                totalPrice: newTotalPrice,
                totalSelectedPrice: 0,
                isAllSelected: false,
            }

        default:
            return state
    }
}

export const changeTotalSelectedPrice = () => ({
    type: CHANGE_TOTAL_SELECTED_PRICE,
})

export const selectItem = (itemId) => ({
    type: SELECT,
    itemId: itemId,
})

export const toggleSelectAll = (removeAll = false) => ({
    type: TOGGLE_SELECT_ALL,
    removeAll: removeAll,
})

export const cancelItem = (itemId) => ({
    type: CANCEL,
    itemId: itemId,
})

export const setInventoryItems = (items) => ({
    type: SET_ITEMS_INVENTORY,
    items: items,
})

String.prototype.splitBrackets = function () {
    var regExp = /\(([^)]+)\)/
    var res = regExp.exec(this)
    return res ? res[1] : ""
}
String.prototype.deleteBrackets = function () {
    var regExp = /\(([^)]+)\)/
    var res = regExp.exec(this)
    res = res ? res[1] : ""
    return this.replace(`(${res})`, "").trim()
}
Array.prototype.howLenghtById = function (idItem) {
    return this.filter((item) => item.idItem == idItem).length
}

export default inventoryReducer
