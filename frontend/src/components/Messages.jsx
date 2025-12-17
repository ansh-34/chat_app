import React from 'react'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector(store => store.message);
    
    // Filter out undefined messages
    const validMessages = Array.isArray(messages) ? messages.filter(msg => msg && msg._id) : [];
    
    return (
        <div className='px-4 flex-1 overflow-auto'>
            {
               validMessages.map((message) => {
                    return (
                        <Message key={message._id} message={message} />
                    )
                })
            }

        </div>


    )
}

export default Messages