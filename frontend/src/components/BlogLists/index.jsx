import React, { Component } from 'react'
import 'swiper/css/swiper.css'
import CardSwiper from '../Utils/swiper';
import { Button } from 'uikit-react';
import Explore from './explore';

export default class BlogList extends Component {

    constructor(props) {
        super(props);
        this.state = { blogs: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], loading: false }
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.setState({ loading: false })
    }

    render() {
        return (
            <>
                <Explore />
                <Button color="primary">See all</Button>
                <div className="uk-margin-small-bottom">
                    <div className="uk-h1 uk-text-left">Your Subscriptions</div>
                    <CardSwiper list={this.state.blogs} />
                </div>
            </>
        )
    }
}
