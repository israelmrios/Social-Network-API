const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const ReactionSchema = require('./Reaction');

const ThoughtSchema = new mongoose.Schema( 
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormat(timestamp),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON:{
            getters: true,
        }, 
        id: false,
    }
)

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

const Thought = mongoose.model('Thought', ThoughtSchema)

module.exports = Thought;
