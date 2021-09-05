const mongoose = require('mongoose');

const achievementSchema = new  mongoose.Schema({
    team_name: {
        type: String,
        required: [true, 'Please enter team name']
    },
    title: {
        type: String,
        required: [true, 'Please enter title for echievement']
    },
    position: {
        type: String,
        required: [true, 'Please enter position']
    },
    date: {
        type: Date,
        required: [true, 'Please enter event date']
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    hidden: {
        type: Boolean,
        default: false
    }
});

const Achievement = mongoose.model('Achievement', achievementSchema);
module.exports = Achievement;