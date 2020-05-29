import React, { Component } from 'react'
import Posts from '../Posts'
import { loggedIn } from '../../api/auth'
import PenSVG from './feather.jsx'
import WordOfTheDay from '../WordOfTheDay'

class Landing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false
        }
    }

    componentDidMount() {
        if (loggedIn()) {
            this.setState({ isLoggedIn: true })
        }
    }

    render() {
        let trendingClassList = "uk-section uk-section-default col-md-12 col-lg-12 col-sm-12 post-container full-height"
        if (this.state.isLoggedIn) {
            trendingClassList = "uk-section uk-section-default col-md-12 col-lg-12 col-sm-12 post-container bg-faded full-height"
        } //end if
        return (
            <>
                <section className="intro">
                    <div className="uk-position-center">
                        <span className="span-intro">Ink</span>
                        <span className="span-intro"> Speaks</span>
                        <PenSVG />
                    </div>
                    <WordOfTheDay />
                </section>
                <div className="uk-grid uk-padding-remove" uk-height-match uk-grid>
                    {/* <div className="uk-width-1-2@m uk-flex-first"> */}
                    <div id="trending-container" className={trendingClassList}>
                        <h1 className="uk-text-center"> Trending</h1>
                        <div className="uk-container uk-container-small">
                            <Posts general={true} />
                        </div>
                    </div>
                    {/* </div> */}
                    {/* <div className="uk-width-1-2@m"> */}
                    {/* {this.state.isLoggedIn ? <></> :
                        <div id="signUpContainer" className="uk-tile uk-tile-muted uk-tile-default col-md-6 col-lg-6 col-sm-12">
                            <div className="uk-card uk-card-secondary uk-card-body">
                                <SignUp />
                            </div>
                        </div>
                    } */}
                    {/* </div> */}
                </div>
            </>

        )
    }
}

export default Landing
