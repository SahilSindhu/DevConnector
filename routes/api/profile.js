const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

//Load profile model
const Profile = require('../../models/Profile');
//Load User model
const User = require('../../models/Users');


router.get('/test', (req,res)=>{res.json({message: "Profile works"})});


//Get profile api
//Private
router.get('/', passport.authenticate('jwt', { session: false}), (req,res)=>{
    let errors = {}
    Profile.findOne({user: req.user.id})
    .then( profile =>{
        errors.noProfile = 'There is no Profile for this user'
        if(!profile){
            return res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch( err =>{
        res.status(404).json({error: err})
    })
})


//Post api/profile
//Private
//create or edit profile

router.post('/', passport.authenticate('jwt', { session: false}), (req,res)=>{
    let errors = {}
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubsername) profileFields.githubsername = req.body.githubsername;
    if(req.body.skills !== 'unndefined'){
        profileFields.skills = req.body.skills.split(',');
    } 
    //Socail
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkdin) profileFields.social.linkdin = req.body.linkdin;
    if(req.body.instagram) profileFields.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
    .then(profile =>{
        if(profile){
            //Update
            Profile.findByIdAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }).then(profile => res.json(profile))
        }
        else{
            //Create
            Profile.findOne({handle: profileFields.handle})
            .then((profile)=>{
                if(profile){
                    errors.handle = 'This username already taken';
                    res.status(400).json(errors)
                }else{
                    new Profile(profileFields).save().then(profile =>{
                        res.json(profile);
                    })
                }
            })
        }
    })

})

module.exports = router;