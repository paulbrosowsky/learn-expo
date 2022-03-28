import React, { useState, useContext } from 'react'
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
import axios from '../helpers/axiosConfig'
import { AuthContext } from '../context/AuthProvider'

export default function NewTweetScreen({ navigation }) {
    const [tweet, setTweet] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(AuthContext)

    function sendTweet() {
        if (tweet.length === 0) {
            Alert.alert('Please enter a tweet')
            return
        }
        setIsLoading(true)

        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
        axios
            .post(`tweets`, {
                body: tweet,
            })
            .then(response => {
                navigation.navigate('Home2', {
                    newTweetAdded: response.data.id,
                })
                setIsLoading(false)
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false)
            })
    }

    return (
        <View style={tw.style('bg-white', 'h-full', 'px-2.5')}>
            <View style={tw.style('flex-row', 'items-center', 'justify-between', 'py-3')}>
                <Text style={tw.style(tweet.length > 250 ? 'text-red-500' : 'text-gray-500')}>
                    Characters left: {280 - tweet.length}
                </Text>
                <View style={tw.style('flex-row', 'items-center')}>
                    {isLoading && <ActivityIndicator style={tw.style('mr-2')} size="small" color="gray" />}
                    <TouchableOpacity
                        style={tw.style('bg-[#1d9bf1]', 'rounded-full', 'py-2', 'px-4')}
                        onPress={() => sendTweet()}
                        disabled={isLoading}
                    >
                        <Text style={tw.style('text-white', 'font-bold')}>Tweet</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={tw.style('flex-row')}>
                <Image
                    style={tw.style('w-10', 'h-10', 'rounded-full', 'mr-2.5')}
                    source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                />
                <TextInput
                    style={tw.style('flex-1', 'leading-5')}
                    onChangeText={setTweet}
                    value={tweet}
                    placeholder="What's happening?"
                    placeholderTextColor="gray"
                    multiline
                    maxLength={280}
                ></TextInput>
            </View>
        </View>
    )
}
