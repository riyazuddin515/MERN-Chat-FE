import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'

const ProfileModal = ({ loggedInUser, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>My Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDir='column' alignItems='center' gap={2}>
                        <Image
                            boxSize='150px'
                            borderRadius='full'
                            src={loggedInUser.profilePic}
                            alt={loggedInUser.name}
                        />
                        <Text fontSize='3xl'>{`Name: ${loggedInUser.name}`}</Text>
                        <Text fontSize='3xl'>{`Email: ${loggedInUser.email}`}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='green' mr={3}>
                            Update Profile
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
