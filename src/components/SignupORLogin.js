import React, { useState } from 'react'
import { FormControl, FormLabel, Input, useToast } from '@chakra-ui/react'
import { VStack, Button } from '@chakra-ui/react'

const Signup = ({ isSignup }) => {

    const toast = useToast()

    const [email, setEmail] = useState('riyazuddin515@gmail.com')
    const [password, setPassword] = useState('123')
    const [confirmPassword, setConfirmPassword] = useState('12')

    const handleForm = (e) => {
        e.preventDefault()
        if (!email || !password || !confirmPassword) {
            toast({
                title: 'Error',
                description: 'All fields are required.',
                status: 'error',
                duration: 2000,
                isClosable: true
            })
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Password did not matched.',
                status: 'error',
                duration: 2000,
                isClosable: true
            })
            return;
        }
        const user = { 'email': email, 'password': password }
        console.log('starting singup')
    }

    return (
        <VStack spacing='20px' mt='10px'>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type='password' onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            {
                isSignup &&
                <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type='password' onChange={(e) => setConfirmPassword(e.target.value)} />
                </FormControl>
            }
            <FormControl>
                <Button mt='10px' colorScheme='teal' type='submit' width='100%' onClick={(e) => handleForm(e)}>{isSignup ? 'Signup' : 'Login'}</Button>
            </FormControl>
        </VStack>
    )
}

export default Signup