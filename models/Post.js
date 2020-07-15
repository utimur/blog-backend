const {Schema, model, ObjectId} = require('mongoose')

const Post = new Schema({
    name: {type: String, required: true},
    created: {type: Date, default: Date.now()},
    content: {type: String, required: true},
    readCount: {type: Number, default: 0},
    likesCount: {type: Number, default: 0},
    likers: [{type: ObjectId, ref: 'User'}],
    owner: [{type: ObjectId, ref: "User"}]
})

module.exports = model('Post', Post)