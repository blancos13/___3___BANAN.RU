import React from "react"
import { connect } from "react-redux"
import ModalWindow from "./ModalWindow"
import { toggleShowModalWindow } from "../../redux/reducers/ModalWindowReducer"

const ModalWindowContainer = ({ ModalWindowState, toggleShowModalWindow }) => {
    return (
        <>
            {ModalWindowState.isShow ? (
                <ModalWindow
                    onClick={toggleShowModalWindow}
                    title={ModalWindowState.title}
                    withBtnBefore={ModalWindowState.withBtnBefore}
                    onBtnBefore={ModalWindowState.onBtnBefore}
                    withFade={ModalWindowState.withFade}
                    otherProps={ModalWindowState.otherProps}
                >
                    {ModalWindowState.modalChild}
                </ModalWindow>
            ) : (
                ""
            )}
        </>
    )
}

const mapStateToProps = (state) => ({
    ModalWindowState: state.ModalWindow,
})

export default connect(mapStateToProps, { toggleShowModalWindow })(ModalWindowContainer)
