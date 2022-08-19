import React, { useEffect } from 'react'
import axios from 'axios'

const Home = () => {
    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get('/chat');
            console.log(res)
        }
        fetch()
    })
    return (
        <h1>Hello</h1>
    )
}

export default Home