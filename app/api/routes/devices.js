/*
██████╗ ███████╗██╗   ██╗██╗ ██████╗███████╗███████╗    
██╔══██╗██╔════╝██║   ██║██║██╔════╝██╔════╝██╔════╝    
██║  ██║█████╗  ██║   ██║██║██║     █████╗  ███████╗    
██║  ██║██╔══╝  ╚██╗ ██╔╝██║██║     ██╔══╝  ╚════██║    
██████╔╝███████╗ ╚████╔╝ ██║╚██████╗███████╗███████║    
╚═════╝ ╚══════╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝╚══════╝    
                                                        
██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗     
██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝     
██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗     
██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║     
██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║     
╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝     
                                                        
                                                        
*/ 

const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middlewares/authentication.js');
const axios = require('axios');



import Device from "../models/device.js";
import AlarmRule from "../models/emqx_alarm_rules.js";
import SaverRule from "../models/emqx_saver_rule.js";

/*
 █████╗ ██████╗ ██╗
██╔══██╗██╔══██╗██║
███████║██████╔╝██║
██╔══██║██╔═══╝ ██║
██║  ██║██║     ██║
╚═╝  ╚═╝╚═╝     ╚═╝
*/


// CREDENTIALS

const auth = {
    auth: {
        username: "admin",
        password: "emqxsecret"
    }
};

//GET DEVICES
router.get("/device", checkAuth, async (req, res) => {
   
    try {

        const userId = req.userData._id;
        

        
        //get devices
        var devices = await Device.find({});
        devices = JSON.parse(JSON.stringify(devices));
/*
        //get saver rules
        const saverRules = await getSaverRules(userId);
        //get alarms
        const alarmRules = await getAlarmRules(userId);
        

        //SAVER RULES TO -> DEVICES
        devices.forEach((device, index) => {
            devices[index].saverRule = saverRules.filter(saverRule => saverRule.dId == device.dId)[0];
            devices[index].alarmRules = alarmRules.filter(alarmRule => alarmRule.dId == device.dId);;
        });
*/
    
       const toSend = {
        status: "success",
        data: devices
    };
    return res.status(200).json(toSend);
   } catch (error) {
        console.log("error getting Devices");

        const toSend = {
            status: "error",
            error: error
        }
        return res.status(500).json(toSend);
   }
    
});
//Create Device
router.post("/device", checkAuth, async (req, res) => {

    try {
        const resourceStatus = await axios.get("http://localhost:8085/api/v4/resources/" + global.saverResource.id, auth);
        if (resourceStatus.data.data.status[0].is_alive === false) {
            throw { errors: {dId:"",e: "resource offline or not connected"} };
        } else {
            
        
            const userId = req.userData._id;
            const newDevice = req.body.newDevice;
   


            newDevice.userId = userId;
            console.log(newDevice);
            newDevice.createdTime = Date.now();
            newDevice.password = makeid(10);


            const device = await Device.create(newDevice);

            createSaverRule(userId, newDevice.dId, true);
            //createSaverRule("121212","111111",false);
            console.log(userId);
            console.log(newDevice.dId);
        

            //selectDevice(userId, newDevice.dId);

            const toSend = {
                status: "success"
            }

            res.json(toSend);
        }
    } catch (error) {
         console.log("ERROR - REGSITER ENDPOINT");
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };

        res.status(500).json(toSend);
    
    }

});
//delete is like .get => req.query
router.delete("/device",checkAuth, async(req, res) => {
    try {
        const userId = req.userData._id;
        const dId = req.query.dId;

        await deleteSaverRule(dId);
        
        const result = await Device.deleteOne({ userId: userId, dId: dId });

        const toSend = {
            status: "success",
            data: result
        };

        return res.json(toSend);
    } catch (error) {
        console.log("ERROR DELETING DEVICE");
        console.log(error);

        const toSend = {
            satus: "error",
            error: error
        }

        return res.status(500).json(toSend);
    }

});

//UPDATE
router.put("/device", checkAuth , async (req, res) => {

    const dId = req.body.dId;
    const userId = req.userData._id;

    if (await selectDevice(userId, dId)) {
        const toSend = {
            status: "success"
        };
        
        return res.json(toSend);

    } else {
        const toSend = {
            status: "error"
        };

        return res.json(toSend);

    }


});

