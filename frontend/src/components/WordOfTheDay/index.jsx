import React, { Component } from 'react'
import getWordOfTheDay from './words/scraper'

export default class WordOfTheDay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            word: getWordOfTheDay()
        }
    }

    render() {
        return (
            <div>
                <div class="uk-card uk-card-default uk-card-body wrd-otd" uk-sticky="offset: 100, bottom: #offset">
                    Stick to the top
                </div>
            </div>
        )
    }
}
