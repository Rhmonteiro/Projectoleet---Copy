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

const carPartSchema = new Schema({

    userId: { type: String, required: [true] },
    rfid:{type:String, unique:[true]},
    vehicleId: {type: Schema.Types.ObjectId, ref: 'Vehicle'},
    type: { type: String, required: [true]},
    name: { type: String, required: [true] },
    description: { type: String },
    state: { type: String },
    price:{type: Number, required: [true]},
    createdTime: { type: Number },
    carMaker:{type:String},
    carModel:{type:String},
    whlocation:{type:String},
    deleted: { type: Boolean, default: false, required: [true]},
    
});

//validator
carPartSchema.plugin(uniqueValidator, { message: 'Erro a peça ja existe na base de dados.' });

// Schema to model
const CarPart = mongoose.model('CarPart', carPartSchema);

export default CarPart;