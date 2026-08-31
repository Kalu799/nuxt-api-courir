import saisonsData from "../../../data/saisons.json";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id")

  const oneSaison = saisonsData.saisons.find((saison) => saison.id === id)

  return oneSaison
})