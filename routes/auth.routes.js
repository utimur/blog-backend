const Router = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = new Router()

router.post(
    '/register',
    [
        check('email', 'Uncorrect email').isEmail(),
        check('username', 'Uncorrect username').isLength({min:3, max:12}),
        check('password', 'Uncorrect password').isLength({min:3, max:12}),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                res.status(400).json({message: "Uncorrect user data", errors: errors})
            }

            const {username, email, password} = req.body
            const candidateEmail = await User.findOne({email:email})
            const candidateUsername = await User.findOne({username:username})

            if(candidateEmail ) {
                return res.status(400).json({message:`User with email ${email} already exist`})
            }

            if(candidateUsername ) {
                return res.status(400).json({message:`User with username ${username} already exist`})
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({username, email, password:hashedPassword})
            await user.save()

            res.json({user: user, message: 'User was created'})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Registration error"})
        }
    }
)


router.post('/login',
    [
        check('password', 'Password is empty').notEmpty(),
        check('username', 'Username is empty').notEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Uncorrect login data", errors}, )
            }
            const {username, password} = req.body

            const user = await User.findOne({username})
            if(!user) {
                return res.status(400).json({message:"User not found"})
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password)
            if(!isPasswordMatch) {
                return res.status(400).json({message:"Uncorrect password"})
            }

            const token = jwt.sign({id: user.id}, config.get('jwtSecret'),{expiresIn: '1h'})

            res.json({token, user:{username:user.username, id:user.id, email: user.email}})
        } catch (e) {
            console.log(e)
            res.status(500).json({message:"Login error"})
        }
    }
)

module.exports = router