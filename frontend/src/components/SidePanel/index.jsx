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
            <div>
                <LoginComponent toggleAuth={this.toggleAuth} tags={this.state.tags} />
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
                        <Link to={ROUTES.addArticle}><div className="uk-button-small">Add Blog</div></Link>
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
            <div className="uk-card uk-card-default uk-margin-top uk-padding-remove">
                <div className="">Follow the trend:<br /></div>
                {
                    <ul className="uk-card-body uk-text-left">
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
                }
            </div>
        </>
    )
} 
