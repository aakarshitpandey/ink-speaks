import React from 'react'

const TagList = (props) => (
    <>
        {
            props.tags ?
                <div className="tag-display">
                    <ul className="input-tag__tags uk-flex-center">
                        {
                            props.tags.map((tag) => (
                                tag.localeCompare("") !== 0 ?
                                    <li key={tag}>
                                        {tag}
                                    </li> : <></>
                            ))
                        }
                    </ul>
                </div> : <></>
        }
    </>
)

export default TagList