const express = require('express')
const app = express()
const router = express.Router()
const auth = require('../middleware/auth')
const Tasks = require('../db/models/tasks')
app.use(router)

router.post('/tasks', auth, async (req, res) => {
    // const tasks = new Tasks(req.body)
    const tasks = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try {
        await tasks.save().then(() => {
            res.status(201).send(tasks)
        })
    }
    catch (e) {
        res.status(400).send()
    }

    // tasks.save().then(() => {
    //     res.status(201).send(tasks)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const user = req.user
        // await user.populate('tasks').execPopulate()
        // res.send(user.tasks)
        const tasks = await Tasks.find({ owner: user._id })
        res.send(tasks)
    }
    catch (e) {
        res.status(500).send()
    }
    // Tasks.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id }) // tasks id should be the one given in the request and its owner should be whats coming from req.user, means only the tasks associated with particu;ar user will be displayed
        if (!task) {
            res.status(404).send('No tasks with this id is found')
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send()
    }
    // Tasks.findById(_id).then((tasks) => {
    //     if (!tasks) {
    //         res.send('No tasks with this id is found')
    //     }
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(404).send()
    // })
})


router.patch('/tasks/:id', auth,async (req, res) => {
    const updatedTasks = Object.keys(req.body)
    const allowedTasks = ["description", "completed"]
    const isValidOperation = updatedTasks.every((task) => allowedTasks.includes(task))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid field' })
    }
    try {
        const task = await Tasks.findOne({_id:req.params.id, owner: req.user._id})
        updatedTasks.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        //await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).then((user) => {
        if (!task) {
            return res.status(404).send({ error: 'Task not found' })
        }
        res.send(task);
    }
    catch (e) {
        res.status(400).send(e)
    }

})

router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({_id:req.params.id, owner:req.user._id})
            if (!task) {
                return res.status(404).send()
            }   
            res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router