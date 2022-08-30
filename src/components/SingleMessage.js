import React from 'react'

const SingleMessage = ({ message, loggedInUser }) => {
    return (
        <div style={{
            margin: '5px',
            display: 'flex',
            justifyContent: `${message.sender._id === loggedInUser._id ? 'flex-end' : 'flex-start'}`
        }}
        >
            <span style={{
                padding: '10px',
                backgroundColor: `${message.sender._id === loggedInUser._id ? 'green' : 'white'}`,
                color: `${message.sender._id === loggedInUser._id ? 'white' : 'balck'}`,
                borderRadius: '20px',
                maxWidth: '75%'
            }}>{message.content}</span>
        </div>
    )
}

export default SingleMessage
