import { queryReducer } from "./QueryReducer";
import { priceReducer } from "./PriceReducer";
import todoReducers from "./Reducers";
import { combineReducers } from "redux";
import { MessageReducer } from "./MessageReducer";

const rootReducers = combineReducers({
  todoReducers,
  queryReducer,
  MessageReducer
  // priceReducer,
});

export default rootReducers;
