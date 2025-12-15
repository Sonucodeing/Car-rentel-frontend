import { useContext, useEffect } from "react";
import { Children } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../Config.js";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext();

export const AppProvider = ({children})=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    
    const [token,setToken] = useState(null)
    const [user,setUser] = useState(null)
    const [isOwner, setIsOwner] = useState(false);

    const [showLogin,setShowLogin] = useState(false)
    const [pickupDate,setPickupDate] = useState('')
    const [returnDate,setReturnDate] = useState('')

    const [cars,setCar] = useState([])

    // Function to check is user is logged in
    const fetchUser = async(req,res)=>{
        try{
            const {data} = await axios.get(`${BASE_URL}/api/user/data`)
            if(data.success){
                setUser(data.user)
                setIsOwner(data.user.role === 'owner')
            }
            else{
                navigate('/')
            }
        }catch(error){
            toast.error(error.message);
            
        }
    }


    // Function to fetch all car from the server
const fetchCars = async () => {
  

  try {
    const { data } = await axios.get(`${BASE_URL}/api/user/cars`)
       
    if (data.success) {
      setCar(data.cars || data.car || [])
    } else {
      toast.error(data.message || 'Failed to fetch cars')
    }
  } catch (error) {
    
    toast.error(error.message)
  }
}



    // Function to logout the user
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ''
        toast.success('You have been logged out')
    }
    // useEffect to retrivev the token from localStorage
    // useEffect(()=>{
    //     const token = localStorage.getItem('token')
    //     setToken(token)
    //     fetchCars()
    // },[])

    useEffect(() => {
  console.log('🎯 useEffect for fetchCars ran');
  const token = localStorage.getItem('token')
  setToken(token)
  fetchCars()
}, [])



    //useEffect to fetch user data when token is available
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization'] = `${token}`
            fetchUser()
        }
    },[token])

      const value = {
            navigate,currency, axios, user, setUser, token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCar, pickupDate, setPickupDate, returnDate, setReturnDate, 

        }

    return(  
    <AppContext.Provider value={value}>

        {children}

    </AppContext.Provider>

    )
}

export const useAppContext = ()=>{
        return useContext(AppContext)
}