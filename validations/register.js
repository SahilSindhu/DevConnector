const validator = require('validator');
const isEmpty =require('./is-empty');

module.exports = function validateRegisterInput(data){
    let errors ={};

  
    data.name = !isEmpty(data.name)? data.name : '';
    data.email = !isEmpty(data.email)? data.email : '';
    data.password = !isEmpty(data.password)? data.password : '';
    data.password2 = !isEmpty(data.password2)? data.password2 : '';

  
    if(!validator.isLength(data.name, {min:2, max: 30})){
        errors.name = 'name must be between 2 and 30 characters';
    }
    if(validator.isEmpty(data.email)){
        errors.email = data.email;
    }
    if(!validator.isEmail(data.email)){
        errors.email = 'Enter a valid email';
    }
    if(validator.isEmpty(data.password)){
        errors.password = data.password;
    }
    if(validator.isEmpty(data.password2)){
        errors.password = 'password2 field is required';
    }

    if(!validator.isLength(data.password, {min:5, max: 30})){
        errors.password = 'password must be between 6 and 30 characters';
    }
    if(!validator.equals(data.password, data.password2)){
        errors.password = 'Both password must match';
    }
    

    return {
        errors,
        isValid: isEmpty(errors)
    }
}