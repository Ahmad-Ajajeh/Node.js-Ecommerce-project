class ApiFeatures {
  constructor(mongooseQuery, query) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
  }

  filter() {
    let queryObj = { ...this.query };
    // console.log(queryObj);
    // console.log("//////////////////////////");
    const exclude = ["page", "limit", "sort", "fields", "keyword"];
    exclude.forEach((p) => delete queryObj[p]);

    // console.log(queryObj);

    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryObj);

    this.mongooseQuery = this.mongooseQuery.find(queryObj);
    return this;
  }

  sort() {
    // console.log(this.query);
    if (this.query.sort) {
      const sort = this.query.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sort);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select(" -__v");
    }
    return this;
  }

  search() {
    if (this.query.keyword) {
      const q = {};
      const keyword = this.query.keyword;
      q.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
      console.log(q);
      this.mongooseQuery = this.mongooseQuery.find(q);
    }

    return this;
  }

  paginate(countDocuments) {
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    // const endIndex = page * limit;

    // const pagination = {};
    // pagination.currentPage = page;
    // pagination.limit = limit;
    // pagination.numberOfPages =
    //   countDocuments / limit + (countDocuments % limit == 0 ? 0 : 1);
    // console.log(countDocuments % limit);
    // if (endIndex < countDocuments) pagination.next = page + 1;
    // if (skip > 0) pagination.prev = page - 1;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    // this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
