const validator = require('validator');
const isEmpty =require('./is-empty');

module.exports = function validateLoginInput(data){
    let errors ={};

    // data.name = !isEmpty(data.name)? data.name : '';
    // data.email = !isEmpty(data.email)? data.email : '';
    // data.password = !isEmpty(data.password)? data.passsword : '';
    // data.password2 = !isEmpty(data.password2)? data.password2 : '';

    if(validator.isEmpty(data.email)){
        errors.email = 'Auth failed: enter a email';
    }
    if(!validator.isEmail(data.email)){
        errors.email = 'Auth failed : Enter a valid email';
    }
    if(validator.isEmpty(new String(data.password))){
        errors.password = 'Auth failed: enter  password';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}