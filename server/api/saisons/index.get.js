import saisonsData from "../../../data/saisons.json";

export default defineEventHandler(() => {
  return saisonsData.saisons;
});