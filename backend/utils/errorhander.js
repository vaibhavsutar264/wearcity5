// here we will use the class for specifiing error in a single line instead of writing 5-6 lines of codes for that status code and error message and if product not found statements


class ErrorHander extends Error {
    //here Error is the predefined node class  
    //   here our ErrorHander class has been inherited in error class 
    constructor(message, statusCode) {
        super(message); //here super keyword is used to give property by the 1st initial class that is predefined error class in our case
        this.statusCode = statusCode
        // now by basic object oriented programing method if we have inherited Error predefined class in our class then we can also use his functions so same we were using predefined capture function
        Error.captureStackTrace(this, this.constructor)

        // here captureStackTrace takes 2 parameters 1st is target object which is ErrorHander and constructor is constructor 


    }


}

module.exports= ErrorHander

// now for working of this we need to make a middle ware