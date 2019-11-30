import React, { Component } from 'react'
import { getBlogList } from '../../api/blogHandler'
import CardSwiper from '../Utils/swiper';

export default class Explore extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            blogs: [],
        }
    }

    async componentDidMount() {
        this.setState({ loading: true })
        try {
            const res = await getBlogList({ sendAll: false })
            console.log(res)
            this.setState({ loading: false, blogs: res.data.blogs })
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
        }
    }

    render() {
        return (
            <div className="uk-margin-small-bottom">
                <div className="uk-h1 uk-text-left">Explore</div>
                {this.state.loading ? <div uk-spinner></div> : <CardSwiper list={this.state.blogs} />}
            </div>
        )
    }
}
