import React, { Component } from 'react'
import getWordOfTheDay from './words/scraper'
import { Accordion, AccordionItem } from 'uikit-react'
import { Link } from 'react-router-dom'

export default class WordOfTheDay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            word: getWordOfTheDay()
        }
    }

    toTitleCase = (string) => {
        if (`${string}`.length > 1) {
            string = `${string}`.charAt(0).toUpperCase() + `${string}`.substring(1)
            return string
        }
        return string.toUpperCase()
    }

    getWord = () => (
        <>
            <h1 className="frijole">{this.toTitleCase(this.state.word.WORD)}</h1>
            <h5>{this.toTitleCase(this.state.word.DEFINITION)}</h5>
            <p>Type: {this.toTitleCase(this.state.word.GROUPING)}</p>
        </>
    )

    render() {
        return (
            <div className="wrd-otd">
                {/* <div class="uk-card uk-card-default uk-card-body wrd-otd" uk-sticky="offset:100, bottom: #offset">
                    Stick to the top
                </div> */}
                <Accordion options="multiple: true; active: 0">
                    <AccordionItem title="Word of The Day" content={this.getWord()} />
                </Accordion>
            </div>
        )
    }
}
