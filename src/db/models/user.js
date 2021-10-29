const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//defining a model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        trim: true,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Password must not contain password')
            }
        }
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Wrong email address')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }

    }],
    avatar : {
        type:Buffer
    }
})
//in this virtual field a relationship is being made between tasks and user 
userSchema.virtual('tasks',{
    'ref': 'Tasks',
    'localField': '_id',
    'foreignField': 'owner'
})
// methods are available in instance level
userSchema.methods.getAuthorizeToken = async function () {
    user = this
    const token = jwt.sign({ _id: user.id.toString() }, 'thisismysecret')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token

}

userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

//statics methods are available in models
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

//run this code before user is saved, hashing the password
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) { //ismodified is used to check whether the password is already hashed or not
        user.password = await bcrypt.hash(user.password, 8)  // 8 rounds to encrypt user password
    }
    next()

})

const User = mongoose.model('User', userSchema)


//making an instance
// const me = new User({
//     name:'Jasim',
//     age:27,
//     email:'jasim@f.com          ',
//     password: 'jasim'
// })

//saving the model

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error', error)
// });

module.exports = User