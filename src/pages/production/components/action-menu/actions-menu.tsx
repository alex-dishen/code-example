import { TrashIcon } from 'icons/trash';
import DropdownMenu from 'components/dropdown-menu/dropdown-menu';
import { connect } from 'react-redux';
import { ClientIcon } from 'icons/client';
import { IdName } from 'types/common-types';
import { ScanBarcodeIcon } from 'icons/scan-barcode';
import { DocumentEmptyIcon } from 'icons/document-empty';
import { ArrowSquareRight } from 'icons/arrow-square-right';
import { SettingsCollectionIcon } from 'icons/settings-collection';
import { ProductionListActions } from 'pages/production/controllers/production-list-controller/production-list.controller';
import { EditOrderActions, EditOrderModalArgs } from 'pages/production/controllers/edit-order-modal.controller';
import { EditClientActions, EditClientModalArgs } from 'pages/production/controllers/edit-client-modal.controller';
import { ProductsLaunchModalActions } from 'pages/production/controllers/products-launch-modal-controller/products-launch-modal.controller';
import { EditVariantActions, EditVariantModalArgs } from 'pages/production/controllers/edit-variant-modal.controller';
import { Actions as PrintLabelActions, prepareAndPrintQrLabel } from 'modules/print-label-with-qr/label-with-qr.controller';
import { StartIcon } from 'icons/start';
import { PrinterIcon } from 'icons/printer';
import {
  ManageTaskPriorityModalActions,
  ManageTaskPriorityModalArgs,
} from 'pages/production/controllers/manage-task-priority.controller';
import { OpenProductsLaunchModalArgs } from 'pages/production/controllers/products-launch-modal-controller/types';
import { ProductionWorkflow, ProductionWorkflowInfo } from 'services/production-workflow.model';
import { ProductionForActionsT } from 'modules/print-label-with-qr/types';
import { Page } from 'pages/production/controllers/production-list-controller/types';
import { LocationTheProductionStatusIsChangingFrom } from 'types/common-enums';
import { ProductionItemsMapT } from 'pages/production/components/action-menu/types';
import { CopyIcon } from '../../../../icons/copy';
import { ProductionStatusEnum } from '../../../../types/status-enums';

type OwnProps = {
  page: Page;
  order: IdName;
  client: IdName;
  isExternal?: boolean;
  productionKey: string;
  configurationId: string;
  externalOrderNumber: string;
  productionWorkflowId: string;
  marketplaceOrderNumber: string;
  productionWorkflowTitle: string;
  production: ProductionWorkflow | ProductionWorkflowInfo | null;
  productVariant: IdName & { sku?: string };
  deleteAction: VoidFunction;
};

type DispatchProps = {
  openModalForManage: (id: string) => void;
  copyProductionWorkflowLink: (id: string) => void;
  openEditOrderModal: (args: EditOrderModalArgs) => void;
  openEditClientModal: (args: EditClientModalArgs) => void;
  openEditVariantModal: (args: EditVariantModalArgs) => void;
  openLaunchModal: (args: OpenProductsLaunchModalArgs) => void;
  openQrLabelModal: (production: ProductionForActionsT) => void;
  manageTaskPriorityModal: (args: ManageTaskPriorityModalArgs) => void;
  openDeleteConfirmationModal: (isExternal: boolean, productionWorkflowTitle: string, action: () => void) => void;
};

type Props = DispatchProps & OwnProps;

