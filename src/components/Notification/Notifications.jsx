import React from "react"
import NotificationItem from "./NotificationItem"

const Notifications = ({ NotificationItems, deleteNotification }) => {
    return (
        <div class="app__notifications notifications">
            <div class="notifications__row">
                {NotificationItems.map((notif) => {
                    return (
                        <NotificationItem
                            key={notif.id}
                            id={notif.id}
                            content={notif.content}
                            notifType={notif.notifType}
                            onClick={() => deleteNotification(notif.id)}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Notifications
