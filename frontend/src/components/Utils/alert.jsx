import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Alert } from 'uikit-react'

export const Alerts = (props) => {
    const [closed, setClosed] = useState(false)
    const color = props.color || "danger"
    return (
        closed === false ?
            <Alert content={props.message} options="" color={color} isClosable onHide={() => {
                setClosed(true)
            }} /> :
            <Closed redirectTo={props.redirectTo} />
    )
}

const Closed = (props) => {
    if (props.redirectTo) {
        return <Redirect to={props.redirectTo} />
    } else {
        return <></>
    }
}

export const DeleteMessage = (props) => (
    <div className="delete-msg">
        <p>Are you sure you want to delete this blog?</p>
        <button className="yes-delete" onClick={() => { props.yesAction() }}>Yes</button>
        <button className="no-delete" onClick={() => { props.noAction() }}>No</button>
    </div >
)