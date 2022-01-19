class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr
    }
    search(){ //for searching  product
        const keyword=this.queryStr.keyword ?
        {
            product_name:{
                $regex:this.queryStr.keyword, 
                $options:"i",
            },
        }
        :{};
        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){ //for filtering
        const queryCopy={...this.queryStr}
        this.query=this.query.find(queryCopy);
        return this;
    }

    pagination(resultPerPage){ //for pagination
        const currentPage = Number(this.queryStr.page)|| 1; 
        const skip = resultPerPage *(currentPage-1) ;       
        this.query= this.query.limit(resultPerPage).skip(skip);      
        return this;
    }
};
export default ApiFeatures