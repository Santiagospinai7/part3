const uniqueValidator = require('mongoose-unique-validator')
const { Schema, model } = require('mongoose')

// Define a schema
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  email: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
})

// Transform the object returned by Mongoose
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    // Delete the _id and __v properties
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

// Define a model to create users
const User = model('User', userSchema)

module.exports = User
