
const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/authentication.js");
var mqtt = require("mqtt");
const axios = require("axios");
const colors = require("colors");

import Device from "../models/device.js";
import EmqxAuthRule from "../models/emqx_auth.js";
import AlarmRule from "../models/emqx_alarm_rules.js";

let client;

//START MQTT CLIENT
function startMqttClient() {
    
    const options = {
        port: 1883,
        host: 'localhost',
        clientId: 'webhook_superuser' + Math.round(Math.random() * (0 - 10000) * -1),
        username: 'superuser',
        password: 'superuser',
        keepalive: 60,
        reconnectPeriod: 5000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
        encoding: 'utf8',
    }

    client = mqtt.connect('mqtt://' + 'localhost', options);

    client.on('connect', function() {
        console.log("MQTT CONNECTION -> SUCCESS;".bgMagenta);
        console.log("\n");
    });

    client.on('reconnect', (error)=> {
        console.log("RECONNECTION MQTT");
        console.log(error);
    });

    client.on('error', (error)=> {
        console.log("MQTT CONNECTION FAIL -> ");
        console.log(error);
    });

}

//SAVER WEBHOOK ENDPOINT
router.post('/saver-webhook', async (req, res) => {
    
    if (req.headers.token != "121212") {
        res.sendStatus(404);
        return;
    }
    
    const data = req.body;
    console.log(data);
    const splittedTopic = data.topic.split("/");
    const dId = splittedTopic[1];
    const userId = splittedTopic[0];
    const variable = splittedTopic[2];
  
    
    try {
      
      const payload = data.payload;

      console.log("saver webhook data: " + data+ "\n");
      let result = await Device.find({ dId: dId, userId: userId });


    if (result.length === 1 ) {
      let updatedTime = Date.now();
      const updateResult = await Device.updateOne({
        dId:dId, userId:userId},{$set:{lastUpdatedTime: updatedTime , rssi:payload.rssi , chargeLeft:payload.bat
      }})
      
      console.log(dId+ " "+ userId + " "+ payload.rssi+" "+payload.bat)
      console.log("update device sinfo");
      
    console.log(updateResult);
    }
    } catch (error) {
      console.log(error + "2nd catcb")
    }
    

    // if (result.length === 1 ) {
    //     Data.create({
    //         userId: data.userId,
    //         dId: dId,
    //         variable: variable,
    //         value: data.payload.value,
    //         time: Date.now(),
    //     })
    //     console.log("Saver Data created".bgMagenta);
    // }

    res.sendStatus(200);

    console.log(data);
});


//ALARM WEBHOOK ENDPOINT
router.post("/alarm-webhook", async (req, res) => {

    try {

        if (req.headers.token != "121212") {
            res.sendStatus(404);
            return;
          }

        const incomingAlarm = req.body;

        updateAlarmCounter(incomingAlarm.emqxRuleId);


        const lastNotif = await Notification.find({ dId: incomingAlarm.dId, emqxRuleId: incomingAlarm.emqxRuleId }).sort({ time: -1 }).limit(1);

        if (lastNotif == 0) {
            console.log("first time alarm");
            saveNotifToMongo(incomingAlarm);
            sendMqttNotif(incomingAlarm);

        } else {

             const lastNotifToNowMins = ( Date.now() - lastNotif[0].time ) / 1000 / 60;
            
            if (lastNotifToNowMins > incomingAlarm.triggerTime) {
                
                console.log("Triggered");
                saveNotifToMongo(incomingAlarm);
                sendMqttNotif(incomingAlarm);

            }
            
        }


    } catch (error) {
        console.log(error);
        res.sendStatus(200);
    }

});


router.post("/getdevicecredentials", async(req,res)=>{

    console.log(req.body);

    const dId = req.body.dId;
  
    const password = req.body.password;

    const device = await Device.findOne({ dId: dId });
  
    if(password != device.password){
        return res.status(401).json();
    };
    const userId = device.userId;
  
    var credentials = await getDeviceMqttCredentials(dId, userId);
  

  
    const toSend = {
      username: credentials.username,
      password: credentials.password,
      topic: userId + "/" + dId + "/"
    };
  
    console.log(toSend);
  
    res.json(toSend);
  
    
    setTimeout(() => {
      getDeviceMqttCredentials(dId, userId);
      console.log("Device Credentials Updated");
    }, 10000);

});




//START MQTT CLIENT
setTimeout(() => {
    startMqttClient();
}, 3000);

// FUNCTIONS //

async function getDeviceMqttCredentials(dId, userId) {
    try {
      var rule = await EmqxAuthRule.find({
        type: "device",
        userId: userId,
        dId: dId
      });
  
      if (rule.length == 0) {
        const newRule = {
          userId: userId,
          username: makeid(10),
          password: makeid(10),
          publish: ["+" + "/" + dId + "/+/sdata",userId + "/" + dId + "/+/sinfo" ],
          subscribe: ["+/"+dId + "/+/actdata"],
          type: "device",
          time: Date.now(),
          updatedTime: Date.now()
        };
  
        const result = await EmqxAuthRule.create(newRule);
  
        const toReturn = {
          username: result.username,
          password: result.password
        };
  
        return toReturn;
      }
  
      const newUserName = makeid(10);
      const newPassword = makeid(10);
  
      const result = await EmqxAuthRule.updateOne(
        { type: "device", dId: dId },
        {
          $set: {
            username: newUserName,
            password: newPassword,
            updatedTime: Date.now()
          }
        }
      );
      await EmqxAuthRule.deleteMany({ type: 'device'});
  
      // update response example
      //{ n: 1, nModified: 1, ok: 1 }
  
      if (result.n == 1 && result.ok == 1) {
        return {
          username: newUserName,
          password: newPassword
        };
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    
  }

//make id

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


module.exports = router;