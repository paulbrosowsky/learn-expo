import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import 'react-native-gesture-handler'
import tw from 'twrnc'
import { AuthContext } from './context/AuthProvider'
import LoginScreen from './screens/Auth/LoginScreen'
import RegisterScreen from './screens/Auth/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import NewTweetScreen from './screens/NewTweetScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import ProfileScreen from './screens/ProfileScreen'
import SearchScreen from './screens/SearchScreen'
import SettingsScreen from './screens/SettingsScreen'
import TweetScreen from './screens/TweetScreen'
import * as SecureStore from 'expo-secure-store'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()

const TabsNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home2"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="search-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="notifications-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen
                name="Tabs"
                component={TabsNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="New Tweet"
                component={NewTweetScreen}
                options={{ title: '' }}
            />
            <Stack.Screen
                name="Tweet"
                component={TweetScreen}
                options={{ title: '' }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: '' }}
            />
        </Stack.Navigator>
    )
}

export default function App() {
    const [isLoading, setIsLoading] = useState(true)
    const { user, setUser } = useContext(AuthContext)

    useEffect(() => {
        SecureStore.getItemAsync('user')
            .then(userString => {
                if (userString) {
                    setUser(JSON.parse(userString))
                }
                setIsLoading(false)
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false)
            })
    }, [])

    if (isLoading) {
        return (
            <View
                style={tw.style(
                    'flex-1',
                    'bg-white',
                    'items-center',
                    'justify-center'
                )}
            >
                <ActivityIndicator size="large" color="gray" />
            </View>
        )
    }

    return (
        <>
            {user ? (
                <NavigationContainer>
                    <Drawer.Navigator
                        initialRouteName="Home"
                        screenOptions={{
                            headerShown: true,
                        }}
                    >
                        <Drawer.Screen
                            name="Home"
                            component={HomeStackNavigator}
                        />
                        <Drawer.Screen
                            name="Settings"
                            component={SettingsScreen}
                        />
                    </Drawer.Navigator>
                </NavigationContainer>
            ) : (
                <NavigationContainer>
                    <AuthStackNavigator />
                </NavigationContainer>
            )}
        </>
    )
}
