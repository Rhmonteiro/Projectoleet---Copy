/*
██████╗ ███████╗██╗   ██╗██╗ ██████╗███████╗███████╗    
██╔══██╗██╔════╝██║   ██║██║██╔════╝██╔════╝██╔════╝    
██║  ██║█████╗  ██║   ██║██║██║     █████╗  ███████╗    
██║  ██║██╔══╝  ╚██╗ ██╔╝██║██║     ██╔══╝  ╚════██║    
██████╔╝███████╗ ╚████╔╝ ██║╚██████╗███████╗███████║    
╚═════╝ ╚══════╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝╚══════╝    
                                           
███╗   ███╗ ██████╗ ██████╗ ███████╗██╗     
████╗ ████║██╔═══██╗██╔══██╗██╔════╝██║     
██╔████╔██║██║   ██║██║  ██║█████╗  ██║     
██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██║     
██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗███████╗
╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝
                                                                                                                     
*/

import mongoose from "mongoose";

const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const carModelSchema = new Schema({
    name: { type: String, required: [true]},
 

});

//validator
carModelSchema.plugin(uniqueValidator, { message: 'Error maker already exists.' });

// Schema to model
const CarModel = mongoose.model('CarModel', carModelSchema);

export default CarModel;