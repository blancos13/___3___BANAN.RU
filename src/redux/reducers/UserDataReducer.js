export const SET_DATA_FULL = "SET_DATA_FULL";
export const SET_URL = "SET_URL";

const defaultState = {
    balance: "",
    nickSteam: "",
    photo: "",
    gamesPlayed: 0,
    topRatio: 0,
    winRate: 0,
    tradeUrl: "",
    allDeposit: [],
    CrashBets: [],
    isMyProfile: true,
};

const profileReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_DATA_FULL:
            return action.data.code == "succes" ? action.data.profile : state;
        case SET_URL:
            return {
                ...state,
                tradeUrl: action.url,
            };

        default:
            return state;
    }
};

export const setDataUserFull = (data) => ({
    type: SET_DATA_FULL,
    data: data,
});
export const setUrl = (url) => ({
    type: SET_URL,
    url: url,
});

export default profileReducer;

// export const getUserDataThuckCreator = () => (dispatch) => {
//     socket.on("GET_USER", ({ code, balance, inventory, nickSteam, photo }) => {
//         if (code != "no_auth") {
//             dispatch(setUserData({ balance, nickSteam, photo }));
//             dispatch(setItems(inventory));
//         }
//     });
//     // inventoryAPI.requestInvetoryItemsData().then((data) => {
//     //     dispatch(endFetching());
//     //     dispatch(setItems(data.items.map((item) => {})));
//     // });
// };