//SAVER-RULE STATUS UPDATER
router.put('/saver-rule', checkAuth, async (req, res) => {
   try {
    
    const rule = req.body.rule;

    console.log(rule);
    
    const rUpdateStatus = await updateSaverRuleStatus(rule.emqxRuleId, rule.status);

       
    if (rUpdateStatus.status == "success") {
        const toSend = {
        status: "success"
    }; 

    res.json(toSend);
    } else {
        console.log("error updating status");

        const toSend = {
            status: "error"
        }
        res.json(toSend);
    }
    
   } catch (error) {
       
   }
   

});



/*
███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
█████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
                                                                          
*/

/*setTimeout(()=> {
    createSaverRule("121212","111111",false);
},2000);
*/



async function getAlarmRules(userId) {

  try {
      const rules = await AlarmRule.find({ userId: userId });
      return rules;
  } catch (error) {
      return "error";
  }

}

async function selectDevice(userId, dId) {
  try {
    const result = await Device.updateMany(
      { userId: userId },
      { selected: false }
    );
    const result2 = await Device.updateOne(
      { dId: dId, userId: userId },
      { selected: true }
    );
    return true;
  } catch (error) {
    console.log("ERROR IN 'selectDevice' FUNCTION ");
    console.log(error);
    return false;
  }
}
/*
 SAVER RULES FUNCTIONS
*/

//create saver rule

async function createSaverRule(userId, dId, status) {
    
    try {
        const url = "http://localhost:8085/api/v4/rules";

        const topic = userId + "/" + dId + "/+/sdata";

        const rawsql = "SELECT topic, payload FROM \"" + topic + "\" WHERE payload.save = 1";

        var newRule = {
            rawsql: rawsql,
            actions: [
                {
                    name: "data_to_webserver",
                    params: {
                        $resource: global.saverResource.id,
                        payload_tmpl: '{"userId":"' + userId + '","payload":${payload},"topic":"${topic}"}'
                    }
                }
            ],
            description: "SAVER-RULE",
            enabled: status
        };

        
        const rStatus = await axios.get("http://localhost:8085/api/v4/resources/" + global.saverResource.id, auth);
        // save rule in emqx
        if (rStatus.data.data.status[0].is_alive === true) {
            var res = await axios.post(url, newRule, auth);
        } else {
            console.log("Resource not connected or not alive");
            return false;
        }
    

        if (res.status === 200 && res.data.data ) {
            console.log(res.data.data);

            await SaverRule.create({
                userId: userId,
                dId: dId,
                emqxRuleId: res.data.data.id,
                status: status
            });

            return true;

        } else {
            return false;
        }
    } catch (error) {
        console.log("Error creating rule");
        console.log(error);
        return false;
    }
}

//update saver rule
async function updateSaverRuleStatus(emqxRuleId, status) {


    const url = "http://localhost:8085/api/v4/rules/" + emqxRuleId;

    const newRule = {
        enabled: status
    }

    const res = await axios.put(url, newRule, auth);

    if (res.status === 200 && res.data.data) {
        await SaverRule.updateOne({ emqxRuleId: emqxRuleId }, {
            status: status
        })

        console.log("Saver rule Status Updated ...".green);
        return {
            status: "success",
            action: "updated"
        }
    }

//delete saver rule 
    async function deleteSaverRule(dId) {
        try {
            
            const mongoRule = await SaverRule.findOne({ dId: dId });

            const url = "http://localhost:8085/api/v4/rules/" + mongoRule.emqxRuleId;

            const emqxRule = await axios.delete(url, auth);

            const deleted = await SaverRule.deleteOne({ dId: dId });

            return true;
        
        } catch (error) {
            console.log("Error deleting saver rule");
        console.log(error);
        return false;
    }
}
}

//get saver rules
//get saver rules
async function getSaverRules(userId) {
  try {
    const rules = await SaverRule.find({ userId: userId });
    return rules;
  } catch (error) {
    return false;
  }
}
//delete saver rule
async function deleteSaverRule(dId) {
  try {
    const mongoRule = await SaverRule.findOne({ dId: dId });
    const url = "http://localhost:8085/api/v4/rules/" + mongoRule.emqxRuleId;
    const emqxRule = await axios.delete(url, auth);
    const deleted = await SaverRule.deleteOne({ dId: dId });
    return true;
  } catch (error) {
    console.log("Error deleting saver rule");
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