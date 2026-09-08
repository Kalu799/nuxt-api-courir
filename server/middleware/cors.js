export default defineEventHandler((event) => {
  const origin = getHeader(event, 'origin')

  if (!origin) return

  // L’App User vit sur une autre origine. Elle utilise des tokens Bearer, pas
  // des cookies : renvoyer l’origine suffit et traite la prévalidation OPTIONS.
  setHeader(event, 'Access-Control-Allow-Origin', origin)
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Authorization, Content-Type')
  setHeader(event, 'Vary', 'Origin')

  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
