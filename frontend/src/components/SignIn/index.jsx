import React, { Component } from 'react'
import { ForgotPassword } from '../SignUp/forgotPassword'
import { login, registerFacebook } from '../../api/auth'
import { Redirect, Link } from "react-router-dom";
import * as ROUTES from '../../routes/index'
import { validateEmail } from '../Utils/constants';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            email: '',
            password: '',
            loading: false,
            loggedIn: false,
            show: false,
        }
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit = async (event) => {
        event.preventDefault()
        this.setState({ loading: true })
        const { email, password } = this.state
        if (!validateEmail(email)) {
            this.setState({ loading: false })
            alert(`Please enter a valid email`)
            return
        }
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

    handleClose = () => {
        this.setState({ show: false })
    }

    handleShow = () => {
        this.setState({ show: true })
    }

    fbBtn = () => {
        registerFacebook()
    }

    render() {
        const { email, password, loggedIn } = this.state
        const isInvalid = email === '' || password === ''
        if (loggedIn === true) {
            return <Redirect to={ROUTES.dashboard} />
        } else {
            return (
                <div>
                    <div className="nav-item uk-button uk-button-default" onClick={this.handleShow}>
                        Login
                    </div>

                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Sign In</Modal.Title>
                        </Modal.Header>
                        <form onSubmit={this.onSubmit}>
                            <Modal.Body>
                                <input className="uk-input uk-margin-small"
                                    type="text"
                                    placeholder="Email"
                                    name="email"
                                    onChange={this.onChange}
                                    value={email}
                                />
                                <br />
                                <input className="uk-input uk-margin-small"
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={this.onChange}
                                />
                                <div className="uk-padding-small">
                                    <ForgotPassword />
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <div className="uk-button uk-button-primary" style={{ paddingLeft: '5px', paddingRight: '8px' }} onClick={this.fbBtn}>
                                    <span uk-icon="icon: facebook; ratio: 1"></span> Login
                                </div>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Close
                                </Button>
                                <Button disabled={isInvalid}
                                    className="uk-button uk-button-default uk-margin-small"
                                    type="submit"
                                    variant="primary"
                                    onClick={this.handleClose}>
                                    Login
                                </Button>
                            </Modal.Footer>
                        </form>
                    </Modal>
                </div>
                // <>
                //     <a className="uk-button uk-button-default nav-item" href="#modal-sections" uk-toggle>Open</a>

                //     <div id="modal-sections" uk-modal>
                //         <div className="uk-modal-dialog">
                //             <button className="uk-modal-close-default" type="button" uk-close></button>
                //             <div className="uk-modal-header">
                //                 <h2 className="uk-modal-title">Sign In</h2>
                //             </div>
                //             <form onSubmit={this.onSubmit}>
                //                 <div className="uk-modal-body">
                //                     <input className="uk-input uk-form-width-small"
                //                         type="text"
                //                         placeholder="Email"
                //                         name="email"
                //                         onChange={this.onChange}
                //                         value={email}
                //                     />
                //                     <input className="uk-input uk-form-width-small"
                //                         type="password"
                //                         placeholder="Password"
                //                         name="password"
                //                         value={password}
                //                         onChange={this.onChange}
                //                     />
                //                 </div>
                //                 <div className="uk-modal-footer uk-text-right">
                //                     <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                //                     <button disabled={isInvalid} className="uk-button uk-button-default uk-margin-small" type="submit">Login</button>
                //                 </div>
                //             </form>
                //         </div>
                //     </div>
                // </>
            )
        }
    }
}
