export const ADD_NOTIFICATION = "ADD_NOTIFICATION"
export const DELETE_NOTIFICATION = "DELETE_NOTIFICATION"

const defaultState = {
    notifications: [],
}

const ID = () => "_" + Math.random().toString(36).substr(2, 9)

const NotificationsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return {
                notifications: [
                    ...state.notifications,
                    {
                        content: action.content,
                        notifType: action.notifType,
                        id: action.id,
                    },
                ],
            }
        case DELETE_NOTIFICATION:
            return {
                notifications: state.notifications.filter(
                    (notif) => notif.id != action.id
                ),
            }

        default:
            return state
    }
}

export const addNotification = (content, notifType, id) => ({
    type: ADD_NOTIFICATION,
    content,
    notifType,
    id,
})
export const deleteNotification = (id) => ({
    type: DELETE_NOTIFICATION,
    id,
})

export const newNotificationTC = (content, notifType) => (dispatch) => {
    const newId = ID()

    if (content !== undefined) {
        dispatch(addNotification(content, notifType, newId))
        setTimeout(() => dispatch(deleteNotification(newId)), 10000)
    }
}

export default NotificationsReducer
