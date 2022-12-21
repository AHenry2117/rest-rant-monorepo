const router = require('express').Router()
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('json-web-token')

const { user } = db;

router.get('/profile', async (req, res) => {
    res.json(req.currentUser)
})
 
  
router.post('/', async (req, res) => {
    
    let user = await user.findOne({
        where: { email: req.body.email }
    })

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({ 
            message: `Could not find a user with the provided username and password` 
        })
    } else {
        const { value } = await jwt.encode(process.env.JWT_SECRET, {id: user.userId});
        res.json({ user, token: value });
    }
})
  
module.exports = router;