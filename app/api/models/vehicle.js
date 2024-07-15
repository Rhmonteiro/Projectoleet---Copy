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

const vehicleSchema = new Schema({

    userId: { type: String, required: [true] },
    plate: { type: String, required: [true], unique:[true] },
    maker: { type: String, required: [true] },
    carModel: { type: String, required: [true] },
    year: { type: String, required:[true]},
    km:{type: Number, required: [true]},
    abate: { type: Boolean, required: [true], default: true },
    state: { type: String },
    createdTime:{type: Number},
    deleted: { type: Boolean, default: false, required: [true]},
    

});

//validator
vehicleSchema.plugin(uniqueValidator, { message: 'Erro o veículo ja existe na base de dados.' });

// Schema to model
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;