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
const mongoose = require('mongoose');


import CarPart from "../models/carPart.js";
import Vehicle from "../models/vehicle.js";
import CarPartAnalytics from "../models/CarPartAnalytics.js"; // replace with your actual analytics model path


/*
 █████╗ ██████╗ ██╗
██╔══██╗██╔══██╗██║
███████║██████╔╝██║
██╔══██║██╔═══╝ ██║
██║  ██║██║     ██║
╚═╝  ╚═╝╚═╝     ╚═╝
*/
//validate query keys
function validateQueryKeys(reqQuery) {
    const schemaKeys = Object.keys(CarPart.schema.paths);
    const queryKeys = Object.keys(reqQuery);
  
    // Filter query keys that are not in the schema
    const validKeys = queryKeys.filter(key => schemaKeys.includes(key) || key === 'vehicleId'|| key === 'model'|| key==='brand'); // 'vehicleId' is a special case
  
    // Optionally, handle special cases or transformations here
    // For example, converting 'vehicleId' to an ObjectId, if necessary
    // if (validKeys.includes('vehicleId')) {
    //     reqQuery.vehicleId = require('mongoose').Types.ObjectId(reqQuery.vehicleId);
    // }
  
    return validKeys;
  }

// CREDENTIALS

const auth = {
    auth: {
        username: "admin",
        password: "emqxsecret"
    }
};

//GET VehicleS
router.get("/carpart", checkAuth, async (req, res) => {
   
    try {

        const userId = req.userData._id;
        

        //get Vehicles
        const query = {
            deleted: 0
        };
        const validKeys = validateQueryKeys(req.query);
        console.log(validKeys);
        for (const key of validKeys) {
            if (req.query[key] != 'null') {
                console.log('inside null check');
            if (key === 'vehicleId') {
                query.vehicleId = mongoose.Types.ObjectId(req.query[key]);
            } else if (key === 'model') {
                query.carModel = req.query[key];
            } else if (key === 'brand') {
                query.carMaker = req.query[key];
            } else{
                query[key] = req.query[key];
            }
            }
        }
        const carparts = await CarPart.find(query);
        const toSend = {
            status: "success",
            data: carparts
        };
        return res.status(200).json(toSend);
        
//         //get Vehicles
//         if (req.query.type || req.query.brand || req.query.model || req.query.vehicleId) {
//             const type = req.query.type;
//             const carMaker = req.query.brand;
//             const carModel = req.query.model;
    
//             const query = {
//                 deleted: 0
//             };
//             let vehicleId;
//             if (req.query.vehicleId) {
//                 vehicleId = mongoose.Types.ObjectId(req.query.vehicleId); // Correctly convert string to ObjectId
//             }
//             if (type) query.type = type;
//             if (carMaker) query.carMaker = carMaker;
//             if (carModel) query.carModel = carModel;
//             if (vehicleId) query.vehicleId = vehicleId;
            
//             const carparts = await CarPart.find(query);
//             const toSend = {
//                 status: "success",
//                 data: carparts
//             };
//             return res.status(200).json(toSend);
//         } else {
//         var carparts = await CarPart.find({deleted:0});
//         carparts = JSON.parse(JSON.stringify(carparts));

    
//        const toSend = {
//         status: "success",
//         data: carparts
//     };
//     console.log(toSend);
//     return res.status(200).json(toSend);
// }
   } catch (error) {
        console.log("error getting car part");

        const toSend = {
            status: "error",
            error: error
        }
        console.log(toSend);
        return res.status(500).json(toSend);
   }
    
});
//Create vehicle
router.post("/carpart", checkAuth, async (req, res) => {

    try {
      
            
        
            const userId = req.userData._id;
            const newCarPart = req.body.newCarPart;
   


            newCarPart.userId = userId;
            console.log(newCarPart);
            newCarPart.createdTime = Date.now();

            const carPart = await CarPart.create(newCarPart);

            //createSaverRule("121212","111111",false);
            console.log(userId);
            console.log(carPart._id);
        

            //selectVehicle(userId, newCarPart.dId);

            const toSend = {
                status: "success"
            }

            res.json(toSend);
        
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
router.delete("/carpart",checkAuth, async(req, res) => {
    try {
        const carPartId = req.query.rfid;

        
        // const result = await CarPart.deleteOne({ rfid: carPartId });
        const result = await CarPart.updateOne({rfid: carPartId}, {deleted: true});

        const toSend = {
            status: "success",
            data: result
        };

        return res.json(toSend);
    } catch (error) {
        console.log("ERROR DELETING CarPart");
        console.log(error);

        const toSend = {
            satus: "error",
            error: error
        }

        return res.status(500).json(toSend);
    }

});


const changeStream = Vehicle.watch();

changeStream.on('change', async (change) => {
    console.log("change streams: \n"+JSON.stringify(change));
    switch (change.operationType) {
        case 'insert':
            // A new document was inserted. Update the analytics collection accordingly.

            const count = await Vehicle.countDocuments({ maker: change.fullDocument.maker, deleted: false });
            await CarPartAnalytics.updateOne(
                { carMaker: change.fullDocument.maker },
                { $set: { count: count } },
                { upsert: true }
            );
            break;
        case 'delete':
            // A document was deleted. Update the analytics collection accordingly.

            console.log("delete: "+ JSON.stringify(change.documentKey));
            await CarPartAnalytics.updateOne(
                { _id: change.documentKey._id},
                { $inc: { count: -1 } }
            );
            break;
        case 'update':
            console.log("update: "+ JSON.stringify(change));
            const oldDocument = await Vehicle.findOne({ _id: change.documentKey._id });
            console.log("oldDocument: "+ JSON.stringify(oldDocument));
            

            const newCount = await Vehicle.countDocuments({ maker: oldDocument.maker, deleted: false });
            await CarPartAnalytics.updateOne(
                { carMaker: oldDocument.maker },
                { $set: { count: newCount } },
                { upsert: true}
            );

        case 'replace':
            // A document was updated or replaced. If the carMaker field was updated, you need to decrement the count for the old carMaker and increment the count for the new carMaker.
            // This is more complex and may require an additional query to get the old document.
            break;
    }
});


//UPDATE 
/*
router.put("/carpart", checkAuth , async (req, res) => {

    const dId = req.body.dId;
    const userId = req.userData._id;

    if (await selectVehicle(userId, dId)) {
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


});*/


/*
███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
█████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
                                                                          
*/

module.exports = router; 