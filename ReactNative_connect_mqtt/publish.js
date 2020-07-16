const deviceModel = require('./bulbModel');


function Publisher(obj) {
	var mqtt = require('mqtt')
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
		var item = []
		item.push({
			device_id : obj.device_id,
			values : [obj.values[0].toString(), obj.values[1].toString()]
		})
		console.log(JSON.stringify(item));
		client.publish('Topic/LightD', JSON.stringify(item));
	})
}

module.exports = { Publisher };
