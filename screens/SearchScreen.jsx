import { AntDesign } from '@expo/vector-icons'
import React, { useEffect, useRef, useState, useContext } from 'react'
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
import RenderItem from '../components/RenderItem'
import axios from '../helpers/axiosConfig'

export default function HomeScreen({ route, navigation }) {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [page, setPage] = useState(1)
    const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false)
    const flatListRef = useRef()

    useEffect(() => {
        getAllTweets()
    }, [page])

    useEffect(() => {
        if (route.params?.newTweetAdded) {
            getAllTweetsRefresh()
            flatListRef.current.scrollToOffset({
                offset: 0,
            })
        }
    }, [route.params?.newTweetAdded])

    function getAllTweets() {
        axios
            .get(`tweets-all?page=${page}`)
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

                setIsLoading(false)
                setIsRefreshing(false)
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false)
                setIsRefreshing(false)
            })
    }

    function getAllTweetsRefresh() {
        setPage(1)
        setIsLoading(true)
        setIsAtEndOfScrolling(false)
        setIsRefreshing(false)

        axios
            .get(`tweets-all`)
            .then(response => {
                setData(response.data.data)
                setIsLoading(false)
                setIsRefreshing(false)
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false)
                setIsRefreshing(false)
            })
    }

    function handleRefresh() {
        setIsAtEndOfScrolling(false)
        setIsRefreshing(true)

        if (page !== 1) {
            setPage(1)
        } else {
            getAllTweets()
        }
    }

    function handleEnd() {
        setPage(page + 1)
    }

    function gotoNewTweet() {
        navigation.navigate('New Tweet')
    }

    return (
        <View style={tw.style('flex-1', 'bg-white')}>
            {isLoading ? (
                <ActivityIndicator style={tw.style('my-5')} size="large" color="gray" />
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={data}
                    renderItem={props => <RenderItem {...props} />}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={tw.style('border-b', 'border-gray-300')}></View>}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    onEndReached={handleEnd}
                    onEndReachedThreshold={0}
                    ListFooterComponent={() =>
                        !isAtEndOfScrolling && <ActivityIndicator style={tw.style('my-5')} size="large" color="gray" />
                    }
                />
            )}

            <TouchableOpacity
                style={tw.style(
                    'absolute',
                    'bottom-0',
                    'right-0',
                    'w-16',
                    'h-16',
                    'rounded-full',
                    'justify-center',
                    'items-center',
                    'bg-[#1d9bf1]',
                    'm-4'
                )}
                onPress={() => gotoNewTweet()}
            >
                <AntDesign name="plus" size={26} color="white" />
            </TouchableOpacity>
        </View>
    )
}
