import React, { useState, useEffect, useRef, useContext } from 'react'
import { Alert, ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { AntDesign, Entypo, EvilIcons } from '@expo/vector-icons'
import tw from 'twrnc'
import axios from '../helpers/axiosConfig'
import { format } from 'date-fns'
import { Modalize } from 'react-native-modalize'
import { AuthContext } from '../context/AuthProvider'

export default function TweetScreen({ route, navigation }) {
    const [tweet, setTweet] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const modalizeRef = useRef(null)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        getTweet()
    }, [])

    function getTweet() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
        axios
            .get(`tweets/${route.params.tweetId}`)
            .then(response => {
                setTweet(response.data)
                setIsLoading(false)
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false)
            })
    }

    function gotoProfile(userId) {
        navigation.navigate('Profile', {
            userId: userId,
        })
    }

    function deleteTweet() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
        axios
            .delete(`tweets/${route.params.tweetId}`)
            .then(response => {
                Alert.alert('Tweet is deleted.')
                navigation.navigate('Home2', {
                    tweetDeleted: true,
                })
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    function showAlert() {
        Alert.alert('Delete this tweet?', null, [
            {
                text: 'Cancel',
                onPress: () => modalizeRef.current?.close(),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => deleteTweet(),
                style: 'default',
            },
        ])
    }

    return (
        <View style={tw.style('flex-1', 'bg-white')}>
            {isLoading ? (
                <ActivityIndicator style={tw.style('my-5')} size="large" color="gray" />
            ) : (
                <>
                    <View style={tw.style('flex-row', 'justify-between', 'p-3')}>
                        <TouchableOpacity style={tw.style('flex-row')} onPress={() => gotoProfile(tweet.user.id)}>
                            <Image
                                style={tw.style('h-14', 'w-14', 'rounded-full', 'mr-2')}
                                source={{
                                    uri: tweet.user.avatar,
                                }}
                            />
                            <View>
                                <Text style={tw.style('font-bold', 'text-base')}>{tweet.user.name}</Text>
                                <Text style={tw.style('text-gray-500', 'mt-2')}>@{tweet.user.username}</Text>
                            </View>
                        </TouchableOpacity>
                        {user.id === tweet.user.id && (
                            <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
                                <Entypo name="dots-three-vertical" size={16} color="gray" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={tw.style('border-b', 'border-gray-300', 'p-3')}>
                        <Text style={tw.style('text-base', 'leading-relaxed')}>{tweet.body}</Text>
                        <View style={tw.style('flex-row', 'mt-2')}>
                            <Text style={tw.style('text-gray-500', 'text-xs')}>
                                {format(new Date(tweet.created_at), 'h:mm a')}
                            </Text>
                            <Text style={tw.style('text-gray-500', 'text-xs', 'mx-1')}>&middot;</Text>
                            <Text style={tw.style('text-gray-500', 'text-xs')}>
                                {format(new Date(tweet.created_at), 'd MMM. yy')}
                            </Text>
                            <Text style={tw.style('text-gray-500', 'text-xs', 'mx-1')}>&middot;</Text>
                            <TouchableOpacity>
                                <Text style={tw.style('text-blue-500', 'text-xs')}>Twitter for iPhone</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={tw.style('flex-row', 'items-center', 'border-b', 'border-gray-300', 'p-3')}>
                        <View style={tw.style('flex-row')}>
                            <Text style={tw.style('font-bold')}>682</Text>
                            <Text style={tw.style('text-gray-500', 'ml-1.5')}>Retweets</Text>
                        </View>
                        <View style={[tw.style('flex-row', 'ml-4')]}>
                            <Text style={tw.style('font-bold')}>38</Text>
                            <Text style={tw.style('text-gray-500', 'ml-1.5')}>Quote Tweets</Text>
                        </View>
                        <View style={[tw.style('flex-row', 'ml-4')]}>
                            <Text style={tw.style('font-bold')}>3.4K</Text>
                            <Text style={tw.style('text-gray-500', 'ml-1.5')}>Likes</Text>
                        </View>
                    </View>
                    <View
                        style={tw.style(
                            'flex-row',
                            'items-center',
                            'justify-around',
                            'py-3',
                            'border-b',
                            'border-gray-300'
                        )}
                    >
                        <TouchableOpacity style={[tw.style('flex-row')]}>
                            <EvilIcons name="comment" size={32} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[tw.style('flex-row', 'ml-4')]}>
                            <EvilIcons name="retweet" size={32} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[tw.style('flex-row', 'ml-4')]}>
                            <EvilIcons name="heart" size={32} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[tw.style('flex-row', 'ml-4')]}>
                            <EvilIcons
                                name={Platform.OS === 'ios' ? 'share-apple' : 'share-google'}
                                size={32}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>
                    <Modalize ref={modalizeRef} snapPoint={150}>
                        <View style={[tw.style('px-4', 'py-8')]}>
                            <TouchableOpacity style={[tw.style('flex-row', 'items-center')]}>
                                <AntDesign name="pushpino" size={20} color="black" />
                                <Text style={[tw.style('ml-2')]}>Pin Tweet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[tw.style('flex-row', 'items-center', 'mt-5')]}
                                onPress={showAlert}
                            >
                                <AntDesign name="delete" size={20} color="black" />
                                <Text style={[tw.style('ml-2')]}>Delete Tweet</Text>
                            </TouchableOpacity>
                        </View>
                    </Modalize>
                </>
            )}
        </View>
    )
}
