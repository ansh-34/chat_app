import {createSlice} from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:null,
    },
    reducers:{
        setMessages:(state,action)=>{
            state.messages = action.payload;
        },
        markMessagesSeen:(state,action)=>{
            const messageIds = action.payload;
            if (Array.isArray(state.messages)) {
                state.messages = state.messages.map(msg => 
                    messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
                );
            }
        }
    }
});
export const {setMessages, markMessagesSeen} = messageSlice.actions;
export default messageSlice.reducer;