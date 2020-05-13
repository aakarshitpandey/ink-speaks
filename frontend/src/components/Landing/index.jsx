import React, { Component } from 'react'
import SignUp from '../SignUp'
import Posts from '../Posts'
import { getUser } from '../../api/auth'

class Landing extends Component {

    constructor(props) {
        super(props)
        this.state = { isLoggedIn: false }
    }

    componentDidMount() {
        const user = getUser()
        if (user) {
            console.log('user is logged in')
            this.setState({ isLoggedIn: true })
        } //end if
    }

    render() {
        return (
            this.state.isLoggedIn ?
                (<div className="uk-grid uk-padding-remove" uk-height-match uk-grid>
                    <div id="trending-container" className="uk-section uk-section-default col-md-12 col-lg-12 col-sm-12 post-container">
                        <h1 className="uk-text-center"> Trending</h1>
                        <div className="uk-container uk-container-small">
                            <Posts general={true} />
                        </div>
                    </div>
                </div>) :
                (<div className="uk-grid uk-padding-remove" uk-height-match uk-grid>
                    {/* <div className="uk-width-1-2@m uk-flex-first"> */}
                    <div id="trending-container" className="uk-section uk-section-default col-md-6 col-lg-6 col-sm-12 post-container">
                        <h1 className="uk-text-center"> Trending</h1>
                        <div className="uk-container uk-container-small">
                            <Posts general={true} />
                        </div>
                    </div>
                    {/* </div> */}
                    {/* <div className="uk-width-1-2@m"> */}
                    <div id="signUpContainer" className="uk-tile uk-tile-muted uk-tile-default col-md-6 col-lg-6 col-sm-12 ">
                        <div className="uk-card uk-card-secondary uk-card-body">
                            <SignUp />
                        </div>
                    </div>
                    {/* </div> */}
                </div>)
        )
    }
}

export default Landing
