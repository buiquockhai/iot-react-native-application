import * as React from 'react';
import { useState } from 'react';
import { Text, View, ScrollView, Alert, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
// import ListView from 'deprecated-react-native-listview';
// import { Container, Header, Content, List, ListItem, Button, Icon } from 'native-base';
import { LocaleConfig } from 'react-native-calendars';
import { Calendar, CalendarList, Agenda, } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

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

function Shownote({ item, day }) {
    if (item[0] == day) {
        return (
            <Text style={[styles.fontsizetext,{color:'#dbd0d0'}]}>
                {item[2].timeFrom}  - - - - - - -  {item[2].timeTo}
            </Text>
        );
    }
    else {
        return (
            <View />
        );
    }
};
export default function scheduled({ route, navigation }) {
    var dataSchedule = [];
    const roomid = route.params.item[0];
    var listSchedule = Object.entries(route.params.item[2]).map(item => [item[0], Object.entries(item[1])]);
    /////////////////Flatting List//////////////////////////////////
    if (listSchedule.length > 0) {
        for (var i = 0; i < listSchedule.length; i = i + 1) {
            for (var j = 0; j < listSchedule[i][1].length; j = j + 1) {
                /////////////////////////Day////////////////IDTime//////////////////Object(timeFrom, timeTo)
                dataSchedule.push([listSchedule[i][0], listSchedule[i][1][j][0], listSchedule[i][1][j][1]]);
            }
        }
    }
    listSchedule = null;
    ///////////////////////////////////////////////////////////////////
    let pageload = false;
    const [toggleLoad, setToggleLoad] = useState(false);
    const [selDay, setSelDay] = useState((new Date()).toISOString().split('T')[0]);
    const [markedDay, setMarkedDay] = useState((new Date()).toISOString().split('T')[0]);
    let dateinit = new Date();
    const [timef, setTimef] = useState(new Date());
    const [timet, setTimet] = useState(new Date());
    const [ftimeinit, setFtimeinit] = useState('00:00:00');
    const [ftimef, setFtimef] = useState(ftimeinit);
    const [ftimet, setFtimet] = useState(ftimeinit);
    const [showtimefrom, setShowtimefrom] = useState(false);
    const [showtimeto, setShowtimeto] = useState(false);

    const timetoinit = () => {
        setFtimet(ftimeinit);
    };
    const timefrominit = () => {
        setFtimef(ftimeinit);
    };
    const onChangef = (event, selectedDate) => {
        if (selectedDate) {
            const stringtime = selectedDate.toISOString().split('T')[1];
            const currentDate = new Date(markedDay + 'T' + stringtime);
            // console.log('test', currentDate);
            setTimef(currentDate);
            const time = selectedDate.toTimeString().split(' ')[0];
            setFtimef(time);
            setShowtimefrom(false);
        }
        else {
            timefrominit();
            setShowtimefrom(false);
        }

    };
    const onChanget = (event, selectedDate) => {
        if (selectedDate) {
            const stringtime = selectedDate.toISOString().split('T')[1];
            const currentDate = new Date(markedDay + 'T' + stringtime);
            // console.log('test', currentDate);
            setTimet(currentDate);
            const time = selectedDate.toTimeString().split(' ')[0];
            setFtimet(time);
            setShowtimeto(false);
        }
        else {
            timetoinit();
            setShowtimeto(false);
        }

    };
    const actionadd = () => {
        if ((ftimet == ftimeinit) || (ftimef == ftimeinit)) {
            Alert.alert(
                "Alert",
                "You should choose time",
                [
                    {
                        text: "Cancel",
                        onPress: () => <View />,
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => <View /> }
                ],
                { cancelable: false }
            );
        }
        else if (timet <= timef) {
            Alert.alert(
                "OOPS",
                "Goal time can not less than or equal source time",
                [
                    {
                        text: "Cancel",
                        onPress: () => <View />,
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => <View /> }
                ],
                { cancelable: false }
            );
        }
        else {
            let checkdouble = false;
            // for(var i = 0;i<dataSchedule.length;i=i+1){
            //     if(markedDay == dataSchedule[i][0]){
            //         let tempf = new Date(markedDay+ ' ' +dataSchedule[i][2].timeFrom);
            //         let tempt = new Date(markedDay+ ' ' +dataSchedule[i][2].timeTo);
            //         if(((timef<= tempt)&&(timef >= tempf)) || ((timet<= tempt)&&(timet >= tempf))){
            //             checkdouble = true;
            //         }
            //     }
            // };
            if (checkdouble == false) {
                let NoteRef = firebase.database().ref('listRooms/' + roomid + '/listSchedules/' + markedDay);
                let createNote = NoteRef.push();
                let newnote = {
                    timeFrom: ftimef,
                    timeTo: ftimet
                };
                let id = createNote.key;

                createNote.set(newnote).then(res => {
                    dataSchedule.push([markedDay, id, newnote]);
                }).catch();
                timefrominit();
                timetoinit();
                navigation.navigate('Room Management', { item: 1 });
            }
            else {
                Alert.alert('Alert', 'Time is double!');
            }

        }
    };

    const showTimeFrompicker = () => {
        setShowtimefrom(true);
    };
    const showTimeTopicker = () => {
        setShowtimeto(true);
    };

    return (
        <View style={styles.container}>

            <TouchableOpacity
                // onPress={() => navigation.navigate('ManagementView')}
            >
                <Image
                    source={require('./assets/back.png')}
                    resizeMode='contain'
                    style={{ width: '7%' }}
                />
            </TouchableOpacity>

            <Calendar
                style={styles.cal}
                theme={{
                    backgroundColor: '#f5f5f5',
                    calendarBackground: '#f5f5f5',
                    textDayFontFamily: 'google-bold',
                    dayTextColor: '#808080',
                    dotColor: '#F4A05B',
                    textDayHeaderFontFamily: 'google-bold',
                    textMonthFontFamily: 'google-bold',
                    textMonthFontSize: 22,
                    arrowColor: '#F4A05B',
                    monthTextColor: '#404040'
                }}
                // Initially visible month. Default = Date()
                current={new Date()}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={'2020-01-01'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={'2021-12-31'}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {
                    setSelDay(day.dateString);

                }}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={(day) => {
                    setSelDay(day.dateString);
                    setMarkedDay(day.dateString);
                    timefrominit();
                    timetoinit();
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'yyyy MM'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                // onMonthChange={(month) => {console.log('month changed', month)}}
                // Hide month navigation arrows. Default = false
                hideArrows={false}
                // renderArrow={renderarrow}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                // renderArrow={(direction) => (<Arrow/>)}
                renderArrow={(direction) => (direction === 'left' ? <MaterialCommunityIcons name="arrow-left-drop-circle" color={'#00ADF5'} size={22} /> : <MaterialCommunityIcons name="arrow-right-drop-circle" color={'#00ADF5'} size={22} />)}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={false}
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                hideDayNames={false}
                // Show week numbers to the left. Default = false
                showWeekNumbers={false}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={substractMonth => substractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
                // Disable left arrow. Default = false
                disableArrowLeft={false}
                // Disable right arrow. Default = false
                disableArrowRight={false}
                // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                disableAllTouchEventsForDisabledDays={false}
                markedDates={{ [markedDay]: { selected: true, marked: true, selectedColor: '#F4A05B' }, }}
            />
            <View style={{ width: '100%', height: '15%', alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
                <View style={{ flexDirection: 'row', width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <Text style={styles.fontsizetext}>from :  </Text>
                    <Text style={styles.fontsizetext}>{ftimef}</Text>
                    <TouchableOpacity style={styles.btnshowtime}
                        onPress={showTimeFrompicker}
                    >
                        <MaterialCommunityIcons name="arrow-down-drop-circle" color={'#808080'} size={20} />
                    </TouchableOpacity>

                </View>
                <View style={{ flexDirection: 'row', width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <Text style={styles.fontsizetext}>to :  </Text>
                    <Text style={styles.fontsizetext}>{ftimet}</Text>
                    <TouchableOpacity style={styles.btnshowtime}
                        onPress={showTimeTopicker}
                    >
                        <MaterialCommunityIcons name="arrow-down-drop-circle" color={'#808080'} size={20} />
                    </TouchableOpacity>
                </View>
                {(showtimefrom || showtimeto) && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={dateinit}
                        mode={'time'}
                        is24Hour={true}
                        display="spinner"
                        /////////////Choose timeFrom or timeTo///////////////////
                        onChange={showtimefrom ? onChangef : onChanget}
                    />
                )}
                <TouchableOpacity style={styles.btnadd}
                    onPress={actionadd}
                >
                    <Image
                        style={{ width: '50%', height: '50%', resizeMode: 'contain' }}
                        source={require('./assets/add.png')}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.viewlist}>
                <FlatList
                    keyExtractor={item => item[1]}
                    data={dataSchedule}
                    style={styles.itemlist}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onLongPress={() => {
                                const index = dataSchedule.indexOf(item, 0);
                                Alert.alert(
                                    "OOPS",
                                    "Do you want to delete",
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => <View />,
                                            style: "cancel"
                                        },
                                        {
                                            text: "OK", onPress: () => {
                                                dataSchedule.splice(index, 1);
                                                let noteRef = firebase.database().ref('listRooms/' + roomid + '/listSchedules/' + item[0] + '/' + item[1]);
                                                noteRef.remove().then().catch();
                                                pageload = !toggleLoad;
                                                setToggleLoad(pageload);
                                                navigation.navigate('Room Management', { item: 1 });

                                            }
                                        }
                                    ],
                                    { cancelable: false }
                                );

                            }}
                            style={styles.item}
                        >
                            <Shownote item={item} day={selDay} />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 40,
        paddingLeft: '5%'
    },
    fontsizetext: {
        fontFamily: 'google-bold',
        fontSize: 16,
        color: '#808080'
    },
    cal: {
        marginTop: 10,
        marginRight: 15,
        backgroundColor: '#f5f5f5',
    },
    viewlist: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 20,
        marginStart: -20,
        width: 363,
        height: 85,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    itemlist: {
        padding: 4,
        width: '100%',
        height: '85%',
    },
    item: {
        flex: 1,
        alignItems: 'center'
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    btnshowtime: {
        height: 20,
        width: 20,
        marginHorizontal: 10,
    },
    btnadd: {
        marginTop: 10,
        height: 20,
        width: 20,
        borderRadius: 1000,
        backgroundColor: '#F4A05B',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
