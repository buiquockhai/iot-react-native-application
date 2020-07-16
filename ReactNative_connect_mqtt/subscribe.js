const lightModel = require('./lightModel');
//const deviceModel = require('./deviceModel');
//const { unsubscribe } = require('./adminRoutes');
function Subscribe() {
	var mqtt = require('mqtt')
	//var client = mqtt.connect('mqtt://52.187.119.84')
	var client = mqtt.connect({
		host: '52.187.125.59',
		port: 1883,
		username: 'BKvm',
		password: 'Hcmut_CSE_2020'
		// host: '13.76.133.72',
		// port: 1883,
		// username: 'AzureUser',
		// password: ''
	});
	client.on('connect', function () {
		console.log("connected")
		client.subscribe('Topic/Light', function (err) {
			client.on('message', function (topic, message) {
				var obj = JSON.parse(message.toString());
				console.log("in intensity");
				console.log(obj)
				//console.log(message);
				lightModel.lightModel(obj[0]);
			})
		})
		// client.subscribe('Topic/Speaker', function (err) {
		// 	// client.unsubscribe('Topic/TempHumi');
		// 	client.on('message', function (topic, message) {
		// 		console.log("in device")
		// 		var obj = JSON.parse(message);
		// 		deviceModel.searchDevice(obj);
		// 	})
		// })
	})
	

	// client.on('connect', function () {
	// 	console.log("connected")
	// 	client.subscribe('Topic/Speaker', function (err) {
	// 		client.on('message', function (topic, message) {
	// 			var obj = JSON.parse(message);
	// 			deviceModel.searchDevice(obj);
	// 		})
	// 	})
	// })

}
module.exports = { Subscribe };
