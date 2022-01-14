const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs')

const foodSchema = new mongoose.Schema({
  name: {
    type: String
  }
}, { timestamps: true, collection: 'food' });

foodSchema.plugin(URLSlugs('name', { field: 'slug', update: true }))

const Food = mongoose.model('food', foodSchema)

module.exports = Food