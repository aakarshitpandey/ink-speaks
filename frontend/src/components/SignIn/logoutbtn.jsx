import { logout } from '../../api/auth'
import * as ROUTES from '../../routes/index'
import { Redirect } from 'react-router-dom'
import React, { Component } from 'react'

export default class LogoutButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: true
        }
    }

    logout = () => {
        const response = logout()
        this.setState({ loggedIn: !response })
        this.props.history.push(ROUTES.landing)
        this.props.toggleAuth(!response)
    }

    render() {
        return this.state.loggedIn ?
            <button className="uk-button uk-button-danger" onClick={this.logout}>Logout</button> :
            <Redirect to={ROUTES.landing} />
    }
}
