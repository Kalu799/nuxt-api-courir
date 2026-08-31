import saisonsData from "../../../data/saisons.json";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id")

  const oneSaison = saisonsData.saisons.find((saison) => saison.id === id)

  if(!oneSaison) {
    throw createError({
      statusCode: 404,
      statusMessage: "Saison introuvable"
    })
  }

  return oneSaison
})