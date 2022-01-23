import React, { useEffect, useState } from "react"
import BlackBtn from "../common/BlackBtn/BlackBtn"
import pauseIcn from "../../assets/image/pauseIcn.svg"
import playIcn from "../../assets/image/playIcn.svg"
import hideChatIcn from "../../assets/image/hideChatIcn.svg"
import pinIcn from "../../assets/image/pin.svg"
import closeIcn from "../../assets/image/close.svg"
import arrowIcn from "../../assets/image/arrowIcn.svg"
import ChatMessage from "./ChatMessage/ChatMessage"
import SendInput from "../common/SendInput/SendInput"
import socket from "../../api/api"
import { chatGoDown } from "../../redux/reducers/ChatReducer"
import { GLOBAL_MEDIA_QUERIES } from "../../utils/mediaQueries"
import { useMedia } from "react-media"
import classNames from "classnames"
import { useTranslation } from "react-i18next"
import "../../utils/i18next"
import "./Chat.scss"

const ChatPinn = ({ pinnMsg, Access_pinnedMessage }) => {
    const [visible, setVisible] = useState(true)

    return (
        <div
            class={`chat-header__pinned-msg chat-header-pinned-msg ${
                !visible ? "hidden" : ""
            }`}
            onClick={() => !visible && setVisible(true)}
        >
            <div className='chat-header-pinned-msg__pinn-block'>
                <img
                    class='chat-header-pinned-msg__pinn-icon'
                    src={pinIcn}
                    alt='pinIcn'
                />
                {visible && (
                    <img
                        onClick={() => setVisible(false)}
                        class='chat-header-pinned-msg__arrow-icon'
                        src={arrowIcn}
                        alt='pinIcn'
                    />
                )}
            </div>

            <ChatMessage
                className='chat-header-pinned-msg__message'
                {...pinnMsg}
                isMyMsg={!visible}
            />

            {Access_pinnedMessage && (
                <img
                    class='chat-header-pinned-msg__unpinn'
                    onClick={() => socket.emit("UNPINNED_MESS")}
                    src={closeIcn}
                    alt='close'
                />
            )}
        </div>
    )
}

const ChatSendMsg = ({ placeholder }) => {
    const [text, setText] = useState("")
    return (
        <div class='chat__send-msg'>
            <SendInput
                submit={() => {
                    socket.emit("SEND_CHATMES", text)
                }}
                onChange={setText}
                innerInput={text}
                placeholder={placeholder}
            />
        </div>
    )
}

const Chat = ({
    isChatVisible,
    inPause = false,
    close,
    messages,
    pepoleOnline,
    toggleSetChatVisible,
    Access_muteUser,
    Access_banUser,
    Access_pauseChat,
    Access_deleteMessage,
    Access_pinnedMessage,
    pinnMsg = {},
    choosedSide,
}) => {
    const chatStyles = classNames({
        chat: true,
        "chat-admin": Access_pauseChat,
        "chat-in-pause": inPause,
        "right-chat": choosedSide === "inventory",
    })

    const { t } = useTranslation()

    useEffect(() => {
        if (isChatVisible) chatGoDown()
    }, [isChatVisible])

    const mediaQueries = useMedia({ queries: GLOBAL_MEDIA_QUERIES })

    const [chatWidth, setChatWidth] = useState(
        mediaQueries.laptop && !Access_pauseChat ? 280 : 376
    )

    const calcChatWidth = (clientX, clientY = -1) => {
        if (clientX % 10 === 0) {
            const windowWidth = document.body.clientWidth

            const Y = clientY

            const X =
                windowWidth / 2 > clientX ? clientX : windowWidth - clientX

            if (X != 0 && Y != 0) setChatWidth(X)
        }
    }

    const onDrag = React.useCallback(
        (e) => calcChatWidth(e.clientX, e.clientY),
        []
    )

    const onDragMobile = React.useCallback(
        (e) => calcChatWidth(e.touches[0].clientX),
        []
    )

    return (
        <div
            style={!mediaQueries.mobileL ? { width: `${chatWidth}px` } : {}}
            class={chatStyles}
        >
            <div
                draggable
                onTouchMove={onDragMobile}
                onDrag={onDrag}
                className='chat__draggable-border'
            />

            <header class='chat__header chat-header'>
                {!pinnMsg.isEmpty() && (
                    <ChatPinn
                        pinnMsg={pinnMsg}
                        Access_pinnedMessage={Access_pinnedMessage}
                    />
                )}

                <div class='chat-header__pause'>
                    <BlackBtn
                        onClick={toggleSetChatVisible}
                        classAdd={["chat-header__pause-image"]}
                    >
                        <img src={hideChatIcn} alt='hideChat' />
                    </BlackBtn>

                    {Access_pauseChat && (
                        <BlackBtn
                            classAdd={["chat-header__pause-image"]}
                            onClick={() => {
                                socket.emit("CHANGE_PAUSE_CHAT")
                            }}
                        >
                            <img
                                src={inPause ? playIcn : pauseIcn}
                                alt='pauseIcn'
                            />
                        </BlackBtn>
                    )}

                    <h2 class='chat-header__title'>{t("chat.title")}</h2>

                    <BlackBtn
                        notButton={true}
                        classAdd={["chat-header__right-side"]}
                    >
                        <div class='chat-header__indicator' />
                        <div class='chat-header__online'>
                            {pepoleOnline} {t("chat.online")}
                        </div>
                    </BlackBtn>
                </div>

                <div class='chat-header__sub-fade' />
            </header>

            <div class='chat__msgs-body chat-msgs-body' id='chat-msgs-body'>
                <div class='chat-msgs-body__grid'>
                    {messages.map((msg) => (
                        <ChatMessage
                            id={msg.id}
                            Access_muteUser={Access_muteUser}
                            Access_banUser={Access_banUser}
                            Access_deleteMessage={Access_deleteMessage}
                            Access_pinnedMessage={Access_pinnedMessage}
                            key={msg.id}
                            steamId={msg.steamid}
                            isMyMsg={msg.isMyMsg}
                            avatar={msg.avatar}
                            name={msg.name}
                            time={msg.time}
                            messageText={msg.messageText}
                            statusUserChat={msg.statusUserChat}
                        />
                    ))}
                </div>
            </div>

            {inPause && (
                <div className={`chat__pause-block`}>
                    <img src={pauseIcn} alt='pauseIcn' />
                    <span>{"chat.Chat is paused"}</span>
                </div>
            )}

            <footer class='chat__footer'>
                <ChatSendMsg placeholder={t("chat.placeholder")} />
            </footer>
        </div>
    )
}

export default React.memo(Chat)
