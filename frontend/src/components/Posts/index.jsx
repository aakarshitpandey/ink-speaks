import React from 'react'
import Post from './post'

export default class Posts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            recentPosts: [1, 1, 1, 1]
        }
    }

    componentDidMount() {
        //Fetch the data and update the state
    }

    render() {
        return <div>
            {this.state.recentPosts.map((post) => {
                return <Post />
            })}
        </div>
    }
}