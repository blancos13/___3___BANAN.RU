import { applyMiddleware, combineReducers, createStore } from "redux"
import thunk from "redux-thunk"
import inventoryReducer from "./reducers/inventoryReducer"
import UserAuthDataReducer from "./reducers/UserAuthDataReducer"
import UserDataReducer from "./reducers/UserDataReducer"
import ModalWindowReducer from "./reducers/ModalWindowReducer"
import SupportReducer from "./reducers/SupportReducer"
import withdrawHistoryReduce from "./reducers/withdrawHistoryReduce"
import ShopItemsReducer from "./reducers/ShopItemsReducer"
import NotificationsReducer from "./reducers/NotificationsReducer"
import ChatReducer from "./reducers/ChatReducer"
import ChooseSideReducer from "./reducers/ChooseSideReducer"
import crashInfo_Reducer from "./reducers/crashInfo_Reducer"
import crashBlockBet_Reducer from "./reducers/crashBlockBet_Reducer"
import crashAllBets_Reducer from "./reducers/crashAllBets_Reducer"
import crashGraph_Reducer from "./reducers/crashGraph_Reducer"
import GamesHistoryReducer from "./reducers/GamesHistoryReducer"
import { compose } from "redux"
import AddFundsReducer from "./reducers/AddFundsReducer"
import AdminModerReducer from "./reducers/AdminModerReducer"
import FaqReducer from "./reducers/FaqReducer"

const reducerS = combineReducers({
    FAQ: FaqReducer,
    AdminModerPanel: AdminModerReducer,
    AddFunds: AddFundsReducer,
    crashGraph: crashGraph_Reducer,
    crashInfo: crashInfo_Reducer,
    crashBlockBet: crashBlockBet_Reducer,
    crashAllBets: crashAllBets_Reducer,
    inventory: inventoryReducer,
    AuthData: UserAuthDataReducer,
    UserData: UserDataReducer,
    ModalWindow: ModalWindowReducer,
    Support: SupportReducer,
    Withdraw: withdrawHistoryReduce,
    Shop: ShopItemsReducer,
    Notifications: NotificationsReducer,
    Chat: ChatReducer,
    ChooseSide: ChooseSideReducer,
    GamesHistory: GamesHistoryReducer,
})

const composeExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const reduxStore = createStore(reducerS, composeExtension(applyMiddleware(thunk)))

window.reduxStore = reduxStore

export default reduxStore
