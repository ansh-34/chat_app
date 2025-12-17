import React, { useState, useEffect } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import { IoArrowBack } from "react-icons/io5";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';

 
const Sidebar = () => {
    const [search, setSearch] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const {otherUsers} = useSelector(store=>store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (otherUsers && otherUsers.length > 1) {
            setAllUsers(otherUsers);
        }
    }, [otherUsers]);

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/user/logout`); 
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    }
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const conversationUser = otherUsers?.find((user)=> user.fullName.toLowerCase().includes(search.toLowerCase()));
        if(conversationUser){
            dispatch(setOtherUsers([conversationUser]));
        }else{
            toast.error("User not found!");
        }
    }

    const handleBack = () => {
        setSearch("");
        dispatch(setOtherUsers(allUsers));
    }
    return (
        <div className='border-r border-slate-500 p-4 flex flex-col'>
            <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
                {search && (
                    <button 
                        type='button' 
                        onClick={handleBack} 
                        className='btn bg-zinc-700 text-white btn-sm'
                    >
                        <IoArrowBack className='w-5 h-5'/>
                    </button>
                )}
                <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className='input input-bordered rounded-md' type="text"
                    placeholder='Search...'
                />
                <button type='submit' className='btn bg-zinc-700 text-white'>
                    <BiSearchAlt2 className='w-6 h-6 outline-none'/>
                </button>
            </form>
            <div className="divider px-3"></div> 
            <OtherUsers/> 
            <div className='mt-2'>
                <button onClick={logoutHandler} className='btn btn-sm'>Logout</button>
            </div>
        </div>
    )
}

export default Sidebar