
const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middlewares/authentication.js');
const axios = require('axios');



////////////////////////////////////////////////////

import Category from '../models/category.js';
import CarPart from '../models/carPart.js';


//CREDS
const auth={
    auth: {
        username: "admin",
        password: "emqxsecret"
    }
};

//GET categories

router.get("/categorycount", checkAuth, async(req,res)=>{
 
    try {

        const userId = req.userData._id;
        const filterBy={type: req.query.type};
        
        
        //get Vehicles
        let categoryCount= await CarPart.countDocuments(filterBy, function (err, count) {
            if (err){
                console.log(err)
            }else{
                // console.log("Count :", count)
                // console.log("type: ", filterBy)
                return count;
            }
        });
        categoryCount = JSON.parse(JSON.stringify(categoryCount));

    
       const toSend = {
        status: "success",
        data: categoryCount
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


//GET categories

router.get("/category", checkAuth, async(req,res)=>{

    try {
        const userId = req.userData._id;
        const filterBy = req.query.name;

        let categories = await Category.find({});
        categories = JSON.parse(JSON.stringify(categories));

        const toSend={
            status: "success",
            data: categories
        };
        return res.status(200).json(toSend);
    } catch (error) {
        console.log("error getting categories");
        
        const toSend={
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    
    }

});

//CREATE category

router.post("/category", checkAuth, async(req,res)=>{

    try {
        
        const userId= req.userData._id;
        const newCategory= req.body.newCategory;

        console.log(newCategory);

        const category = await Category.create(newCategory);
        
        const toSend={
            status:"success"
        }

        res.json(toSend);
    } catch (error) {
        console.log("error creating category");
        console.log(error);

        const toSend=  {
            status: "error",
            error:error
        };
        res.status(500).json(toSend);
    }

});

////////////////////////////////////////////////////

module.exports = router;