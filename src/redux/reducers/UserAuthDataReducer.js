export const SET_DATA = "SET_DATA"
export const UPDATE_BALANCE = "UPDATE_BALANCE"

const defaultState = {
    balance: 0,
    photo: "",
    nickName: "",
    bonusDeposit: 0,
    openOrClose: "close",
    isAuth: false,
    steamid: null,
}

const UserAuthDataReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_DATA:
            return {
                nickName: action.data?.nickName,
                balance: action.data?.balance ? action.data?.balance : state.balance,
                photo: action.data?.photo ? action.data?.photo : state.photo,
                bonusDeposit: action.data?.bonusDeposit
                    ? action.data?.bonusDeposit
                    : state.bonusDeposit,
                steamid: action.data?.steamid ? action.data?.steamid : state.steamid,
                openOrClose: action.data?.openOrClose
                    ? action.data?.openOrClose
                    : state.openOrClose,
                isAuth: action.data?.code == "succes",
            }
        case UPDATE_BALANCE:
            return {
                ...state,
                balance: action.balance,
            }
        default:
            return state
    }
}

export const setUserAuthData = (data) => ({
    type: SET_DATA,
    data: data,
})
export const updateBalance = (balance) => ({
    type: UPDATE_BALANCE,
    balance: balance,
})

export default UserAuthDataReducer
