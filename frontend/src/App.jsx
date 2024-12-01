import './App.css'
import { AuthTabs } from './components'
import axios from 'axios'
import {useDispatch} from 'react-redux'
import { useEffect, useState } from 'react'
import { login } from './store/authSlice'
import { useNavigate } from 'react-router-dom'

function App() {
  const dispatch = useDispatch()
  const [authPage, setAuthPage] = useState(true);
  const navigate  = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_PREFIX}/user/current-user`, {
              withCredentials: true
            });
            dispatch(login(response.data.data));
            closeAuthPage()
            console.log("Login successful from cookies");
        } catch (error) {
            console.log("Error while loging in from cookies", error);
        }
      };

      fetchData();
  }, []);

  const closeAuthPage = () => {
    navigate('/home')
  }


  return (
    <div>
      {authPage && <AuthTabs closeAuthPage={closeAuthPage}/>}

    </div>
  )
}

export default App
