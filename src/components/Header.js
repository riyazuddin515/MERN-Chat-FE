import React, { useContext, useState } from 'react'
import {
    Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    MenuButton, MenuList, MenuItem, Menu,
    Box, Button, Input, IconButton, Heading, Avatar,
    useDisclosure, useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import { ChatContext } from '../ChatContext'
import axios from 'axios'
import UserItem from './UserItem'
import ChatLoading from './ChatLoading'

const SearchDrawer = () => {

    const { loggedInUser } = useContext(ChatContext)

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
            if (res.data.success) {
                if (res.data.result.length === 0) {
                    toast({
                        title: "No Users found.",
                        description: "No users found with give input.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                        position: "bottom-left",
                    });
                }
                setSearchResult(res.data.result)
            } else {
                toast({
                    title: "Error Occured!",
                    description: res.data.message,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-left",
                });
            }
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

    const hanldeOnUserClick = async (id) => {
        console.log('click', id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const res = await axios.post('/chat', { userId: id }, config)
            console.log(res);
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

    return (
        <>
            <Box width='100%' p={2}
                backgroundColor='white'
                display='flex' justifyContent='space-between'>
                <Button leftIcon={<SearchIcon />} colorScheme='teal'
                    variant='outline' onClick={onOpen} ref={btnRef}>
                    Search User
                </Button>
                <Heading>MERN Chat</Heading>
                <Box>
                    <IconButton icon={<BellIcon />} marginRight={3} />
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar src={loggedInUser.profilePic} name={loggedInUser.name} size='sm' />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>My Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
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
                                    <UserItem key={user._id} user={user} handleOnUserClick={hanldeOnUserClick} />
                                ))
                        }
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SearchDrawer