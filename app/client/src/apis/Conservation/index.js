import { create } from "./create";
import { get } from "./get";
import { getHistory } from "./getHistory";
import { getRecommendedQuestions } from "./recommendedQuestions";
import { remove } from "./remove";
import { update } from "./update";

export const useConservation = {
    create,
    get,
    getHistory,
    remove,
    update,
    getRecommendedQuestions
}