import { ArrowBackIcon, InfoIcon } from '@chakra-ui/icons'
import { Box, Heading, IconButton, Input, useToast, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatContext'
import { getOtherUser } from '../utils/getOtherUser'
import SingleMessage from './SingleMessage'
import { io } from 'socket.io-client'
import ProfileModal from './ProfileModal'
import GroupInfoModal from './GroupInfoModal'
let socket = io('http://localhost:4000');

const ChatBox = () => {

    const { loggedInUser, selectedChat, setSelectedChat } = ChatState()
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [newArrivalMessage, setNewArrivalMessage] = useState(null)

    const toast = useToast()

    useEffect(() => {
        socket.on('receive-message', message => {
            setNewArrivalMessage(message)
        })
    })

    useEffect(() => {

        if (newArrivalMessage) {

            selectedChat?._id === newArrivalMessage.chat?._id && setMessages(pre => [...pre, newArrivalMessage])
            if (selectedChat?._id !== newArrivalMessage.chat?._id) {
                console.log('inside if')
                newArrivalMessage.chat.isGroupChat
                    ? toast({
                        title: `New Message in ${newArrivalMessage.chat.chatName}`,
                        description: `${newArrivalMessage.sender.name}: ${newArrivalMessage.content}`,
                        status: 'success',
                        duration: 2000,
                        isClosable: false,
                        position: 'bottom-left'
                    })
                    : toast({
                        title: `${newArrivalMessage.sender.name} sent a message.`,
                        description: newArrivalMessage.content,
                        status: 'success',
                        duration: 2000,
                        isClosable: false,
                        position: 'bottom-left'
                    })
            }

        }
        // eslint-disable-next-line
    }, [newArrivalMessage])

    useEffect(() => {
        socket.emit('add-user', loggedInUser._id)
    }, [loggedInUser])

    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                try {
                    const config = {
                        headers: {
                            'content-type': 'application/json',
                            Authorization: `Bearer ${loggedInUser.token}`,
                        },
                    };
                    const res = await axios.get(`/chat/messages/${selectedChat._id}`, config)
                    setMessages(res.data)
                } catch (error) {
                    console.log(error)
                    toast({
                        title: 'Error Occured',
                        description: error.response.data,
                        status: 'error',
                        duration: 2000,
                        isClosable: false,
                        position: 'bottom-left'
                    })
                }
            }
            fetchMessages()
        }
    }, [selectedChat, loggedInUser, toast])

    const sendMessage = async (e) => {
        e.preventDefault()
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const res = await axios.post('/chat/messages/', { content: newMessage, chat: selectedChat._id }, config)
            socket.emit('send-message', res.data)
            setMessages([...messages, res.data])
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data,
                status: 'error',
                duration: 2000,
                isClosable: false,
                position: 'bottom-left'
            })
        }
        setNewMessage('')
    }


    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            width={{ base: selectedChat ? '100%' : '70%', md: '70%' }}
            height='100%' borderRadius='lg'
            backgroundColor='white' p={2}
            flexDir='column'
        >
            {
                selectedChat
                    ?
                    <Box height='100%'
                        display='flex' flexDir='column'
                    >
                        <Box
                            p={2}
                            display='flex' justifyContent='space-between'
                        >
                            <IconButton icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat(null)}
                            />
                            <Heading size='lg'>{selectedChat.isGroupChat ? selectedChat.chatName : getOtherUser(loggedInUser, selectedChat.users).name}</Heading>
                            {
                                selectedChat.isGroupChat
                                    ? <GroupInfoModal groupChat={selectedChat}>
                                        <IconButton icon={<InfoIcon />} />
                                    </GroupInfoModal>
                                    : <ProfileModal user={getOtherUser(loggedInUser, selectedChat.users)}>
                                        <IconButton icon={<InfoIcon />} />
                                    </ProfileModal>
                            }

                        </Box>
                        <Box
                            h="100%" p={3} mb={2}
                            display='flex' flexDir='column-reverse'
                            borderRadius="lg" overflowY="scroll"
                            backgroundColor='#E2E2E2'
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {
                                    messages &&
                                    messages.map(message => (
                                        <SingleMessage key={message._id} message={message} loggedInUser={loggedInUser} />
                                    ))
                                }
                            </div>
                        </Box>
                        <form
                            onSubmit={(e) => sendMessage(e)}
                        >
                            <Input
                                bg="#E8E8E8" placeholder='Type message here'
                                type='text' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                        </form>
                    </Box>
                    : <Text fontSize='3xl' margin='auto'>Select Chat</Text>
            }
        </Box>
    )
}

export default ChatBox
