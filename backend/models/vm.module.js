const mongoose = require('mongoose')

const vmSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        vmId: { type: Number, required: true, unique: true },
        name: { type: String },
        memory: { type: Number },
        cpu: { type: Number },
        disk: { type: Number },
        os: { type: String },
        startDate: {type: Date},
        endDate: {type: Date},
        active: {type: Boolean},
        costDay: {type: Number},
        costFull: {type: Number},
    },
    { collection: 'vm-data' }
)

const model = mongoose.model('VMData', vmSchema)

module.exports = model