import { Box } from '@chakra-ui/react'
import React from 'react'
import ChatBox from '../components/ChatBox'
import Header from '../components/Header'
import MyChat from '../components/MyChat'
import { ChatState } from '../context/ChatContext'

const Home = () => {

    const { loggedInUser } = ChatState()

    return (
        <div style={{
            width: '100vw', height: '100vh',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
            <Header />
            <Box width='98%' height='90vh'
                display='flex' gap={3} justifyContent='center' mt={2}>
                {loggedInUser && <MyChat />}
                {loggedInUser && <ChatBox />}
            </Box>
        </div>
    )
}

export default Home