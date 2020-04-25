const validator = require('validator');
const isEmpty =require('./is-empty');

module.exports = function validateProfileInput(data){
    let errors ={};
    
    data.handle = !isEmpty(data.handle)? data.handle : '';
    data.status = !isEmpty(data.status)? data.status : '';
    data.skills = !isEmpty(data.skills)? data.skills : '';
    //data.password2 = !isEmpty(data.password2)? data.password2 : '';

    if(!validator.isLength(data.handle, {min:2, max: 30})){
        errors.handle = 'Handle must be between 2 and 30 characters';
    }
    if(validator.isEmpty(data.handle)){
        errors.handle = 'Profile Handle is requires ';
    }
    
    if(validator.isEmpty(data.status)){
        errors.status = 'Profile status is requires ';
    }
    if(validator.isEmpty(data.skills)){
        errors.skills = 'Profile skills is requires ';
    }
    if(!isEmpty(data.website)){
        if(!validator.isURL(data.website)){
            errors.website = 'Not a valid url of website'
        }
    }
    if(!isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter)){
            errors.twitter = 'Not a valid url of twitter'
        }
    }
    if(!isEmpty(data.linkdin)){
        if(!validator.isURL(data.linkdin)){
            errors.linkdin = 'Not a valid url of linkdin'
        }
    }
    if(!isEmpty(data.facebook)){
        if(!validator.isURL(data.facebook)){
            errors.facebook = 'Not a valid url of facebook'
        }
    }
    if(!isEmpty(data.instagram)){
        if(!validator.isURL(data.instagram)){
            errors.instagram = 'Not a valid url of instagram'
        }
    }
    

    return {
        errors,
        isValid: isEmpty(errors)
    }
}