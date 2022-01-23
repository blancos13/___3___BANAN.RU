export const SET_MES_ALL_DATA = "SET_MES_ALL_DATA";
export const SET_MES_NEW_DATA = "SET_MES_NEW_DATA";

const defaultState = [];

const SupportReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_MES_NEW_DATA:
            return [...state, action.data];
        case SET_MES_ALL_DATA:
            return action.data;
        // case SET_ASSISTENT:
        //     return {
        //         ...state,
        //         assistant: action.data,
        //     };
        default:
            return state;
    }
};

export const setMessageAll = (data) => ({
    type: SET_MES_ALL_DATA,
    data: data,
});
export const setNewMessage = (data) => ({
    type: SET_MES_NEW_DATA,
    data: data,
});
// export const setAssistent = (data) => ({
//     type: SET_ASSISTENT,
//     data: data,
// });

//ThuckCreator
// export const getUserAuthData = () => (dispatch) => {
//     mySocket.on("GET_USER", ({ code, balance, nickSteam, photo }) => {
//         if (code != "no_auth") {
//             dispatch(setUserAuthData({ balance, nickSteam, photo }));
//         }
//     });
// };

export default SupportReducer;
