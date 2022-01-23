import React from "react"
import { useSelector } from "react-redux"
import ChatIcn from "../../assets/image/collapseIcn_2.svg"

const ShowChatBtn = ({ toggleSetChatVisible }) => {
    const choosedSide = useSelector((state) => state.ChooseSide.choosedSide)

    const onBtnClick = () => toggleSetChatVisible()

    return (
        <div
            className={`show-chat ${
                choosedSide && choosedSide == "chat" ? "left" : "right"
            }`}
        >
            <button onClick={onBtnClick} className='show-chat__btn'>
                <img src={ChatIcn} alt='showChat' />
            </button>
        </div>
    )
}

export default ShowChatBtn
