import React, { Component } from 'react'

export default class Meta extends Component {
    render() {
        return (
            <>
                <div className="author-meta" style={{ height: '250px', width: '100%', marginBottom: '150px' }}></div>
                <div className="image-meta-wrapper">
                    <div className="image-meta" style={{ borderRadius: '100%', height: '200px', width: '200px' }}></div>
                </div>
            </>

        )
    }
}
