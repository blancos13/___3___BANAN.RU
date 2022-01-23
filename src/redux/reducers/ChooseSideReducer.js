export const SET_SIDE = "SET_SIDE"

const defaultState = {
    choosedSide: localStorage.getItem("chooseLeftSide") || "chat",
}

const ChooseSideReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_SIDE:
            return {
                choosedSide: action.side,
            }

        default:
            return state
    }
}

const setSide = (side) => ({
    type: SET_SIDE,
    side,
})

export const chooseSideTC = (side) => (dispatch) => {
    dispatch(setSide(side))
    localStorage.setItem("chooseLeftSide", side)
}

export default ChooseSideReducer
