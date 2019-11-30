// import React, { Component } from 'react'
// import { Editor, EditorState, RichUtils } from 'draft-js';

// export default class TextEditor extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { editorState: EditorState.createEmpty() };
//         this.onChange = (editorState) => this.setState({ editorState });
//     }

//     handleKeyCommand = (command) => {
//         const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
//         if (newState) {
//             this.onChange(newState);
//             return 'handled';
//         }
//         return 'not-handled'
//     }

//     onUnderlineClick = () => {
//         this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
//     }

//     onBoldClick = () => {
//         this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
//     }

//     onItalicClick = () => {
//         this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'))
//     }

//     render() {
//         return (
//             <div className="uk-margin-large">
//                 <button onClick={this.onUnderlineClick}>U</button>
//                 <button onClick={this.onBoldClick}><b>B</b></button>
//                 <button onClick={this.onItalicClick}><em>I</em></button>
//                 <div className="" style={{ border: '1px solid black' }}>
//                     <Editor editorState={this.state.editorState} onChange={this.onChange} handleKeyCommand={this.handleKeyCommand} />
//                 </div>
//             </div>
//         );
//     }
// }
