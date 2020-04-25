const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

//Load profile validator
const validateProfileInput = require('../../validations/profile');
const validateExperienceInput = require('../../validations/experience');
const validateeducationInput = require('../../validations/education');

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
    .populate('user',['name','avatar'])
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
  
    const { errors , isValid } = validateProfileInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }


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
            
            
            Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true })
                .then(profile => res.json(profile))
                .catch(err =>{
                    return res.status(400).json(err)
                })
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
    .catch(err =>{
        
        res.status(400).json(err)
    })

})


//GET api/profile/handle/:handle
// get profile details by handle

router.get('/handle/:handle', (req,res)=>{
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile = 'there is no profile for this user';
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err =>res.status(404).json(err))
})



//GET api/profile/handle/:user_id
// get profile details by user id

router.get('/user/:user_id', (req,res)=>{
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile = 'there is no profile for this user';
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err =>res.status(404).json(err))
})

//GET api/profile/all
// get all profile

router.get('/all', (req,res)=>{
    const errors = {};
    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles =>{
        if(!profiles){
            errors.noprofile = 'there are no profiles';
            res.status(404).json(errors)
        }
        res.json(profiles)
    })
    .catch(err =>res.status(404).json(err))
})


// POST api/profile/experience
// add experience to the profile

router.post('/experience', passport.authenticate('jwt', { session: false}), (req,res)=>{
    const { errors , isValid } = validateExperienceInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    
    Profile.findOne({user: req.user.id})
    .then( profile =>{
       const newExperience = {
           title: req.body.title,
           company: req.body.company,
           location: req.body.location,
           from: req.body.from,
           to: req.body.to,
           current: req.body.current,
           description: req.body.description,

       }

       //Add to exp array
       profile.experience.unshift(newExperience);

       profile.save().then(profile => res.json(profile))
    })
    .catch( err =>{
        res.status(404).json({error: err})
    })
})

// Delete api/profile/experience/:edu_id
// delete experience from the profile

router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false}), (req,res)=>{
    
    Profile.findOne({user: req.user.id})
    .then( profile =>{
       let removeIndex = profile.experience
                        .map(item => item.id)
                        .indexOf(req.params.exp_id)
       //Remove from array
       profile.experience.splice(removeIndex, 1);

       profile.save().then(profile => res.json(profile))
       .catch(err =>{
           return res.status(404).json(err)
       })
    })
    .catch( err =>{
        res.status(404).json({error: err})
    })
})


// Delete api/profile/education/:edu_id
// delete education from the profile

router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false}), (req,res)=>{
    
    Profile.findOne({user: req.user.id})
    .then( profile =>{
       let removeIndex = profile.education
                        .map(item => item.id)
                        .indexOf(req.params.exp_id)
       //Remove from array
       profile.education.splice(removeIndex, 1);

       profile.save().then(profile => res.json(profile))
       .catch(err =>{
           return res.status(404).json(err)
       })
    })
    .catch( err =>{
        res.status(404).json({error: err})
    })
})


// Delete api/profile
// delete profile and user

router.delete('/', passport.authenticate('jwt', { session: false}), (req,res)=>{
    
    Profile.findOneAndRemove({user: req.user.id})
    .then( () =>{
       User.findOneAndRemove({_id: req.user.id})
       .then(() =>{
           return res.json( {success: true})
       })
    })
    .catch( err =>{
        res.status(404).json({error: err})
    })
})

// POST api/profile/education
// add education to the profile

router.post('/education', passport.authenticate('jwt', { session: false}), (req,res)=>{
    const { errors , isValid } = validateeducationInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id})
    .then( profile =>{
       const neweducation = {
           school: req.body.school,
           degree: req.body.degree,
           fieldofstudy: req.body.fieldofstudy,
           from: req.body.from,
           to: req.body.to,
           current: req.body.current,
           description: req.body.description,

       }

       //Add to exp array
       profile.education.unshift(neweducation);

       profile.save().then(profile => res.json(profile))
       .catch(err =>{
           return res.status(202).json(err)
       })
    })
    .catch( err =>{
        res.status(404).json({error: err})
    })
})

module.exports = router;