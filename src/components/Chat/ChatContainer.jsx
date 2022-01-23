import React from "react"
import { connect } from "react-redux"
import Chat from "./Chat"
import socket from "../../api/api"
import {
    setMessage,
    newMessageTC,
    updatePepoleOnline,
    toggleSetPause,
    toggleSetChatVisible,
    chatGoDown,
    setPinnedMess,
} from "../../redux/reducers/ChatReducer"
import ShowChatBtn from "./ShowChatBtn"
import { compose } from "redux"
import { SwitchTransition, CSSTransition } from "react-transition-group"

class ChatContainer extends React.PureComponent {
    componentDidMount() {
        socket.on("LOAD_CHAT", ({ code, message, isPause, pinned }) => {
            if (!code) {
                this.props.setMessage(
                    message.map((v) => ({
                        ...v,
                        isMyMsg: this.props.steamid == v.steamid,
                    }))
                )
                if (this.props.Chat.isChatVisible) {
                    chatGoDown()
                }
                if (isPause) this.props.toggleSetPause(isPause)
                if (pinned) this.props.setPinnedMess(pinned)
            }
        })
        socket.emit("LOAD_CHAT")
        socket.on("NEW_MESSAGE", (message) => {
            this.props.newMessageTC({
                ...message,
                isMyMsg: this.props.steamid == message.steamid,
            })
        })
        socket.on("CHAT_PAUSEDCHANGES", (isPause) => {
            this.props.toggleSetPause(isPause)
        })
        socket.on("PINNED_MESS", (messagePinned) => {
            this.props.setPinnedMess(messagePinned)
        })
        socket.on("ONLINE_USER", (online) => {
            this.props.updatePepoleOnline(online)
        })
    }

    render() {
        const isVisible = this.props.Chat.isChatVisible
        return (
            <>
                <SwitchTransition mode={"out-in"}>
                    <CSSTransition
                        key={isVisible}
                        addEndListener={(node, done) => {
                            node.addEventListener("transitionend", done, false)
                        }}
                        classNames='fade'
                    >
                        <div className='chat-transition-container'>
                            {isVisible ? (
                                <Chat
                                    choosedSide={this.props.choosedSide}
                                    isChatVisible={
                                        this.props.Chat.isChatVisible
                                    }
                                    messages={this.props.Chat.messages}
                                    pepoleOnline={this.props.Chat.pepoleOnline}
                                    inPause={this.props.Chat.inPause}
                                    toggleSetChatVisible={
                                        this.props.toggleSetChatVisible
                                    }
                                    Access_muteUser={this.props.Access_muteUser}
                                    Access_banUser={this.props.Access_banUser}
                                    Access_pauseChat={
                                        this.props.Access_pauseChat
                                    }
                                    Access_deleteMessage={
                                        this.props.Access_deleteMessage
                                    }
                                    Access_pinnedMessage={
                                        this.props.Access_pinnedMessage
                                    }
                                    pinnMsg={this.props.Chat.messagePinned}
                                />
                            ) : (
                                <ShowChatBtn
                                    toggleSetChatVisible={
                                        this.props.toggleSetChatVisible
                                    }
                                />
                            )}
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    Chat: state.Chat,
    steamid: state.AuthData.steamid,
    choosedSide: state.ChooseSide.choosedSide,

    Access_muteUser: state.AdminModerPanel.Access_muteUser,
    Access_banUser: state.AdminModerPanel.Access_banUser,
    Access_pauseChat: state.AdminModerPanel.Access_pauseChat,
    Access_deleteMessage: state.AdminModerPanel.Access_deleteMessage,
    Access_pinnedMessage: state.AdminModerPanel.Access_pinnedMessage,
})

const mapDispatchToProps = {
    setMessage,
    newMessageTC,
    updatePepoleOnline,
    toggleSetPause,
    toggleSetChatVisible,
    setPinnedMess,
}
export default compose(connect(mapStateToProps, mapDispatchToProps))(
    ChatContainer
)
