import { Text } from '@chakra-ui/react'
import React from 'react'

const SingleMessage = ({ message, loggedInUser, isGroupChat }) => {
    return (
        <div style={{
            margin: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: `${message.sender._id === loggedInUser._id ? 'flex-end' : 'flex-start'}`
        }}
        >
            <span style={{
                padding: '10px',
                backgroundColor: `${message.sender._id === loggedInUser._id ? 'green' : 'white'}`,
                color: `${message.sender._id === loggedInUser._id ? 'white' : 'balck'}`,
                borderRadius: '20px',
                maxWidth: '75%'
            }}>
                {message.content}
            </span>
            {isGroupChat && message.sender._id !== loggedInUser._id &&
                <Text fontSize='sm'>{message.sender.name}</Text>
            }

        </div>
    )
}

export default SingleMessage
