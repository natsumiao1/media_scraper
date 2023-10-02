/**
 * 参数实体类
 */
class QueryParameters {
    constructor(query = '', includeAdult = true, page = 1) {
        this.query = query;
        this.includeAdult = includeAdult;
        this.page = page;
    }

    setQuery(query) {
        this.query = query;
    }

    setIncludeAdult(includeAdult) {
        this.includeAdult = includeAdult;
    }

    setPage(page) {
        this.page = page;
    }

    getParameters() {
        return {
            query: this.query,
            include_adult: this.includeAdult,
            page: this.page,
        };
    }
}

module.exports = { QueryParameters };