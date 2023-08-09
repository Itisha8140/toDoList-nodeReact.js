class ApiFeatures  {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          title: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = [
      "keyword",
      "page",
      "limit",
      "resultPerPage",
      "sortkey",
      "sortorder",
    ];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    console.log("queryStr: " + queryStr);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination() {
    const currentPage = Number(this.queryStr.page) || 1;
    let resultPerPage = Number(this.queryStr.resultPerPage) || 50;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(+resultPerPage).skip(+skip);
    console.log(skip);

    return this;
  }

  sort() {
    let val = this.queryStr.sortorder;
    let key = this.queryStr.sortkey;
    console.log("val", val, "key", key);
    this.query = this.query.sort({ [key]: val === "desc" ? -1 : 1 });
    return this;
  }
}
module.exports = ApiFeatures 