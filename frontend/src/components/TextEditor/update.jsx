import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import { Button, Input, InputContainer } from 'uikit-react'
import { addBlog, getBlogContentsById } from '../../api/blogHandler'
import { Alerts } from '../Utils/alert'
import InputTag from './inputTags'
import { Container } from 'uikit-react'
import Loading from '../Utils/loading'

export default class UpdatePost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            post: this.props.location.state.post
        }
    }

    render() {
        return (
            <Container size="expand" background="muted" className="uk-margin-medium uk-padding-large editor-container" >
                <h2 className="uk-align-left">Update</h2>
                <br />
                <hr />
                <UpdateTextEditor post={this.state.post} />
            </Container>
        )
    }
}

class UpdateTextEditor extends Component {
    constructor(props) {
        super(props)
        this.state = { text: '', msg: '', loading: false, loadingData: false, title: null, categories: [] }
        this.handleChange = this.handleChange.bind(this)
    }

    async componentDidMount() {
        const { post } = this.props
        if (post.blogContent) {
            this.setState({ title: post.title, categories: post.categories, text: post.blogContent })
        } else {
            this.setState({ title: post.title, categories: post.categories, loadingData: true })
            try {
                const ret = await getBlogContentsById(post.data)
                this.setState({ loadingData: false, text: ret.data })
            } catch (e) {
                console.log(e)
                this.setState({ loadingData: false, blogContent: 'Error Occurred, reload...' })
            }
        }
    }

    handleChange(value) {
        this.setState({ text: value })
    }

    updateTags = (tags) => {
        this.setState({ categories: [...tags] })
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const body = {
            title: this.state.title,
            data: this.state.text,
            categories: [...this.state.categories],
        }
        body.isPosted = (`${e.target.getAttribute('name')}`).localeCompare("Draft") === 0 ? false : true
        this.setState({ loading: true })
        try {
            const res = await addBlog(body);
            this.setState({ msg: res.data.msg, loading: false, text: '' })
        } catch (err) {
            console.log(err)
            this.setState({ msg: err.msg, loading: false })
        }
    }

    render() {
        const toolbar = {
            toolbar: [['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            ['link'],
            ['blockquote', 'code-block'],
            [{ 'size': ['small', 'medium', 'large', 'huge'] }],
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['image'],
            ['video'],
            ['clean']]
        }
        return this.state.loading ? <div uk-spinner></div> :
            <>
                <Input className="uk-input uk-margin-bottom" name="title" value={this.state.title} placeholder="Title" onChange={(e) => { this.setState({ title: e.target.value }); console.log(this.state) }}></Input>
                {this.state.loadingData ?
                    <Loading /> :
                    <>
                        <ReactQuill value={this.state.text} preserveWhiteSpace={true} modules={toolbar}
                            onChange={this.handleChange} theme="snow" className="react-quill" />
                        <InputTag updateTags={this.updateTags} taglist={this.props.post.categories} />
                    </>
                }
                <div className="uk-button-group uk-margin">
                    <Button name="Post" type="submit" color="secondary" size="small" className="uk-margin-small-right" onClick={(e) => { console.log(`Post pressed`); this.onSubmit(e) }}>Post</Button>
                    <Button name="Draft" type="submit" color="secondary" size="small" className="uk-margin-small-right" onClick={(e) => this.onSubmit(e)}>Save as Draft</Button>
                    <Button color="secondary" size="small" className="uk-margin-small-right">Cancel</Button>
                </div>
                {this.state.msg && <Alerts message={this.state.msg} color="primary" />}
            </>
    }
}

