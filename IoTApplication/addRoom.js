import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert, Modal, FlatList, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import DropDownItem from 'react-native-drop-down-item';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import uuid from 'react-native-uuid';


export default function AddRoom({ navigation }) {

    const [toogle, setToogle] = useState('false');
    const [usersData, setUsersData] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [choose, setChoose] = useState(0);
    const [usersDataRes, setUsersDataRes] = useState([]);

    const addData = (param) => {
        firebase.database().ref('users/' + navigation.getParam('idRoot') + '/listRooms/' + uuid.v1()).set({
            roomsName: param,
            // listUserHistory: {
            //     history: {
            //         action: 'Turn off',
            //         dateTime: '000:00 May 14 2020',
            //         room: '101H1',
            //         status: 'on'
            //     }
            // }
        })
    }

    const removeData = () => {
        firebase.database().ref('/users/' + navigation.getParam('idRoot') + '/listRooms').remove();
    }

    useEffect(() => {
        firebase.database().ref('/users/' + navigation.getParam('idRoot') + '/listRooms').once('value', (snap) => {
            if (snap.val() != null) {
                setUsersData(Object.entries(snap.val()).map(item => item[1].roomsName));
                setUsersDataRes(Object.entries(snap.val()).map(item => item[1].roomsName));
            }
        });

        firebase.database().ref('/listRooms').once('value', (snap) => {
            if (snap.val() != null) {
                setRooms(Object.entries(snap.val()).map(item => item[1]));
            }
        });
    }, [toogle]);

    return (
        <View style={styles.container}>

            <TouchableOpacity
                onPress={() => navigation.navigate('ManageAccount')}
            >
                <Image
                    source={require('./assets/back.png')}
                    resizeMode='contain'
                    style={{ width: '7%' }}
                />
            </TouchableOpacity>

            <View style={styles.header}>
                <Text
                    style={{
                        fontFamily: 'google-bold',
                        fontSize: 25,
                        color: '#404040',
                    }}
                >{navigation.getParam('fullname')}</Text>
            </View>

            <FlatGrid
                itemDimension={80}
                data={rooms}
                style={styles.gridFlat}
                // staticDimension={300}
                // fixed
                spacing={20}
                renderItem={({ item }) => (
                    <View >
                        <TouchableOpacity
                            onPress={() => {
                                if (usersData.includes(item.roomsName)) {
                                    setChoose(0);
                                    setUsersData(usersData.filter(ele => ele != item.roomsName));
                                } else {
                                    let data = usersData;
                                    data.push(item.roomsName);
                                    setUsersData(data);
                                    setChoose(1);
                                }
                            }}
                            style={(usersData.includes(item.roomsName)) ? styles.selectGrid : styles.grid}
                        >
                            <Text
                                style={{
                                    fontFamily: 'google-bold',
                                    fontSize: 18,
                                    color: '#808080'
                                }}
                            >{item.roomsName}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => {
                        // remove data
                        removeData();
                        usersData.map(item => addData(item));
                        navigation.navigate('ManageAccount');
                    }}
                    style={{
                        width: 80,
                        height: 40,
                        backgroundColor: '#f4a05b',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20
                    }}
                >
                    <Text style={{
                        fontFamily: 'google-bold',
                        fontSize: 16,
                        color: '#f5f5f5'
                    }}>Save</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 40,
        paddingLeft: '5%'
    },
    grid: {
        flex: 1,
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#e7e6e6',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectGrid: {
        flex: 1,
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#e7e6e6',
        borderWidth: 1,
        borderColor: '#f4a05b',
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
    footer: {
        // flex: 1,
        width: '100%',
        height: 100,
        alignItems: 'center',
    }
})