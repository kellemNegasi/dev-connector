
const { default: validator } = require('validator');
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function ValidateRegistorInput(data){
    let errors = {};
    data.name = !isEmpty(data.name)?data.name:'';
    data.email = !isEmpty(data.email)?data.email:'';
    data.password = !isEmpty(data.password)?data.password:'';
    data.password2 = !isEmpty(data.password2)?data.password2:'';



    if(!Validator.isLength(data.name,{min:2,max:30})){
        errors.name = "Name must be between 2 and 30 characteres long";
    }
    if(validator.isEmpty(data.name)){
        errors.name ="Name field is required";
    }
    if(validator.isEmpty(data.email)){
        errors.email ="Email field is required";
    }
    if(!validator.isEmail(data.email)){
        errors.email ="Email is invalid";
    }
  
    if(!Validator.isLength(data.password,{min:6,max:30})){
        errors.password = "password must be atleast 6 long";
    }

    if(!validator.equals(data.password,data.password2)){
        errors.password2 ='passwords must match';
    }
    if(validator.isEmpty(data.password)){
        errors.password ="password field is required";
    }
    if(validator.isEmpty(data.password2)){
        errors.password2 ="Confirm password field is required";
    }
    return {errors,
        isValid:isEmpty(errors)}
}