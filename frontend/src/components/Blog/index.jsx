import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getBlogById, likeBlog, getBlogContentsById, isSubscribed, subscribe } from '../../api/blogHandler'
import { loggedIn } from '../../api/auth'
import { Article } from 'uikit-react'
import { getUser } from '../../api/auth'
import * as ROUTES from '../../routes/index'
import { Alerts } from '../Utils/alert'
import Liked from '../../liked.png'
import notLiked from '../../not-liked.png'
import Loading from '../Utils/loading'


export default class Blog extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            blog: {},
            loading: false,
            loadingBlogContent: false,
            msg: null,
            id: null,
            likes: 0,
            user: null,
            isLoggedIn: true,
            likedIcon: notLiked,
            isLiked: false,
            blogContent: '',
            isSubscribed: false,
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
                this.setState({ loadingBlogContent: true })
                let ret = await getBlogContentsById(res.data.blog.data)
                this.setState({ blogContent: ret.data, loadingBlogContent: false })
                ret = await isSubscribed(this.state.blog.authorID)
                this.setState({ isSubscribed: ret.isSubscribed })
            } else {
                this.setState({ loading: false, msg: `Error occured...try again!` })
            }
        } catch (err) {
            this.setState({ loading: false, msg: `Error occured...try again!` })
        }
    }

    toggleSubscribe = async () => {
        try {
            const ret = await subscribe(this.state.blog.authorID)
            this.setState({ isSubscribed: !this.state.isSubscribed })
        } catch (e) {
            console.log(e)
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
                                    {this.state.loadingBlogContent ?
                                        <Loading /> :
                                        <div dangerouslySetInnerHTML={{ __html: this.state.blogContent }} />
                                    }
                                </Article>
                                <div className="uk-row">
                                    <span className="uk-badge reaction-btn-list"> {likes} likes</span>
                                    <img className="reaction reaction-icon" onClick={this.onLike} src={this.state.likedIcon} />
                                    {/* <div className="reaction uk-link uk-button uk-button-secondary uk-margin uk-margin-top reaction-btn-list">Share</div> */}
                                    <div className="uk-inline">
                                        <button className="reaction uk-link uk-button uk-button-secondary uk-margin uk-margin-top reaction-btn-list" type="button">Share</button>
                                        <div uk-drop="animation: uk-animation-slide-top-small; duration: 500">
                                            <div class="uk-card uk-flex uk-card-body uk-card-default" style={{ padding: "7px 7px", border: '1px solid black' }}>
                                                <div style={{ width: '80%', overflowX: 'scroll', marginRight: '2px' }}>{window.location.href}</div>
                                                <button onClick={() => { navigator.clipboard.writeText(`${window.location.href}`) }}>
                                                    <div uk-icon="icon: copy"></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="reaction uk-button uk-button-danger uk-margin reaction-btn-list"
                                        onClick={this.toggleSubscribe}>
                                        {this.state.isSubscribed ? "Unsubscribe" : "Subscribe"}
                                    </div>
                                </div>
                            </div>
                    }
                </> :
                <Alerts message="You are not logged in" redirectTo={ROUTES.landing} />
        )
    }
}

