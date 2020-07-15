const Router = require('express');
const router = new Router();
const Post = require('../models/Post')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/', authMiddleware,
    async (req, res) => {
        try {
            const {name, content} = req.body
            const post = new Post({name, content, owner: req.user.id})
            await post.save()
            res.json({post})
        } catch (e) {
            console.log(e)
            res.status(500).json({message:"Server error"})
        }
    }
)

router.get('/', async (req, res) => {
        try {
            const posts = await Post.find({}).populate('owner', 'username')
            res.json({posts})
        } catch (e) {
            console.log(e)
            res.status(500).json({message:"Server error"})
        }
    }
)

router.get('/:username', async (req, res) => {
        try {
            const username = req.params.username
            const user = await User.findOne({username})
            const posts = await Post.find({owner: user.id}).populate('owner', 'username')
            res.json({posts})
        } catch (e) {
            console.log(e)
            res.status(500).json({message:"Server error"})
        }
    }
)



module.exports = router