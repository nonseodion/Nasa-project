const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query){
  let {limit, page} = query;
  limit = Math.abs(limit || DEFAULT_PAGE_LIMIT);
  page = Math.abs(page || DEFAULT_PAGE_NUMBER);
  const skip = (page-1) * limit;
  return {skip, limit};
}

module.exports = {
  getPagination
}