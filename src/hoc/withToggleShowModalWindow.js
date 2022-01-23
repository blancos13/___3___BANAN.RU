import React from "react"
import { connect } from "react-redux"
import {
    setModalChild,
    toggleShowModalWindow,
} from "../redux/reducers/ModalWindowReducer"

const withToggleShowModalWindow = (Component) => {
    let withToggleShowModalWindowComponent = (props) => {
        return <Component {...props} />
    }

    const mapStateToProps = (state) => ({})

    withToggleShowModalWindowComponent = connect(mapStateToProps, {
        toggleShowModalWindow,
        setModalChild,
    })(withToggleShowModalWindowComponent)

    return withToggleShowModalWindowComponent
}

export default withToggleShowModalWindow
