const mongoose = require('mongoose')

const Server = new mongoose.Schema(
    {
        name: { type: String, required: true},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { collection: 'server-data' }

)