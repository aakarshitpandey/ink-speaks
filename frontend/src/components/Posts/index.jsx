import React from 'react'
import Post from './post'
import { getBlogList, getBlogListFromCreator } from '../../api/blogHandler'

export default class Posts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            recentPosts: [],
            loading: false
        }
    }

    async componentDidMount() {
        this.setState({ loading: true })
        if (this.props.general) {
            try {
                const res = await getBlogList({ sendAll: false })
                this.setState({ recentPosts: res.data.blogs.slice(0, 5), loading: false })
            } catch (err) {
                this.setState({ loading: false })
            }
        } else {
            try {
                const res = await getBlogListFromCreator({ sendAll: false })
                this.setState({ recentPosts: res.data.blogs, loading: false })
            } catch (err) {
                this.setState({ loading: false })
            }
        }
    }

    render() {
        return this.state.loading ?
            <div className="loading-spinner-component"><div uk-spinner="ratio: 1"></div></div>
            : <div>
                {this.state.recentPosts.map((post) => {
                    return <Post post={post} general={this.props.general} />
                })}
            </div>
    }
}