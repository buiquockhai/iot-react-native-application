var FirebaseDatabase = require('./index');
var database = FirebaseDatabase.database;
// function updateDevice() {
//     database.ref('devices-final').on('child_changed', (dataSnapshot) => {
//         var items = [];
//         items.push({
//             device_id: dataSnapshot.val().device_id,
//             values: [dataSnapshot.val().values[0], dataSnapshot.val().values[1]],
//             room: dataSnapshot.val().room
//         });
//         var obj = JSON.stringify(items);
//         publish.Publisher(obj);
//     });
// }

// function updateDevice(deviceData) {
//     database.ref('devices/' + deviceData.device_key + '/values').set({
//         0: deviceData.values[0],
//         1: deviceData.values[1]
//     });
// }

function updateDevice(deviceData) {
    database.ref('sensors/' + deviceData.device_key + '/values').set({
        valueF: deviceData.values[0],
        valueS: deviceData.values[1]
    });
}

function searchDevice(obj) {
    var ref = database.ref('/devices-final')
    var flag = false;
    ref.on('value', (dataSnapshot) => {
        dataSnapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            if ((childSnapshot.val().room == obj.room) && (childSnapshot.val().device_id == obj.device_id)) {
                console.log("search");
                console.log(obj)
                database.ref('/devices-final/' + key).update({
                    values: obj.values
                })
                flag = true;
            }
        })
    })
    if (!flag) {
        ref.push().set({
            device_id: obj.device_id,
            values: obj.values,
            room: obj.room
        });
    }
}

module.exports = { updateDevice, searchDevice };