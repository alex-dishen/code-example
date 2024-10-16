import { FC } from 'react';
import { connect } from 'react-redux';
import { ClientIcon } from 'icons/client';
import { IdName } from 'types/common-types';
import { DocumentEmptyIcon } from 'icons/document-empty';
import DropdownMenu from 'components/dropdown-menu/dropdown-menu';
import { EditOrderActions, EditOrderModalArgs } from 'pages/production/controllers/edit-order-modal.controller';
import { EditClientActions, EditClientModalArgs } from 'pages/production/controllers/edit-client-modal.controller';
import { Page } from 'pages/production/controllers/production-list-controller/types';

type OwnProps = {
  order: IdName;
  client: IdName;
  externalOrderNumber: IdName;
  marketplaceOrderNumber: IdName;
};
type DispatchProps = {
  openEditOrderModal: (args: EditOrderModalArgs) => void;
  openEditClientModal: (args: EditClientModalArgs) => void;
};
type Props = DispatchProps & OwnProps;

const ActionsMenu: FC<Props> = ({
  order,
  client,
  externalOrderNumber,
  marketplaceOrderNumber,
  openEditOrderModal,
  openEditClientModal,
}) => {
  const changeOrder = {
    key: 'change_order',
    text: 'Change order',
    icon: <DocumentEmptyIcon width={16} height={16} />,
    onClick: () =>
      openEditOrderModal({
        order,
        page: Page.Production,
        isOpenFromOrder: true,
        externalOrderNumber: externalOrderNumber.name,
        marketplaceOrderNumber: marketplaceOrderNumber.name,
      }),
  };
  const editClient = {
    key: 'edit_order_client',
    text: 'Edit order client',
    icon: <ClientIcon width={16} height={16} />,
    onClick: () =>
      openEditClientModal({
        client,
        orderId: order.id,
        isOpenFromOrder: true,
        page: Page.Production,
      }),
  };
  const productionItems = [changeOrder, editClient];

  return <DropdownMenu items={productionItems} id="collapse-content-card" />;
};

const mapDispatchToProps: DispatchProps = {
  openEditClientModal: EditClientActions.openModal,
  openEditOrderModal: EditOrderActions.openModal,
};
export default connect(null, mapDispatchToProps)(ActionsMenu);
