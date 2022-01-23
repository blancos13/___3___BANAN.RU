export const ADD_HISTORY = "ADD_HISTORY";
export const CHANGE_HASH = "CHANGE_HASH";

const defaultState = {
    XsHistory: [],
    hash: ""
};

const crashInfo_Reducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_HISTORY:
            return {
                ...state,
                XsHistory: action.history
            }
        case CHANGE_HASH:
            return {
                ...state,
                hash: action.hash
            }
        default:
            return state;
    }
};

export const addNewHistory = (history) => ({
    type: ADD_HISTORY,
    history: history
});
export const changeHash = (hash) => ({
    type: CHANGE_HASH,
    hash: hash
});

export default crashInfo_Reducer;
