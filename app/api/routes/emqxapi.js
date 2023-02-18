const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');

import SaverRule from '../models/emqx_saver_rule';

const auth = {
    auth: {
        username: 'admin',
        password: 'emqxsecret'
    }
}
global.saverResource = null;
global.alarmResource = null;


/*
 / \ / \ / \ / \   / \ / \ / \ / \ / \ / \ / \ / \ 
( E | M | Q | X ) ( R | E | S | O | U | R | C | E )
 \_/ \_/ \_/ \_/   \_/ \_/ \_/ \_/ \_/ \_/ \_/ \_/ 
  _   _   _   _   _   _   _  
 / \ / \ / \ / \ / \ / \ / \ 
( M | A | N | A | G | E | R )
 \_/ \_/ \_/ \_/ \_/ \_/ \_/ 
*/

async function listResources() {
    
    const url = "http://localhost:8085/api/v4/resources/";

    let res = await axios.get(url, auth);

    let size = res.data.data.length;

    if (size == 0) {
        console.log("****** Creating emqx webhook*****".green);
        await createResources();
        res = await axios.get(url, auth);
        size = res.data.data.length;
    }else if (size == 2) {
        res.data.data.forEach(resource => {
            if (resource.description == "alarm-webhook") {
                global.alarmResource = resource;

                console.log("▼ ▼ ▼ ALARM RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
                console.log(global.alarmResource);
                console.log("▲ ▲ ▲ ALARM RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
                console.log("\n");
                console.log("\n");
            }
            if (resource.description== "saver-webhook") {
                global.saverResource = resource;

                
                console.log("▼ ▼ ▼ SAVER RESOURCE FOUND ▼ ▼ ▼ ".bgMagenta);
                console.log(global.saverResource);
                console.log("▲ ▲ ▲ SAVER RESOURCE FOUND ▲ ▲ ▲ ".bgMagenta);
                console.log("\n");
                console.log("\n");
            }
        });
    }else{

        function printWarning() {
            console.log("DELETE ALL WEBHOOK EMQX RESOURCES AND RESTART NODE - youremqxdomain:8085/#/resources".red);
            setTimeout(() => {
                printWarning();
            }, 1000);
        }

        printWarning();
    }

    await createSaverRule(1,true);
    //console.log(res.data.data);

};

async function createSaverRule( dId, status) {
    
    try {
        const url = "http://localhost:8085/api/v4/rules";

        const topic = "+/+/+/sinfo";

        const rawsql = "SELECT topic, payload FROM \"" + topic + "\" WHERE payload.rssi != \"\" ";

        var newRule = {
            rawsql: rawsql,
            actions: [
                {
                    name: "data_to_webserver",
                    params: {
                        $resource: global.saverResource.id,
                        payload_tmpl: '{"payload":${payload},"topic":"${topic}"}'
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
                userId: "something",
                dId: "tbd",
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


//create resources
async function createResources() {

    try {
        const url = "http://localhost:8085/api/v4/resources";

        const data1 = {
            "type": "web_hook",
            "config": {
                url: "http://localhost:3001/api/saver-webhook",
                headers: {
                    token: "121212"
                },
                method: "POST"
            },
            description: "saver-webhook"
        }
    
        const data2 = {
            "type": "web_hook",
            "config": {
                url: "http://localhost:3001/api/alarm-webhook",
                headers: {
                    token: "121212"
                },
                method: "POST"
            },
            description: "alarm-webhook"
        }
    
        const res1 = await axios.post(url, data1, auth);
    
        if (res1.status === 200){
            console.log("Saver resource created!".green);
        }
    
        const res2 = await axios.post(url, data2, auth);
    
        if (res2.status === 200){
            console.log("Alarm resource created!".green);
        }
    
        setTimeout(() => {
            console.log("***** Emqx WH resources created! :) *****".green);
            listResources();
        }, 1000);
    } catch (error) {
        console.log("Error creating resources");
        console.log(error);
    }

   

}

setTimeout(() => {
    listResources();
}, 1000);

module.exports = router;
