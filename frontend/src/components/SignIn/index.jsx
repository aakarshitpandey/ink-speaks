import React, { Component } from 'react'
import { login } from '../../api/auth'
import { Redirect } from "react-router-dom";
import * as ROUTES from '../../routes/index'

export default class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            email: '',
            password: '',
            loading: false,
            loggedIn: false
        }
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit = async (event) => {
        event.preventDefault()
        this.setState({ loading: true })
        const { email, password } = this.state
        try {
            const data = { email, password }
            const response = await login(data)
            if (response.success) {
                this.setState({ loggedIn: true })
                this.props.toggleAuth(true)
            } else {
                console.log(response.error)
                this.setState({ message: response.error })
            }
        } catch (err) {
            this.setState({ loading: false, message: err })
            alert(`Password is incorrect`)
        }
    }

    render() {
        const { email, password, loggedIn } = this.state
        const isInvalid = email === '' || password === ''
        if (loggedIn === true) {
            return <Redirect to={ROUTES.dashboard} />
        } else {
            return (
                <div className="nav-item">
                    <form onSubmit={this.onSubmit}>
                        <input className="uk-input uk-form-width-small"
                            type="text"
                            placeholder="Email"
                            name="email"
                            onChange={this.onChange}
                            value={email}
                        />
                        <input className="uk-input uk-form-width-small"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={this.onChange}
                        />
                        {/* {this.state.message === null ? (<div>{this.state.message}</div>) : <></>} */}
                        <button disabled={isInvalid} className="uk-button uk-button-default uk-margin-small" type="submit">Login</button>
                    </form>
                </div>
            )
        }
    }
}
