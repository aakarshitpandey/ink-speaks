import React from 'react'
import { register } from '../../api/auth'

const RESET_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConf: '',
}

export default class SignUp extends React.Component {

    constructor(props) {
        super(props)
        this.state = { ...RESET_STATE, loading: false, message: null }
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const { firstName, lastName, email, password } = this.state
        this.setState({ loading: true })
        const data = { firstName, lastName, email, password }
        register(data)
            .then((data) => {
                this.setState({ loading: false, message: 'Registration Successful', ...RESET_STATE })
            })
            .catch((err) => {
                this.setState({ loading: false, message: 'Registration failed' })
            })
    }


    render() {
        const {
            firstName,
            lastName,
            email,
            password,
            passwordConf,
        } = this.state;

        const isInvalid = firstName === '' || lastName === '' || `${password}`.localeCompare(`${passwordConf}`) !== 0 || email === '' || password === ''

        return (
            <div className="uk-margin-remove" >
                <form onSubmit={this.onSubmit}>
                    <fieldset className="uk-fieldset">
                        <legend className="uk-legend">Sign Up</legend>
                        <div className="uk-margin">
                            <input className="uk-input"
                                name="firstName"
                                type="text"
                                id="firstName"
                                placeholder="First Name"
                                value={firstName}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="uk-margin">
                            <input className="uk-input"
                                name="lastName"
                                type="text"
                                id="lastName"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="uk-margin">
                            <input className="uk-input"
                                type="text"
                                id="email"
                                placeholder="Email"
                                name="email"
                                value={email}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="uk-margin">
                            <input className="uk-input"
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={this.onChange}
                                name="password"
                            />
                        </div>
                        <div className="uk-margin">
                            <input
                                className="uk-input"
                                type="password"
                                id="passwordConf"
                                placeholder="Confirm Password"
                                value={passwordConf}
                                onChange={this.onChange}
                                name="passwordConf"
                            />
                        </div>
                    </fieldset>
                    {this.state.message ? (<div>{this.state.message}</div>) : <></>}
                    <div className="uk-margin">
                        {this.state.loading === true ? (<div>Loading...</div>) : <button disabled={isInvalid} className="uk-button uk-button-default" type="submit">Sign Up</button>}
                    </div>
                </form>
            </div >
        )
    }
}
