import React, { useState } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import DropMenu from "../../common/DropMenu/DropMenu"
import socket from "../../../api/api"
import "./ChatMessage.scss"

const ChatMessage = ({
    blurMessages = false,
    className = "",
    admin,
    steamId,
    statusUserChat,
    isMyMsg,
    avatar,
    name,
    time,
    messageText,
    photo,
    id,
    Access_muteUser,
    Access_banUser,
    Access_deleteMessage,
    Access_pinnedMessage,
    isMsgBlur,
    onClick = () => {},
}) => {
    const toAnonimName = (name) =>
        name
            .split("")
            .map((_, i) => (i <= 15 ? "*" : ""))
            .join("")

    const [contextMenu, setContextMenu] = useState(false)

    const positionColor = (statusUserChat) => {
        //определение цвета в зависимости от должности
        switch (statusUserChat) {
            case "Dev":
                return "person-position-dev"
            case "Admin":
                return "person-position-admin"
            case "Mod":
                return "person-position-mod"
            case "YT":
                return "person-position-yt"
            case "Twitch":
                return "person-position-twitch"
            default:
                return ""
        }
    }
    const onContextMenu = (e) => {
        e.preventDefault()
        setContextMenu(true)
    }

    const isContextMenuOpen =
        (Access_muteUser || Access_banUser || Access_deleteMessage) &&
        contextMenu

    return (
        <div
            // onClick={() => setContextMenu(false)}
            class={`chat__message chat-message ${
                isMyMsg ? "chat-my-message" : ""
            } ${isMsgBlur ? "blur-message" : ""} ${className}`}
        >
            <div class='chat-message__grid'>
                {!isMyMsg && (
                    <>
                        <NavLink to={`/profile/${steamId}`}>
                            <div class='chat-message__avatar'>
                                <img src={avatar} alt='avatar' />
                            </div>
                        </NavLink>
                        <div class='chat-message__name'>
                            {statusUserChat ? (
                                <span
                                    class={`chat-message__person-position ${positionColor(
                                        statusUserChat
                                    )}`}
                                >
                                    {statusUserChat}
                                </span>
                            ) : (
                                ""
                            )}
                            {isMsgBlur ? toAnonimName(name) : name}
                        </div>
                    </>
                )}

                <div class='chat-message__time'>{time}</div>
                <div onContextMenu={onContextMenu} class='chat-message__text'>
                    {messageText}

                    <DropMenu
                        isOpen={isContextMenuOpen}
                        closeDropMenu={() => setContextMenu(false)}
                        oprtionStyle={{
                            padding: "10px 0",
                        }}
                        containerStyle={{
                            border: "3px solid #545559",
                            //boxShadow: "-2px 0px 18px 8px rgba(18, 18, 18, 0.4)",
                            top: "unset",
                            bottom: "-20px",
                            zIndex: 10000,
                            right: `${isMyMsg ? "0" : "unset"}`,
                            left: `${isMyMsg ? "unset" : "0"}`,
                            marginRight: "8px",
                            width: "min-content",
                            height: "min-content",
                            flexDirection: "row",
                        }}
                    >
                        {Access_deleteMessage && (
                            <div
                                onClick={() => {
                                    socket.emit("DELETE_MESSAGE", id)
                                    setContextMenu(false)
                                }}
                            >
                                Delete
                            </div>
                        )}

                        {Access_muteUser && (
                            <div
                                onClick={() => {
                                    socket.emit(
                                        "MUTE_USER",
                                        steamId,
                                        prompt("Введите количествог минут бана")
                                    )
                                    setContextMenu(false)
                                }}
                            >
                                Mute
                            </div>
                        )}
                        {Access_banUser && (
                            <div
                                onClick={() => {
                                    socket.emit(
                                        "BAN_USER",
                                        steamId,
                                        prompt("Причина бана?")
                                    )
                                    setContextMenu(false)
                                }}
                            >
                                Ban
                            </div>
                        )}
                        {Access_pinnedMessage && (
                            <div
                                onClick={() => {
                                    socket.emit("PINNED_MESS", id)
                                    setContextMenu(false)
                                }}
                            >
                                Pinned
                            </div>
                        )}
                    </DropMenu>
                </div>

                {photo && (
                    <div class='chat-message__photo'>
                        {photo.map((v, i) => (
                            <div
                                onClick={() => onClick(v)}
                                class='photochka'
                                key={i}
                                style={{
                                    backgroundImage: `linear-gradient(247.28deg, rgba(34, 35, 40, 0.7) 0%, rgba(34, 35, 40, 0) 45.24%),url(${v})`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    isMsgBlur: state.Chat.blurMessages,
})

export default connect(mapStateToProps, {})(ChatMessage)
