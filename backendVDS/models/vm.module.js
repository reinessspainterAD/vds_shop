const mongoose = require('mongoose')

const vmSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        vmId: { type: Number, required: true, unique: true },
        name: { type: String },
        memory: { type: Number },
        socket: { type: Number },
        cpu: { type: Number },
        disk: { type: Number },
        iso: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { collection: 'vm-data' }
)

const model = mongoose.model('VMData', vmSchema)

module.exports = model