require('dotenv').config({ path: '.env' })
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const passport = require('./config/passport')

const config = require('./config/config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
passport()

mongoose.connect(`${config.mongodb_key}${config.database}?retryWrites=true&w=majority`, {})
  .then(() => {
    console.log('Database connection successful')
  })
  .catch(err => {
    console.error('Database connection error')
  });



const postsRouter = require('./routes/posts');
const foodRouter = require('./routes/food');
const auth = require('./routes/auth');

app.use('/abc', postsRouter)
app.use('/food', foodRouter)
app.use('/auth', auth)

app.get('/posts', (req, res) => {

});

app.get('/', (req, res) => {
  res.json({ message: '/backend-api -> GET: /get-posts' });
});

app.listen(8081, () => {
  console.log('app listening on port 8081!');
});
