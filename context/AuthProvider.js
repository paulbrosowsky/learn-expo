import React, { createContext, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import axios from '../helpers/axiosConfig'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    return (
        <AuthContext.Provider
            value = {{
                user, 
                setUser,
                error,
                isLoading,
                login: (email, password) => {
                    setIsLoading(true)

                    axios.post('login', {
                        email,
                        password,
                        device_name: 'mobile'
                    })
                    .then(response => {
                        const user = response.data.user
                        const userResponse = {
                            token: response.data.token,
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            email: user.email,
                            avatar: user.avatar
                        }
                        setUser(userResponse)
                        setError(null)
                        SecureStore.setItemAsync('user', JSON.stringify(userResponse))
                        setIsLoading(false)
                    })
                    .catch(error => {
                        console.log(error.response);
                        const key = Object.keys(error.response.data.errors)[0]
                        setError(error.response.data.errors[key][0])
                        setIsLoading(false)
                    })                    
                },
                logout: () => {
                    setIsLoading(true)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
                    axios.post('logout')
                    .then(response => {
                        setUser(null)
                        SecureStore.deleteItemAsync('user')
                        setError(null)
                        setIsLoading(false)
                    })
                    .catch(error => {
                        console.log(error.response);
                        setUser(null)
                        SecureStore.deleteItemAsync('user')
                        setError(error.response.data.message)
                        setIsLoading(false)
                    })
                   
                }
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}