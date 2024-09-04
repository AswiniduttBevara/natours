class APIFeatures{
    constructor(mongoQuery, expQuery){
        this.mongoQuery = mongoQuery;
        this.expQuery = expQuery;
    }

    filter(){
        const requestedQuery = {...this.expQuery};
        const excludedQuery = ['page', 'sort', 'limit', 'fields'];
        excludedQuery.forEach(el => delete requestedQuery[el]);


        //ADVANCE FILTERING
        let queryStr = JSON.stringify(requestedQuery);
        queryStr = JSON.parse(queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`));
        // console.log(queryStr);
        this.mongoQuery = this.mongoQuery.find(queryStr);
        // this.mongoQuery = queryStr;

        return this;
    };

    sort(){
        if(this.expQuery.sort){
            const sortBy = this.expQuery.sort.split(',').join(' ');
            this.mongoQuery = this.mongoQuery.sort(sortBy);
        }else{
            this.mongoQuery = this.mongoQuery.sort('createdAt');
        }

        return this;
    }

    limitFields(){
        if(this.expQuery.fields){
            const fields = this.expQuery.fields.split(',').join(' ');
            this.mongoQuery = this.mongoQuery.select(fields);
        }else{
            this.mongoQuery = this.mongoQuery.select('-__v');
        }

        return this;
    }

    pagination(){
        const page = this.expQuery.page*1 || 1;
        const limit = this.expQuery.limit*1 || 100;
        const skip = (page-1)*limit;

        this.mongoQuery = this.mongoQuery.skip(skip).limit(limit);

        return this;
    }
};

module.exports = APIFeatures;