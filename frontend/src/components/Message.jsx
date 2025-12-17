import React, { useEffect, useRef } from 'react'
import {useSelector} from "react-redux";

const Message = ({message}) => {
    const scroll = useRef();
    const {authUser,selectedUser} = useSelector(store=>store.user);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"});
    },[message]);
    
    if (!message) return null;

    const senderIdStr = message?.senderId?._id?.toString?.() ?? message?.senderId?.toString?.();
    const authIdStr   = authUser?._id?.toString?.();
    const isCurrentUserMessage = senderIdStr && authIdStr && senderIdStr === authIdStr;
    
    const statusLabel = isCurrentUserMessage ? (message?.seen ? 'Seen' : 'Delivered') : '';

    return (
        <div ref={scroll} className={`chat ${isCurrentUserMessage ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={isCurrentUserMessage ? authUser?.profilePhoto  : selectedUser?.profilePhoto } />
                </div>
            </div>
            <div className="chat-header">
                <time className="text-xs opacity-50 text-white">
                    {(() => {
                        const d = message?.createdAt ? new Date(message.createdAt) : null;
                        if (!d || isNaN(d.getTime())) return '';
                        const hh = String(d.getHours()).padStart(2, '0');
                        const mm = String(d.getMinutes()).padStart(2, '0');
                        return `${hh}:${mm}`;
                    })()}
                </time>
            </div>
            <div className={`chat-bubble ${!isCurrentUserMessage ? 'bg-gray-200 text-black' : ''} `}>{message?.message}</div>
            {isCurrentUserMessage && (
                <div className="chat-footer opacity-50 text-xs text-white">{statusLabel}</div>
            )}
        </div>
    )
}

export default Message