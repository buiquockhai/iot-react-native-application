import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import * as firebase from 'firebase';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import uuid from 'react-native-uuid';


const getFonts = () => Font.loadAsync({
    'google-bold': require('./assets/font/ProductSans-Black.ttf'),
});



export default function SignUp({ navigation }) {

    const [fontLoaded, setFontLoaded] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [usersData, setUsersData] = useState(null);
    const [toogle, setToogle] = useState('false');
    const [openModal, setOpenModal] = useState(false);
    const [otp, setOtp] = useState();

    useEffect(() => {
        firebase.database().ref('/users').once('value', (snap) => {
            setUsersData(Object.entries(snap.val()));
        });
    }, [toogle]);


    let validator = require('email-validator');

    // let nodemailer = require('nodemailer');
    let userExisted = null;

    // const sendMail = (emailParam, otpParam) => {
    //     let transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: 'twoteam192@gmail.com',
    //             pass: '123456789team'
    //         }
    //     });

    //     transporter.sendMail({
    //         from: '"Fred Foo 👻" <twoteam192@gmail.com>', 
    //         to: emailParam,
    //         subject: "Confirm create useraccount ✔",
    //         text: otpParam
    //     });
    // }

    const storeData = (fullNameParam, emailParam, phoneParam, usernameParam, passwordParam) => {
        // setOpenModal(true);
        // return;
        if (fullNameParam == '' || emailParam == '' || phoneParam == '' || usernameParam == '' || passwordParam == '') Alert.alert('OOPS', 'Something is empty');
        else {
            if (!validator.validate(emailParam)) {
                Alert.alert('FAIL', 'Email format is not allowed');
                setEmail('');
                return;
            }
            userExisted = usersData.find(item => {
                return item[1].username == usernameParam;
            });
            if (userExisted == undefined) {
                let id = uuid.v4();
                let userId = uuid.v1();
                firebase.database().ref('users/' + id).set({
                    id: userId,
                    fullname: fullNameParam,
                    email: emailParam,
                    username: usernameParam,
                    password: passwordParam,
                    phone: phoneParam,
                    idRoot: id
                });

                setFullname('');
                setEmail('');
                setPhone('');
                setUsername('');
                setPassword('');
                Alert.alert('GREAT', 'Sign up successfull');
                setToogle(!toogle);
            } else {
                Alert.alert('FAIL', 'Password has existed');
                setUsername('');
            }

        }
    }

    if (fontLoaded) {
        return (
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', }}>
                <View style={styles.container}>

                    <Modal
                        transparent={true}
                        visible={openModal}
                        onRequestClose={() => setOpenModal(false)}
                    >
                        <View style={styles.modalView}>
                            <View
                                style={{
                                    paddingTop: 30,
                                    alignItems: 'center',
                                    width: '80%',
                                    height: 250,
                                    backgroundColor: '#e7e6e6',
                                    borderRadius: 30,
                                    borderColor: '#f4a05b',
                                    borderWidth: 1
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'google-bold',
                                        color: '#828283',
                                        fontSize: 16
                                    }}
                                >Check your email</Text>
                                <View
                                    style={{
                                        flex: 1,
                                        padding: 30
                                    }}
                                >
                                    <TextInput
                                        keyboardType='decimal-pad'
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: 'google-bold',
                                            fontSize: 25,
                                            color: '#828283',
                                            backgroundColor: '#f5f5f5',
                                            width: 200,
                                            height: 40,
                                            borderRadius: 30,
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        padding: 0
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {

                                        }}
                                        style={{
                                            backgroundColor: '#f4a05b',
                                            width: 70,
                                            height: 45,
                                            // margin: 10,
                                            borderRadius: 30,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Image
                                            source={require('./assets/arrows.png')}
                                            style={{ width: '30%' }}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Image
                            source={require('./assets/back.png')}
                            resizeMode='contain'
                            style={{ width: '7%' }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.boxOne}>
                    <Text style={styles.textTitle}>Sign up</Text>
                    <Image
                        source={require('./assets/letgo.png')}
                        resizeMode='contain'
                        style={{ width: '70%' }}
                    />
                </View>
                <View style={styles.boxOne}>
                    <View style={styles.boxTwo}>
                        <Image
                            source={require('./assets/users.png')}
                            style={styles.imageStyle}
                        />
                        <TextInput
                            onChangeText={(val) => setFullname(val)}
                            value={fullname}
                            keyboardType='default'
                            style={styles.textInput}
                            placeholder="Enter Your Full Name Here"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={styles.boxTwo}>
                        <Image
                            source={require('./assets/interface.png')}
                            style={styles.imageStyle}
                        />
                        <TextInput
                            onChangeText={(val) => setEmail(val)}
                            value={email}
                            keyboardType='email-address'
                            style={styles.textInput}
                            placeholder="Enter Your Email Here"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={styles.boxTwo}>
                        <Image
                            source={require('./assets/touch-screen.png')}
                            style={styles.imageStyle}
                        />
                        <TextInput
                            onChangeText={(val) => setPhone(val)}
                            value={phone}
                            keyboardType='phone-pad'
                            style={styles.textInput}
                            placeholder="Enter Your Phone Number Here"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={styles.boxTwo}>
                        <Image
                            source={require('./assets/man-avatar.png')}
                            style={styles.imageStyle}
                        />
                        <TextInput
                            onChangeText={(val) => setUsername(val)}
                            value={username}
                            keyboardType='default'
                            style={styles.textInput}
                            placeholder="Enter Your Username Here"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={styles.boxTwo}>
                        <Image
                            source={require('./assets/closed.png')}
                            style={styles.imageStyle}
                        />
                        <TextInput
                            onChangeText={(val) => setPassword(val)}
                            value={password}
                            secureTextEntry={true}
                            keyboardType='decimal-pad'
                            style={styles.textInput}
                            placeholder="Enter Your Paswword Here"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => storeData(fullname, email, phone, username, password)}
                        style={styles.button}
                    >
                        <Text style={styles.create}>create</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Image
                            source={require('./assets/here.png')}
                            style={styles.here}
                        />
                    </TouchableOpacity>
                </View>


            </KeyboardAwareScrollView>


        )
    } else {
        return (
            <AppLoading
                startAsync={getFonts}
                onFinish={() => setFontLoaded(true)}
            />
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 40,
        paddingLeft: '5%'
    },
    boxOne: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
        alignItems: 'center'
    },
    boxTwo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e7e6e6',
        height: 45,
        width: '80%',
        borderRadius: 30,
        margin: 10
    },
    textTitle: {
        fontFamily: 'google-bold',
        fontSize: 26,
        color: '#404040'
    },
    textInput: {
        flex: 1,
        fontFamily: 'google-bold',
        fontSize: 14,
        color: '#404040',
    },
    imageStyle: {
        padding: 10,
        margin: 15,
        height: 20,
        width: 20,
        resizeMode: 'contain',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#f4a05b',
        width: '25%',
        height: 45,
        margin: 10,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    create: {
        fontFamily: 'google-bold',
        fontSize: 18,
        color: '#f5f5f5'
    },
    here: {
        resizeMode: 'contain',
        width: 200,
        margin: -5
    },
    modalView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});