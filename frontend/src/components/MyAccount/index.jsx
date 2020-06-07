import React, { Component } from 'react'
import { getUser } from '../../api/auth'
import Meta from '../Blog/meta'
import Posts from '../Posts/index'
import { getUserByID } from '../../api/blogHandler'

export default class MyAccount extends Component {
    render() {
        return (
            <div>
                <UserData />
            </div>
        )
    }
}

class UserData extends Component {
    constructor(props) {
        super(props)
        this.state = { user: { followers: [], following: [] }, loading: true, msg: null }
    }

    async componentDidMount() {
        this.setState({ loading: true })
        try {
            const user = (await getUserByID()).data
            console.log(user)
            this.setState({ user: user, loading: false })
        } catch (e) {
            console.log(e)
            this.setState({ msg: `Error occurred, try again`, loading: false })
        }
    }

    render() {
        const { user } = this.state
        return (
            <div className="bg-faded full-height">
                <Meta />
                < div className="uk-section uk-card-body" >
                    {
                        this.state.loading ? <div>Loading...</div> :
                            <>
                                <p>Name: {user.firstName} {user.lastName}</p>
                                <p>Email: {user.email}</p>
                                <p>Subscribers: {user.followers.length}</p>
                                <p>Following: {user.following.length}</p>
                            </>
                    }
                </div >
                <div className="uk-padding-large">
                    <Posts general={false} />
                </div>
            </div>

        )
    }
}

