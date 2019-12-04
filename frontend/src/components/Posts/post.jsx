import React from 'react'
import { getUser } from '../../api/auth'
import { Redirect } from 'react-router-dom'
import * as ROUTES from '../../routes/index'

export default class Post extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numLikes: 0,
            numComments: 0,
            title: 'No title',
            content: 'No content',
            clicked: false
        }
    }

    onClick = (e) => {
        this.setState({ clicked: true })
    }

    render() {
        const { post } = this.props
        return <>
            {this.state.clicked ? <Redirect to={`${ROUTES.article}/${post._id}`} /> :
                <div className="post uk-card uk-card-default uk-card-body uk-width-1-1@m" onClick={this.onClick}>
                    <h3 className="uk-card-title">{post.title || `Default`}</h3>
                    <div className="post-data" dangerouslySetInnerHTML={{ __html: post.data }}></div>
                    <ul class="uk-iconnav">
                        <li><div uk-icon="icon: plus"></div></li>
                        <li><div uk-icon="icon: file-edit"></div></li>
                        <li><div uk-icon="icon: copy"></div></li>
                        <li><div uk-icon="icon: trash"></div></li>
                    </ul>
                </div>}
        </>
    }
}