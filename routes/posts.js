const express = require('express');
const router = express.Router();
const movies = require('../models/movie');
const mongoose = require('mongoose');
const posts = [
  {
    post: 'random post 1',
    id: 0,
    userID: 1,
    photoID: 1
  },
  {
    post: 'random post 2',
    id: 1,
    userID: 1,
    photoID: 0
  },
  {
    post: 'random post 3',
    id: 2,
    userID: 1,
    photoID: 1
  },
  {
    post: 'random post 4',
    id: 3,
    userID: 1,
    photoID: 0
  }
];

const getPosts = () => {

  return posts
};
const userSchema = new mongoose.Schema({ name: String })
const User = mongoose.model('abcd', userSchema);
router.get('/', async (req, res, next) => {
  const posts = getPosts();

  const data = await movies.find().limit(3)


  let a = new User({name:'Wojtek'})
  a.save(function (err) {
    if (err) console.log(err);
    // saved!
  });
  await User.create([{ name: 'Will Riker' }, { name: 'Geordi LaForge' }]);
  // User.createCollection().then(function (collection) {
  //   console.log('Collection is created!');
  //   User.create({
  //     name: 'Wojtek'
  //   })
  // });

  res.json(data);
});
module.exports = router;