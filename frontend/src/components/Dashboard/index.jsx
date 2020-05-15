import React, { Component } from 'react'
import { getUser, loggedIn } from '../../api/auth'
import * as ROUTES from '../../routes/index'
import { Alerts } from '../Utils/alert'
import BlogList from '../BlogLists'


export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: true,
            user: {},
        }
    }

    componentDidMount() {
        if (loggedIn()) {
            const user = getUser()
            this.setState({ user: user })
        } else {
            this.setState({ isLoggedIn: false })
        }
    }

    render() {
        return (
            this.state.isLoggedIn ?
                <div className="uk-card-body">
                    <br />
                    <br />
                    <div className="uk-text-right uk-h4 livvic">Hi there {this.state.user.firstName}!</div>
                    <BlogList />
                </div> :
                <Alerts message="You are not logged in" redirectTo={ROUTES.landing} />
        )
    }
}


