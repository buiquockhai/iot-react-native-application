import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert, Modal, FlatList, ScrollView } from 'react-native';
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
    const [rooms, setRooms] = useState([]);
    const [bulbs, setBulbs] = useState([]);
    const [roomChoose, setRoomChoose] = useState('');
    const [roomIdChoose, setRoomIdChoose] = useState('');
    const [intensity, setIntensity] = useState('');   
    const [bulbVisible, setBulbVisible] = useState(false);
    const [firstPush, setFirstPush] = useState(true);

    useEffect(() => {
        firebase.database().ref('/listRooms').once('value', (snap) => {
            if (snap.val() != null) {
                setRooms(Object.entries(snap.val()).map(item => item[1]));
            }
        });
    }, [toogle]);

    const emptyAdd = (param) => {
        let dataTmp = param;
        dataTmp.push({});
        return dataTmp;
    };

    const updateIntensity = (roomIdParam, value) =>{
        firebase.database().ref('/listRooms/'+roomIdParam).update({
            levelLight: value === '' ? '0' : value,
        });
    }

    if (fontLoaded) {

        return (

            <View style={styles.container}>

                <View style={styles.header1}>
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
                    source={require('./assets/manageDevice.png')}
                    resizeMode='contain'
                    style={{ width: '70%' }}
                />

                <Text style={{ fontSize: 10 }}></Text>

                <View style={styles.boxTwo}>
                    <Text
                        style={{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            color: '#404040'
                        }}
                    >Rooms</Text>
                </View>

                <View style={styles.boxOne}>
                    <FlatGrid
                        itemDimension={60}
                        data={(firstPush) ? emptyAdd(rooms) : rooms}
                        style={styles.gridFlat}
                        // staticDimension={300}
                        // fixed
                        spacing={10}
                        renderItem={({ item }) => (
                            <View >
                                <TouchableOpacity
                                    onPress={() => {
                                        setBulbVisible(true);
                                        setFirstPush(false);
                                        if (item.roomsName != null) {
                                            setBulbs(Object.values(item.listBulbs));
                                            setRoomChoose(item.roomsName);
                                            setRoomIdChoose(item.roomsID);
                                            setIntensity(item.levelLight);
                                        } else {
                                            setBulbVisible(false);
                                            setBulbs([]);
                                            setRoomChoose('');
                                            navigation.navigate('AddDeviceRoom');
                                        }

                                    }}

                                    style={(item.roomsName == roomChoose) ? styles.select : styles.noSelect}
                                >
                                    <Image
                                        source={(item.roomsName == null) ? require('./assets/add.png') : null}
                                        style={(item.roomsName == null) ? {
                                            resizeMode: 'contain',
                                            width: 20,
                                            height: 20,
                                        } : null}
                                    />
                                    <Text
                                        style={(item.roomsName != null) ? {
                                            fontFamily: 'google-bold',
                                            fontSize: 15,
                                            color: '#808080'
                                        } : {
                                                fontSize: 0,
                                            }}
                                    >{item.roomsName}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>

                <View style={styles.boxTwo}>
                    <Text
                        style={{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            color: '#404040'
                        }}
                    >Devices</Text>
                </View>

                <View style={[styles.boxOne]}>
                    <FlatGrid
                        itemDimension={60}
                        data={(bulbVisible) ? emptyAdd(bulbs) : bulbs}
                        style={styles.gridFlat}
                        // staticDimension={300}
                        // fixed
                        spacing={10}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableOpacity
                                    style={(item.status) ? styles.on : styles.off}
                                >
                                    <Image
                                        source={(item.status != null) ? ((item.status) ? require('./assets/bulb.png') : require('./assets/buldOff.png')) : require('./assets/add.png')}
                                        style={(item.status != null) ? {
                                            resizeMode: 'contain',
                                            width: 30,
                                            height: 30,
                                        } : {
                                                resizeMode: 'contain',
                                                width: 20,
                                                height: 20,
                                                justifyContent: 'center',
                                            }}
                                    />
                                    <Text
                                        style={(item.status != null) ? {
                                            fontFamily: 'google-bold',
                                            fontSize: 11,
                                            color: '#808080'
                                        } : {
                                                fontSize: 0,
                                            }}
                                    >{item.bulbsName}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>

                <View style={styles.boxTwo}>
                    <Text
                        style={roomChoose!='' ?{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            color: '#404040'
                        } : {
                            fontSize: 0
                        }}
                    >Intensity</Text>
                </View>
                
                <View style={ styles.boxThree}>
                    
                    <TextInput
                        keyboardType={'decimal-pad'}
                        placeholder={'Bulb name'}
                        defaultValue={intensity}
                        onChangeText={(val) => updateIntensity(roomIdChoose, val)}
                        style={roomChoose!='' ? {
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            width: 300,
                            height: 45,
                            backgroundColor: '#e7e6e6',
                            borderRadius: 12,
                            color: '#404040',
                            textAlign: 'center',
                            //margin: 10
                        } : {
                            width: 0,
                            height: 0,
                        }}
                    />
                </View>

                {/* <View style={styles.boxTwo}>
                </View> */}

                <View style={styles.footer}>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('ManageAccount')}
                        style={{
                            with: '100%',
                            height: '100%',
                            marginStart: 30
                        }}
                    >
                        <Text style={{
                            fontFamily: 'google-bold',
                            fontSize: 15,
                            color: '#828283'
                        }}>accounts</Text>
                    </TouchableOpacity>

                    <Text style={{
                        fontFamily: 'google-bold',
                        fontSize: 15,
                        color: '#f4a05b',
                        marginStart: 100,
                    }}>devices</Text>


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
    header1: {
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
        // flex: 1,
        width: 320,
        height: 114,
        backgroundColor: '#f5f5f5',
        // paddingTop: 30,

    },
    boxTwo: {
        padding: 20,
        width: '100%',
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red'
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        width: 315,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#e7e6e6'
    },
    footer: {
        flexDirection: 'row',
        // justifyContent: 'center',
        padding: 20,
        width: '100%',
        height: 70,
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
    },
    off: {
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#e7e6e6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    on: {
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noSelect: {
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#e7e6e6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    select: {
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#f4a05b',
        backgroundColor: '#e7e6e6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gridFlat: {
        marginStart: 0
    },
    header: {
        padding: 10,
        alignItems: 'center',
        width: '100%',
        height: 30,
        marginBottom: 30
    },
    boxThree: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        alignItems: 'center',
        marginLeft: 10
    },
    
});