import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { deleteNotification } from "../../redux/reducers/NotificationsReducer"
import Notifications from "./Notifications"

class NotificationsContainer extends Component {
    static propTypes = {
        NotificationItems: PropTypes.arrayOf(
            PropTypes.shape({
                content: PropTypes.string,
                notifType: PropTypes.number,
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            })
        ),
        deleteNotification: PropTypes.func,
    }

    static defaultProps = { NotificationItems: [], deleteNotification: () => {} }

    render() {
        const { NotificationItems, deleteNotification } = this.props

        //debugger;
        return (
            <Notifications
                NotificationItems={NotificationItems}
                deleteNotification={deleteNotification}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return { NotificationItems: state.Notifications.notifications }
}

const mapDispatchToProps = {
    deleteNotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer)
