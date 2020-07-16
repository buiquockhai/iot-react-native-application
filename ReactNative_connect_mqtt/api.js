var express = require("express")
var router = express.Router();
var publish = require("./publish");
var deviceModel = require("./bulbModel")

router.post('/', (req, res) => {
    console.log("API");
    //console.log(req.body.data);
    var deviceData = JSON.parse(req.body.data);
    publish.Publisher(deviceData);
    //deviceModel.updateDevice(deviceData);
    res.send('API ok');
});

module.exports = router