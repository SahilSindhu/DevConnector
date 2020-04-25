const validator = require('validator');
const isEmpty =require('./is-empty');

module.exports = function validateLoginInput(data){
    let errors ={};

    data.email = !isEmpty(data.email)? data.email : '';
    data.password = !isEmpty(data.password)? data.password : '';

    if(validator.isEmpty(data.email)){
        errors.email = 'Auth failed: enter a email';
    }
    if(!validator.isEmail(data.email)){
        errors.email = 'Auth failed : Enter a valid email';
    }
    if(validator.isEmpty(data.password)){
        errors.password = 'Auth failed: enter  password';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}