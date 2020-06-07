import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { loggedIn } from '../../api/auth'
import { getTopTags } from '../../api/blogHandler'
import { SignUpButton } from '../SignUp'
import SignIn from '../SignIn'
import * as ROUTES from '../../routes/index'

export default class SidePanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: loggedIn(),
            tags: []
        }
    }

    componentDidMount = () => {
        getTopTags().then(data => {
            console.log(data.tags)
            this.setState({ tags: data.tags })
        }).catch((e) => {
            console.log('')
        })
    }

    toggleAuth = (state) => {
        this.setState({ loggedIn: !loggedIn })
    }

    render() {
        return (
            <div style={{ marginLeft: '18px', width: '100%' }}>
                <LoginComponent toggleAuth={this.toggleAuth} />
                <TagDisplay tags={this.state.tags} />
                <Policies />
            </div>
        )
    }
}

export const LoginComponent = (props) => {
    return (
        <>
            <div className="uk-card uk-card-default uk-margin-remove uk-padding-remove">
                {
                    loggedIn() ? <>
                        Use our ink to pen your words....
                    <br />
                        <Link to={ROUTES.addArticle}><div className="uk-button-small uk-link-text">Add Blog</div></Link>
                    </> :
                        <div className="uk-card-body">
                            <p className="uk-text-left">Let your ink do the talking...</p>
                            <hr />
                            <SignIn toggleAuth={props.toggleAuth} />
                            <br />
                            <SignUpButton />
                        </div>
                }
            </div>
        </>
    )
}

export const TagDisplay = (props) => (
    <div className="uk-card uk-card-default uk-margin-top uk-padding-remove">
        <div className="">Follow the trend:<br /></div>
        {
            <div className="panel-tag-display">
                <ul className="uk-text-left tags">
                    {
                        props.tags.map(tag => {
                            return (
                                <li key={tag.name}>
                                    {tag.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        }
    </div>
)

export const Policies = () => (
    <div className="policies">
        <hr />
        <span>
            <Link to={ROUTES.privacy} className="uk-text-meta">Privacy</Link>
        </span>
        <span className="uk-text-meta"> | </span>
        <span>
            <Link to={ROUTES.terms} className="uk-text-meta">Terms</Link>
        </span>
        <span className="uk-text-meta"> | </span>
        <span>
            <a href={ROUTES.aboutDeveloper} target="_blank" className="uk-text-meta">About</a>
        </span>
    </div>
)
