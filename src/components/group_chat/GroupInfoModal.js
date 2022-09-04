import React from 'react'
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
    AvatarGroup,
    Avatar,
    WrapItem,
} from '@chakra-ui/react'

const GroupInfoModal = ({ groupChat, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{groupChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <WrapItem display='flex' justifyContent='center'>
                            <Avatar name={groupChat.chatName} src='' size='2xl' />
                        </WrapItem>
                        <AvatarGroup size='md' max={10} mt={3}>
                            {
                                groupChat.users.map(user => {
                                    return <Avatar key={user._id} name={user.name} src={user.profilePic} />
                                })
                            }
                        </AvatarGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupInfoModal
