export const STATUS_UPDATEID = "STATUS_UPDATEID"
export const ADD_ALLWITHDRAW = "ADD_ALLWITHDRAW"

const defaultState = {
    withdraw: [],
}

const withdrawHistoryReducee = (state = defaultState, action) => {
    switch (action.type) {
        case STATUS_UPDATEID:
            return {
                withdraw: state.withdraw.map((item) => {
                    if (item.idWithdraw == action.data.idWithdraw) {
                        item.statusMessage = action.data.statusMessage
                        item.statusNumber = action.data.statusNumber
                    }
                    return item
                }),
            }
        case ADD_ALLWITHDRAW:
            return {
                withdraw: [
                    ...action.item.map((v, i) => ({
                        ...v,
                        id: i + state.withdraw.length,
                        weaponName: v.weaponName,
                        exterior: v.weaponName.splitBrackets(),
                    })),
                    ...state.withdraw,
                ],
            }

        default:
            return state
    }
}

export const UPDATE_STATUS = (data) => ({
    type: STATUS_UPDATEID,
    data: data,
})

export const ADD_WITHDRAW = (item) => ({
    type: ADD_ALLWITHDRAW,
    item: item,
})

export default withdrawHistoryReducee
