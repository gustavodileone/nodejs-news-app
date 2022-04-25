module.exports = {
    pagination(page, limit, dbAllResults, redirect) {
        page = page ? parseInt(page) : 1;

        const paginator = {};
        
        if(dbAllResults.length == 0) {
            paginator.err = false;
            paginator.paginatedResults = [];

            return paginator;
        }

        if(page < 1) {
            paginator.err = true;
            paginator.status = 400;
            paginator.redirect = redirect;

            return paginator;
        }

        const offset = Math.ceil((page - 1) * limit);

        const paginatedResults = dbAllResults.slice(offset, offset + limit);
        const theresMoreResults = dbAllResults.slice(offset + limit)[0] == undefined ? true : false;

        const totalPages = Math.ceil(dbAllResults.length / limit);

        if(page > totalPages) {
            paginator.err = true;
            paginator.status = 400;
            paginator.redirect = redirect + "?page=" + encodeURIComponent(totalPages);
            
            return paginator;
        }

        paginator.prev = true;
        paginator.next = true;
        paginator.page = page;
        paginator.redirect = redirect;
        paginator.paginatedResults = paginatedResults;

        if(offset < 1)
            paginator.prev = false;

        if(theresMoreResults)
            paginator.next = false;

        return paginator;
    }
}