import React, { useState, useEffect, useContext } from 'react'
import { Alert, ActivityIndicator, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
import axios from '../helpers/axiosConfig'
import { EvilIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import RenderItem from '../components/RenderItem'
import { AuthContext } from '../context/AuthProvider'

export default function ProfileScreen({ route, navigation }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState([])
    const [isLoadingTweets, setIsLoadingTweets] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [page, setPage] = useState(1)
    const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const { user: userFromContext } = useContext(AuthContext)

    useEffect(() => {
        getUserProfile()
        getUserTweets()
    }, [page])

    useEffect(() => {
        getIsFollowing()
    }, [])

    function getUserProfile() {
        axios
            .get(`users/${route.params.userId}`)
            .then(response => {
                setUser(response.data)
                setIsLoading(false)
            })
            .catch(error => {
                console.log(error.response)
                setIsLoading(false)
            })
    }
    function getUserTweets() {
        axios
            .get(`users/${route.params.userId}/tweets?page=${page}`)
            .then(response => {
                if (page === 1) {
                    setData(response.data.data)
                } else {
                    setData([...data, ...response.data.data])
                }

                if (!response.data.next_page_url) {
                    setIsAtEndOfScrolling(true)
                } else {
                    setIsAtEndOfScrolling(false)
                }

                setIsLoadingTweets(false)
                setIsRefreshing(false)
            })
            .catch(error => {
                console.log(error)
                setIsLoadingTweets(false)
                setIsRefreshing(false)
            })
    }

    function getIsFollowing() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userFromContext.token}`
        axios
            .get(`is-following/${route.params.userId}`)
            .then(response => {
                setIsFollowing(response.data)
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    function follow(userId) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userFromContext.token}`
        axios
            .post(`follow/${userId}`)
            .then(response => {
                setIsFollowing(true)
                Alert.alert(`Now you are following ${user.name}.`)
            })
            .catch(error => {
                console.log(error)
            })
    }

    function unfollow(userId) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userFromContext.token}`
        axios
            .post(`unfollow/${userId}`)
            .then(response => {
                setIsFollowing(false)
                Alert.alert(`You are not following ${user.name} anymore.`)
            })
            .catch(error => {
                console.log(error)
            })
    }

    function handleRefresh() {
        setIsAtEndOfScrolling(false)
        setIsRefreshing(true)

        if (page !== 1) {
            setPage(1)
        } else {
            getUserTweets()
        }
    }

    function handleEnd() {
        setPage(page + 1)
    }

    const profileHeader = () => (
        <View style={tw.style('flex-1', 'bg-white')}>
            {isLoading ? (
                <ActivityIndicator style={tw.style('my-5')} size="large" color="gray" />
            ) : (
                <>
                    <Image
                        style={tw.style('w-full', 'h-[160px]')}
                        source={{
                            uri: 'https://picsum.photos/800',
                        }}
                    />
                    <View style={tw.style('flex-row', 'justify-between', 'items-end', 'px-2.5', '-mt-8')}>
                        <Image
                            style={tw.style('h-20', 'w-20', 'rounded-full', 'border-4', 'border-white')}
                            source={{
                                uri: user.avatar,
                            }}
                        />
                        {userFromContext.id !== route.params.userId && (
                            <View>
                                {isFollowing ? (
                                    <TouchableOpacity
                                        style={tw.style('bg-gray-800', 'rounded-full', 'py-2', 'px-4')}
                                        onPress={() => unfollow(route.params.userId)}
                                    >
                                        <Text style={tw.style('text-white', 'font-bold')}>Unfollow</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={tw.style('bg-gray-800', 'rounded-full', 'py-2', 'px-4')}
                                        onPress={() => follow(route.params.userId)}
                                    >
                                        <Text style={tw.style('text-white', 'font-bold')}>Follow</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                    <View style={tw.style('px-2.5')}>
                        <View style={tw.style('mb-3')}>
                            <Text style={tw.style('font-bold', 'text-xl')}>{user.name}</Text>
                            <Text style={tw.style('text-gray-500')}>@{user.username}</Text>
                        </View>
                        <View>
                            <Text style={tw.style('leading-5')}>{user.profile}</Text>
                        </View>
                        <View style={tw.style('flex-row', 'mt-3')}>
                            <EvilIcons name="location" size={24} color="gray" />
                            <Text style={tw.style('text-gray-500')}>{user.location}</Text>
                        </View>
                        <View style={tw.style('flex-row', 'mt-1')}>
                            <TouchableOpacity style={tw.style('flex-row')} onPress={() => Linking.openURL(user.link)}>
                                <EvilIcons name="link" size={24} color="gray" />
                                <Text style={tw.style('text-gray-500', 'text-blue-500')}>{user.linkText}</Text>
                            </TouchableOpacity>
                            <View style={tw.style('flex-row', 'ml-3')}>
                                <EvilIcons name="calendar" size={24} color="gray" />
                                <Text style={tw.style('text-gray-500')}>
                                    Joined {format(new Date(user.created_at), 'MMM yyyy')}
                                </Text>
                            </View>
                        </View>
                        <View style={tw.style('flex-row', 'items-center', 'py-3')}>
                            <View style={tw.style('flex-row')}>
                                <Text style={tw.style('font-bold')}>682</Text>
                                <Text style={tw.style('text-gray-500', 'ml-1.5')}>Followers</Text>
                            </View>
                            <View style={[tw.style('flex-row', 'ml-4')]}>
                                <Text style={tw.style('font-bold')}>38</Text>
                                <Text style={tw.style('text-gray-500', 'ml-1.5')}>Following</Text>
                            </View>
                        </View>
                    </View>

                    <View style={tw.style('border-b', 'border-gray-300')} />
                </>
            )}
        </View>
    )

    return (
        <View style={tw.style('flex-1', 'bg-white')}>
            {isLoadingTweets ? (
                <ActivityIndicator style={tw.style('my-5')} size="large" color="gray" />
            ) : (
                <FlatList
                    data={data}
                    renderItem={props => <RenderItem {...props} />}
                    keyExtractor={item => item.id.toString()}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    onEndReached={handleEnd}
                    onEndReachedThreshold={0}
                    ItemSeparatorComponent={() => <View style={tw.style('border-b', 'border-gray-300')}></View>}
                    ListHeaderComponent={profileHeader}
                    ListFooterComponent={() =>
                        !isAtEndOfScrolling && <ActivityIndicator style={tw.style('my-5')} size="large" color="gray" />
                    }
                    scrollIndicatorInsets={{ right: 1 }}
                />
            )}
        </View>
    )
}
