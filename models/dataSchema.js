const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
    id: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        trim: true,
    },
    other_title: {
        type: String,
        trim: true,
    },
    embed_title: {
        type: String,
        trim: true,
    },
    sposter: {
        type: String,
        trim: true,
    },
    bposter: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
    },
    duration: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    episodes: {
        type: String,
        trim: true,
    },
    hindidub: {
        type: String,
        trim: true,
    },
    dubbed: {
        type: String,
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    date: {
        type: String,
        trim: true,
    },
    genre: {
        type: [String],
        trim: true,
    },
    status: {
        type: String,
        trim: true,
    },
    premiered: {
        type: String,
        trim: true,
    },
    language: {
        type: [String],
        trim: true,
    },
    studios: {
        type: String,
        trim: true,
    },
    rating: {
        type: String,
        trim: true,
    },
    new_rating: {
        type: String,
        trim: true,
    },
    plus18: {
        type: Boolean,
        trim: true,
    },
    producers: {
        type: String,
        trim: true,
    },
})




const allData = new mongoose.model('database', dataSchema);


module.exports = allData;