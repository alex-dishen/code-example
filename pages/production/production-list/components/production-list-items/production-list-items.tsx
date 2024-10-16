import { HandleProductionStatusArgs } from 'pages/production-workflow/controllers/types';
import { modes } from 'pages/production/constants';
import { PaginationState, ShowMoreArgs } from 'pages/production/controllers/production-filters-controller/types';
import { ProductionWorkflow, ProductionWorkflowUpdateBody } from 'services/production-workflow.model';
import { User } from 'services/user.model';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { Actions as ProductionWorkflowActions } from 'pages/production-workflow/controllers/production-workflow.controller';
import {
  ProductionListActions,
  ProductionState,
} from 'pages/production/controllers/production-list-controller/production-list.controller';
import { PermissionGuardSelectors } from 'modules/permission-guard/permission-guard.controller';
import { AccessLevel, Permission } from 'services/permission.model';
import { ProductionFiltersActions } from 'pages/production/controllers/production-filters-controller/production-filters.controller';
import { FC } from 'react';
import { LocationTheProductionStatusIsChangingFrom } from 'types/common-enums';
import NoResults from 'pages/production/components/no-results/no-results';
import InfiniteScroll from 'react-infinite-scroll-component';
import ListSpinner from 'pages/production/production-list/components/list-spinner/list-spinner';
import s from './production-list-items.module.scss';

type StateProps = {
  users: User[];
  pagination: PaginationState;
  isProductionEditPermitted: boolean;
  productionItems: ProductionState['productionItems'];
};
type DispatchProps = {
  clearFilters: VoidFunction;
  handleShowMore: (args: ShowMoreArgs) => void;
  loadMoreProductions: VoidFunction;
  deleteProductionWorkflow: (id: string) => void;
  handleProductionStatus: (args: HandleProductionStatusArgs) => void;
  handleSelectDeselectProductions: (production: ProductionWorkflow) => void;
  setProductionsWithOpenedNestedProductions: (productionId: string) => void;
  updateProduction: (id: string, value: Partial<ProductionWorkflowUpdateBody>) => void;
};
type Props = StateProps & DispatchProps;

const ProductionListItems: FC<Props> = ({
  users,
  pagination,
  productionItems,
  isProductionEditPermitted,
  clearFilters,
  handleShowMore,
  updateProduction,
  loadMoreProductions,
  handleProductionStatus,
  deleteProductionWorkflow,
  handleSelectDeselectProductions,
  setProductionsWithOpenedNestedProductions,
}) => {
  const hasMore = productionItems.data.length < pagination.total;
  if (productionItems.data.length === 0) {
    return <NoResults clearFilters={clearFilters} />;
  }
  const Component = modes[productionItems.groupBy].component;

  return (
    <>
      <InfiniteScroll
        loader={null}
        hasMore={hasMore}
        className={s.infinity_container}
        dataLength={productionItems.data.length}
        next={loadMoreProductions}
        scrollThreshold={1}
      >
        {productionItems.data.length ? (
          productionItems.data.map((item, index) => (
            <Component
              item={item}
              key={item.id}
              users={users}
              mainItemId={item.id}
              isExternal={item.is_external}
              isEditPermitted={isProductionEditPermitted}
              isLastOnList={productionItems.data.length - 1 === index}
              handleShowMore={handleShowMore}
              updateProduction={updateProduction}
              deleteAction={deleteProductionWorkflow}
              setSelectedProductions={handleSelectDeselectProductions}
              setProductionsWithOpenedNestedProductions={setProductionsWithOpenedNestedProductions}
              handleProductionStatus={(args) =>
                handleProductionStatus({
                  ...args,
                  updatingStatusFrom: LocationTheProductionStatusIsChangingFrom.ProductionList,
                })
              }
            />
          ))
        ) : (
          <NoResults clearFilters={clearFilters} />
        )}
      </InfiniteScroll>
      {hasMore && <ListSpinner size={32} containerClassName={s.spinner} />}
    </>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  users: state.production.productionList.users,
  pagination: state.production.filters.pagination,
  productionItems: state.production.productionList.productionItems,
  isProductionEditPermitted: PermissionGuardSelectors.selectIsPermitted(state, Permission.webProductionEdit, [
    AccessLevel.access,
  ]),
});
const mapDispatchToProps: DispatchProps = {
  clearFilters: ProductionFiltersActions.clearFilters,
  handleShowMore: ProductionFiltersActions.handleShowMore,
  loadMoreProductions: ProductionFiltersActions.loadMoreProductions,
  updateProduction: ProductionListActions.updateProduction,
  handleProductionStatus: ProductionWorkflowActions.handleProductionStatus,
  deleteProductionWorkflow: ProductionListActions.deleteProductionWorkflow,
  handleSelectDeselectProductions: ProductionListActions.handleSelectDeselectProductions,
  setProductionsWithOpenedNestedProductions: ProductionListActions.setProductionsWithOpenedNestedProductions,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductionListItems);
