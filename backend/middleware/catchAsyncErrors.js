//this fuction or file is used for async error handling such as if someone doesnt write the field which is required then server gets crash to be aware of the error is occured due to required feild is not given we made this handler

module.exports = (theFunc)=>(req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next);
}