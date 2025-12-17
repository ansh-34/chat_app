import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        authUser:null,
        otherUsers:null,
        selectedUser:null,
        onlineUsers:null,
        unreadMessages:[]
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser = action.payload;
        },
        setOtherUsers:(state, action)=>{
            state.otherUsers = action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        },
        addUnreadMessage:(state,action)=>{
            const userId = action.payload;
            if (!state.unreadMessages.includes(userId)) {
                state.unreadMessages.push(userId);
            }
        },
        clearUnreadMessage:(state,action)=>{
            const userId = action.payload;
            state.unreadMessages = state.unreadMessages.filter(id => id !== userId);
        }
    }
});
export const {setAuthUser,setOtherUsers,setSelectedUser,setOnlineUsers,addUnreadMessage,clearUnreadMessage} = userSlice.actions;
export default userSlice.reducer;