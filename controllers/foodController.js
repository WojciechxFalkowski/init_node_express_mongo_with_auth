const Food = require('../models/food')
module.exports = {
  async findOne (req, res, next) {
    const query = { slug: req.params.slug }
    const response = await Food.findOne(query)

    if (!response) {
      return next()
    }

    return res.status(200).send({ data: response })
  },

  async findAll (req, res) {
    const offset = parseInt(req.query.offset) || 0
    const per_page = parseInt(req.query.per_page) || 2
    const foodPromise = Food.find().skip(offset).limit(per_page).sort({ createdAt: 'desc' })
    const countPromise = Food.count()
    const [food, count] = await Promise.all([foodPromise, countPromise])
    return res.status(200).send({ data: food, count })
  },

  async create (req, res) {
    const food = await new Food({ name: req.body.name }).save()
    return res.status(201).send({ data: food, message: 'Food was created.' })
  },

  async update (req, res, next) {
    const query = { slug: req.params.slug }
    const food = await Food.findOne(query)

    if (!food) {
      return next()
    }

    food.name = req.body.title
    await food.save()

    return res.status(200).send({ data: food, message: 'Food was updated.' })
  },

  async remove (req, res) {
    const query = { slug: req.params.slug }
    const response = await Food.findOne(query)

    if (!response) {
      return res.status(404).send({ message: 'Food with given slug doesn\'t exist' })
    }

    await Food.deleteMany(query)

    return res.status(200).send({ message: 'Food removed' })
  }
}


