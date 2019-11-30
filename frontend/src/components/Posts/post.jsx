import React from 'react'

export default class Post extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numLikes: 0,
            numComments: 0,
            title: 'No title',
            content: 'No content'
        }
    }

    componentDidMount() {
        //Fetch the data and update the state
    }

    render() {
        return <div className="post uk-card uk-card-default uk-card-body uk-width-1-1@m">
            <h3 className="uk-card-title">Default</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet velit, doloremque qui nesciunt cumque ad laudantium quisquam vel totam magni doloribus animi perspiciatis ipsum molestiae, repellat, quis ipsam. Fugit, aliquam?</p>
            <ul class="uk-iconnav">
                <li><div uk-icon="icon: plus"></div></li>
                <li><div uk-icon="icon: file-edit"></div></li>
                <li><div uk-icon="icon: copy"></div></li>
                <li><div uk-icon="icon: trash"></div></li>
            </ul>
        </div>
    }
}