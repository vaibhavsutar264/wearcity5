class ApiFeatures {
    constructor(query,queryStr){
        // here querystr means query string
        this.query = query;
        //this.query means Product.find() which finds all of the products in all products
        this.queryStr = queryStr;
        
        //querystr means req.query.keyword
        // keyword is the name u will search while searching for a products
        // req.query is like req.params in req.params we take th id from url and in req.query we will find the product through url

    }

    search(){
        // got to product controller there what is query and what is query str mentions in get all products
        const keyword = this.queryStr.keyword
        // this.queryStr.keyword is equal to req.query.keyword because query str we will take from query of url
        // here below ? is used whic is the ternary operator syntax followed means if we get a query value in keyword
        ? {
            //now we will find the name , here name is the word which is used to find the keyword
            name: {
                //here this name is nothing but the product model name all the product has given name this is that name only menas we were finding the data through its name
                $regex: this.queryStr.keyword, //regex is the regurlar expression operator of mongodb 
                $options: "i", //i means case sensitive means if capital abc is searched then it will also give results for small abc it is stated on mongo db website
            },
        }
        : {};

        // console.log(keyword); //by this console log u get the value such as name in ur terminal

        this.query = this.query.find({...keyword});
        //here we have changed the product.find to product.find({...keyword}); here we put the keyword to find
        return this
    }

    //this all search thing will only be applicable fro all products api

    filter(){
        //this querystrcopy i for category
        const queryCopy = {...this.queryStr} //spread operator is used to kep the copy as a new query fro filter without spread operatorwhatever u chaneg in querycopy it will affect the this.querystr

        //removing some fields for category in this filter only sorting type such as fields branch this type of things should be filtered so in this name which we use in search box shd not filter because filter is different from search search searches product based on name and filter gives product based on brand type and price low or high so below we are removing search keywords 

        const removeFields = ["keyword","page","limit"];

        removeFields.forEach((key)=> delete queryCopy[key]);
        // key= keyword page limit

        //filter for price and rating

        console.log(queryCopy);

        let queryStr = JSON.stringify(queryCopy);
        //here stringify is required because query str is the object bcz products are objects so in order to get the greater than and less than we need to string it
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=> `$${key}`); 
        //here gt means greater than and gte is greater than equal to u can also wite prie[gt] in postman in keyword to get the range of price for products
        

        // now this.query means product.find
        this.query = this.query.find(JSON.parse(queryStr));

        console.log(queryStr);

        return this;



    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        //now if u wants to go on 2nd page then u have to skip 1st page if u wants to go on 4th page then u have to skip the 1st 2 pages that is 1st and 2nd page

        const skip = resultPerPage*(currentPage-1);
        //for example u have 10 products per page then if u wants to go on 3rd page then previous 2 pages products which is 20 products should not shown to u so for that skip = 10*(3-1)=20 so in this way previous 20 products will not be shown
        
        this.query = this.query.limit(resultPerPage).skip(skip);
        // over above this.query is product.find and after getting product.find u get all the products now after applying limit on it we will get  products only and when u get on 2nd page previous 5 products deleted

        return this
    }
}

module.exports = ApiFeatures;