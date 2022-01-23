export const SET_OPTION_X = "SET_OPTION_X"
export const SET_KOFX = "SET_KOFX"
export const SET_SKINSANIMATION = "SET_SKINSANIMATION"
export const CLEAR_ANIMATION = "CLEAR_ANIMATION"
export const CHANGE_MYBET = "CHANGE_MYBET"

const defaultState = {
    optionsXs: JSON.parse(localStorage.getItem("crashYourBetOptions")) || [1, 2, 3, 4],
    kofX: "",
    animationSkins: {},
    ValueMyBet: 0,
    userWinValue: false,
}

const crashBlockBet_Reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_OPTION_X:
            let tempOptinsXs = state.optionsXs
            tempOptinsXs[action.index] = action.value

            return {
                ...state,
                optionsXs: tempOptinsXs,
            }
        case CHANGE_MYBET:
            return {
                ...state,
                ValueMyBet: action.summaBet,
                userWinValue: action.userWinValue,
            }
        case CLEAR_ANIMATION:
            return {
                ...state,
                animationSkins: {},
                ValueMyBet: 0,
                userWinValue: false,
            }
        case SET_SKINSANIMATION:
            return {
                ...state,
                animationSkins: action.skin,
            }
        case SET_KOFX:
            return {
                ...state,
                kofX: action.kofX,
            }
        default:
            return state
    }
}

export const setOptionX = (value, index) => ({ type: SET_OPTION_X, value, index })

export const setMyBets = (summaBet, userWinValue) => ({
    type: CHANGE_MYBET,
    summaBet,
    userWinValue,
})

export const setKofX = (kofX) => ({
    type: SET_KOFX,
    kofX,
})

export const clearAnimation = () => ({
    type: CLEAR_ANIMATION,
})

export const setAnimation = (skin) => ({
    type: SET_SKINSANIMATION,
    skin,
})

export default crashBlockBet_Reducer
