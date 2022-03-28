import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import tw from 'twrnc'
import axios from '../../helpers/axiosConfig'

export default function LoginScreen({ navigation }) {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    function register(name, username, email, password, confirmPassword) {
        setIsLoading(true)

        axios
            .post('register', {
                name,
                username,
                email,
                password,
                password_confirmation: confirmPassword,
            })
            .then(response => {
                Alert.alert('User created! Please login.')
                navigation.navigate('Login')
                setIsLoading(false)
                setError(null)
            })
            .catch(error => {
                console.log(error.response)
                const key = Object.keys(error.response.data.errors)[0]
                setError(error.response.data.errors[key][0])
                setIsLoading(false)
            })
    }

    return (
        <View style={tw.style('flex-1', 'bg-[#1d9bf1]', 'items-center')}>
            <View style={tw.style('mt-32', 'w-64')}>
                <View style={tw.style('mx-auto')}>
                    <Image
                        source={require('../../assets/larydefault.png')}
                    ></Image>
                </View>
                <View style={tw.style('mt-10')}>
                    {error && (
                        <Text
                            style={tw.style(
                                'text-red-300',
                                'text-center',
                                'mb-2'
                            )}
                        >
                            {error}
                        </Text>
                    )}
                    <TextInput
                        style={tw.style('bg-white', 'rounded', 'p-2.5', 'mb-2')}
                        onChangeText={setName}
                        value={name}
                        placeholder="Name"
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={tw.style('bg-white', 'rounded', 'p-2.5', 'mb-2')}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Username"
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={tw.style('bg-white', 'rounded', 'p-2.5', 'mb-2')}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="gray"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={tw.style('bg-white', 'rounded', 'p-2.5', 'mb-2')}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Password"
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={tw.style('bg-white', 'rounded', 'p-2.5', 'mb-2')}
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        placeholder="ConfirmPassword"
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity
                    style={tw.style(
                        'bg-[#0084b3]',
                        'rounded',
                        'flex-row',
                        'justify-center',
                        'items-center',
                        'p-3',
                        'mt-5'
                    )}
                    onPress={() =>
                        register(
                            name,
                            username,
                            email,
                            password,
                            confirmPassword
                        )
                    }
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text
                            style={tw.style(
                                'text-white',
                                'uppercase',
                                'font-bold'
                            )}
                        >
                            Register
                        </Text>
                    )}
                </TouchableOpacity>
                <View style={tw.style('flex-row', 'justify-center', 'mt-3')}>
                    <Text>Already have an acconut?</Text>
                    <TouchableOpacity
                        style={tw.style('ml-2')}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={tw.style('text-white', 'underline')}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
