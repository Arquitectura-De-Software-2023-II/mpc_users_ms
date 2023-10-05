const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        require: true,
        minlength: 6
        
    },
    role: {
        type: String,
        require: true,
        
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// Define the findByEmail() method
userSchema.statics.findByEmail = async function (email) {
    const user = await this.findOne({ email });
    return user;
  };

module.exports = mongoose.model('User', userSchema)