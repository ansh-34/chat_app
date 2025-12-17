import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, markMessagesSeen } from "../redux/messageSlice";
import { addUnreadMessage, clearUnreadMessage } from "../redux/userSlice";

const useGetReatTimeMessage = () => {
    const {socket} = useSelector(store => store.socket);
    const {messages} = useSelector(store => store.message);
    const {selectedUser, authUser} = useSelector(store => store.user);
    const dispatch = useDispatch();
    
    // Clear unread indicator when user is selected
    useEffect(() => {
        if (selectedUser) {
            dispatch(clearUnreadMessage(selectedUser._id));
        }
    }, [selectedUser, dispatch]);
    
    useEffect(() => {
        if (!socket) return;
        const handler = (newMessage) => {
            const senderId = newMessage.senderId?._id || newMessage.senderId;
            const receiverId = newMessage.receiverId?._id || newMessage.receiverId;
            const currentUserId = authUser?._id;
            
            // Only process if current user is sender or receiver
            const isParticipant = senderId === currentUserId || receiverId === currentUserId;
            if (!isParticipant) return;

            // Add unread indicator only if current user is the receiver and not viewing this chat
            const isForMe = receiverId === currentUserId;
            const isViewingChat = selectedUser && (selectedUser._id === senderId || selectedUser._id === receiverId);
            if (isForMe && !isViewingChat) {
                dispatch(addUnreadMessage(senderId));
            }

            // Only update visible messages when user is viewing this conversation
            if (isViewingChat) {
                const current = Array.isArray(messages) ? messages : [];
                dispatch(setMessages([...current, newMessage]));
            }
        };
        socket.on('newMessage', handler);

        const seenHandler = ({ messageIds }) => {
            dispatch(markMessagesSeen(messageIds));
        };

        socket.on('messagesSeen', seenHandler);

        return () => {
            socket.off('newMessage', handler);
            socket.off('messagesSeen', seenHandler);
        };
    }, [socket, messages, dispatch, selectedUser, authUser]);
};

export default useGetReatTimeMessage;