export const ADD_MESSAGE = "chat/ADD_MESSAGE"
export const SET_ALLMESS = "chat/SET_ALLMESS"
export const UPDATE_ONLINE = "chat/UPDATE_ONLINE"
export const TOGGLE_SET_PAUSE = "chat/TOGGLE_SET_PAUSE"
export const TOGGLE_SET_CHAT_VISIBLE = "chat/TOGGLE_SET_CHAT_VISIBLE"
export const TOGGLE_BLUR_MESSAGES = "chat/TOGGLE_BLUR_MESSAGES"
export const PINN_MESS = "PINN_MESS"

const defaultState = {
    messages: [],
    pepoleOnline: 0,
    inPause: false,
    isChatVisible: JSON.parse(localStorage.getItem("isChatVisible")),
    blurMessages: JSON.parse(localStorage.getItem("isMsgBlur")),
    messagePinned: {},
}
window.ChatDefaultState = defaultState

const ChatReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return {
                ...state,
                messages: [
                    {
                        isMyMsg: action.isMyMsg,
                        avatar: action.avatar,
                        name: action.name,
                        time: action.time,
                        messageText: action.messageText,
                    },
                    ...state.messages.slice(state.messages.length - 49), //ласт 49 сообщений оставим
                ],
            }
        case TOGGLE_SET_PAUSE:
            return {
                ...state,
                inPause: action.isPaused,
            }
        case PINN_MESS:
            return {
                ...state,
                messagePinned: action.data,
            }
        case TOGGLE_BLUR_MESSAGES:
            return {
                ...state,
                blurMessages: !state.blurMessages,
            }
        case TOGGLE_SET_CHAT_VISIBLE:
            localStorage.setItem("isChatVisible", !state.isChatVisible)
            return {
                ...state,
                isChatVisible: !state.isChatVisible,
            }
        case SET_ALLMESS:
            return {
                ...state,
                messages: action.data,
            }
        case UPDATE_ONLINE:
            return {
                ...state,
                pepoleOnline: action.online,
            }

        default:
            return state
    }
}
export const toggleSetChatVisible = () => ({
    type: TOGGLE_SET_CHAT_VISIBLE,
})
export const toggleBlurMessages = () => ({
    type: TOGGLE_BLUR_MESSAGES,
})
export const toggleSetPause = (isPaused) => ({
    type: TOGGLE_SET_PAUSE,
    isPaused: isPaused,
})
export const addMessage = (mes) => ({
    type: ADD_MESSAGE,
    ...mes,
})
export const setMessage = (data) => ({
    type: SET_ALLMESS,
    data: data,
})
export const setPinnedMess = (data) => ({
    type: PINN_MESS,
    data: data,
})
export const updatePepoleOnline = (online) => ({
    type: UPDATE_ONLINE,
    online: online,
})

export const chatGoDown = () => {
    const chatBody = document.getElementById("chat-msgs-body")
    chatBody.scrollTo = chatBody.scrollTop ? chatBody ? chatBody.scrollHeight : 0 : 0
}

export const newMessageTC = (mes) => (dispatch) => {
    dispatch(addMessage(mes))
    chatGoDown()
}

export default ChatReducer
