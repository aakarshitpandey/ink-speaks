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