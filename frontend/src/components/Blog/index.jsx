import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getBlogById, likeBlog } from '../../api/blogHandler'
import { Article, Badge, Icon } from 'uikit-react'
import { getUser } from '../../api/auth'

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
        }
    }

    async componentDidMount() {
        this.setState({ loading: true })
        try {
            const res = await getBlogById(this.props.match.params.id)
            if (res.data.blog) {
                this.setState({ loading: false, blog: res.data.blog })
                this.setState({ likes: this.state.blog.reactions.likes })
            } else {
                this.setState({ loading: false, msg: `Error occured...try again!` })
            }
        } catch (err) {
            this.setState({ loading: false, msg: `Error occured...try again!` })
        }
    }

    onLike = async () => {
        try {
            const res = await likeBlog(this.props.match.params.id)
            if (res.data.blog) {
                console.log(`updating state`)
                this.setState({ likes: res.data.blog.reactions.likes })
            }
        } catch (err) {
            console.log(err)
            this.setState({ msg: `Couldn't like....try again` })
        }
    }

    render() {
        const { blog, likes } = this.state
        return (
            <>
                {
                    this.state.loading ?
                        <div>Loading...</div> :
                        <div className="uk-margin-large-top uk-background-muted uk-box-shadow-small uk-margin-auto uk-padding-small">
                            <Article title={blog.title} meta={`Written by ${blog.authorName}`}>
                                <div dangerouslySetInnerHTML={{ __html: blog.data }} />
                            </Article>
                            <div className="uk-flex uk-flex-inline">
                                <div className="uk-button-secondary uk-button uk-margin uk-margin-left" style={{ marginTop: '20px' }} onClick={this.onLike}>Like<span className="uk-badge uk-margin-small"> {likes}</span></div>
                                <div className="share uk-link uk-button uk-button-secondary uk-margin uk-margin-left">Share</div>
                                <div className="Subscribe uk-button uk-button-danger uk-margin uk-margin-left">Subscribe</div>
                            </div>
                        </div>
                }
            </>
        )
    }
}

