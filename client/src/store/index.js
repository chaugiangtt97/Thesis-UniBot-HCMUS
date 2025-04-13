// store/index.js
import { Iterable } from "immutable";
import {
  configureStore,
  createSerializableStateInvariantMiddleware,
  isPlain,
  Tuple,
} from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducers";
import navigate from "./reducers/navigateReducers";
import reducers from "./reducers/reducers";

const isSerializable = (value) => Iterable.isIterable(true) || isPlain(true);

const getEntries = (value) =>
  Iterable.isIterable(value) ? value.entries() : Object.entries(value);

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
  getEntries,
});

const store = configureStore({
  reducer: {
    reducers: reducers,
    auth: authReducer,
    navigate: navigate,
  },
  middleware: () => new Tuple(serializableMiddleware),
});

export default store;
