import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import PostsReducer from "./reducers/PostsReducer";
import thunk from "redux-thunk";
import { AuthReducer } from "./reducers/AuthReducers";
import todoReducers from "./reducers/Reducers";
import { queryReducer } from "./reducers/QueryReducer";
import { priceReducer } from "./reducers/PriceReducer";
import { itineraryReducer } from "./reducers/ItineraryDataReducer";
import { stepperReducer } from "./reducers/stepperReducer";
import { supplierReducer } from "./reducers/SupplierReducer";
import ItineraryServiceReducer from "./reducers/ItineraryServiceReducer";
import { MessageReducer } from "./reducers/MessageReducer";

import supplierSectionStateChangeReducer from "./supplierSectionStateChange/supplierConfirmation";
import activeTabOperationReducer from "./activeTabOperations/activeTabOperation";
import inineraryServiceDataLoadReducer from "./itineraryServiceLoadReducer/itineraryServiceReducer";
import createExcortDayLocalForeignerReducer from "./reducers/createExcortLocalForeignerReducer";

import tabWiseDataLoadReducer from "./itineraryTabReducer/tabWiseDataLoadReducer";

//import { reducer as reduxFormReducer } from 'redux-form';
import activeTabReducer from "./activeTabActions/activeTabActions";
import chatUserDataReducer from "./reducers/ChatUserDataReducer";
import countReducer from "./reducers/countReducer";
import { itineraryFromDataReducer } from "./reducers/itineraryReducers/trainReducers";
import itinararyLocalForeignerDataReducer from "./reducers/itenararyLocalForeignerReducer/itenararyTransportReducer";

// Itinerary Copy Logic
import itineraryServiceCopyReducer from "./reducers/itineraryServiceCopyReducers/itineraryServiceCopyReducer";
import itineraryUpgradeReducer from "./reducers/itineraryServiceCopyReducers/itineraryUpgradeReducer";

// Operation part
import { operationSupplierConfirmationReducer } from "./reducers/operationsReducer/supplierConfirmation/supplierConfirmationReducer";

// Create query part
import { createQueryPageReducer } from "./reducers/createQueryReducer/createQueryReducer";
import finalQueryDataReducer from "./reducers/applicationLevelReducers/queryFinalReducer";

// Quotation - Four Reducer
import { queryQuotationFourReducer } from "./itineraryFourReducer/QueryQuotation.reducer";

const middleware = applyMiddleware(thunk);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  posts: PostsReducer,
  auth: AuthReducer,
  todoReducers,
  queryReducer,
  priceReducer,
  itineraryReducer,
  stepperReducer,
  supplierReducer,
  ItineraryServiceReducer,
  MessageReducer,
  activeTab: activeTabReducer,
  chatUserDataReducer: chatUserDataReducer,
  count: countReducer,
  supplierStateReducer: supplierSectionStateChangeReducer,
  activeTabOperationReducer: activeTabOperationReducer,
  inineraryServiceDataLoadReducer: inineraryServiceDataLoadReducer,
  createExcortDayLocalForeignerReducer: createExcortDayLocalForeignerReducer,
  tabWiseDataLoadReducer: tabWiseDataLoadReducer,
  itineraryFromDataReducer,
  itinararyLocalForeignerDataReducer,
  itineraryServiceCopyReducer,
  itineraryUpgradeReducer,
  operationSupplierConfirmationReducer,
  createQueryPageReducer,
  finalQueryDataReducer,
  queryQuotationFourReducer,
});

export const store = createStore(reducers, composeEnhancers(middleware));
