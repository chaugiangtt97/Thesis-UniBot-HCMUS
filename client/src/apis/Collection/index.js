import { createCollection } from "./createCollection";
import { getCollection } from "./getCollection";
import { getCollectionSchema } from "./getCollectionSchema";
import { getDocumentInCollection } from "./getDocumentInCollection";
import { removeCollection } from "./removeCollection";

export const useCollection = {
    getCollection,
    getCollectionSchema,
    getDocumentInCollection,
    createCollection,
    removeCollection
}