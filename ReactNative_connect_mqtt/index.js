const firebase = require('firebase');
// const firebaseConfig = {
//   apiKey: "AIzaSyAJ46Zpo5mLyyFhInxwmASGnDxs1ybl9lE",
//   authDomain: "iotproject-802c9.firebaseapp.com",
//   databaseURL: "https://iotproject-802c9.firebaseio.com",
//   projectId: "iotproject-802c9",
//   storageBucket: "iotproject-802c9.appspot.com",
//   messagingSenderId: "658518817451",
//   appId: "1:658518817451:web:6ab0b8f55f75029a6d95ee",
//   measurementId: "G-HX7NK3C14H"
// };
const firebaseConfig = {
  apiKey: "AIzaSyALHh1hMM3BCqJ3c7SR_6XLVtwuwjc27sU",
  authDomain: "myproject-13f98.firebaseapp.com",
  databaseURL: "https://myproject-13f98.firebaseio.com",
  projectId: "myproject-13f98",
  storageBucket: "myproject-13f98.appspot.com",
  messagingSenderId: "665863113151",
  appId: "1:665863113151:web:d6d7e346ca299e0cd0390a",
  measurementId: "G-ZVTYSDJX51"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
module.exports = { database };
const express = require('express');
const app = express();

var APIRouter = require('./api');
var subscribe = require('./subscribe');
var publish = require('./publish');


// app.use(bodyParser.json());
app.use(express.json())



app.use('/api', APIRouter);
subscribe.Subscribe();

app.listen(8080);

module.exports = app