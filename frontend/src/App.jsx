import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import HomePage from './components/HomePage'
import { useSelector , useDispatch} from 'react-redux'
import io from 'socket.io-client';
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/userSlice'

const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
   {
    path:"/signup",
    element:<Signup/>
  },
   {
    path:"/login",
    element:<Login/>
  },
])


function App() {
  // const [socket, setSocket] = useState(null);
  const {authUser} = useSelector(store => store.user);
  const {socket} = useSelector(store => store.socket);
  const dispatch = useDispatch();
  useEffect(() => {
    if(authUser){
      const socket = io("http://localhost:8080", {
        query: { userId: authUser._id },
        withCredentials: true,
      });
      dispatch(setSocket(socket));

      socket.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      return ()=>{
        socket.close();
      }

    }else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }
  },[authUser]);
  return (
      <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router}/>
    </div>

    
  )
}

export default App
