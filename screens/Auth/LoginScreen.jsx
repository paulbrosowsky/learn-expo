import React, { useContext, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import tw from 'twrnc'
import { AuthContext } from '../../context/AuthProvider'

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useContext(AuthContext)

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
                        style={tw.style('bg-white', 'rounded', 'p-2.5')}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="gray"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={tw.style('bg-white', 'rounded', 'p-2.5', 'mt-2')}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Password"
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
                    onPress={() => login(email, password)}
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
                            Login
                        </Text>
                    )}
                </TouchableOpacity>
                <View style={tw.style('flex-row', 'justify-center', 'mt-3')}>
                    <Text>Don't have an account?</Text>
                    <TouchableOpacity
                        style={tw.style('ml-2')}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={tw.style('text-white', 'underline')}>
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
