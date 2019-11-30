import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Swiper from 'react-id-swiper'
import { swiperParams } from './constants'
// import { Link } from 'react-router-dom'

export default class CardSwiper extends Component {
    static propTypes = {
        list: PropTypes.array.isRequired
    }

    render() {
        const { list } = this.props
        return (
            <div className="swiper-container">
                <Swiper {...swiperParams}>
                    {
                        list.map((blog) => {
                            return <div>
                                <div className="swiper-slide" id={blog._id}>
                                    <div className="uk-card-body card-body" dangerouslySetInnerHTML={{ __html: blog.data }} />
                                    <div className="uk-card-footer uk-text-right">{blog.authorName}</div>
                                </div>
                            </div>
                        })
                    }
                </Swiper>
            </div >
        )
    }
}
