import SteamID from "steamid"

export const SET_DEPOSIT_OPTION = "addFunds/SET_DEPOSIT_OPTION"
export const SET_DATAPAYMENT = "addFunds/SET_DATAPAYMENT"
export const SET_STEAM_WEAPON = "addFunds/SET_STEAM_WEAPON"
export const TOGGLE_SELECT_WEAPON = "addFunds/TOGGLE_SELECT_WEAPON"

const defaultState = {
    currentDepositOption: "All",
    depositData: [],
    itemWeaponInventorySteam: [],
    selectedDep: {
        method: "e-wallet",
        nameMethod: "bitcoin",
        icon: "",
        fee: {
            percent: 10,
            value: 5,
        },
    }, //убрать
}

const AddFundsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case TOGGLE_SELECT_WEAPON:
            return {
                ...state,
                itemWeaponInventorySteam: state.itemWeaponInventorySteam.map(
                    (weapon) =>
                        weapon.idItem == action.id
                            ? { ...weapon, isSelected: !weapon.isSelected }
                            : weapon
                ),
            }
        case SET_DEPOSIT_OPTION:
            return {
                ...state,
                currentDepositOption: action.depositOption,
            }
        case SET_DATAPAYMENT:
            return {
                ...state,
                depositData: action.data,
            }
        case SET_STEAM_WEAPON:
            return {
                ...state,
                itemWeaponInventorySteam: action.data.map((v) => {
                    let exterior = v.weaponName.splitBrackets()
                    let weaponName = v.weaponName.deleteBrackets()

                    return {
                        ...v,
                        weaponName: weaponName,
                        exterior: exterior,
                        isSelected: false,
                    }
                }),
            }
        // case SET_WEAPONS:
        //     return {
        //         ...state,
        //         itemWeaponInventorySteam: action.weapons,
        //     }
        default:
            return state
    }
}

export const setDepositOption = (depositOption) => ({
    type: SET_DEPOSIT_OPTION,
    depositOption,
})
export const toggleSelectWeapon = (id) => ({
    type: TOGGLE_SELECT_WEAPON,
    id,
})
export const setDataDep = (data) => ({
    type: SET_DATAPAYMENT,
    data: data,
})
export const setSteamInventory = (data) => ({
    type: SET_STEAM_WEAPON,
    data: data,
})

export default AddFundsReducer
