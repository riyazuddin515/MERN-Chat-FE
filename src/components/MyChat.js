import { AddIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Heading, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect } from 'react'
import { ChatState } from '../context/ChatContext'
import { getOtherUser } from '../utils/getOtherUser'
import GroupModal from './group_chat/GroupModal'

const MyChat = () => {

    const toast = useToast()
    const { loggedInUser, chat, setChat, selectedChat, setSelectedChat } = ChatState()

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'))
                const config = {
                    headers: {
                        'content-type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('/chat', config)
                setChat(data)
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
        }
        fetchChat()
        // eslint-disable-next-line
    }, [toast])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir='column'
            width={{ base: '100%', md: '30%' }}
            height='100%' borderRadius='lg'
            backgroundColor='white' p={3}
        >
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Heading size='md'>My Chats</Heading>
                <GroupModal chat={chat} setChat={setChat} setSelectedChat={setSelectedChat}>
                    <Button leftIcon={<AddIcon />}>New Group</Button>
                </GroupModal>
            </Box>
            <Stack overflowY='scroll' width='100%' mt={5}>
                {
                    chat && loggedInUser &&
                    chat.map(each => {
                        const otherUser = getOtherUser(loggedInUser, each.users)
                        return <Box key={each._id} width='100%' display='flex' alignItems='center' gap={2}
                            backgroundColor={selectedChat === each ? 'green' : '#E8E8E8'}
                            color={selectedChat === each ? 'white' : 'black'}
                            borderRadius='md' p={3} cursor='pointer'
                            onClick={() => setSelectedChat(each)}
                        >
                            <Avatar
                                // src={otherUser.profilePic}
                                name={each.isGroupChat ? each.chatName : otherUser.name} size='sm' />
                            <Box>
                                <b>{each.isGroupChat ? each.chatName : otherUser.name}</b>
                                {each.lastMessage && each.isGroupChat
                                    ? <Text> {`${each.lastMessage.sender._id === loggedInUser._id
                                        ? 'ME'
                                        : each.lastMessage.sender.name
                                        }: ${each.lastMessage.content}`}</Text>
                                    : <Text>{each.lastMessage?.content}</Text>
                                }
                            </Box>
                        </Box>
                    })
                }
            </Stack>
        </Box>
    )
}

export default MyChat
