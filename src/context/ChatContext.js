import React, { useState, createContext, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext()

export const ChatProvider = props => {

    const navigate = useNavigate()

    const [loggedInUser, setLoggedInUser] = useState(null)
    const [chat, setChat] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)

    useEffect(() => {
        const cache = localStorage.getItem('user')
        setLoggedInUser(JSON.parse(cache))

        if (!cache) {
            navigate("/auth", { replace: true });
        }
    }, [navigate])

    return (
        <ChatContext.Provider value={
            {
                loggedInUser, setLoggedInUser,
                chat, setChat,
                selectedChat, setSelectedChat
            }}>
            {props.children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => useContext(ChatContext)