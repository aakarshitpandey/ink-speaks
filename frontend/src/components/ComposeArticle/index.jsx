import React, { Component } from 'react'
import TextEditor from '../TextEditor';
import { Container } from 'uikit-react'

export default class Compose extends Component {
    render() {
        return (
            <Container size="expand" background="muted" className="uk-margin-medium uk-padding-large editor-container" >
                <h2 className="uk-align-left">Compose</h2>
                <br />
                <hr />
                <TextEditor />
            </Container>
        )
    }
}
