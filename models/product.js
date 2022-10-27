const { Schema, model } = require('mongoose')

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio.'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
  
        type: Schema.Types.ObjectId,

        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: { type: String },
    availabe: { type: Boolean, default: true },
    img: { type: String }
})


ProductSchema.methods.toJSON = function () {
    const { __v, state, ...data } = this.toObject()
    return data
}


module.exports = model('Product', ProductSchema)