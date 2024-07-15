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



import Vehicle from "../models/vehicle.js";

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
    const schemaKeys = Object.keys(Vehicle.schema.paths);
    const queryKeys = Object.keys(reqQuery);
  
    // Filter query keys that are not in the schema
    const validKeys = queryKeys.filter(key => schemaKeys.includes(key) || key === 'vehicleId'); // 'vehicleId' is a special case
  
    // Optionally, handle special cases or transformations here
    // For example, converting 'vehicleId' to an ObjectId, if necessary
    if (validKeys.includes('vehicleId')) {
        reqQuery.vehicleId = require('mongoose').Types.ObjectId(reqQuery.vehicleId);
    }
  
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
router.get("/vehicle", checkAuth, async (req, res) => {
   
    try {

        const userId = req.userData._id;
        const query = {
            deleted: 0
        };
        const validKeys = validateQueryKeys(req.query);  // Validate query keys
        console.log(validKeys);
        for (const key of validKeys) {
            if (req.query[key] != 'null') {
                if (key === 'vehicleId') {
                    query._id = req.query[key];
                }else{
                    
                    query[key] = req.query[key];   // Add valid keys to the query
                }
            }
        }
console.log(query);
        
        //get Vehicles
        var vehicles = await Vehicle.find(query);
        vehicles = JSON.parse(JSON.stringify(vehicles));

    
       const toSend = {
        status: "success",
        data: vehicles
    };
    return res.status(200).json(toSend);
   } catch (error) {
        console.log("error getting vehicles");

        const toSend = {
            status: "error",
            error: error
        }
        return res.status(500).json(toSend);
   }
    
});
router.get("/vehicleMakers", checkAuth, async (req, res) => {
   
    try {

        const userId = req.userData._id;
        

        
        //get Vehicles
        var vehiclesMakers = await Vehicle.find().distinct('maker');
        vehiclesMakers = JSON.parse(JSON.stringify(vehiclesMakers));

    
       const toSend = {
        status: "success",
        data: vehiclesMakers
    };
    return res.status(200).json(toSend);
   } catch (error) {
        console.log("error getting vehicles");

        const toSend = {
            status: "error",
            error: error
        }
        return res.status(500).json(toSend);
   }
    
});
//Create vehicle
router.post("/vehicle", checkAuth, async (req, res) => {

    try {
      
            
        
            const userId = req.userData._id;
            const newVehicle = req.body.newVehicle;
   


            newVehicle.userId = userId;
            console.log(newVehicle);
            newVehicle.createdTime = Date.now();

            const vehicle = await Vehicle.create(newVehicle);

            //createSaverRule("121212","111111",false);
            console.log(userId);
            console.log(newVehicle.plate);
        

            //selectVehicle(userId, newVehicle.dId);

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
router.delete("/vehicle",checkAuth, async(req, res) => {
    try {
        const plate = req.query.plate;

        
        // const result = await Vehicle.deleteOne({ plate: plate });

        const result = await Vehicle.updateOne({ plate: plate }, { deleted: 1 });

        const toSend = {
            status: "success",
            data: result
        };

        return res.json(toSend);
    } catch (error) {
        console.log("ERROR DELETING Vehicle");
        console.log(error);

        const toSend = {
            satus: "error",
            error: error
        }

        return res.status(500).json(toSend);
    }

});

//UPDATE
router.put("/vehicle", checkAuth , async (req, res) => {

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


});


/*
███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
█████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
                                                                          
*/

module.exports = router; 