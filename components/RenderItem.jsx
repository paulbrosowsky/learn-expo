import { EvilIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { formatDistanceToNowStrict } from 'date-fns'
import locale from 'date-fns/locale/en-US'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
import formatDistance from '../helpers/formatDistanceCustom'

export default function RenderItem({ item: tweet }) {
    const navigation = useNavigation()

    function gotoProfile(userId) {
        navigation.navigate('Profile', {
            userId: userId,
        })
    }
    function gotoTweet(tweetId) {
        navigation.navigate('Tweet', {
            tweetId: tweetId,
        })
    }

    return (
        <View style={tw.style('flex-row', 'p-3')}>
            <TouchableOpacity onPress={() => gotoProfile(tweet.user.id)}>
                <Image
                    style={tw.style('w-10', 'h-10', 'rounded-full', 'mr-2')}
                    source={{
                        uri: tweet.user.avatar,
                    }}
                />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={tw.style('flex-row')}
                    onPress={() => gotoTweet(tweet.id)}
                >
                    <Text numberOfLines={1} style={tw.style('font-bold')}>
                        {tweet.user.name}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={tw.style('text-gray-500', 'mx-2')}
                    >
                        @{tweet.user.username}
                    </Text>
                    <Text>&middot;</Text>
                    <Text
                        numberOfLines={1}
                        style={tw.style('text-gray-500', 'mx-2')}
                    >
                        {formatDistanceToNowStrict(new Date(tweet.created_at), {
                            locale: {
                                ...locale,
                                formatDistance,
                            },
                        })}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw.style('mt-1')}
                    onPress={() => gotoTweet(tweet.id)}
                >
                    <Text style={tw.style('text-sm', 'leading-5')}>
                        {tweet.body}
                    </Text>
                </TouchableOpacity>
                <View style={tw.style('flex-row', 'items-center', 'mt-3')}>
                    <TouchableOpacity style={tw.style('flex-row')}>
                        <EvilIcons
                            style={tw.style('mr-0.5')}
                            name="comment"
                            size={20}
                            color="gray"
                        />

                        <Text style={tw.style('text-gray-500')}>123</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw.style('flex-row', 'ml-4')}>
                        <EvilIcons
                            style={tw.style('mr-0.5')}
                            name="retweet"
                            size={20}
                            color="gray"
                        />
                        <Text style={tw.style('text-gray-500')}>3.2K</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw.style('flex-row', 'ml-4')}>
                        <EvilIcons
                            style={tw.style('mr-0.5')}
                            name="heart"
                            size={20}
                            color="gray"
                        />
                        <Text style={tw.style('text-gray-500')}>23</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw.style('flex-row', 'ml-4')}>
                        <EvilIcons
                            style={tw.style('mr-0.5')}
                            name={
                                Platform.OS === 'ios'
                                    ? 'share-apple'
                                    : 'share-google'
                            }
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
