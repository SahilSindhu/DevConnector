const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');

const router = express.Router();

//load input validations
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
//load user model
const User =require('../../models/Users');

router.get('/test', (req,res)=>{res.json({message: "users works"})});


//register user route
router.post('/register',(req,res)=>{
    const { errors, isValid } = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
    .then((user)=>{
        
        if(user){
            return res.status(400).json({email: "Email already exists"})
        }else{
            const avatar = gravatar.url(req.body.email,{
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
            })
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password, salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password= hash;

                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                })
            })
        }
    })
})


// user login and return token
router.post('/login', (req,res)=>{
    const email =   req.body.email;
    const password = req.body.password;

    const { isValid, errors } = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    
    User.findOne({email})
        .then( user =>{
            if(!user){
                return res.status(404).json({email: "User doesn't exist"})
            }
            bcrypt.compare(password, user.password)
                .then(isMatch =>{
                    if(isMatch){
                        //create payload for jwt token;
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }
                        //Sign token
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600}, 
                            (err,token)=>{
                                res.json({
                                    success: true,
                                    token: 'Bearer '+ token
                                })
                            }
                        )
                    } else{
                        return res.status(400).json({password:'invalid password'})
                    }
                })
        })
})

//return current user /private
router.get('/current', passport.authenticate('jwt', { session: false}), (req,res)=>{
    res.json(req.user)
})



module.exports = router;