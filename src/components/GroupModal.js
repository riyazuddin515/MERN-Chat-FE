import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    Input,
    useToast,
    Box,
    Stack,
    Badge,
    Text,
} from '@chakra-ui/react'
import axios from 'axios'
import { ChatState } from '../context/ChatContext'
import UserItem from './UserItem'
import { CloseIcon } from '@chakra-ui/icons'

const GroupModal = ({ children }) => {

    const toast = useToast()
    const { loggedInUser } = ChatState()

    const [groupName, setGroupName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (searchInput) => {
        if (!searchInput) {
            setSearchResult([])
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const res = await axios.get(`/users?search=${searchInput}`, config)
            setSearchResult(res.data)
        } catch (error) {
            console.log(error)
            toast({
                title: "Error Occured!",
                description: error.message,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left",
            });
        }
        setLoading(false)
    }

    const handleOnUserClick = (user) => {
        if (selectedUsers.includes(user)) {
            toast({
                title: "User already selected",
                description: "",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-center",
            });
            return
        }
        setSelectedUsers([user, ...selectedUsers])
    }

    const handleOnClose = (user) => {
        setSelectedUsers(selectedUsers.filter(each => each._id !== user._id))
    }

    const createGroup = () => {
        if (!groupName) {
            toast({
                title: "Group Name can't be empty.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-center",
            });
            return
        }
        if (selectedUsers.length < 1) {
            toast({
                title: "Add alteast one user.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-center",
            });
            return
        }
        console.log('processing')
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={() => {
                setSearchResult([])
                onClose()
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input type='text' placeholder='Group Name'
                                value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                        </FormControl>
                        <FormControl mt={2}>
                            <Input type='text' placeholder='Search Users'
                                onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Stack direction='row' mt={2}>
                            {
                                selectedUsers.map(user => (
                                    <Badge
                                        key={user._id}
                                        backgroundColor='green'
                                        color='white'
                                        borderRadius='md'
                                        display='flex'
                                        alignItems='center'
                                        gap={1}
                                    >
                                        <Text>{user.name}</Text>
                                        <CloseIcon w={2} h={3} cursor='pointer'
                                            onClick={() => handleOnClose(user)}
                                        />
                                    </Badge>
                                ))
                            }
                        </Stack>
                        <Box maxH='250px' overflow='scroll' mt={2}>
                            {
                                loading
                                    ? <p> Loading</p>
                                    : searchResult.map(each => (
                                        <UserItem key={each._id} user={each}
                                            handleOnUserClick={() => handleOnUserClick(each)}
                                        />
                                    ))
                            }
                        </Box>
                    </ModalBody>
                    <ModalFooter mt='-5'>
                        <Button colorScheme='green'
                            onClick={createGroup}
                        >Create Group</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupModal
