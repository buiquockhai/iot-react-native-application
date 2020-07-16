import React, { useState, useEffect } from 'react';
import { Slider, Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, FlatList, Switch, ImageBackground } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HeaderButtons, } from 'react-navigation-header-buttons';
import { BarChart, LineChart } from "react-native-chart-kit";
import * as firebase from 'firebase';
import Sche from './schedule';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
// import * as Progress from 'react-native-progress';
import ProgressBar from 'react-native-progress/Bar';
import uuid from 'react-native-uuid';

var firebaseConfig = {
  apiKey: "AIzaSyALHh1hMM3BCqJ3c7SR_6XLVtwuwjc27sU",
  authDomain: "myproject-13f98.firebaseapp.com",
  databaseURL: "https://myproject-13f98.firebaseio.com",
  projectId: "myproject-13f98",
  storageBucket: "myproject-13f98.appspot.com",
  messagingSenderId: "665863113151",
  appId: "1:665863113151:web:d6d7e346ca299e0cd0390a",
  measurementId: "G-ZVTYSDJX51"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// var mqtt = require('mqtt/dist/mqtt')
// // var client  = mqtt.connect('mqtt://test.mosquitto.org')

// var option = {
//   clientId: "mqttjs01",
//   host: 'broker.hivemq.com',
//   // port: 1883,
//   // username: 'BKvm2',
//   // password: 'Hcmut_CSE_2020'
// }

// var client = mqtt.connect("mqtt://test.mosquitto.org");

// console.log("connected flag  " + client.connected);

// // client.on('connect', function () {
// //   client.subscribe('presence', function (err) {
// //     if (!err) {
// //       client.publish('presence', 'Hello mqtt')
// //     }
// //   })
// // })

// // client.on('message', function (topic, message) {
// //   // message is Buffer
// //   console.log(message.toString())
// //   client.end()
// // })


// class for receiving data from firebase
class User {
  constructor(fullName, email, phone, userName) {
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.userName = userName;
  }

  get getFullName() {
    return this.fullName.toString();
  }

  get getEmail() {
    return this.email.toString();
  }

  get getPhone() {
    return this.phone.toString();
  }

  get getUserName() {
    return this.userName.toString();
  }
}

let userId;
let bulbRoot;
let navi;
let user;
var roomDataOfUser = [];
var DBulbs = [];
var DSchedules = [];
var DListRoomOfUser = [];
var DListhistory = [];
//var DListIdRoom = [];
var nameOfRoom = '', DListNameRoom = [];
var DSystemHistory = [], listSystemHistory = [];

var listAllSensorHistory = [];
var listAllSensorHistoryData = [];
var serialDate = 0;
var arrayLevelLight = [];

// function data() {

// }

function ReadUserData(id) {
  //=====================================Get temporary user have ID 1, please pass ID of user =====================
  firebase.database().ref('users/' + id).on('value', function (snapshot) {
    user = new User(snapshot.val().fullname,
      snapshot.val().email,
      snapshot.val().phone,
      snapshot.val().username);

    //=============================Get list room of user ============================
    DListRoomOfUser = Object.entries(snapshot.val().listRooms != undefined ? snapshot.val().listRooms : {});
    //DListIdRoom = DListRoomOfUser.map(item => item[0]);
    if (DListRoomOfUser.length != 0) {
      DListNameRoom = DListRoomOfUser.map(item => item[1].roomsName);
      nameOfRoom = DListNameRoom[0];
      DListhistory = Object.entries(DListRoomOfUser.map(item => item[1])[DListNameRoom.indexOf(nameOfRoom)].listUserHistory != undefined ?
        DListRoomOfUser.map(item => item[1])[DListNameRoom.indexOf(nameOfRoom)].listUserHistory :
        {
          "history": {
            "action": "",
            "dateTime": "null",
            "room": "",
            "status": ""
          },
        }).map(item => item[1]);
    }

    // console.log("==========This is history of user in room ===============")

  });

  firebase.database().ref('listRooms/').on('value', function (snap) {

    // setUsersData(Object.entries(snap.val()).map(item => item[1]));
    // setUsersData(Object.entries(snap.val()));
    roomDataOfUser = Object.entries(snap.val());
    // listRoomIDName = roomDataOfUser.map(item => [item[1].roomsID, item[1].roomsName]);
    if (DListRoomOfUser.length != 0) {
      DBulbs = roomDataOfUser.map((item) => {
        for (var name of DListNameRoom) {
          if (item[1].roomsName == name) {
            return [item[1].roomsID, item[1].roomsName, item[1].listBulbs, item[1].lightSensorID, item[1].levelLight];
          }
        }
        return null;
      });
      DBulbs = DBulbs.filter(function (obj) {
        return obj != null;
      });
      //------------------------------------------------------------------------------------
      DSchedules = roomDataOfUser.map((item) => {
        for (var name of DListNameRoom) {
          if (item[1].roomsName == name) {
            return [item[1].roomsID, item[1].roomsName, item[1].listSchedules == undefined ? {} : item[1].listSchedules];
          }
        }
        return null;
      });
      DSchedules = DSchedules.filter(function (obj) {
        return obj != null;
      });
      //-----------------------------------------------------------------------------------
      // DSystemHistory = roomDataOfUser.map((item) => {
      //   for (var name of DListNameRoom) {
      //     if (item[1].roomsName == name) {
      //       if (item[1].listSystemHistory != undefined) {
      //         return item[1].listSystemHistory;
      //       }
      //       else {
      //         return {};
      //       }
      //     }
      //   }
      //   return null;
      // });
      // DSystemHistory = DSystemHistory.filter(function (obj) {
      //   return obj != null;
      // });
      // listSystemHistory = Object.entries(DSystemHistory[DListNameRoom.indexOf(nameOfRoom)]).map(item => item[1]);
      // for (var sys of listSystemHistory) {
      //   arrayTime.push(sys.dateTime);
      // }
      // for (var sys of listSystemHistory) {
      //   arrayLevelLight.push(sys.levelLight);
      // }
    }
    // console.log('===============SystemHIstory============');
    // console.log(listSystemHistory);
    // console.log("---------------------------------");
    // console.log(DSystemHistory);
  });

  // for(var i =0;i<listroomID.length;i=i+1){
  //   firebase.database().ref('listRooms/' + listroomID[i]).on('value', function (snap) {
  //     roomDataOfUser = Object.entries(snap.val());
  //     listroomID = roomDataOfUser.map(item => item[0]);

  //   });
  // }

}


//===============================================================================================

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
//----------------------------------------------MainScreen----------------------------------------------
function MainScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>

      <Image
        source={require('./assets/home.png')}
        style={{
          resizeMode: 'contain',
          width: '90%'
        }}
      />



    </View>
  );
}
function StackMain() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Home"
        component={MainScreen}
        options={{
          headerTitle: () => (
            <Text style={{ fontSize: 18, color: '#6E6E6E' }}> <Text style={{ fontWeight: 'bold', color: '#404040', fontSize: 20 }}>Home </Text></Text>
          ),

          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerRight: () => (

            <HeaderButtons>
              <TouchableOpacity style={styles.touchable}>
                <Image
                  source={require('./assets/notifi.png')}
                  style={styles.notification} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchable}>
                <Image
                  source={require('./assets/back.png')}
                  style={styles.logout} />
              </TouchableOpacity>
            </HeaderButtons>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
//----------------------------------------------RoomScreen----------------------------------------------

function VDevice({ item }) {
  // const [count, setCount] = useState(item.stateB=="1"? 1: 0);
  //console.log(item.valueF+" "+ item.valueS+" "+item.status);
  if (item.valueS > 0 && item.valueF > 0) {
    return (
      <View style={{
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ImageBackground
          source={require('./assets/bulb.png')}
          style={{
            resizeMode: 'contain',
            width: 30,
            height: 30,
          }}
        >
        </ImageBackground>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'google-bold',
            color: '#404040'
          }}
        >{item.bulbsName}</Text>

      </View >
    );
  }
  else {
    return (
      <View style={{
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#e7e6e6',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ImageBackground
          source={require('./assets/buldOff.png')}
          style={{
            resizeMode: 'contain',
            width: 30,
            height: 30,
          }}
        >
        </ImageBackground>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'google-bold',
            color: '#404040'
          }}
        >{item.bulbsName}</Text>

      </View >
    );
  }
}

function RoomScreen({ route, navigation }) {
  const [serialRoom, setSerialRoom] = useState(0);
  const numcol = 4;
  let loadpage = false;
  const [nameRoom, setNameRoom] = useState(DListRoomOfUser.length != 0 ? DBulbs[0][1] : '');
  const [isEnabled, setIsEnabled] = useState(false);
  const [bulb, setBulb] = useState(DListRoomOfUser.length != 0 ? Object.entries(DBulbs[0][2]).map(item => item[1]) : '');
  const [togglebulb, setTogglebulb] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [valuesSensor, setValuesSensor] = useState('');
  /*MUST CREATE A FUNCTION TO CALL SET FUNCTION OF USE STATE WITH IF STATEMENT
  TO READ CHANGED DATA ON FIREBASE*/
  let count = 0;
  const handleGetValue = (value) => {
    if (value != valuesSensor && count == 0) {
      setValuesSensor(value);
    }
  }
  //var valuesSensor = ''; 
  if(DBulbs[serialRoom]!=undefined){
    firebase.database().ref('listSensors/' + DBulbs[serialRoom][3]).on('value', function (snapshot) {
      handleGetValue(snapshot.val().values);
      //console.log(valuesSensor);
    });
  }
  
  // let bulbRootTmp = DListRoomOfUser.find(item => {
  //   if (item[1].roomsName == DBulbs[0][1]) return item[0];
  // });
  // bulbRoot = bulbRootTmp[0];

  const changeRoomLeft = () => {
    if (serialRoom > 0) {
      count++;
      let bulbRootTmp1 = DListRoomOfUser.find(item => {
        if (item[1].roomsName == DBulbs[serialRoom - 1][1]) return item[0];
      });
      bulbRoot = bulbRootTmp1[0];
      // window.bulbRoot;
      // console.log(window.bulbRoot);

      setNameRoom(DListRoomOfUser.length != 0 ? DBulbs[serialRoom - 1][1] : '');
      setBulb(DListRoomOfUser.length != 0 ? Object.entries(DBulbs[serialRoom - 1][2]).map(item => item[1]) : '');
      setSerialRoom(serialRoom - 1);
    }
  };
  const changeRoomRight = () => {
    if (serialRoom < (DBulbs.length - 1)) {
      count++;
      let bulbRootTmp1 = DListRoomOfUser.find(item => {
        if (item[1].roomsName == DBulbs[serialRoom + 1][1]) return item[0];
      });
      bulbRoot = bulbRootTmp1[0];
      // window.bulbRoot;
      // console.log(window.bulbRoot);

      setNameRoom(DListRoomOfUser.length != 0 ? DBulbs[serialRoom + 1][1] : '');
      setBulb(DListRoomOfUser.length != 0 ? Object.entries(DBulbs[serialRoom + 1][2]).map(item => item[1]) : '');
      setSerialRoom(serialRoom + 1);
    }
  };
  ////////////////ReLoad Schedule to update data from databse//////////////
  if (route.params != undefined) {
    if (route.params.item == 1) {
      route.params.item = 0;
      navigation.navigate('Schedule', { item: DSchedules[serialRoom] });
    }
  }

  return DListRoomOfUser.length != 0 ? (
    <View style={{ flex: 1, padding: 40, paddingLeft: '5%', backgroundColor: '#f5f5f5' }}>

      <View style={styles.header1}>
        <TouchableOpacity
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
          onPress={() => {
            roomDataOfUser = [];
            DBulbs = [];
            DSchedules = [];
            DListRoomOfUser = [];
            DListhistory = [];
            //DListIdRoom = [];
            nameOfRoom = [];
            DSystemHistory = [];
            listSystemHistory = [];
            //arrayTime = [];
            arrayLevelLight = [];
            navi.navigate('Home');
          }}
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
        source={require('./assets/manageRoom.png')}
        resizeMode='contain'
        style={{ width: '70%' }}
      />

      <View
        style={styles.titleR}
      >
        <View style={[styles.titleC, { alignItems: 'center' }]}>
          
        </View>
      </View>
      <View
        style={{ marginTop: '2%', alignItems: 'center' }}
      >
        <Text style={{ fontSize: 18, fontFamily: 'google-bold', color: '#404040' }}>
          {DBulbs[serialRoom][3]}
        </Text>
        <View style={{
          flexDirection: 'row',
        }}>
          <Text style={(DBulbs[serialRoom][3] > parseInt(DBulbs[serialRoom][4]) - 10) && (DBulbs[serialRoom][3] < parseInt(DBulbs[serialRoom][4]) + 10) 
            ? { fontSize: 30, color: '#29c270', fontFamily: 'google-bold' }
            : { fontSize: 30, color: '#c22929', fontFamily: 'google-bold' }}>
            {valuesSensor}
          </Text>
          <Text style={{ fontSize: 25, color: '#404040', }}>
            /
          </Text>
          <Text style={{ fontSize: 15, color: '#404040', fontFamily: 'google-bold', paddingTop: 15 }}>
            intensity ({parseInt(DBulbs[serialRoom][4]) - 10} - {parseInt(DBulbs[serialRoom][4]) + 10})
          </Text>
        </View>

      </View>

      <View style={styles.boxOne}>
        <FlatGrid
          itemDimension={250}
          data={bulb}
          style={styles.gridFlat}
          // staticDimension={300}
          // fixed
          spacing={10}
          renderItem={({ item }) => (
            <View >
              <Slider
                style={{ width: 250, height: 30, alignSelf: 'center' }}
                maximumValue={255}
                minimumValue={0}
                minimumTrackTintColor="#FFE671"
                maximumTrackTintColor="#000000"
                thumbTintColor="#F4A05A"
                step={1}
                value={parseInt(item.valueS)}
                onValueChange={(bright) => {

                  item.valueS = bright.toString();
                  loadpage = !togglebulb;
                  // setBrightness(bright);
                  let bulbsRef = firebase.database().ref('listRooms/' + DBulbs[serialRoom][0] + '/listBulbs/' + item.bulbsID);
                  var valueF = "0";
                  if (item.valueS > 0) {
                    valueF = "1"
                  }
                  else {
                    valueF = "0"
                  }
                  bulbsRef.update({ status: valueF > 0 ? true : false, valueF: valueF, valueS: item.valueS }).then().catch();
                  item.valueF = valueF;
                  item.status = valueF > 0 ? true : false;
                  setTogglebulb(loadpage);


                  item = {
                    device_key: item.bulbsID,
                    device_id: item.bulbsName,
                    values: [valueF, item.valueS]
                  }
                  var data = JSON.stringify(item);
                  const axios = require('axios');
                  axios.post('http://192.168.137.1:8080/api', { data })
                    .then(function (response) {
                      //console.log(response);
                    })
                    .catch(function (error) {
                      //console.log(error);
                    });
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  if (true) {
                    item.status = !(item.status);
                    loadpage = !togglebulb;
                    let bulbsRef = firebase.database().ref('listRooms/' + DBulbs[serialRoom][0] + '/listBulbs/' + item.bulbsID);
                    bulbsRef.update({ status: item.status, valueF: item.status ? '1' : '0' }).then().catch();
                    item.valueF = item.status ? '1' : '0';
                    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    let date = new Date();
                    if (bulbRoot == null || bulbRoot == undefined) {
                      let bulbRootTmp = DListRoomOfUser.find(item => {
                        if (item[1].roomsName == DBulbs[0][1]) return item[0];
                      });
                      bulbRoot = bulbRootTmp[0];
                    }
                    // console.log(bulbRoot);
                    let bulbHisRef = firebase.database().ref('users/' + userId + '/listRooms/' + bulbRoot + '/listUserHistory/' + uuid.v4());
                    if (item.status) {
                      bulbHisRef.set({
                        action: 'Turn on',
                        dateTime: date.getHours() + ':' + date.getMinutes() + ' ' + months[date.getMonth()] + ' ' + date.getDay() + ' ' + date.getFullYear(),
                        room: item.bulbsName,
                        status: 'on'
                      })
                    } else {
                      bulbHisRef.set({
                        action: 'Turn off',
                        dateTime: date.getHours() + ':' + date.getMinutes() + ' ' + months[date.getMonth()] + ' ' + date.getDay() + ' ' + date.getFullYear(),
                        room: item.bulbsName,
                        status: 'off'
                      })
                    }

                    item = {
                      device_key: item.bulbsID,
                      device_id: item.bulbsName,
                      values: [item.status ? "1" : "0", item.valueS]
                    }
                    var data = JSON.stringify(item);
                    const axios = require('axios');
                    axios.post('http://192.168.137.1:8080/api', { data })
                      .then(function (response) {
                        //console.log(response);
                      })
                      .catch(function (error) {
                        //console.log(error);
                      });

                    setTogglebulb(loadpage);
                  }
                }}
                style={styles.ItemDevice}
              >
                <VDevice item={item} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View style={styles.boxTwo0}>
        <TouchableOpacity
          style={styles.buttonschedule}
          onPress={() =>
            navigation.navigate('Schedule', { item: DSchedules[serialRoom] })
          }
        >
          <Image
            source={require('./assets/schedule.png')}
            style={{ resizeMode: 'contain', width: '50%', height: '50%' }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.transroom}>
        <TouchableOpacity
          onPress={changeRoomLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 25, fontFamily: 'google-bold', color: '#404040' }}

        > {nameRoom} </Text>
        <TouchableOpacity
          onPress={changeRoomRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
      </View>
    </View >
  ) :
    (
      <View style={{ flex: 1, padding: 40, paddingLeft: '5%', backgroundColor: '#f5f5f5' }}>

        <View style={styles.header1}>
          <TouchableOpacity
            // onPress={() => setToogle(!toogle)}
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
            onPress={() => {
              roomDataOfUser = [];
              DBulbs = [];
              DSchedules = [];
              DListRoomOfUser = [];
              DListhistory = [];
              //DListIdRoom = [];
              nameOfRoom = [];
              DSystemHistory = [];
              listSystemHistory = [];
              //arrayTime = [];
              arrayLevelLight = [];
              navi.navigate('Home');
            }}
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
          source={require('./assets/manageRoom.png')}
          resizeMode='contain'
          style={{ width: '70%' }}
        />

        <View
          style={styles.titleR}
        >
          <View style={[styles.titleC, { alignItems: 'center' }]}>
            <Text
              style={{ fontSize: 14, fontFamily: 'google-bold', color: '#808080', textAlign: 'center' }}
            >Contact to admin to have privilege for managing rooms yours</Text>
          </View>
        </View>
      </View >
    );
}

function stackRoomScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Room Management"
        component={RoomScreen}
        options={{
          // headerTitle: () => (
          //   <Text style={{ fontSize: 18, color: '#6E6E6E' }}> <Text style={{ fontWeight: 'bold', color: '#404040', fontSize: 20 }}>Room </Text> Management</Text>
          // ),

          // headerStyle: {
          //   backgroundColor: '#f5f5f5',
          // },
          // headerRight: () => (

          // <HeaderButtons>
          //   <TouchableOpacity style={styles.touchable}>
          //     <Image
          //       // source={require('./assets/notifi.png')}
          //       style={styles.notification} />
          //   </TouchableOpacity>
          //   <TouchableOpacity style={styles.touchable}>
          //     <Image
          //       source={require('./assets/back.png')}
          //       style={styles.logout} />
          //   </TouchableOpacity>
          // </HeaderButtons>
          // ),
        }}
      />

      <Stack.Screen
        name="Schedule"
        component={Sche}
        options={{
          headerTitle: () => (
            <Text style={{ fontSize: 18, color: 'red' }}> <Text style={{ fontFamily: 'google-bold', color: '#404040', fontSize: 20 }}>Schedule </Text></Text>
          ),

          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
        }}
      />
    </Stack.Navigator>
  )
}

//--------------------------------------------------AccountScreen----------------------------------------------------------
function Account() {
  //use for update info
  const [username, setUsername] = useState(user.getUserName);
  const [fullname, setFullname] = useState(user.getFullName);
  const [email, setEmail] = useState(user.getEmail);
  const [phone, setPhone] = useState(user.getPhone);

  const UpdateUserData = () => {
    firebase.database().ref('users/1').update({
      fullname: fullname,
      email: email,
      phone: phone,
      username: username,
    });
  }
  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <View style={styles.container}>

        <View style={styles.header1}>
          <TouchableOpacity
            // onPress={() => setToogle(!toogle)}
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
            onPress={() => {
              roomDataOfUser = [];
              DBulbs = [];
              DSchedules = [];
              DListRoomOfUser = [];
              DListhistory = [];
              //DListIdRoom = [];
              nameOfRoom = [];
              DSystemHistory = [];
              listSystemHistory = [];
              //arrayTime = [];
              arrayLevelLight = [];
              navi.navigate('Home')
            }}
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

        <Image
          source={require('./assets/avatar.png')}
          style={styles.avatar}
          resizeMode='center' />

        <View style={styles.boxOne1}>
          <View style={styles.boxTwo}>
            <Image
              source={require('./assets/users.png')}
              style={styles.imageStyle}
            />
            <TextInput
              style={styles.input}
              placeholder='Name'
              defaultValue={fullname}
              onChangeText={(val) => setFullname(val)}
              keyboardType='default'
              style={styles.textInput}
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
              placeholder="Email"
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
              placeholder="Phone"
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
              placeholder="Username"
              underlineColorAndroid="transparent"
            />
          </View>

          <TouchableOpacity
            onPress={UpdateUserData}
            style={{
              backgroundColor: '#f4a05b',
              width: '25%',
              height: 45,
              margin: 10,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center'
            }}
          >
            <Text style={{
              fontFamily: 'google-bold',
              fontSize: 18,
              color: '#f5f5f5'
            }}>save</Text>
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
function stackAccountScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Account Management"
        component={Account}
        options={{
          //   headerTitle: () => (
          //     <Text style={{ fontSize: 18, color: '#6E6E6E' }}> <Text style={{ fontWeight: 'bold', color: '#404040', fontSize: 20 }}>Account </Text> Management</Text>
          //   ),

          //   headerStyle: {
          //     backgroundColor: '#f5f5f5',
          //   },
          //   headerRight: () => (

          //     <HeaderButtons>
          //       <TouchableOpacity style={styles.touchable}>
          //         <Image
          //           source={require('./assets/notifi.png')}
          //           style={styles.notification} />
          //       </TouchableOpacity>
          //       <TouchableOpacity style={styles.touchable}>
          //         <Image
          //           source={require('./assets/back.png')}
          //           style={styles.logout} />
          //       </TouchableOpacity>
          //     </HeaderButtons>
          //   ),
        }}
      />
    </Stack.Navigator>
  )
}

//----------------------------------------------------HistoryScreen------------------------------------------------------------
const screenWidth = Dimensions.get("window").width;
const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#E7E7E7",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(92, 92, 92, ${opacity})`,
  barPercentage: 0.5,
};

var data = {
  labels: [],
  datasets: [
    {
      data: []
    }
  ]
};
const styleBarChart = {
  paddingTop: 10,
  marginVertical: '2%',
  borderRadius: 16
}

function statusToImage(status) {
  var imagePath = '';
  if (status.toLowerCase() == 'on') {
    imagePath = require('./assets/interface(5).png');
  }
  else {
    imagePath = require('./assets/interface(6).png');
  }

  return imagePath;
}

const CustomRow = ({ title, description, image_path, room }) => (
  <View style={styles.container1}>
    <Image source={image_path} style={styles.photo} />
    <Text style={styles.room}>{room}</Text>
    <View style={styles.container_text}>
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={styles.description}>
        {description}
      </Text>
    </View>
  </View>
);

const CustomListview = ({ itemList }) => (
  <View style={styles.container2}>
    <FlatList
      data={itemList}
      renderItem={({ item }) => <CustomRow
        title={item.dateTime}
        description={item.action}
        image_path={statusToImage(item.status)}
        room={item.room}
      />}
      keyExtractor={(item, index) => index.toString()}
    />

  </View>
);

function isEmptyObject(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

function History() {
  const [serialRoom, setSerialRoom] = useState(0);
  // const [serialDate, setSerialDate] = useState(0);
  const [sensorHistory, setSensorHistory] = useState({});
  const [allSensorHistory, setAllSensorHistory] = useState({});
  //const [listAllSensorHistory, setListAllSensorHistory] = useState([]);
  const [toggle, setToggle] = useState(false);
  var arrayTime = [], arrayLevelLight = [];
  var time = new Date();
  var currentDate = time.toISOString().split('T')[0];

  const handleSensorHistory = (value) => {
    if (!(JSON.stringify(value) === JSON.stringify(allSensorHistory))) {
      setAllSensorHistory(value);
      //setListAllSensorHistory(Object.entries(value).map(item => item[0]));
      listAllSensorHistory = Object.entries(value).map(item => item[0]);
      listAllSensorHistoryData = Object.entries(value).map(item => item[1]);

      //setSerialDate(Object.entries(value).map(item => item[0]).length-1);
      serialDate = Object.entries(value).map(item => item[0]).length - 1;
    }
    if (!listAllSensorHistory.includes(currentDate) && listAllSensorHistory.length > 0) {
      listAllSensorHistory.push(currentDate);
      serialDate += 1;
    }
    else if (!listAllSensorHistory.includes(currentDate) && listAllSensorHistory.length == 0) {
      listAllSensorHistory.push(currentDate);
    }
  }
  if(DBulbs[serialRoom]!= undefined){
    firebase.database().ref('listSensors/' + DBulbs[serialRoom][3] + '/sensorHistory').on('value', function (snapshot) {
      handleSensorHistory(snapshot.val() != undefined ? snapshot.val() : {});
    });
  }
  //console.log(allSensorHistory);
  // console.log(listAllSensorHistory);
  // console.log(serialDate+"-----");

  const handleGetValue = (value) => {
    //console.log(!(JSON.stringify(value) === JSON.stringify(sensorHistory)));
    if (!(JSON.stringify(value) === JSON.stringify(sensorHistory))) {
      //console.log(value);
      setSensorHistory(value);
    }
  }

  //var valuesSensor = ''; 
  if(DBulbs[serialRoom]!= undefined){
    firebase.database().ref('listSensors/' + DBulbs[serialRoom][3] + '/sensorHistory/' + listAllSensorHistory[serialDate]).on('value', function (snapshot) {
      //console.log(snapshot.val());
      handleGetValue(snapshot.val() != undefined ? snapshot.val() : {});
    });
  }
  
  //console.log(sensorHistory)
  arrayTime = Object.entries(sensorHistory).map(item => item[0]);
  arrayLevelLight = Object.entries(sensorHistory).map(item => item[1]);
  if (arrayTime.length >= 1) {
    arrayTime.unshift("0");
  }
  if (arrayLevelLight.length >= 1) {
    arrayLevelLight.unshift("0");
  }

  //console.log(Object.entries(sensorHistory).map(item => item[1]) );

  // console.log(arrayTime);
  // console.log(arrayLevelLight);
  data = {
    labels: arrayTime,
    datasets: [
      {
        data: arrayLevelLight
      }
    ]
  };

  const changeDateLeft = () => {
    //console.log(listAllSensorHistory[serialDate - 1]);
    if (serialDate > 0) {
      serialDate -= 1;
      var temp = listAllSensorHistoryData[serialDate];
      arrayTime = temp != null ? Object.entries(temp).map(item => item[0]) : [];
      arrayLevelLight = temp != null ? Object.entries(temp).map(item => item[1]) : [];
      data = {
        labels: arrayTime,
        datasets: [
          {
            data: arrayLevelLight
          }
        ]
      };
      setToggle(!toggle);
      //setSerialDate(setSerialDate - 1);
    }
    // console.log("------------");
    // console.log(arrayTime);
    // console.log(arrayLevelLight);
    // console.log(serialDate);
    // console.log(listAllSensorHistory);
  };

  const changeDateRight = () => {
    //console.log(listAllSensorHistory[serialDate + 1]);
    if (serialDate < (listAllSensorHistory.length - 1)) {
      serialDate += 1;
      var temp = listAllSensorHistoryData[serialDate];
      arrayTime = temp != null ? Object.entries(temp).map(item => item[0]) : [];
      arrayLevelLight = temp != null ? Object.entries(temp).map(item => item[1]) : [];
      data = {
        labels: arrayTime,
        datasets: [
          {
            data: arrayLevelLight
          }
        ]
      };
      setToggle(!toggle);
      //setSerialDate(setSerialDate + 1);
      // console.log("++++++++++++");
      // console.log(arrayTime);
      // console.log(arrayLevelLight);
      // console.log(serialDate);
      // console.log(listAllSensorHistory);
    }
  };


  const [nameRoom, setNameRoom] = useState(DListRoomOfUser.length != 0 ? DBulbs[0][1] : '');
  const changeRoomLeft = () => {
    if (serialRoom > 0) {
      setNameRoom(DListRoomOfUser.length != 0 ? DBulbs[serialRoom - 1][1] : '');
      nameOfRoom = DListRoomOfUser.length != 0 ? DBulbs[serialRoom - 1][1] : '';
      // DListhistory = DListRoomOfUser.length != 0 ? Object.entries(DListRoomOfUser.map(item => item[1])[DListNameRoom.indexOf(nameOfRoom)].listUserHistory != undefined ?
      //   DListRoomOfUser.map(item => item[1])[DListNameRoom.indexOf(nameOfRoom)].listUserHistory :
      //   {
      //     "history": {
      //       "action": "",
      //       "dateTime": "null",
      //       "room": "",
      //       "status": ""
      //     },
      //   }).map(item => item[1]) : [];
      // //----------------------------------------------------------------------------------------------------
      // listSystemHistory = DListRoomOfUser.length != 0 ? Object.entries(DSystemHistory[DListNameRoom.indexOf(nameOfRoom)]).map(item => item[1]) : [];
      //console.log(DListhistory);
      // arrayTime.length = 0;
      // arrayLevelLight.length = 0;
      if (DListRoomOfUser.length != 0) {
        var time = new Date();
        var currentDate = time.toISOString().split('T')[0];
        //var valuesSensor = ''; 
        firebase.database().ref('listSensors/' + DBulbs[serialRoom - 1][3] + "/sensorHistory/" + currentDate).on('value', function (snapshot) {
          //console.log(snapshot.val());
          handleGetValue(snapshot.val() != undefined ? snapshot.val() : {});
        });
        arrayTime = Object.entries(sensorHistory).map(item => item[0]);
        arrayLevelLight = Object.entries(sensorHistory).map(item => item[1]);
        if (arrayTime.length >= 1) {
          arrayTime.unshift("0");
        }
        if (arrayLevelLight.length >= 1) {
          arrayLevelLight.unshift("0");
        }

        // for (var sys of listSystemHistory) {
        //   arrayTime.push(sys.dateTime);
        // }
        // for (var sys of listSystemHistory) {
        //   arrayLevelLight.push(sys.levelLight);
        // }
        //console.log(arrayTime);
        data = {
          labels: arrayTime,
          datasets: [
            {
              data: arrayLevelLight
            }
          ]
        };
        setSerialRoom(serialRoom - 1);
      }
    }
  };
  const changeRoomRight = () => {
    if (serialRoom < (DBulbs.length - 1)) {
      setNameRoom(DListRoomOfUser.length != 0 ? DBulbs[serialRoom + 1][1] : '');
      nameOfRoom = DListRoomOfUser.length != 0 ? DBulbs[serialRoom + 1][1] : '';
      // DListhistory = DListRoomOfUser.length != 0 ? Object.entries(DListRoomOfUser.map(item => item[1])[DListNameRoom.indexOf(nameOfRoom)].listUserHistory != undefined ?
      //   DListRoomOfUser.map(item => item[1])[DListNameRoom.indexOf(nameOfRoom)].listUserHistory :
      //   {
      //     "history": {
      //       "action": "",
      //       "dateTime": "null",
      //       "room": "",
      //       "status": ""
      //     },
      //   }).map(item => item[1]) : [];
      // //------------------------------------------------
      // listSystemHistory = DListRoomOfUser.length != 0 ? Object.entries(DSystemHistory[DListNameRoom.indexOf(nameOfRoom)]).map(item => item[1]) : [];
      //console.log(listSystemHistory);
      // arrayTime.length = 0;
      // arrayLevelLight.length = 0;
      if (DListRoomOfUser.length != 0) {
        var time = new Date();
        var currentDate = time.toISOString().split('T')[0];
        //var valuesSensor = ''; 
        //console.log(currentDate);
        firebase.database().ref('listSensors/' + DBulbs[serialRoom + 1][3] + "/sensorHistory/" + currentDate).on('value', function (snapshot) {
          //console.log(snapshot.val());
          handleGetValue(snapshot.val() != undefined ? snapshot.val() : {});
        });
        //console.log(sensorHistory);
        arrayTime = Object.entries(sensorHistory).map(item => item[0]);
        arrayLevelLight = Object.entries(sensorHistory).map(item => item[1]);
        if (arrayTime.length >= 1) {
          arrayTime.unshift("0");
        }
        if (arrayLevelLight.length >= 1) {
          arrayLevelLight.unshift("0");
        }

        // for (var sys of listSystemHistory) {
        //   arrayTime.push(sys.dateTime);
        // }
        // for (var sys of listSystemHistory) {
        //   arrayLevelLight.push(sys.levelLight);
        // }
        // console.log(arrayTime);
        // console.log(arrayLevelLight);
        data = {
          labels: arrayTime,
          datasets: [
            {
              data: arrayLevelLight
            }
          ]
        };
        setSerialRoom(serialRoom + 1);
      }
      // for(var sys of arrayLevelLight){
      //   console.log(sys);
      // }
      //console.log(data);
    }
  };
  //console.log(!isEmptyObject(sensorHistory) && Object.keys(sensorHistory).length > 1 );
  //console.log(!isEmptyObject(sensorHistory));
  //console.log(arrayLevelLight.length > 1);
  return (!isEmptyObject(sensorHistory) && arrayLevelLight.length > 1) ? (
    <View style={styles.container}>

      <View style={styles.header1}>
        <TouchableOpacity
          // onPress={() => setToogle(!toogle)}
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
          onPress={() => {
            roomDataOfUser = [];
            DBulbs = [];
            DSchedules = [];
            DListRoomOfUser = [];
            DListhistory = [];
            //DListIdRoom = [];
            nameOfRoom = [];
            DSystemHistory = [];
            listSystemHistory = [];
            //arrayTime = [];
            arrayLevelLight = [];
            navi.navigate('Home');
          }}
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

      {/* <Image
        source={require('./assets/manageHistory.png')}
        resizeMode='contain'
        style={{ width: '70%' }}
      /> */}

      <Text style={styles.titleName}>statistics</Text>
      <LineChart
        style={styleBarChart}
        data={toggle ? data : data}
        width={screenWidth * 0.9}
        height={160}
        withVerticalLabels={false}
        //yAxisSuffix="%"
        chartConfig={chartConfig}
        bezier
      />

      <View style={{
        marginTop: 8,
        marginStart: -15,
        marginBottom: 0,
        width: 400,
        height: 25,
        alignItems: 'center',
        // justifyContent: 'center',
        marginStart: 50,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
      }}>
        <TouchableOpacity
          onPress={changeDateLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'#808080'} size={25} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 16, fontFamily: 'google-bold', color: '#404040' }}

        > {listAllSensorHistory[serialDate]} </Text>
        <TouchableOpacity
          onPress={changeDateRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'#808080'} size={25} />
        </TouchableOpacity>
      </View>



      <Text style={styles.titleName}>tasks</Text>
      <Text style={{ fontSize: 10 }}></Text>

      <View style={{
        height: 124
      }}>
        <CustomListview style={styles.customList}
          itemList={DListhistory}
        />
      </View>
      {/* <View style={styles.changeHistory}>
        <TouchableOpacity
          onPress={changeRoomLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'gray'} size={30} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 25, fontFamily: 'google-bold' }}

        > {nameRoom} </Text>
        <TouchableOpacity
          onPress={changeRoomRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'gray'} size={30} />
        </TouchableOpacity>
      </View> */}

      <View style={{
        marginTop: 8,
        marginStart: -15,
        marginBottom: 0,
        width: 400,
        height: 55,
        alignItems: 'center',
        // justifyContent: 'center',
        marginStart: 50,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
      }}>
        <TouchableOpacity
          onPress={changeRoomLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 25, fontFamily: 'google-bold', color: '#404040' }}

        > {nameRoom} </Text>
        <TouchableOpacity
          onPress={changeRoomRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
      </View>

    </View>
  ) : (DListRoomOfUser.length!=0) ?
    (<View style={styles.container}>

      <View style={styles.header1}>
        <TouchableOpacity
          // onPress={() => setToogle(!toogle)}
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
          onPress={() => {
            roomDataOfUser = [];
            DBulbs = [];
            DSchedules = [];
            DListRoomOfUser = [];
            DListhistory = [];
            //DListIdRoom = [];
            nameOfRoom = [];
            DSystemHistory = [];
            listSystemHistory = [];
            //arrayTime = [];
            arrayLevelLight = [];
            navi.navigate('Home');
          }}
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

      {/* <Image
        source={require('./assets/manageHistory.png')}
        resizeMode='contain'
        style={{ width: '70%' }}
      /> */}

      <Text style={styles.titleName}>statistics</Text>
      <View
        style={styles.titleR}
      >
        <View style={[styles.titleC, { alignItems: 'center' }]}>
          <Text
            style={{ fontSize: 14, fontFamily: 'google-bold', color: '#808080' }}
          >Could not find history</Text>
          <Text style={{ fontSize: 104, }}></Text>
        </View>
      </View>

      <View style={{
        marginTop: 8,
        marginStart: -15,
        marginBottom: 0,
        width: 400,
        height: 25,
        alignItems: 'center',
        // justifyContent: 'center',
        marginStart: 50,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
      }}>
        <TouchableOpacity
          onPress={changeDateLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'#808080'} size={25} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 16, fontFamily: 'google-bold', color: '#404040' }}

        > {listAllSensorHistory[serialDate]} </Text>
        <TouchableOpacity
          onPress={changeDateRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'#808080'} size={25} />
        </TouchableOpacity>
      </View>

      <Text style={styles.titleName}>tasks</Text>
      <Text style={{ fontSize: 10 }}></Text>

      <View style={{
        height: 124
      }}>
        <CustomListview style={styles.customList}
          itemList={DListhistory}
        />
      </View>
      {/* <View style={styles.changeHistory}>
        <TouchableOpacity
          onPress={changeRoomLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'gray'} size={30} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 25, fontFamily: 'google-bold' }}

        > {nameRoom} </Text>
        <TouchableOpacity
          onPress={changeRoomRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'gray'} size={30} />
        </TouchableOpacity>
      </View> */}

      <View style={{
        marginTop: 8,
        marginStart: -15,
        marginBottom: 0,
        width: 400,
        height: 55,
        alignItems: 'center',
        // justifyContent: 'center',
        marginStart: 50,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
      }}>
        <TouchableOpacity
          onPress={changeRoomLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 25, fontFamily: 'google-bold', color: '#404040' }}

        > {nameRoom} </Text>
        <TouchableOpacity
          onPress={changeRoomRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
      </View>


    </View>) :
    (
      <View style={{ flex: 1, padding: 40, paddingLeft: '5%', backgroundColor: '#f5f5f5' }}>

        <View style={styles.header1}>
          <TouchableOpacity
            // onPress={() => setToogle(!toogle)}
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
            onPress={() => {
              roomDataOfUser = [];
              DBulbs = [];
              DSchedules = [];
              DListRoomOfUser = [];
              DListhistory = [];
              //DListIdRoom = [];
              nameOfRoom = [];
              DSystemHistory = [];
              listSystemHistory = [];
              //arrayTime = [];
              arrayLevelLight = [];
              navi.navigate('Home');
            }}
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
          source={require('./assets/manageHistory.png')}
          resizeMode='contain'
          style={{ width: '70%' }}
        />

        <View
          style={styles.titleR}
        >
          <View style={[styles.titleC, { alignItems: 'center' }]}>
            <Text
              style={{ fontSize: 14, fontFamily: 'google-bold', color: '#808080', textAlign: 'center' }}
            >No data</Text>
          </View>
        </View>
      </View >
    );;
}


