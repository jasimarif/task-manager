const express = require('express')
const app = express()
const multer = require('multer')
const router = express.Router() // a middleware 
const auth = require('../middleware/auth')
const User = require('../db/models/user')
app.use(router) // for express to use this middleware otherwise express will not realize this

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.getAuthorizeToken()
        res.status(201).send({ user, token })

    }
    catch (e) {
        res.status(400).send(e)
    }
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
    // console.log(req.body)
})

//login user 
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.getAuthorizeToken()
        res.send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => { //Since we have multiple tokens if the user has signed in from multiple devices we will only filter out the one which is currently beign sent by the request
            return token.token !== req.token // the returned token will be deleted from the array, if tokens array is not equal to token in the request then return false and dont delete it, other wise delete the token
        }) // token object has property token thats why token.token
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// we are using middleware auth in all the routes where authetication is required
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    // try {
    //     User.find({}).then((users) => {
    //         res.send(users)
    //     })
    // }
    // catch (e) {
    //     res.status(500).send(e)
    // }

    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         await User.findById(_id).then((user) => {
//             if (!user) {
//                 return res.send('No user found')
//             }
//             res.send(user)
//         })
//     }
//     catch (e) {
//         res.status(404).send(e)
//     }

//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.send('No user found')
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(404).send()
//     // })
// })

router.patch('/users/me', auth, async (req, res) => {
    //validation if field updated is not in db
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // 'every function' checks every item in the allowed updates array and returns false even if one item is not matched
    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates' })
    }
    try {
        const user = req.user
        //this extra code is to make sure middleware userschema run in update route
        updates.forEach((update) => {
            user[update] = req.body[update] //this will update each field provided in the request body
        })
        await user.save() // this is where middleware will come in
        // await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // await User.findByIdAndDelete(req.params.id).then((user) => {
        //     if (!user) {
        //         return res.status(404).send()
        //     }
        await req.user.remove()
        res.send(req.user)
    }
    catch (e) {
        return res.status(400).send(e)
    }
})

const upload = multer({
    // dest:'images/avatars',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        //if(!file.originalname.endsWith('.pdf')){
        //if(!file.originalname.match(/\.(doc|docx)$/)){  
        if (!file.originalname.match(/\.(PNG|jpg|jpeg)$/)) {
            return cb(new Error('Please upload a png, jpeg or jpg doc'))
        }
        cb(undefined, true)
    }
})
// handling error if post method doesnt work
router.post('/users/me/avatars', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})
router.delete('/users/me/avatars', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
})


module.exports = router