export const SET_ACCESS = "SET_ACCESS"
export const SET_MESSSUPPORT = "SET_MESSSUPPORT"
export const SET_ALLUSERS = "SET_ALLUSERS"
export const SET_ALLWITHDRAWITEMS = "SET_ALLWITHDRAWITEMS"

const defaultState = {
    Access_deleteMessage: false,
    Access_pinnedMessage: false,
    Access_answerSupport: false,
    Access_acceptWithdraw: false,
    Access_pauseChat: false,
    Access_muteUser: false,
    Access_unMuteUser: false,
    Access_banUser: false,
    supportMes: [],
    allUsers: [],
    currentPage: 1,
    pageAll: 1,
    listPage: ["1"],
    sortBalance: -1,
    itemsWithdraw: [],
    onlyOpenWidraw: true,
}
const generateArray = (currentPage, all) => {
    currentPage = Number(currentPage)
    all = Number(all)
    let genArrayMax =
        currentPage + 4 <= all
            ? currentPage + 4
            : currentPage + 3 <= all
            ? currentPage + 3
            : currentPage + 2 <= all
            ? currentPage + 2
            : currentPage + 1 <= all
            ? currentPage + 1
            : currentPage
    let getArrayStart =
        currentPage - 4 > 0
            ? currentPage - 4
            : currentPage - 3 > 0
            ? currentPage - 3
            : currentPage - 2 > 0
            ? currentPage - 2
            : currentPage - 1 > 0
            ? currentPage - 1
            : currentPage

    let arr = ["Начало"]
    for (let i = getArrayStart; i <= genArrayMax; i++) arr.push(String(i))
    arr.push(`Конец`)
    return arr
}
const AdminModerReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_ACCESS:
            return {
                ...state,
                ...action.data,
            }
        case SET_ALLUSERS:
            return {
                ...state,
                allUsers: action.data.users,
                pageAll: action.data.pageAll,
                currentPage: action.data.currentPage,
                listPage: generateArray(action.data.currentPage, action.data.pageAll),
                sortBalance: action.data.sortBalance,
            }
        case SET_ALLWITHDRAWITEMS:
            return {
                ...state,
                itemsWithdraw: action.data.items,
                pageAll: action.data.pageAll,
                currentPage: action.data.currentPage,
                listPage: generateArray(action.data.currentPage, action.data.pageAll),
                onlyOpenWidraw: action.data.onlyOpenWidraw,
            }
        case SET_MESSSUPPORT:
            return {
                ...state,
                supportMes: action.data,
            }
        default:
            return state
    }
}

export const setAccess = (data) => ({
    type: SET_ACCESS,
    data,
})
export const setSupportMes = (data) => ({
    type: SET_MESSSUPPORT,
    data,
})
export const setAllUsers = (data) => ({
    type: SET_ALLUSERS,
    data,
})
export const setAllWithdrawItems = (data) => ({
    type: SET_ALLWITHDRAWITEMS,
    data,
})

export default AdminModerReducer
