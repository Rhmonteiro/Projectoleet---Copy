
//requires

const express  = require("express");
const mongoose = require("mongoose");
const morgan   = require("morgan");
const cors = require("cors");
const colors = require("colors");


//instances 
const app = express();



//express config
app.use(morgan("short"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

module.exports = app;

//express routes

app.use('/api', require('./routes/devices.js'));
app.use('/api', require('./routes/users.js'));
app.use('/api', require('./routes/webhook.js'));
app.use('/api', require('./routes/emqxapi.js'));
app.use('/api', require('./routes/vehicles.js'));
app.use('/api', require('./routes/carParts.js'));
app.use('/api', require('./routes/categorys.js'));
app.use('/api', require('./routes/carMakers.js'));


//listener

app.listen('3001', () => {
    console.log("api Server listening on 3001");
});

//Mongo connection
const mongoUserName = "dev";
const mongoPassword = "devpw3";
const mongoHost = "localhost";
const mongoPort = "27017";
const mongoDatabase = "ioticos_god_level";

var uri =
    "mongodb://" +
    mongoUserName +
    ":" +
    mongoPassword +
    "@" +
    mongoHost +
    ":" +
    mongoPort +
    "/" +
    mongoDatabase;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authSource: "admin"
};


try {
    mongoose.connect(uri, options).then(() => {
        console.log("\n");
        console.log("*******************************".green);
        console.log("✔ Mongo Successfully Connected!".green);
        console.log("*******************************".green);
        console.log("\n");
    },
        (err) => {
            console.log("\n");
            console.log("*******************************".red);
            console.log("    Mongo Connection Failed    ".red);
            console.log("*******************************".red);
            console.log("\n");
            console.log(err);
        });
} catch (error) {
    console.log("ERROR CONNECTING MONGO ");
    console.log(error);
}  

