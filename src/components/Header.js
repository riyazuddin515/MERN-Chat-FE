import React, { useContext, useState } from 'react'
import {
    Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    MenuButton, MenuList, MenuItem, Menu,
    Box, Button, Input, IconButton, Heading, Avatar,
    useDisclosure, useToast, Spinner, Tooltip
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import { ChatContext } from '../context/ChatContext'
import axios from 'axios'
import UserItem from './UserItem'
import ChatLoading from './ChatLoading'
import ProfileModal from './ProfileModal'

const SearchDrawer = () => {

    const { loggedInUser, chat, setChat, setSelectedChat } = useContext(ChatContext)

    const navigate = useNavigate()
    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    const [searchInput, setSearchInput] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/auth', { replace: true })
    }

    const handleClose = () => {
        setSearchInput('')
        setSearchResult([])
    }

    const handleSearch = async () => {
        try {
            if (!searchInput) {
                toast({
                    title: "Error Occured!",
                    description: "Search field can't be empty",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-left",
                });
                setSearchResult([])
                return
            }
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const res = await axios.get(`/users?search=${searchInput}`, config)
            setSearchResult(res.data)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left",
            });
        }
        setLoading(false)
    }

    const handleOnUserClick = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const { data } = await axios.post('/chat', { userId: id }, config)
            setSelectedChat(data)
            if (!chat.find(eachChat => eachChat._id === data._id)) {
                setChat([data, ...chat])
            }
            onClose()
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

    if (!loggedInUser) {
        return (
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='green'
                size='xl'
            />
        )
    }

    return (
        <>
            <Box width='100%' p={2}
                backgroundColor='white'
                display='flex' justifyContent='space-between' alignItems='center'>
                <Heading size={['sm', 'md', 'lg', 'xl']}>MERN Chat</Heading>
                <Box>
                    <Tooltip label='Search Users'>
                        <IconButton
                            icon={<SearchIcon color='green' />}
                            marginRight={3}
                            backgroundColor='transparent'
                            border='1px solid green'
                            onClick={onOpen} ref={btnRef}
                        />
                    </Tooltip>
                    <IconButton icon={<BellIcon />} marginRight={3} />
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar src={loggedInUser.profilePic} name={loggedInUser.name} size='sm' />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={loggedInUser} isLoggedInUserProfile={true}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={() => {
                    onClose()
                    handleClose()
                }}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search for user</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' gap={1} mb={3}>
                            <Input placeholder='Name or Email ID' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                            <IconButton aria-label='Search database' icon={<SearchIcon />} onClick={handleSearch} />
                        </Box>
                        {
                            loading ?
                                <ChatLoading /> :
                                searchResult.map(user => (
                                    <UserItem key={user._id} user={user} handleOnUserClick={handleOnUserClick} />
                                ))
                        }
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SearchDrawer