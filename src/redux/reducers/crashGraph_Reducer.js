export const CRASHED = "CRASHED";
export const UPDATE_TIME = "UPDATE_TIME";
export const UPDATE_KOFX = "UPDATE_KOFX";
export const UPDATE_ALL = "UPDATE_ALL";

const defaultState = {
    kofX: "1.00",
    time: "10",
    crashedGame: false
};

const crashGraph_Reducer = (state = defaultState, action) => {
    switch (action.type) {
        case CRASHED:
            return {
                ...state,
                crashedGame: true,
                kofX: action.kofX
            }
        case UPDATE_ALL:
            return {
                ...state,
                kofX: "1.00",
                crashedGame: false,
            }
        case UPDATE_TIME:
            return {
                ...state,
                time: action.time,
            }
        case UPDATE_KOFX:
            return {
                ...state,
                kofX: action.kofX,
            }
        default:
            return state;
    }
};

export const chashedGame = (kofX) => ({
    type: CRASHED,
    kofX: kofX
});
export const updateKofX = (kofX) => ({
    type: UPDATE_KOFX,
    kofX: kofX
});
export const updateTimer = (time) => ({
    type: UPDATE_TIME,
    time: time
});
export const newGame = () => ({
    type: UPDATE_ALL
});

export default crashGraph_Reducer;
