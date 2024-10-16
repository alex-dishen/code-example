import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { DepartmentsIcon } from 'icons/departments';
import { ProductionStatusEnum } from 'types/status-enums';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { ProductionWorkflowService } from 'services/production-workflow.service';
import { EditNoteActions } from 'pages/production/controllers/edit-note.controller';
import { Page } from 'pages/production/controllers/production-list-controller/types';
import { productionDetails } from 'pages/production/components/info-dropdown/constants';
import { EditOrderActions } from 'pages/production/controllers/edit-order-modal.controller';
import { EditClientActions } from 'pages/production/controllers/edit-client-modal.controller';
import { EditVariantActions } from 'pages/production/controllers/edit-variant-modal.controller';
import { ItemInfoDataT } from 'pages/production/components/production-item/components/item-info/item-info';
import { ComponentHistoryItem } from 'services/production-workflow.model';

type Args = {
  page?: Page;
  data: ItemInfoDataT;
  onOpen?: (id: string) => void;
};

let globalSetDetails: (value: any) => void = null;
let globalSetComponentsHistory: (value: any) => void = null;

export const loadData = async (globalIdRef: string) => {
  const value = await ProductionWorkflowService.getProductionWorkflowDetails(globalIdRef);

  await globalSetDetails(value);
};

export const loadComponentsHistory = async (globalIdRef: string) => {
  const data = await ProductionWorkflowService.getComponentsHistory(globalIdRef);
  await globalSetComponentsHistory(data);
};

const useInfoDorpDown = ({ data, page, onOpen }: Args) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState(productionDetails);
  const [componentsHistory, setComponentsHistory] = useState<ComponentHistoryItem[]>([]);

  const textareaRef = useRef(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const globalIdRef = useRef<string>('');
  const popupState = usePopupState({ variant: 'popover', popupId: `actions-info` });

  const isLaunching = data.status === ProductionStatusEnum.Launching;
  const responsibleDepartments = details.organization.responsible_departments.map((dep) => ({
    id: dep,
    name: dep,
    icon: <DepartmentsIcon />,
  }));
  const involvedDepartments = details.organization.involved_departments.map((dep) => ({
    id: dep,
    name: dep,
    icon: <DepartmentsIcon />,
  }));

  const onOrderEdit = isLaunching
    ? undefined
    : () =>
        dispatch(
          EditOrderActions.openModal({
            page,
            productionId: details.id,
            productName: details.product.name,
            productionKey: details.production_key,
            order: {
              id: details.order.id,
              name: details.order.order_key,
            },
            externalOrderNumber: details.order.external_order_number,
            marketplaceOrderNumber: details.order.marketplace_order_number,
          }),
        );

  const onClientEdit = isLaunching
    ? undefined
    : () =>
        dispatch(
          EditClientActions.openModal({
            page,
            productionId: details.id,
            orderId: details.order.id,
            productName: details.product.name,
            productionKey: details.production_key,
            client: {
              id: details.order?.client?.id || '',
              name: details.order?.client?.name || '',
            },
          }),
        );

  const onVariantEdit = isLaunching
    ? undefined
    : () =>
        dispatch(
          EditVariantActions.openModal({
            page,
            productionId: details.id,
            productName: details.product.name,
            configurationId: details.product.product_configuration_id,
            productionKey: details.production_key,
            productVariant: {
              id: details.product.product_variant_id,
              name: details.product.variant,
            },
          }),
        );

  const onEditConfiguration = isLaunching
    ? undefined
    : () => {
        dispatch(EditNoteActions.onChangeNoteMode(true));
        textareaRef.current.focus();
      };

  useEffect(() => {
    if (onOpen) {
      if (isOpen) {
        onOpen(data.id);
      } else {
        onOpen(null);
      }
    }

    (async () => {
      if (!isOpen) {
        globalSetDetails = null;
        setComponentsHistory([]);
        return;
      }

      setIsLoading(true);
      globalIdRef.current = data.id;
      globalSetDetails = setDetails;
      globalSetComponentsHistory = setComponentsHistory;
      await loadData(globalIdRef.current);
      await loadComponentsHistory(globalIdRef.current);
      setIsLoading(false);
    })();
  }, [isOpen, data.id, onOpen]);

  return {
    isOpen,
    details,
    rootRef,
    isLoading,
    popupState,
    isLaunching,
    textareaRef,
    componentsHistory,
    involvedDepartments,
    responsibleDepartments,
    dispatch,
    setIsOpen,
    onOrderEdit,
    onClientEdit,
    onVariantEdit,
    onEditConfiguration,
  };
};

export default useInfoDorpDown;
