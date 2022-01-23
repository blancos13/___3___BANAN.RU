const TOGGLE_SHOW = "TOGGLE_SHOW"
const SET_MODAL_CHILD = "SET_MODAL_CHILD"
const SET_MODAL_ON_BTN_BEFORE = "SET_MODAL_ON_BTN_BEFORE"

const defaultState = {
    isShow: false,
    modalChild: "",
    title: "",
    withBtnBefore: false,
    onBtnBefore: () => {},
    withFade: true,
    otherProps: {},
}

const ModalWindowReducer = (state = defaultState, action) => {
    switch (action.type) {
        case TOGGLE_SHOW:
            return {
                ...state,
                isShow: !state.isShow,
            }
        case SET_MODAL_CHILD:
            if (action.title !== state.title || action.otherProps.ignoreTitle)
                return {
                    ...state,
                    modalChild: action.child,
                    title: action.title,
                    withBtnBefore: action.withBtnBefore,
                    onBtnBefore: action?.onBtnBefore,
                    withFade: action.withFade,
                    otherProps: action.otherProps,
                }
            return { ...state }
        case SET_MODAL_ON_BTN_BEFORE:
            return {
                ...state,
                onBtnBefore: action.onBtnBefore,
            }
        default:
            return state
    }
}

export const toggleShowModalWindow = () => ({
    type: TOGGLE_SHOW,
})

export const setModalOnBtnBefore = (onBtnBefore = () => {}) => ({
    type: SET_MODAL_ON_BTN_BEFORE,
    onBtnBefore,
})

export const setModalChild = (
    child,
    title = "",
    withBtnBefore = false,
    onBtnBefore = () => {},
    withFade = true,
    otherProps = {}
) => ({
    type: SET_MODAL_CHILD,
    child,
    title,
    withBtnBefore,
    onBtnBefore,
    withFade,
    otherProps,
})

export default ModalWindowReducer
