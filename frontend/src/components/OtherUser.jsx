import React from 'react'
import { useDispatch,useSelector } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const {selectedUser, onlineUsers, unreadMessages} = useSelector(store=>store.user);
    const isOnline = onlineUsers?.includes(user._id);
    const hasUnread = unreadMessages?.includes(user._id);
    const formatLastSeen = (dateStr) => {
        if(!dateStr) return '';
        const d = new Date(dateStr);
        const diffMs = Date.now() - d.getTime();
        const mins = Math.floor(diffMs / 60000);
        if(mins < 1) return 'just now';
        if(mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins/60);
        if(hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours/24);
        return `${days}d ago`;
    };
    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
    }
    return (
        <>
            <div onClick={() => selectedUserHandler(user)} className={` ${selectedUser?._id === user?._id ? 'bg-zinc-200 text-black' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}>
                <div className={`avatar ${isOnline ? 'online' : 'offline' }`}>
                    <div className='w-12 rounded-full'>
                        <img src={user?.profilePhoto} alt="user-profile" />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between gap-2 '>
                        <p>{user?.fullName}</p>
                        <div className='flex items-center gap-1'>
                            {isOnline && <span className='text-green-500 text-xs'>●</span>}
                            {hasUnread && <span className='text-yellow-500 text-lg'>🔔</span>}
                        </div>
                        {!isOnline && (
                            <span className='text-xs text-gray-400'>Last seen {formatLastSeen(user?.lastSeen)}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className='divider my-0 py-0 h-1'></div>
        </>
    )
}

export default OtherUser