function stackHistoryScreen() {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="History Management"
        component={History}
        options={{
          // headerTitle: () => (
          //   <Text style={{ fontSize: 18, color: '#6E6E6E' }}> <Text style={{ fontFamily: 'google-bold', color: '#404040', fontSize: 20 }}>History </Text> Management</Text>
          // ),
          // headerStyle: {
          //   backgroundColor: '#f5f5f5',
          // },
          // headerRight: () => (

          //   <HeaderButtons>
          //     <TouchableOpacity style={styles.touchable}>
          //       <Image
          //         source={require('./assets/notifi.png')}
          //         style={styles.notification} />
          //     </TouchableOpacity>
          //     <TouchableOpacity style={styles.touchable}>
          //       <Image
          //         source={require('./assets/back.png')}
          //         style={styles.logout} />
          //     </TouchableOpacity>
          //   </HeaderButtons>
          // ),
        }}
      />
    </Stack.Navigator>
  );
}

//---------------------------------------------Tabs for room, account and history------------------------------------------------------------
function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="MainScreen"
      tabBarOptions={{
        style: {
          height: '8%',
          backgroundColor: 'white',
        },
        activeTintColor: '#F4A05C',
        tabStyle: {
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        },
        labelStyle: {
          fontFamily: 'google-bold',
          fontSize: 15,
          margin: 0,
          padding: 0,
        },

      }}
    >
      <Tab.Screen
        name="MainScreen"
        component={StackMain}
        options={{
          tabBarLabel: 'home',
          backgroundColor: '#F5F5F5',
        }}
      />
      <Tab.Screen
        name="Room"
        component={stackRoomScreen}
        options={{
          tabBarLabel: 'rooms',
          backgroundColor: '#f5f5f5',
        }}
      />
      <Tab.Screen
        name="Account"
        component={stackAccountScreen}
        options={{
          tabBarLabel: 'account',
          backgroundColor: '#F5F5F5',
        }}
      />
      <Tab.Screen
        name="History"
        component={stackHistoryScreen}
        options={{
          tabBarLabel: 'history',
          backgroundColor: '#F5F5F5',

        }}
      />
    </Tab.Navigator>
  );
}

