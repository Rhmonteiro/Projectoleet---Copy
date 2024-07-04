import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

const carPartAnalyticsSchema = new Schema({
    carMaker: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 }
});

carPartAnalyticsSchema.plugin(uniqueValidator, { message: 'Error, expected carMaker to be unique.' });

const CarPartAnalytics = mongoose.model('CarPartAnalytics', carPartAnalyticsSchema);

export default CarPartAnalytics;