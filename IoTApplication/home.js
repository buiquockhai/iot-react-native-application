import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert, Modal } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import * as firebase from 'firebase';

const getFonts = () => Font.loadAsync({
    'google-bold': require('./assets/font/ProductSans-Black.ttf'),
});

const firebaseConfig = {
    apiKey: "AIzaSyALHh1hMM3BCqJ3c7SR_6XLVtwuwjc27sU",
    authDomain: "myproject-13f98.firebaseapp.com",
    databaseURL: "https://myproject-13f98.firebaseio.com",
    projectId: "myproject-13f98",
    storageBucket: "myproject-13f98.appspot.com",
    messagingSenderId: "665863113151",
    appId: "1:665863113151:web:d6d7e346ca299e0cd0390a",
    measurementId: "G-ZVTYSDJX51"
};
if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


export default function Home({ navigation }) {

    const [fontLoaded, setFontLoaded] = useState(false);
    const [focus, setFocus] = useState(false);
    const [focusPass, setFocusPass] = useState(false);
    const [userSelect, setUserSelect] = useState(true);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const [usersData, setUsersData] = useState(null);
    const [adminsData, setAdminsData] = useState(null);
    const [toogle,setToogle] = useState(true);

    const navigateToSignUp = () => {
        navigation.navigate('SignUp');
    }

    useEffect(() => {
        setOpenModal(false);

        let firebaseUserReponse = firebase.database().ref('/users');
        firebaseUserReponse.once('value', (snap) => {
            setUsersData(Object.entries(snap.val()));
        });

        let firebaseAdminReponse = firebase.database().ref('/admins');
        firebaseAdminReponse.once('value', (snap) => {
            setAdminsData(Object.entries(snap.val()));
        });
    },[toogle]);

    let userValid = null;
    let adminValid = null;

    const login = async (usernameParam,passwordParam) => {
        if(userSelect) {
                userValid = usersData.find(item => {
                return item[1].username===usernameParam && item[1].password==passwordParam;
            });
            setToogle(!toogle);
        } else {
            adminValid = adminsData.find(item => {
                return item[1].username===usernameParam && item[1].password==passwordParam;
            });
            setToogle(!toogle);
        }
        if (userSelect) if (userValid) navigation.navigate('ManagementView',{ root: userValid[1].idRoot }); else Alert.alert('OOPS','User login unsuccessfull');
        else if (adminValid) navigation.navigate('ManageAccount'); else Alert.alert('OOPS','Admin login unsuccessfull');
    }

    if (fontLoaded) {
        return (
            <KeyboardAvoidingView
                style = {{ position: 'absolute', width: '100%' }}
                behavior = 'padding'
            >
                <TouchableWithoutFeedback
                    onPress = {() => {
                        Keyboard.dismiss();
                        setFocus(false);
                        setFocusPass(false);
                        setOpenModal(false);
                    }}
                >

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
                                        height: '40%',
                                        backgroundColor: '#e7e6e6',
                                        borderRadius: 30
                                    }}
                                >
                                    <Text 
                                        style={{
                                            fontFamily: 'google-bold',
                                            color: '#828283',
                                            fontSize: 16
                                        }}
                                    >Crete new password</Text>
                                    <View
                                        style={{
                                            flex: 1,
                                            padding: 30
                                        }}
                                    >
                                        <TextInput
                                        style={{
                                            backgroundColor: '#f5f5f5',
                                            width: 200,
                                            height: 40,
                                            borderRadius: 30,
                                        }}
                                    />
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <Image
                            source = {require('./assets/1.png')}
                            style = { styles.image }
                            resizeMode = 'contain'
                        />
                        <Image
                            source = {require('./assets/2.png')}
                            style = {{ position: 'absolute',top: '30%', width: '35%',  }}
                            resizeMode = 'contain'
                        />
                        <Text style = {styles.textTitle}>Sign in</Text>
                        <TextInput
                            onBlur = {() => setFocus(false)}    
                            onTouchCancel = {() => setFocus(false)}
                            onFocus = {() => {
                                setFocus(true);
                                setUserName('');
                            }}
                            value = {userName}
                            onChangeText = {(val) => setUserName(val)}
                            style = {(focus) ? styles.textInputFocus : styles.textInput}
                        />
                        <Text style = {{fontSize: 7}}></Text>
                        <TextInput
                            keyboardType = 'decimal-pad'
                            onBlur = {() => setFocusPass(false)}    
                            onTouchCancel = {() => setFocusPass(false)}
                            secureTextEntry = {true}
                            onFocus = {() => {
                                setFocusPass(true);
                                setPassword('');
                            }}
                            value = {password}
                            onChangeText = {(val) => setPassword(val)}
                            style = {(focusPass) ? styles.textInputFocusPass : styles.textInputPass}
                        />
                        {/* *********************************************************************** */}
                        <TouchableOpacity 
                            onPress = {async () => {
                                setUserName('');
                                setPassword('');
                                login(userName,password);
                            }}
                            style={styles.buttonSignIn}
                        >
                            <Image
                                source = {require('./assets/arrows.png')}
                                style = {{ width: '25%' }}
                                resizeMode = 'contain'
                            />
                        </TouchableOpacity>
                        {/* ************************************************************************* */}
                        <TouchableOpacity
                            onPress = {() => setOpenModal(true)}
                            style={{
                                position: 'absolute', 
                                top: '50%', 
                                left: '15%',
                            }}
                        >
                            {/* <Text style = {{ 
                                fontFamily: 'google-bold',
                                fontSize: 15,
                                textDecorationLine: 'underline',
                                color: '#ddd' 
                            }}
                            >Forgot password</Text> */}
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress = {() => setUserSelect(true)}
                            style={(userSelect) ? styles.buttonUserSelect : styles.buttonUser}
                        >
                            <Image
                                source = {(userSelect) ? require('./assets/socialWhite.png') : require('./assets/social.png')}
                                style = {{ width: '50%' }}
                                resizeMode = 'contain'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress = {() => setUserSelect(false)}
                            style={(userSelect) ? styles.buttonAdmin : styles.buttonAdminSelect}
                        >
                            <Image
                                source = {(userSelect) ? require('./assets/admin.png') : require('./assets/adminWhite.png')}
                                style = {{ width: '60%' }}
                                resizeMode = 'contain'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: '61%',
                                left: '43%',
                            }}
                            onPress = {() => navigateToSignUp()}
                        >
                            <Text style={{
                                fontFamily: 'google-bold',
                                color: '#828283',
                            }}
                            >Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        )
    } else {
        return (
            <AppLoading
                startAsync = { getFonts }
                onFinish = { () => setFontLoaded(true) }
            />
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 1000,
        backgroundColor: '#f5f5f5',
        alignItems: "center",
        paddingTop: 40
    },
    textTitle: {
        position: 'absolute',
        top: '38%',
        left: '15%',
        fontFamily: 'google-bold',
        fontSize: 24,
        color: '#404040',
        paddingBottom: 50
    },
    image: {
        position: 'absolute',
        top: '5%',
        width: '48%',
    },
    textInput: {
        position: 'absolute',
        top: '38%',
        width: '75%',
        height: '4.5%',
        borderRadius: 30,
        fontSize: 16,
        color: '#828283',
        textAlign: 'center',
        backgroundColor: '#e7e6e6',
        fontFamily: 'google-bold',
    },
    textInputFocus: {
        position: 'absolute',
        top: '38%',
        width: '75%',
        height: '4.5%',
        borderRadius: 30,
        borderWidth: 1,
        fontSize: 16,
        color: '#828283',
        borderColor: '#f4a05b',
        textAlign: 'center',
        backgroundColor: '#e7e6e6',
        fontFamily: 'google-bold',
    },
    textInputPass: {
        position: 'absolute',
        top: '43%',
        width: '75%',
        height: '4.5%',
        borderRadius: 30,
        fontSize: 16,
        color: '#828283',
        textAlign: 'center',
        backgroundColor: '#e7e6e6',
        fontFamily: 'google-bold',
    },
    textInputFocusPass: {
        position: 'absolute',
        top: '43%',
        width: '75%',
        height: '4.5%',
        borderRadius: 30,
        borderWidth: 1,
        fontSize: 16,
        color: '#828283',
        borderColor: '#f4a05b',
        textAlign: 'center',
        backgroundColor: '#e7e6e6',
        fontFamily: 'google-bold',
    },
    buttonSignIn: {
        position: 'absolute',
        right: '12.5%',
        top: '49%',
        width: '20%',
        height: '4%',
        borderRadius: 30,
        backgroundColor: '#f4a05b',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonUserSelect: {
        position: 'absolute',
        top: '57%',
        left: '40%',
        backgroundColor: '#f4a05b',
        width: 30,
        height: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonUser: {
        position: 'absolute',
        top: '57%',
        left: '40%',
        backgroundColor: '#e7e6e6',
        width: 30,
        height: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonAdmin: {
        position: 'absolute',
        top: '57%',
        right: '40%',
        backgroundColor: '#e7e6e6',
        width: 30,
        height: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },buttonAdminSelect: {
        position: 'absolute',
        top: '57%',
        right: '40%',
        backgroundColor: '#f4a05b',
        width: 30,
        height: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});