const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')


const router = express.Router()
const app = express()

const { Schema } = mongoose

const recordSchema = new Schema({
    name: String,
    phone: String
})

const Record = mongoose.model('Record', recordSchema)

app.set('port', 3000);
app.use(cors())

app.listen(app.get('port'), () => {
    console.log(`[OK] Server is running on localhost:${app.get('port')}`);
});

// mongoose.connect('mongodb://localhost:27017/test')
    mongoose.connect('mongodb://db:27017/test')
    .then(db => console.log('[OK] DB is connected'))
    .catch(err => console.error(err));

app.use('/', express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'))


router.get('/', async (req, res) => {
    res.json(await Record.find())
})

router.post('/', async (req, res) => {
    const record = new Record(req.body)
    await record.save()
    res.json({state: 'success'})
})

router.get('/:id', async (req, res) => {
    res.json(await Record.findById(req.params.id))
})
router.put('/:id', async (req, res) => {
    await Record.findByIdAndUpdate(req.params.id, req.body)
    res.json({state: 'updated'})
})

router.delete('/:id', async (req, res) => {
    await Record.findByIdAndRemove(req.params.id)
    res.json({state: 'deleted'})
})

app.use('/api/records', router)