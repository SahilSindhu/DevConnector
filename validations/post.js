const validator = require('validator');
const isEmpty =require('./is-empty');

module.exports = function validatePostInput(data){
    let errors ={};

    data.text = !isEmpty(data.text)? data.text : '';

    if(!validator.isLength(data.text, {min:10, max: 400})){
        errors.text = 'Auth failed: Post must be 10 and 400 character';
    }
    if(validator.isEmpty(data.text)){
        errors.text = 'Auth failed: Text field is required';
    }
   

    return {
        errors,
        isValid: isEmpty(errors)
    }
}