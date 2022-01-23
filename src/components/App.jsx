import React, { Suspense } from "react"
import { Route } from "react-router-dom"
import { Switch, Redirect } from "react-router"
import { connect } from "react-redux"
import HeaderContainer from "./Header/HeaderContainer"
import InventoryContainer from "./Inventory/InventoryContainer"
import ProfileContainer from "./Profile/ProfileContainer"
import SupportContainer from "./Support/SupportContainer"
import ModalWindowContainer from "./ModalWindow/ModalWindowContainer"
import NotificationsContainer from "./Notification/NotificationsContainer"
import ChatContainer from "./Chat/ChatContainer"
import CrashPageContainer from "./CrashPage/CrashPageContainer"
import AdminModerContainer from "./Admin/AdminModerContainer"
import FrequentlyAskedQuestion from "./FrequentlyAskedQuestion"
import Preloader from "./common/Preloader/Preloader"
import classNames from "classnames"
import "../assets/style/app.scss"

const App = ({ choosedSide }) => {
    const refInUrl = new URLSearchParams(window.location.search).get("ref")

    if (refInUrl) document.cookie = `refCode=${refInUrl};Session;path=/`

    const appStyles = classNames({
        app: true,
        "app-reversed": choosedSide == "inventory",
    })

    return (
        <Suspense fallback={<Preloader />}>
            <div class={appStyles}>
                <HeaderContainer />
                <div className="app__chat">
                    <ChatContainer />
                </div>

                <div class="app__content">
                    <Switch>
                        <Route path="/profile/:userId?">
                            <ProfileContainer />
                        </Route>

                        <Route path="/support/:userIdSender?">
                            <SupportContainer />
                        </Route>

                        <Route path="/crash">
                            <CrashPageContainer />
                        </Route>

                        <Route
                            path="/panel"
                            exact
                            component={() => <AdminModerContainer />}
                            forceRefresh={true}
                        />

                        <Route path="/faq">
                            <FrequentlyAskedQuestion />
                        </Route>

                        <Redirect to="/crash" />
                    </Switch>
                </div>

                <div className="app__inventory">
                    <InventoryContainer />
                    <NotificationsContainer />
                </div>

                <ModalWindowContainer />
            </div>
        </Suspense>
    )
}

const mapStateToProps = (state) => ({
    choosedSide: state.ChooseSide.choosedSide,
})

export default connect(mapStateToProps, {})(App)
