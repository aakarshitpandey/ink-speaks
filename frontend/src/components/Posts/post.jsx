import React from 'react'
import { getUser } from '../../api/auth'
import { Redirect, Link } from 'react-router-dom'
import * as ROUTES from '../../routes/index'
import { getBlogContentsById, deleteBlog } from '../../api/blogHandler'
import Loading from '../Utils/loading'
import { DeleteMessage } from '../Utils/alert'

export default class Post extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numLikes: 0,
            numComments: 0,
            title: 'No title',
            content: 'No content',
            clicked: false,
            loading: false,
            blogContent: '',
            showAlert: false
        }
    }

    async componentDidMount() {
        const { post } = this.props
        this.setState({ loading: true })
        try {
            const ret = await getBlogContentsById(post.data)
            this.setState({ loading: false, blogContent: ret.data })
        } catch (e) {
            console.log(e)
            this.setState({ loading: false, blogContent: 'Error Occurred, reload...' })
        }
    }

    toggleAlert = () => {
        this.setState({ showAlert: !this.state.showAlert })
    }

    deletePost = async () => {
        try {
            const ret = await deleteBlog(this.props.post._id)
            console.log('Deleted')
            window.location.reload()
        } catch (e) {
            console.log(e.message, 'Could not delete')
        }
    }

    onClick = (e) => {
        this.setState({ clicked: true })
    }

    render() {
        const { post } = this.props
        return <>
            {this.state.clicked ? <Redirect to={`${ROUTES.article}/${post._id}`} /> :
                <div className="post uk-card uk-card-default uk-card-body uk-width-1-1@m" /*onClick={this.onClick}*/>
                    <h3 className="uk-card-title" onClick={this.onClick}>{post.title || `Default`}</h3>
                    {
                        this.state.loading ?
                            <Loading /> :
                            <div onClick={this.onClick} className="post-data" dangerouslySetInnerHTML={{ __html: this.state.blogContent }}></div>
                    }
                    {this.props.general ? <>
                        <ul class="uk-iconnav">
                            <li>
                                <div>
                                    <span className="uk-text-meta">{this.props.post.authorName}</span>
                                </div>
                            </li>
                            <li><span className="uk-text-meta"> | </span></li>
                            <li>
                                <div>
                                    <span className="uk-text-meta">{parseInt(this.state.blogContent.length / 600)} min read</span>
                                </div>
                            </li>
                        </ul>
                    </> :
                        <ul class="uk-iconnav">
                            <li><Link className="uk-link-reset" to={ROUTES.addArticle}><div uk-icon="icon: plus"></div></Link></li>
                            <li><div uk-icon="icon: file-edit"></div></li>
                            <li><div uk-icon="icon: copy"></div></li>
                            <li><div uk-icon="icon: trash" onClick={this.toggleAlert}></div></li>
                            <li><div className="uk-text-meta">  {this.props.post.authorName}</div></li>
                            <li><div><span className="uk-text-meta">{this.props.post.authorName}</span></div></li>
                            <li><div><span className="uk-text-meta">{parseInt(this.state.blogContent.length / 600)} min read</span></div></li>
                        </ul>
                    }
                    {
                        this.state.showAlert ? <DeleteMessage noAction={this.toggleAlert} yesAction={this.deletePost} /> : <></>
                    }
                </div>
            }
        </>
    }
}