//=======================================Function to export=========================================

const getFonts = () => Font.loadAsync({
  'google-bold': require('./assets/font/ProductSans-Black.ttf'),
});

const setNavi = (naviParam) => {
  navi = naviParam;
}

const setUserId = (userIdParam) => {
  userId = userIdParam;
}

export default function ManagementView({ navigation }) {

  const [fontLoaded, setFontLoaded] = useState(false);
  setNavi(navigation);
  setUserId(navigation.getParam('root'));
  ReadUserData(navigation.getParam('root'));

  if (fontLoaded) {
    return (
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => setFontLoaded(true)}
      />
    )
  }

}

//=========================================Styles===========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    // height: '100%',
    backgroundColor: '#f5f5f5',
    paddingStart: '5%',
  },
  touchable: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#E7E6E6',
    margin: 6,
    paddingLeft: '4%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notification: {
    width: 20,
    height: 20,
  },
  logout: {
    width: 20,
    height: 20,
  },
  // for account
  avatar: {
    // position: 'absolute',
    // top: -40,
    resizeMode: 'contain',
    alignItems: 'center',
    alignSelf: 'center'
    // width: '50%',
  },
  input: {
    flex: 1,
    paddingLeft: 20,
    width: '100%',
    height: 45,
  },
  info: {
    // position: 'absolute',
    // top: '20%',
    height: 45,
    width: '100%',
    // padding: 10,
  },
  buttonSave: {
    // top: '85%',
    width: '30%',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f4a05b',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    fontSize: 16,
    borderColor: '#f4a05b',
    textAlign: 'left',
    backgroundColor: '#e7e6e6',
    margin: '5%',
    paddingTop: 5,
    paddingBottom: 10,
  },
  icon: {
    paddingTop: 0,
    marginLeft: 25,
  },

  //for list history
  titleName: {
    fontSize: 17,
    fontFamily: 'google-bold',
    textAlign: 'left',
    paddingTop: '3%',
    paddingRight: '70%',
    color: '#404040'
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    //borderRadius: 5,
    backgroundColor: '#f5f5f5',
    //elevation: 2,
    width: '100%',
    height: '40%'
  },
  title: {
    fontSize: 14,
    color: '#404040',
    fontFamily: 'google-bold'
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 120,
    borderBottomLeftRadius: 120,
    paddingLeft: '12%',
    paddingBottom: 12,
    paddingTop: 12,

  },
  description: {
    fontFamily: 'google-bold',
    color: '#808080',
    fontSize: 12,
  },
  photo: {
    marginTop: '4%',
    height: 20,
    width: 20,
  },
  container2: {
    flex: 1,
    width: 340,
    height: 150,
  },
  customList: {
    marginTop: 10,
    flex: 1,
    width: '100%',
    height: '40%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  room: {
    fontFamily: 'google-bold',
    marginLeft: '3%',
    marginRight: '3%',
    marginTop: '5%',
    fontSize: 14,
    color: '#404040',
  },
  boxTwo0: {
    padding: 20,
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonschedule: {
    marginTop: 20,
    width: 50,
    height: 50,
    backgroundColor: '#F4A05B',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonrightheader: {
    width: '30%',
    backgroundColor: '#E7E6E6',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleR: {
    marginTop: 10,
  },
  titleC: {
    marginTop: '5%',
  },
  transroom: {
    marginTop: 20,
    marginStart: -15,
    marginBottom: 0,
    width: 400,
    height: 65,
    alignItems: 'center',
    // justifyContent: 'center',
    marginStart: 50,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  btnleftright: {
    width: '15%',
    height: '40%',
    backgroundColor: '#E7E6E6',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  ItemDevice: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    marginVertical: 0,
    marginHorizontal: 0,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // paddingLeft: -10
  },
  ItemDevicesList: {
    flex: 1,
    marginVertical: '5%',
    marginHorizontal: '5%',
  },
  Viewdevice: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    // marginBottom: 0,
    width: '100%',
    height: '40%',
    // backgroundColor : 'white',
  },

  //---------------------------------
  changeHistory: {
    paddingTop: 30,
    marginTop: '2%',
    marginBottom: 0,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 60,
  },
  header1: {
    flexDirection: 'row',
    width: 320,
    height: 60,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOne: {
    // flex: 1,
    width: '100%',
    height: 220,
    backgroundColor: '#f5f5f5',
    // paddingTop: 20,
    // paddingStart: 10,
    alignItems: 'center',

  },
  boxOne1: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
    paddingStart: 10,
    alignItems: 'center',

  },
  gridFlat: {
    marginStart: 0,
    // alignContent: 'center',
    //alignItems: 'center',
    alignSelf: 'center',

  },
  // boxOne: {
  //   flex: 1,
  //   backgroundColor: '#f5f5f5',
  //   paddingTop: 20,
  //   alignItems: 'center'
  // },
  boxTwo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7e6e6',
    height: 45,
    width: '100%',
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
});

