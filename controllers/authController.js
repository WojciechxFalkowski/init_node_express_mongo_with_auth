const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
})
const User = require('../models/user')

module.exports = {
  async login (req, res, next) {
    if (req.user.verified) {
      // generate token
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: parseInt(process.env.JWT_EXPIRES_IN) }
      );
      // return token
      return res.status(200).send({ token, message: 'You have successfully logged in' });
    } else {
      return res.status(404).send({ message: 'Check your email to activate account.' });

    }
  },
  async register (req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    const user = new User({ firstName, lastName, email, verified: false });
    await User.register(user, password).then((user) => {
      res.status(200).send({ message: 'User created successfully. Check your email to activate account.' });
    })
      .catch((error) => {
        res.status(404).send({ message: error.message ? error.message : 'Ups something went wrong' })
      });

    //url to be used in the email
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: 'Verify Your Email',
      html: `
       <p>Verify your email address to complete the signup and login into your account.</p>
       <p>This link <b>expires in 6 hours.</b></p>
       <p>Press <a href="${process.env.FRONT_URL + 'verify-user/' + user.id}">link</a> to proceed.</p>`
    }
    await transporter.sendMail(mailOptions)
  },

  async verify (req, res, next) {
    let { id } = req.params
    return User.findById(id)
      .then((user) => {
        if (user.verified) {
          return res.status(404).send({ message: 'Something went wrong' })
        } else {
          user.verified = true
          user.save()
          const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: parseInt(process.env.JWT_EXPIRES_IN) }
          );
          return res.status(200).send({ token, message: 'Email has been verified' })
        }
      })
      .catch(() => {
        return res.status(404).send({ message: 'Wrong token' })
      })
  },


  async currentUser (req, res, next) {
    const BEARER = 'Bearer '
    const token = req.headers.authorization.slice(BEARER.length)
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decodedToken) {
      const user = await User.findById(decodedToken.id)
      return res.status(200).send({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    })
  },

  async forgetPassword (req, res, next) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '20m' })
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: 'Reset password',
            html: `
                <h2>Please click on given link to reset your password</h2>
                <p>This link <b>expires in 20 minutes.</b></p>
                <p>Press <a href="${process.env.FRONT_URL + 'reset-password?token=' + token}">link</a> to proceed.</p>`
          }
          transporter.sendMail(mailOptions)
          res.status(200).send({ message: 'Check your email to change password.' })
        } else {
          res.status(404).send({ message: 'Wrong email' })
        }
      })
      .catch(() => {
        res.status(404).send({ message: 'Something went wrong' })
      })
  },

  async resetPasswordCheckEmail (req, res, next) {
    let { token } = req.body
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decodedToken) {
      if (decodedToken) {
        const user = await User.findById(decodedToken.id)
        if (user) {
          res.status(200).send({
            data: {
              email: user.email
            }
          })
        } else {
          res.status(404).send({ message: 'Something went wrong' })
        }
      } else {
        res.status(404).send({ message: 'Wrong token' })
      }
    })
  },

  async resetPassword (req, res, next) {
    let { token, password } = req.body
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decodedToken) {
      if (decodedToken) {
        const user = await User.findById(decodedToken.id)
        if (user) {
          await user.setPassword(password, function (err, user) {
            user.save()
          })
          res.status(200).send({ message: 'Password has been changed' })
        } else {
          res.status(404).send({ message: 'Something went wrong' })
        }
      } else {
        res.status(404).send({ message: 'Wrong token' })
      }
    })
  }

}