const ActionsMenu = ({
  page,
  order,
  client,
  production,
  isExternal,
  productionKey,
  productVariant,
  configurationId,
  externalOrderNumber,
  productionWorkflowId,
  marketplaceOrderNumber,
  productionWorkflowTitle,
  deleteAction,
  openLaunchModal,
  openQrLabelModal,
  openModalForManage,
  openEditOrderModal,
  openEditClientModal,
  openEditVariantModal,
  copyProductionWorkflowLink,
  openDeleteConfirmationModal,
  manageTaskPriorityModal,
}: Props) => {
  const startProductionAction = {
    onClick: () =>
      openLaunchModal({
        version: production?.version,
        productionIdToLaunch: production?.id,
        variantName: production?.variant.name,
        productVariantId: production?.variant.id,
        configurationName: production?.configuration.name,
        openedFrom: LocationTheProductionStatusIsChangingFrom.ProductionList,
      }),
    key: 'open_launch_production_workflow_modal',
    text: 'Launch',
    icon: <StartIcon width={16} height={16} />,
  };

  const mangeProductionAction = {
    onClick: () => openModalForManage(production?.id),
    key: 'open_manage_production_workflow_modal',
    text: 'Manage launch',
    icon: <StartIcon width={16} height={16} />,
  };

  const copyLink = {
    onClick: () => copyProductionWorkflowLink(production?.id),
    key: 'copy_url_for_production_workflow',
    text: 'Copy url',
    bottomDivider: true,
    icon: <CopyIcon width="16" height="16" />,
  };

  const deleteProductionAction = {
    onClick: () => openDeleteConfirmationModal(isExternal, production?.title, deleteAction),
    key: 'action_delete_item',
    text: 'Delete',
    icon: <TrashIcon width={16} height={16} />,
  };

  const openLabel = {
    onClick: () => openQrLabelModal(production),
    key: 'action_open_label',
    text: 'Open label',
    icon: <ScanBarcodeIcon width={16} height={16} />,
  };

  const printLabel = {
    onClick: () => prepareAndPrintQrLabel(production),
    key: 'action_print_label',
    text: 'Print label',
    bottomDivider: true,
    icon: <PrinterIcon width={16} height={16} />,
  };

  const editOrder = {
    onClick: () =>
      openEditOrderModal({
        page,
        order,
        productionKey,
        externalOrderNumber,
        marketplaceOrderNumber,
        productionId: productionWorkflowId,
        productName: productionWorkflowTitle,
      }),
    key: 'change_order_label',
    text: 'Change order',
    icon: <DocumentEmptyIcon width={16} height={16} />,
  };

  const editClient = {
    onClick: () =>
      openEditClientModal({
        page,
        productionId: productionWorkflowId,
        orderId: order.id,
        productName: productionWorkflowTitle,
        productionKey,
        client: {
          id: client.id,
          name: client.name,
        },
      }),
    key: 'edit_client_label',
    text: 'Edit order client',
    bottomDivider: true,
    icon: <ClientIcon width={16} height={16} />,
  };

  const editVariant = {
    onClick: () =>
      openEditVariantModal({
        page,
        productionKey,
        productVariant,
        configurationId,
        productionId: productionWorkflowId,
        productName: productionWorkflowTitle,
      }),
    key: 'edit_variant_label',
    text: 'Edit variant',
    bottomDivider: true,
    icon: <SettingsCollectionIcon width={16} height={16} />,
  };

  const manageTaskPriority = {
    onClick: () =>
      manageTaskPriorityModal({
        production,
      }),
    key: 'manage_task_priority_label',
    text: 'Manage task priority',
    icon: <ArrowSquareRight width={16} height={16} />,
  };

  const defaultItems = [
    mangeProductionAction,
    copyLink,
    openLabel,
    printLabel,
    editOrder,
    editClient,
    editVariant,
    manageTaskPriority,
  ];

  const productionItemsMap: ProductionItemsMapT = {
    [ProductionStatusEnum.Launching]: [copyLink, openLabel, printLabel, deleteProductionAction],
    [ProductionStatusEnum.To_Do]: [
      startProductionAction,
      copyLink,
      openLabel,
      printLabel,
      editOrder,
      editClient,
      editVariant,
      deleteProductionAction,
    ],
    [ProductionStatusEnum.Canceled]: [copyLink, openLabel, printLabel],
    [ProductionStatusEnum.Done]: [copyLink, openLabel, printLabel],
    [ProductionStatusEnum.From_Stock]: [
      mangeProductionAction,
      copyLink,
      openLabel,
      printLabel,
      editOrder,
      editClient,
      editVariant,
    ],
    [ProductionStatusEnum.In_Progress]: defaultItems,
    [ProductionStatusEnum.Stopped]: defaultItems,
  };

  return (
    <DropdownMenu
      disabledItems={
        !production?.variant.id
          ? { open_launch_production_workflow_modal: `You can't launch an unknown product in production` }
          : undefined
      } // Disabled "launch" when unknown product
      id="collapse-content-card"
      items={productionItemsMap[production.status]}
    />
  );
};

const mapDispatchToProps: DispatchProps = {
  openEditOrderModal: EditOrderActions.openModal,
  openEditClientModal: EditClientActions.openModal,
  openQrLabelModal: PrintLabelActions.openLabelModal,
  openEditVariantModal: EditVariantActions.openModal,
  openLaunchModal: ProductsLaunchModalActions.openModal,
  openModalForManage: ProductsLaunchModalActions.openModalForManage,
  manageTaskPriorityModal: ManageTaskPriorityModalActions.openModal,
  copyProductionWorkflowLink: ProductionListActions.copyProductionWorkflowLink,
  openDeleteConfirmationModal: ProductionListActions.openDeleteConfirmationModal,
};

export default connect(null, mapDispatchToProps)(ActionsMenu);
