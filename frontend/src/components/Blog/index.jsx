import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getBlogById, likeBlog } from '../../api/blogHandler'
import { Article, Badge, Icon } from 'uikit-react'
import { getUser } from '../../api/auth'
import * as ROUTES from '../../routes/index'
import { Alerts } from '../Utils/alert'
import Liked from '../../liked.png'
import notLiked from '../../not-liked.png'

export default class Blog extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            blog: {},
            loading: false,
            msg: null,
            id: null,
            likes: 0,
            user: null,
            isLoggedIn: true,
            likedIcon: notLiked,
            isLiked: false
        }
    }

    async componentDidMount() {
        this.setState({ loading: true })
        console.log("loading")
        if (loggedIn()) {
            const user = getUser()
            this.setState({ user: user })
        } else {
            this.setState({ isLoggedIn: false })
            return
        }
        try {
            const res = await getBlogById(this.props.match.params.id)
            if (res.data.blog) {
                this.setState({ loading: false, blog: res.data.blog })
                this.setState({ likes: this.state.blog.reactions.likes })
                if (res.data.blog.reactions) {
                    if (res.data.blog.reactions.likedUsers.indexOf(this.state.user.id) >= 0) {
                        this.setState({ likedIcon: Liked, isLiked: true })
                    }
                }
            } else {
                this.setState({ loading: false, msg: `Error occured...try again!` })
            }
        } catch (err) {
            this.setState({ loading: false, msg: `Error occured...try again!` })
        }
    }

    onLike = async () => {
        try {
            let res
            if (this.state.isLiked) {
                res = await likeBlog(this.props.match.params.id, "unlike")
            } else {
                res = await likeBlog(this.props.match.params.id)
            }
            if (res.data.blog) {
                console.log(`updating state`)
                let image = this.state.isLiked ? notLiked : Liked
                this.setState({ likes: res.data.blog.reactions.likes, likedIcon: image, isLiked: !this.state.isLiked })
            }
        } catch (err) {
            console.log(err)
            this.setState({ msg: `Couldn't like....try again` })
        }
    }

    render() {
        const { blog, likes } = this.state
        return (
            this.state.isLoggedIn ?
                <>
                    {
                        this.state.loading ?
                            <div className="loading-spinner"><div uk-spinner="ratio: 3"></div></div> :
                            <div className="uk-margin-large-top uk-background-muted uk-box-shadow-small uk-margin-auto uk-padding-small">
                                <Article title={blog.title} meta={`Written by ${blog.authorName}`}>
                                    <div dangerouslySetInnerHTML={{ __html: blog.data }} />
                                </Article>
                                <div className="uk-row">
                                    <span className="uk-badge reaction-btn-list"> {likes} likes</span>
                                    <img className="reaction reaction-icon" onClick={this.onLike} src={this.state.likedIcon} />
                                    <div className="reaction uk-link uk-button uk-button-secondary uk-margin uk-margin-top reaction-btn-list">Share</div>
                                    <div className="reaction uk-button uk-button-danger uk-margin reaction-btn-list">Subscribe</div>
                                </div>
                            </div>
                    }
                </> : <Alerts message="You are not logged in" redirectTo={ROUTES.landing} />
        )
    }
}

