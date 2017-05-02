'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var RolesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    rights: [{
        type: Schema.Types.ObjectId,
        ref: "Right"
    }]
});
mongoose.model('Role', RolesSchema);