import React from "react"
import faildIcn from "../../assets/image/faildIcn.svg"
import successIcn from "../../assets/image/successIcn.svg"
import "./Notification.scss"

const NotificationItem = ({ content, notifType, onClick, id }) => {
    return (
        <div
            onClick={onClick}
            class={`notifications__item notification-item ${
                notifType == 1
                    ? "notif-item-succes"
                    : notifType == 2
                    ? "notif-item-failed"
                    : ""
            }`}
        >
            <div class="notification-item__row">
                <div class="notification-item__image">
                    <img
                        src={notifType == 1 ? successIcn : notifType == 2 ? faildIcn : ""}
                        alt="notification-item-image"
                    />
                </div>
                <div class="notification-item__content">{content}</div>
            </div>
        </div>
    )
}

export default NotificationItem
