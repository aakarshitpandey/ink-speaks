import React, { Component, useState } from 'react'
import { ForgotPassword } from '../SignUp/forgotPassword'
import { Link, Route } from 'react-router-dom'
import SignIn from '../SignIn'
import { getUser } from '../../api/auth'
import * as ROUTES from '../../routes/index'
import LogoutButton from '../SignIn/logoutbtn'
import { withRouter } from 'react-router-dom'

class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false
        }
    }

    componentDidMount() {
        const user = getUser()
        if (user && user != null) {
            this.setState({ isLoggedIn: true })
        } else {
            this.setState({ isLoggedIn: false })
        }
    }

    changeAuthState = (state) => {
        this.setState({ isLoggedIn: state })
    }

    render() {
        return this.state.isLoggedIn === false ?
            <NavNoAuth toggleAuth={this.changeAuthState} history={this.props.history} /> :
            <NavAuth toggleAuth={this.changeAuthState} history={this.props.history} />
    }
}

const NavNoAuth = (props) => {
    const [collapsed, setCollapsed] = useState(true)
    return (<>
        <nav className={`navbar navbar-expand-lg navbar-light bg-default fixed-top ${collapsed ? "" : "nav-bg-dark"}`} uk-navbar>
            <Link to={ROUTES.landing} className="navbar-brand"><span className="frijole">Ink </span><span className="loved-by-king">Speaks</span></Link>
            <button className="navbar-toggler" onClick={() => { setCollapsed(!collapsed) }} data-target="#my-nav" data-toggle="collapse" aria-controls="my-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="my-nav" className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item item active uk-navbar-item">
                        {/* <Link className="nav-a" to="#">Trending<span className="sr-only">(current)</span></Link> */}
                    </li>
                    <li className="nav-item item active uk-navbar-item">
                        {/* <Link className="nav-a" to="#">Categories<span className="sr-only">(current)</span></Link> */}
                    </li>
                </ul>
                <div className="nav-item uk-navbar-item">
                    <SignIn toggleAuth={props.toggleAuth} />
                </div>
                <li className="nav-item active uk-navbar-item">
                    <ForgotPassword />
                </li>
            </div>
        </nav>
        {/* <br />
        <br />
        <br /> */}
    </>)
}

const NavAuth = (props) => {
    const [collapsed, setCollapsed] = useState(true)
    return (<>
        <nav className={`navbar navbar-expand-lg navbar-light bg-default fixed-top ${collapsed ? "" : "nav-bg-dark"}`} uk-navbar>
            <Link to={ROUTES.landing} className="navbar-brand"><span className="frijole">Ink </span><span className="loved-by-king">Speaks</span></Link>
            <button className="navbar-toggler" onClick={() => { setCollapsed(!collapsed) }} data-target="#my-nav" data-toggle="collapse" aria-controls="my-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="my-nav" className="collapse navbar-collapse">
                <LeftNav />
                <CenterNav />
                <RightNav toggleAuth={props.toggleAuth} history={props.history} />
            </div>
        </nav>
        {/* <br />
        <br />
        <br /> */}
    </>)
}

const LeftNav = () => (
    <ul className="navbar-nav mr-auto">
        <li className="nav-item item active uk-navbar-item">
            <Link className="nav-a" to={ROUTES.dashboard}>Dashboard<span className="sr-only">(current)</span></Link>
        </li>
        <li className="nav-item item active uk-navbar-item">
            <Link className="nav-a" to={ROUTES.myaccount}>My Blogs<span className="sr-only">(current)</span></Link>
        </li>
    </ul>
)

const CenterNav = () => (
    <div className="uk-navbar-center">
        <div className="uk-margin uk-navbar-item">
            <form className="uk-search uk-search-default">
                <span className="uk-search-icon-flip" uk-search-icon></span>
                <input className="uk-search-input" type="search" placeholder="Search..." />
            </form>
        </div>
    </div>
)

const RightNav = (props) => (
    <div className="uk-navbar-right">
        <div className="uk-navbar-item">
            <Link to={ROUTES.addArticle} className="">Add Blog</Link>
        </div>
        <div className="uk-navbar-item">
            <Link to={ROUTES.myaccount} className="">My Account</Link>
        </div>
        <LogoutButton toggleAuth={props.toggleAuth} history={props.history} />
    </div>
)

export default withRouter(NavBar)