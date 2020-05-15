import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import { Button, Input, InputContainer } from 'uikit-react'
import { addBlog } from '../../api/blogHandler'
import { Alerts } from '../Utils/alert'

export default class TextEditor extends Component {
    constructor(props) {
        super(props)
        this.state = { text: '', msg: '', loading: false, title: null }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
        this.setState({ text: value })
        console.log(this.state)
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const body = {
            title: this.state.title,
            data: this.state.text,
            categories: [],
        }
        body.isPosted = (`${e.target.getAttribute('name')}`).localeCompare("Draft") === 0 ? false : true
        console.log(body)
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
                <ReactQuill value={this.state.text} preserveWhiteSpace={true} modules={toolbar}
                    onChange={this.handleChange} theme="snow" className="react-quill" />
                <div className="uk-button-group uk-margin">
                    <Button name="Post" type="submit" color="secondary" size="small" className="uk-margin-small-right" onClick={(e) => { console.log(`Post pressed`); this.onSubmit(e) }}>Post</Button>
                    <Button name="Draft" type="submit" color="secondary" size="small" className="uk-margin-small-right" onClick={(e) => this.onSubmit(e)}>Save as Draft</Button>
                    <Button color="secondary" size="small" className="uk-margin-small-right">Cancel</Button>
                </div>
                {this.state.msg && <Alerts message={this.state.msg} color="primary" />}
            </>
    }
}

