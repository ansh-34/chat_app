import React from 'react'
import { useSelector } from "react-redux";
import Messages from './Messages';
import SendInput from './SendInput';

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = selectedUser && onlineUsers?.includes(selectedUser._id);
    const formatLastSeen = (dateStr) => {
        if(!dateStr) return 'Offline';
        const d = new Date(dateStr);
        const diffMs = Date.now() - d.getTime();
        const mins = Math.floor(diffMs / 60000);
        if(mins < 1) return 'just now';
        if(mins < 60) return `${mins} min${mins>1?'s':''} ago`;
        const hours = Math.floor(mins/60);
        if(hours < 24) return `${hours} hour${hours>1?'s':''} ago`;
        const days = Math.floor(hours/24);
        return `${days} day${days>1?'s':''} ago`;
    };
    
    return (
        <div className='md:min-w-md flex flex-col'>
            {selectedUser ? (
                <>
                    {/* Header */}
                    <div className='bg-zinc-800 text-white px-4 py-2 mb-2 flex items-center gap-3 justify-between'>
                        <div className='avatar'>
                            <div className='w-8 rounded-full'>
                                <img src={selectedUser?.profilePhoto} alt={selectedUser?.fullName || 'User'} />
                            </div>
                        </div>
                        <p className='text-lg font-bold'>{selectedUser?.fullName}</p>
                        <p className='text-xs opacity-80 ml-auto'>{isOnline ? 'Online' : `Last seen ${formatLastSeen(selectedUser?.lastSeen)}`}</p>
                    </div>
                    {/* Messages */}
                    <Messages />
                    {/* Send Input */}
                    <SendInput />
                </>
            ) : (
                <div className='md:min-w-md flex-1 flex flex-col items-center justify-center text-center gap-2'>
                    <h1 className='text-4xl text-white font-bold'>Hi, {authUser?.fullName || 'there'}</h1>
                    <h2 className='text-2xl text-white'>Let's start a conversation</h2>
                </div>
            )}
        </div>
    )
}

export default MessageContainer