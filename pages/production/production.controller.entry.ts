import { combineReducers } from 'redux';
import { reducer as productionReducer } from './controllers/production-list-controller/production-list.controller';
import { Reducer as filtersReducer } from './controllers/production-filters-controller/production-filters.controller';
import { reducer as productsLaunchModalReducer } from './controllers/products-launch-modal-controller/products-launch-modal.controller';

export const reducer = combineReducers({
  filters: filtersReducer,
  productionList: productionReducer,
  productsLaunchModal: productsLaunchModalReducer,
});