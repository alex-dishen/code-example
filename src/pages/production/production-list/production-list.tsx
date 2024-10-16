import { connect } from 'react-redux';
import { Stack } from '@mui/material';
import { AppState } from 'redux/store';
import { FC, useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import Skeleton from 'components/ui-new/skeleton/skeleton';
import { UseWebsocketType } from 'pages/production/production-list/types';
import EditOrderModal from 'pages/production/edit-order-modal/edit-order-modal';
import EditClientModal from 'pages/production/edit-client-modal/edit-client-modal';
import EditVariantModal from 'pages/production/edit-variant-modal/edit-variant-modal';
import ProductsLaunchModal from 'pages/production/products-launch-modal/products-launch-modal';
import ManageComponentsModal from 'pages/production/manage-components-modal/manage-components-modal';
import ComponentsHistoryModal from 'pages/production/components-history-modal/components-history-modal';
import DeleteProductionsModal from 'pages/production/delete-productions-modal/delete-productions-modal';
import ManageTaskPriorityModal from 'pages/production/manage-task-priority-modal/manage-task-priority-modal';
import { WebsocketResponseMessageForProductionWorkflowT } from 'pages/production/controllers/production-list-controller/types';
import { ProductionFiltersActions } from 'pages/production/controllers/production-filters-controller/production-filters.controller';
import { ProductionListActions } from 'pages/production/controllers/production-list-controller/production-list.controller';
import ProductionListItems from 'pages/production/production-list/components/production-list-items/production-list-items';
import s from './production-list.module.scss';

type StateProps = {
  isFetchingData: boolean;
  isLoadingFilters: boolean;
};
type DispatchProps = {
  init: VoidFunction;
  clearFiltersState: VoidFunction;
  handleWebsocketResponse: (message: WebsocketResponseMessageForProductionWorkflowT) => void;
};
type Props = StateProps & DispatchProps;

const ProductionList: FC<Props> = ({ isFetchingData, isLoadingFilters, init, clearFiltersState, handleWebsocketResponse }) => {
  const didUnmount = useRef(false);
  const { lastJsonMessage }: UseWebsocketType = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL, {
    shouldReconnect: () => {
      return didUnmount.current === false;
    },
    reconnectAttempts: 10,
    reconnectInterval: 2000,
  });

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  useEffect(() => {
    if (!lastJsonMessage) return;

    handleWebsocketResponse(lastJsonMessage);
  }, [lastJsonMessage, handleWebsocketResponse]);

  useEffect(() => {
    init();
    return () => clearFiltersState();
  }, [init]);

  if (isLoadingFilters || isFetchingData) {
    return (
      <div className={s.loading_container}>
        {Array(10)
          .fill(null)
          .map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton key={index} variant="text" className={s.skeleton_item} />
          ))}
      </div>
    );
  }
  return (
    <Stack zIndex={0} position="relative">
      <EditOrderModal />
      <EditClientModal />
      <EditVariantModal />
      <ProductsLaunchModal />
      <ManageComponentsModal />
      <DeleteProductionsModal />
      <ComponentsHistoryModal />
      <ManageTaskPriorityModal />
      <ProductionListItems />
    </Stack>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  isFetchingData: state.production.filters.isFetchingData,
  isLoadingFilters: state.production.filters.isLoadingFilters,
});
const mapDispatchToProps: DispatchProps = {
  init: ProductionListActions.initPageData,
  clearFiltersState: ProductionFiltersActions.clearFilterState,
  handleWebsocketResponse: ProductionListActions.handleWebsocketResponse,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductionList);
