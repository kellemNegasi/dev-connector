
const { default: validator } = require('validator');
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function ValidatePostInput(data){
    let errors = {};
  data.text = !isEmpty(data.text) ? data.text : '';
  if (!validator.isLength(data.text, { min: 10, max:300})){
    errors.post = "Post must between 10 and 300 characters";
  }
    if(validator.isEmpty(data.text)){
        errors.text ="text field is Empty";
    }
    return {errors,
        isValid:isEmpty(errors)}
}