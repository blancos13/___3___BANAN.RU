import React from "react"
import "./ChooseSide.scss"
import chatIcn from "../../assets/image/collapseIcn_2.svg"
import crashIcn from "../../assets/image/crashIcn.svg"
import weaponIcn from "../../assets/image/weaponIcn.svg"
import { connect } from "react-redux"
import { chooseSideTC } from "../../redux/reducers/ChooseSideReducer"

const ChooseSide = ({ choosedSide, chooseSideTC }) => {
    return (
        <div class="profile-settings__choose-sides choose-sides">
            <label class="radio">
                <input
                    checked={choosedSide == "chat"}
                    onChange={() => chooseSideTC("chat")}
                    type="radio"
                    name="gender"
                    value="MADAME"
                />
                <div class="choose-sides__option" onClick={(e) => e.stopPropagation()}>
                    <div class="choose-sides__chat">
                        <img src={chatIcn} alt="chat" />
                    </div>
                    <div class="choose-sides__content">
                        <img src={crashIcn} alt="chat" />
                    </div>
                    <div class="choose-sides__inventory">
                        <img src={weaponIcn} alt="inventory" />
                    </div>
                </div>
            </label>
            <label class="radio">
                <input
                    checked={choosedSide == "inventory"}
                    onChange={() => chooseSideTC("inventory")}
                    type="radio"
                    name="gender"
                    value="MONSIEUR"
                />
                <div class="choose-sides__option" onClick={(e) => e.stopPropagation()}>
                    <div class="choose-sides__inventory">
                        <img src={weaponIcn} alt="inventory" />
                    </div>
                    <div class="choose-sides__content">
                        <img src={crashIcn} alt="chat" />
                    </div>
                    <div class="choose-sides__chat">
                        <img src={chatIcn} alt="chat" />
                    </div>
                </div>
            </label>
        </div>
    )
}

const mapStateToProps = (state) => ({
    choosedSide: state.ChooseSide.choosedSide,
})

export default connect(mapStateToProps, { chooseSideTC })(ChooseSide)
