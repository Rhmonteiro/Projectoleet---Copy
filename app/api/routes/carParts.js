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



import CarPart from "../models/carPart.js";
// const CarPartAnalytics = require('../models/CarPartAnalytics.js'); // replace with your actual analytics model path


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

//GET VehicleS
router.get("/carpart", checkAuth, async (req, res) => {
   
    try {

        const userId = req.userData._id;
        

        
        //get Vehicles
        var carparts = await CarPart.find({});
        carparts = JSON.parse(JSON.stringify(carparts));

    
       const toSend = {
        status: "success",
        data: carparts
    };
    return res.status(200).json(toSend);
   } catch (error) {
        console.log("error getting car part");

        const toSend = {
            status: "error",
            error: error
        }
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

        
        const result = await CarPart.deleteOne({ rfid: carPartId });

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


// const changeStream = CarPart.watch();

// changeStream.on('change', async (change) => {
//     switch (change.operationType) {
//         case 'insert':
//             // A new document was inserted. Update the analytics collection accordingly.
//             await CarPartAnalytics.updateOne(
//                 { carMaker: change.fullDocument.carMaker },
//                 { $inc: { count: 1 } },
//                 { upsert: true }
//             );
//             break;
//         case 'delete':
//             // A document was deleted. Update the analytics collection accordingly.
//             await CarPartAnalytics.updateOne(
//                 { carMaker: change.documentKey._id },
//                 { $inc: { count: -1 } }
//             );
//             break;
//         case 'update':
//         case 'replace':
//             // A document was updated or replaced. If the carMaker field was updated, you need to decrement the count for the old carMaker and increment the count for the new carMaker.
//             // This is more complex and may require an additional query to get the old document.
//             break;
//     }
// });


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