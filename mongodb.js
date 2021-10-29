//CRUD create read update delete

const { MongoClient, ObjectID } = require('mongodb') // destructuring from returned mongodb object

//const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017' // we have used IP of local host instead of writing localhost
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => { //connect method is used to connect to the db
    if (error) {
        return console.log("Unable to connect") //return is used to stop execution
    }
    const db = client.db(databaseName); // client is the argument of callback function

    ////////////////////////INSERT ONE///////////////////////////////////////////////

    // db.collection('users').insertOne({ // collection in mongodb is like a table in mongodb, name of the collection is users
    //     "name":"Jasim",
    //     "age":27
    // }, (error,result)=>{
    //     if(error){
    //         return console.log("Some error occured");
    //     }
    //     console.log(result.ops); // ops is an argument is result object that contains the document we have added
    // })
    // db.collection('users').insertMany([
    //     {
    //         name:"Taha",
    //         age:35
    //     },{
    //         name:"Uzair",
    //         age:33
    //     }

    // ], (error,result)=>{
    //     if(error){
    //         return console.log("Unable to insert document!!");
    //     }
    //     console.log(result.ops);
    //  })

    ///////////////////////////////INSERT MANY//////////////////////////

    // db.collection('tasks').insertMany([
    //     {
    //         description : "Authethication of App",
    //         status : false
    //     },{
    //         description: "Uploading theme",
    //         status: false
    //     }, {
    //         description: "discussion about features",
    //         status: true
    //     }
    // ], (error,result)=>{
    //     if(error){
    //         return console.log("Unable to add documents");
    //     }
    //     console.log(result.ops);
    // })

    ///////////////////////////FIND ONE/////////////////////////////
    // db.collection('users').findOne({name:"Jasim"},(error,result)=>{
    //     if(error){
    //         return console.log("Unable to find user");
    //     }
    //     console.log(result);
    // })

    ///////////////////////////FIND ONE BY ID///////////////////////

    // db.collection('users').findOne({ _id:new ObjectID('5ed603f9ff16712c0c335e83')},(error,result)=>{
    //         if(error){
    //             return console.log("Unable to find user");
    //         }
    //         console.log(result);
    //     })

    ////////////////////////////////FIND/////////////////////////////
    // db.collection('tasks').find({status:false}).toArray((error,tasks)=>{ //find returns a cursor on which we can apply functions like toarray and others
    //     console.log(tasks);
    // });

    //////////////////////////UPDATE ONE///////////////////////////////////

    // db.collection('users').updateOne(
    //     {
    //         _id: new ObjectID('5ed603f9ff16712c0c335e83')
    //     }, {
    //     $set: {
    //         name: 'Ali'
    //     }
    // }).then((result) => {
    //     console.log('Update successfully', result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    /////////////////////////////////////UPDATE MANY///////////////////////////
    // db.collection('tasks').updateMany({
    //     status: false
    // }, {
    //     $set: {
    //         status: true
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error)
    // })
    /////////////////////////////////DELETE MANY////////////////////////////////
    db.collection('users').deleteMany({
        age:27
    }).then((results)=>{
        console.log(results);
    }).catch((error)=>{
        console.log(error)
    })
})