const path = require("path");
const express = require("express");

const router = express.Router();
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://13.76.133.72')
console.log("vao")
router.get('/', (req, res, next) => {
    console.log("in router get");
    client.on('connect', function () {
        client.subscribe('home/light', function (err) {
            //open connect to database
            if (err) {
                console.log(err)
            }
        })
    })
})

module.exports = router;