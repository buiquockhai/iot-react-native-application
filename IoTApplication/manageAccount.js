import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert, Modal, FlatList, ScrollView, BackHandler } from 'react-native';
import * as firebase from 'firebase';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import DropDownItem from 'react-native-drop-down-item';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';

const getFonts = () => Font.loadAsync({
    'google-bold': require('./assets/font/ProductSans-Black.ttf'),
});

export default function ManageAccount({ navigation }) {


    const [fontLoaded, setFontLoaded] = useState(false);
    const [toogle, setToogle] = useState('false');
    const [usersData, setUsersData] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", function () { return true; });

        firebase.database().ref('/users').once('value', (snap) => {
            if (snap.val() != null) {
                setUsersData(Object.entries(snap.val()).map(item => item[1]));
            }
        });

        firebase.database().ref('/listRooms').once('value', (snap) => {
            if (snap.val() != null) {
                setRooms(Object.entries(snap.val()).map(item => item[1]));
            }
        });
    }, [toogle]);

    const remmoveNode = (param) => {
        firebase.database().ref('/users/' + param).remove();
    }

    const userHadRoom = (list, param) => {
        let check = list.find(item => {
            return item == param;
        });
        if (check) return true; else return false;
    }


    const [tmp, setTmp] = useState([
        {
            fullname: "Bui Quoc Khai",
            email: "twoteam@gamail.com",
            phone: '0898463001',
            username: 'buiquockhai'

        },
        {
            fullname: "Bui Quoc Khai",
            email: "twoteam@gamail.com",
            phone: '0898463001',
            username: 'buiquockhai'
        },
        {
            fullname: "Bui Quoc Khai",
            email: "twoteam@gamail.com",
            phone: '0898463001',
            username: 'buiquockhai'
        },
        {
            fullname: "Bui Quoc Khai",
            email: "twoteam@gamail.com",
            phone: '0898463001',
            username: 'buiquockhai'
        },
        {
            fullname: "Bui Quoc Khai",
            email: "twoteam@gamail.com",
            phone: '0898463001',
            username: 'buiquockhai'
        },
        {
            fullname: "Bui Quoc Khai",
            email: "twoteam@gamail.com",
            phone: '0898463001',
            username: 'buiquockhai'
        }
    ]);



    if (fontLoaded) {

        return (

            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => setToogle(!toogle)}
                        style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#e7e6e6',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 40,
                            marginStart: 170
                        }}>
                        <Image
                            source={require('./assets/refresh.png')}
                            resizeMode='contain'
                            style={{ width: '50%' }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#e7e6e6',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 40,
                        marginStart: 10
                    }}>
                        <Image
                            source={require('./assets/notifi.png')}
                            resizeMode='contain'
                            style={{ width: '40%' }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        style={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#e7e6e6',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 40,
                            marginStart: 10
                        }}>
                        <Image
                            source={require('./assets/logout.png')}
                            resizeMode='contain'
                            style={{ width: '50%' }}
                        />
                    </TouchableOpacity>
                </View>

                <Image
                    source={require('./assets/manageAccount.png')}
                    resizeMode='contain'
                    style={{ width: '70%' }}
                />

                <Text style={{ fontSize: 30 }}></Text>

                <ScrollView>
                    {
                        usersData.map((param, i) => {
                            return (

                                <DropDownItem
                                    key={i}
                                    style={styles.dropdown}
                                    // contentVisible={false}
                                    // invisibleImage={IC_ARR_DOWN}
                                    // visibleImage={IC_ARR_UP}
                                    header={
                                        <View style={styles.item}>
                                            <Image
                                                source={require('./assets/users.png')}
                                                style={styles.image}
                                            />
                                            <Text style={{
                                                fontFamily: 'google-bold',
                                                fontSize: 16,
                                                color: '#404040',
                                            }}>{param.fullname}</Text>
                                        </View>
                                    }
                                >
                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: 'google-bold',
                                                fontSize: 14,
                                                color: "#808080"
                                            }}
                                        >
                                            Email: {param.email}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'google-bold',
                                                fontSize: 14,
                                                color: "#808080"
                                            }}
                                        >
                                            Phone: {param.phone}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'google-bold',
                                                fontSize: 14,
                                                color: "#808080"
                                            }}
                                        >
                                            Username: {param.username}
                                        </Text>

                                        <View style={styles.option}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    remmoveNode(param.idRoot);
                                                    setToogle(!toogle);
                                                }}
                                                style={{
                                                    width: 130,
                                                    height: 30,
                                                    marginEnd: 20,
                                                    marginStart: -10,
                                                    backgroundColor: '#f55353',
                                                    borderRadius: 7,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Image
                                                    source={require('./assets/bin.png')}
                                                    style={{
                                                        width: 15,
                                                        height: 15,
                                                        resizeMode: 'contain'
                                                    }}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('AddRoom', { idRoot: param.idRoot, fullname: param.fullname })}
                                                style={{
                                                    width: 130,
                                                    height: 30,
                                                    backgroundColor: '#f4a05b',
                                                    borderRadius: 7,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Image
                                                    source={require('./assets/add.png')}
                                                    style={{
                                                        width: 15,
                                                        height: 15,
                                                        resizeMode: 'contain'
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </DropDownItem>
                            );
                        })
                    }
                    <View style={{ height: 96 }} />
                </ScrollView>


                <View style={styles.footer}>
                    <Text style={{
                        fontFamily: 'google-bold',
                        fontSize: 15,
                        color: '#f4a05b',
                        marginStart: 30,
                    }}>accounts</Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('ManageDevice')}
                        style={{
                            with: '100%',
                            height: '100%',
                            marginStart: 100
                        }}
                    >
                        <Text style={{
                            fontFamily: 'google-bold',
                            fontSize: 15,
                            color: '#828283'
                        }}>devices</Text>
                    </TouchableOpacity>
                </View>

            </View>

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
    header: {
        flexDirection: 'row',
        width: 320,
        height: 60,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 40,
        paddingLeft: '5%'
    },
    boxOne: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 30,
        alignItems: 'center'
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        width: 315,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#e7e6e6'
    },
    dropdown: {
        margin: 5
    },
    footer: {
        flexDirection: 'row',
        // justifyContent: 'center',
        padding: 20,
        width: '100%',
        height: 60,
    },
    image: {
        resizeMode: 'contain',
        width: 15,
        height: 15,
        marginEnd: 10,
        marginStart: 5
    },
    option: {
        padding: 10,
        flexDirection: 'row',
    },
    add: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    }
});