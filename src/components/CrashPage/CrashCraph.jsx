import React from "react"
import { connect } from "react-redux"
import volumeIcon from "../../assets/image/volume.svg"
import muteIcon from "../../assets/image/mute.svg"
import "./CrashGraph.scss"

const CrashCraph = ({ kofX, time, crashedGame, toggleMute, isMuted }) => {
    return (
        <div className='crash__graph crash-graph'>
            kof: {kofX}
            <br />
            time: {time}
            <br />
            crashedGame: {String(crashedGame)}
            <button className='crash-graph__mute-btn' onClick={toggleMute}>
                {isMuted ? (
                    <img src={muteIcon} alt='mute' />
                ) : (
                    <img src={volumeIcon} alt='volume' />
                )}
            </button>
        </div>
    )
}

const mapStateToProps = (state) => state.crashGraph

export default connect(mapStateToProps, {})(CrashCraph)
