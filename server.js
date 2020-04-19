const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const app = express();
//body parser misddleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db= require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose
.connect(db, { useNewUrlParser: true ,
            useUnifiedTopology: true,
            useUnifiedTopology: true })
    .then(()=>{
        console.log('mongoDb connect')
    })
    .catch(()=>{
        console.log('error in mongo connection')
    })

// passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

app.get('/', (req,res)=> res.send('Hello world'));

//Routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);



//Port setting
const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server running on port ${port}`))