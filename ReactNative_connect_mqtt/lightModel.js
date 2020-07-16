// const { database } = require('firebase');
var FirebaseDatabase = require('./index');
var database = FirebaseDatabase.database;
function lightModel(obj) {
    
    database.ref('listSensors/' + obj.device_id).update({
        device_id: obj.device_id,
        values: obj.values[0],
    });

    var time = new Date();
    console.log(time);
    var currentDate = time.toISOString().split('T')[0];
    console.log(currentDate);
    var currentTime = time.toLocaleTimeString('en-US', { hour12: false });
    console.log(currentTime);
    //var dateAndTime = currentDate+ " " + currentTime;
    database.ref('listSensors/' + obj.device_id +"/sensorHistory/"+ currentDate).update({
        [currentTime]: obj.values[0]
    });

    // function writeSensorData(obj) {
    //     // var sensorRef = ref.push();
    //     // var sensorRefKey = sensorRef.key;
    //     console.log(obj.device_id);
    //     ref.push().set({
    //         device_id: obj.device_id,
    //         value: obj.values
    //     });
    // }
    
    // writeSensorData(obj);
}

module.exports = { lightModel };