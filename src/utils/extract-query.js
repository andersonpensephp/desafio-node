export const extractQuery = (query) => {
  const normalizeQuery = query?.substr(1).split('&')
    .reduce((queryParam, params) => {
        const [key, value] = params.split('=')
        queryParam[key] = value
        return queryParam
  }, {})

  return normalizeQuery
}