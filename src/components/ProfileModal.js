import { Avatar, Box, Button, Divider, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, WrapItem } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../context/ChatContext'

const ProfileModal = ({ user, isLoggedInUserProfile, children }) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { loggedInUser, setLoggedInUser } = ChatState()

    const [name, setName] = useState(loggedInUser.name)

    const handleImageSelect = (e) => {
        console.log(e.target.files[0])
    }

    const handleProfileInfoUpdate = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`,
                },
            };
            const update = {
                name: name
            }
            const res = await axios.put('/users/update', update, config)
            setLoggedInUser(res.data)
        } catch (error) {
            console.log(error)
            toast({
                title: 'Error Occured',
                description: error.response.data,
                status: 'error',
                duration: 2000,
                isClosable: false,
                position: 'center'
            })
        }
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={() => {
                setName(loggedInUser.name)
                onClose()
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isLoggedInUserProfile ? 'My Profile' : `${user.name} Profile`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDir='column' alignItems='center' gap={2}>
                        {
                            <>
                                <WrapItem>
                                    <Avatar name={user.name} src={user.profilePic} size='2xl' />
                                </WrapItem>
                                <Box width='100%' display='flex' alignItems='center' justifyContent='center'>
                                    {
                                        user.profilePic.length !== 0 &&
                                        <Button colorScheme='red' variant='ghost' mr={3} >
                                            Remove Image
                                        </Button>
                                    }
                                    <label htmlFor='image-input' style={{ fontWeight: 'bold', cursor: 'pointer' }}>Choose Image</label>
                                    <input type='file' id='image-input' style={{ display: 'none' }}
                                        onChange={(e) => handleImageSelect(e)}
                                    />
                                </Box>
                                <Divider orientation='horizontal' />
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input type='email' value={loggedInUser.email} disabled />
                                </FormControl>
                            </>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {
                            isLoggedInUserProfile &&
                            <Button colorScheme='green' marginLeft='auto' disabled={name === user.name ? true : false}
                                onClick={handleProfileInfoUpdate}>
                                Update Profile
                            </Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
