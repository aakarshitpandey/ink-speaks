import React from 'react'

export default class InputTag extends React.Component {
    constructor() {
        super();

        this.state = {
            tags: []
        };
    }

    removeTag = (i) => {
        const newTags = [...this.state.tags];
        newTags.splice(i, 1);
        this.setState({ tags: newTags });
        if (this.props.updateTags) {
            this.props.updateTags(newTags)
        }
    }

    inputKeyDown = (e) => {
        let val = e.target.value;
        if ((e.key === 'Enter' && val) || (e.key === ' ' && val)) {
            val = '#' + val
            if (this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
                return;
            }
            let updatingTags = [...this.state.tags, val]
            this.setState({ tags: [...this.state.tags, val] });
            this.tagInput.value = null;
            if (this.props.updateTags) {
                this.props.updateTags(updatingTags)
            }
        } else if (e.key === 'Backspace' && !val) {
            this.removeTag(this.state.tags.length - 1);
        }
    }

    render() {
        const { tags } = this.state;

        return (
            <div className="input-tag">
                <ul className="input-tag__tags">
                    {tags.map((tag, i) => (
                        <li key={tag}>
                            {tag}
                            <button type="button" onClick={() => { this.removeTag(i); }}>+</button>
                        </li>
                    ))}
                    <li className="input-tag__tags__input">
                        <input type="text" onKeyDown={this.inputKeyDown} placeholder="Add tags to your post..." ref={c => { this.tagInput = c; }} />
                    </li>
                </ul>
            </div>
        );
    }
}