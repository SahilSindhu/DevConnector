const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load POSTS model
const Post = require('../../models/Post');

//Load Profile model
const Profile = require('../../models/Profile');

router.get('/test', (req,res)=>{res.json({message: "posts works"})});

// load validator
const validatePostInput = require('../../validations/post');


// Get api/posts
// fetch all
router.get('/', (req,res) =>{
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.json(err))
})

// Get api/posts/:id
// find post by id
router.get('/:id', (req,res) =>{
    Post.findById(req.params.id)
        .then((post) => res.json(post))
        .catch(err => res.status(404).json({error: 'no post found with this ID'}))
})

// DELETE api/posts/:id
// Delete post
router.delete('/:id',passport.authenticate('jwt', { session: false}) ,(req,res) =>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
            .then((post) =>{
                if(post.user.toString() !== req.user.id){
                    return res.status(401).json({ notauthorised: 'User not autherised'})
                }

                //Delete
                post.remove().then(() => res.json({ success: true}))
            })
        })
        .catch(err => res.status(404).json({error: 'Post not found'}))
})

// Post api/posts//like/:id
// Like
router.post('/like/:id',passport.authenticate('jwt', { session: false}) ,(req,res) =>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
            .then( post =>{
                
                if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                    return res.status(400).json({ alreadyLiked: 'User already liked this post'})
                }
                
                post.likes.push({user: req.user.id});
                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ postnotfound: err}))
        })
})

// Post api/posts/unlike/:id
// unlike post
router.post('/unlike/:id',passport.authenticate('jwt', { session: false}) ,(req,res) =>{
    Profile.findOne({user: req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
            .then( post =>{
                
                if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                    return res.status(400).json({ notYetLiked: 'You have not yet liked this post'})
                }
                //Get the remove index

                const removeIndex = post.likes
                                    .map(item => item.user.toString())
                                    .indexOf(req.user.id);

                post.likes.splice(removeIndex, 1);
                
                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ postnotfound: err}))
        })
})





// POST api/post
// creates a post

router.post('/', passport.authenticate('jwt', { session: false}), (req,res) =>{

    const { errors, isValid } = validatePostInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.name,
        user: req.user.id
    })

    newPost.save().then(post => res.json(post))
})


module.exports = router;