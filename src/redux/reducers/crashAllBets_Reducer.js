export const UPDATE_ALLBETS = "UPDATE_ALLBETS";
export const CLEAR_ALLBETS = "CLEAR_ALLBETS";
export const CRASH_ALLBETS = "CRASH_ALLBETS";

const defaultState = {
    amountOfPlayers: 0,
    amountOfSkinsPlaced: 0,
    betsValue: 0,
    allBets: [],
};

const crashAllBets_Reducer = (state = defaultState, action) => {
    switch (action.type) {
        case CRASH_ALLBETS:
            return {
                ...state,
                allBets: state.allBets.map((v) => ({
                    ...v,
                    crashed: v.skinsVictory.isEmpty(),
                })),
            };
        case UPDATE_ALLBETS:
            return {
                allBets: action.data.map((v) => ({
                    ...v,
                    inGame: v.skinsVictory.isEmpty(),
                })),
                betsValue: action.data.reduce((all, cur) => all + cur.totalBetsSumma, 0),
                amountOfPlayers: action.data.length,
                amountOfSkinsPlaced: action.data.reduce(
                    (all, cur) => all + cur.items.length,
                    0
                ),
            };
        case CLEAR_ALLBETS:
            return {
                allBets: [],
                betsValue: 0,
                amountOfPlayers: 0,
                amountOfSkinsPlaced: 0,
            };
        default:
            return state;
    }
};

export const upadteAllBets = (data) => ({
    type: UPDATE_ALLBETS,
    data: data,
});
export const clearAllBets = () => ({
    type: CLEAR_ALLBETS,
});
export const crashedAllItems = () => ({
    type: CRASH_ALLBETS,
});

export default crashAllBets_Reducer;
