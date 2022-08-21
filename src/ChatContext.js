import React, { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext()

export const ChatProvider = props => {

    const navigate = useNavigate()

    const [loggedInUser, setLoggedInUser] = useState({})

    useEffect(() => {
        const cache = localStorage.getItem('user')
        setLoggedInUser(JSON.parse(cache))

        if (!cache) {
            navigate("/auth", { replace: true });
        }
    }, [navigate])

    return (
        <ChatContext.Provider value={{ loggedInUser, setLoggedInUser }}>
            {props.children}
        </ChatContext.Provider>
    )
}