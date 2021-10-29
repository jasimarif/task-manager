const mongoose = require('mongoose')
const validator= require('validator')

// require('./db/mongoose')

const Tasks= mongoose.model('Tasks',{
    description: {
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false 
    },
    owner:{ // this field creates relationship between tasks and owner
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    } 
}) 

module.exports=Tasks



// appTasks.save().then(()=>{
//     console.log(appTasks)
// }).catch((error)=>{
//     console.log(error);
// });