import React from 'react'
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import {useSelector} from "react-redux";

const OtherUsers = () => {
    // This hook fetches all other users 
    useGetOtherUsers();
    const {otherUsers} = useSelector(store=>store.user);
    if (!otherUsers || !Array.isArray(otherUsers)) return null; // Don't show anything until users are loaded
    
    return (
        <div className='overflow-auto flex-1'>
            {
                otherUsers?.map((user)=>{
                    return (
                        <OtherUser key={user._id} user={user}/>
                    )
                })
            }   
        </div>
    )
}

export default OtherUsers