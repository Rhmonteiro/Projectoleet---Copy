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



import CarMaker from "../models/car_maker.js";

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
router.get("/carmakers", checkAuth, async (req, res) => {
   
    try {

        const userId = req.userData._id;
        

        
        //get Vehicles
        var carmakers = await CarMaker.find({});
        carmakers = JSON.parse(JSON.stringify(carmakers));

    
       const toSend = {
        status: "success",
        data: carmakers
    };
    return res.status(200).json(toSend);
   } catch (error) {
        console.log("error getting car maker");

        const toSend = {
            status: "error",
            error: error
        }
        return res.status(500).json(toSend);
   }
    
});

//GET MAKER MODELS

router.get("/makermodels", checkAuth, async (req, res) => {
   
    try {

        const userId = req.userData._id;
        const maker = req.query.name;
        
        
        //get Vehicles
        var makermodels = await CarMaker.find({name:maker});
        makermodels = JSON.parse(JSON.stringify(makermodels));
        console.log("models: "+makermodels[0].models);
       const toSend = {
        status: "success",
        data: makermodels[0].models
    };
    return res.status(200).json(toSend);
   } catch (error) {
        console.log("error getting car maker");

        const toSend = {
            status: "error",
            error: error
        }
        return res.status(500).json(toSend);
   }
    
});

//Create vehicle
router.post("/carmakers", checkAuth, async (req, res) => {

    try {
      
            
        
            const userId = req.userData._id;
            const newCarMaker = req.body.newCarMaker;
   


            newCarMaker.userId = userId;
            console.log(newCarPart);
            newCarMaker.createdTime = Date.now();

            const carMaker = await CarMaker.create(newCarMaker);

            //createSaverRule("121212","111111",false);
            console.log(userId);
            console.log(carMaker._id);
        

            //selectVehicle(userId, newCarPart.dId);

            const toSend = {
                status: "success"
            }

            res.json(toSend);
        
    } catch (error) {
         console.log("ERROR - CARMAKER REGSITER ENDPOINT");
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };

        res.status(500).json(toSend);
    
    }

});
//delete is like .get => req.query
router.delete("/carmakers",checkAuth, async(req, res) => {
    try {
        const carMakerName = req.query.name;

        
        const result = await CarMaker.deleteOne({ rfid: carMakerName });

        const toSend = {
            status: "success",
            data: result
        };

        return res.json(toSend);
    } catch (error) {
        console.log("ERROR DELETING CARMAKER");
        console.log(error);

        const toSend = {
            satus: "error",
            error: error
        }

        return res.status(500).json(toSend);
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