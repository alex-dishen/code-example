import {
  ProductionListActions,
  ProductionListSelectors,
} from 'pages/production/controllers/production-list-controller/production-list.controller';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { LocationTheProductionStatusIsChangingFrom } from 'types/common-enums';
import { PrinterIcon } from 'icons/printer';
import { FormControlLabel } from '@mui/material';
import { ManageComponentsActions } from 'pages/production/controllers/manage-components-modal.controller/manage-components-modal.controller';
import ActionItem from 'pages/production/actions-panel/components/action-item/action-item';
import Checkbox from 'components/checkbox/checkbox';
import { GroupByEnum, ProductionWorkflow } from 'services/production-workflow.model';
import { CrossIcon } from 'icons/cross';
import { TrashIcon } from 'icons/trash';
import { PluginIcon } from 'icons/plugin';
import { prepareAndPrintQrLabel } from 'modules/print-label-with-qr/label-with-qr.controller';
import { ManageSelectOrDeselectAllProductionsArgs } from 'pages/production/controllers/types';
import { DeleteProductionsModalActions } from 'pages/production/controllers/delete-productions-modal.controller';
import { ProductsLaunchModalActions } from 'pages/production/controllers/products-launch-modal-controller/products-launch-modal.controller';
import { PlayCircleIcon } from 'icons/play-circle';
import { UserCircleAddIcon } from 'icons/user-circle-add';
import DropdownUserSearchSelector from 'components/ui-new/dropdown-user-search-selector/dropdown-user-search-selector';
import { User } from 'services/user.model';
import s from './actions-panel.module.scss';

type StateProps = {
  users: User[];
  groupBy: GroupByEnum;
  isDeleteEnabled: boolean;
  isMassLaunchPossible: boolean;
  isEnableMultiActions: boolean;
  selectedProductions: ProductionWorkflow[];
};
type DispatchProps = {
  openModal: () => void;
  openDeleteProductionsModal: () => void;
  toggleIsEnableMultiActions: (value: boolean) => void;
  assignResponsibleToProductions: (responsibleId: string) => void;
  manageSelectOrDeselectAllProductions: (args: ManageSelectOrDeselectAllProductionsArgs) => void;
  openMultiLaunchModal: (
    selectedProductions: ProductionWorkflow[],
    openedFrom: LocationTheProductionStatusIsChangingFrom,
  ) => void;
};
type Props = StateProps & DispatchProps;

const ActionsPanel = ({
  users,
  groupBy,
  isDeleteEnabled,
  selectedProductions,
  isMassLaunchPossible,
  isEnableMultiActions,
  openModal,
  openMultiLaunchModal,
  openDeleteProductionsModal,
  toggleIsEnableMultiActions,
  assignResponsibleToProductions,
  manageSelectOrDeselectAllProductions,
}: Props) => {
  if (groupBy !== GroupByEnum.None) return null;
  const launchButtonTooltip =
    selectedProductions.length && !isMassLaunchPossible
      ? 'Only main productions can be launched from To do status at one time'
      : '';
  const deleteButtonTooltip =
    selectedProductions.length && !isDeleteEnabled ? 'Only main production items that are in "To do" status can be deleted' : '';
  const manageComponentsTooltip = selectedProductions.length
    ? 'You can replace components in main productions that are displayed on this page currently'
    : '';
  const selectButtonText = isEnableMultiActions ? `${selectedProductions.length} selected` : 'Select';

  const handleOnClick = () => {
    if (isEnableMultiActions) {
      manageSelectOrDeselectAllProductions({});
    } else {
      toggleIsEnableMultiActions(true);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.left_col}>
        <FormControlLabel
          className={s.form_control}
          label={<div className={s.select_button}>{selectButtonText}</div>}
          control={
            <Checkbox
              size="medium"
              className={s.checkbox}
              checked={!!selectedProductions.length}
              data-show-checkbox={isEnableMultiActions}
              onClick={handleOnClick}
            />
          }
        />
        <ActionItem
          text="Close"
          Icon={CrossIcon}
          enableWithoutVisualEffect
          visible={isEnableMultiActions}
          onClick={() => toggleIsEnableMultiActions(false)}
        />
      </div>

      <div className={s.actions_container}>
        <ActionItem
          text="Launch"
          Icon={PlayCircleIcon}
          withLeftDivider={false}
          enable={isMassLaunchPossible}
          visible={isEnableMultiActions}
          tooltipText={launchButtonTooltip}
          onClick={() => openMultiLaunchModal(selectedProductions, LocationTheProductionStatusIsChangingFrom.ProductionList)}
        />
        <ActionItem
          Icon={PrinterIcon}
          text="Print labels"
          enable={!!selectedProductions.length}
          visible={isEnableMultiActions}
          onClick={() => prepareAndPrintQrLabel(selectedProductions)}
        />
        <DropdownUserSearchSelector
          value=""
          users={users}
          showUnassignedOption
          currentlySelectedUser={null}
          triggerContainerClassName={s.assign_managers_container}
          onSelect={(value) => assignResponsibleToProductions(value)}
          renderTriggerComponent={(onClick) => (
            <ActionItem
              Icon={UserCircleAddIcon}
              text="Assign managers"
              enable={!!selectedProductions.length}
              visible={isEnableMultiActions}
              onClick={onClick}
            />
          )}
        />
        <ActionItem
          Icon={PluginIcon}
          text="Manage components"
          enable={!!selectedProductions.length}
          visible={isEnableMultiActions}
          tooltipText={manageComponentsTooltip}
          onClick={() => openModal()}
        />
        <ActionItem
          color="red"
          text="Delete"
          Icon={TrashIcon}
          enable={isDeleteEnabled}
          visible={isEnableMultiActions}
          tooltipText={deleteButtonTooltip}
          onClick={() => openDeleteProductionsModal()}
        />
      </div>
    </div>
  );
};

const mapStatToProps = (state: AppState): StateProps => ({
  groupBy: state.production.filters.groupBy,
  users: state.production.productionList.users,
  isDeleteEnabled: ProductionListSelectors.isDeleteEnabled(state),
  selectedProductions: state.production.productionList.selectedProductions,
  isEnableMultiActions: state.production.productionList.isEnableMultiActions,
  isMassLaunchPossible: ProductionListSelectors.checkIfMassLaunchPossible(state),
});
const mapDispatchToProps: DispatchProps = {
  openModal: ManageComponentsActions.openModal,
  openDeleteProductionsModal: DeleteProductionsModalActions.openModal,
  openMultiLaunchModal: ProductsLaunchModalActions.openMultiLaunchModal,
  toggleIsEnableMultiActions: ProductionListActions.toggleIsEnableMultiActions,
  assignResponsibleToProductions: ProductionListActions.assignResponsibleToProductions,
  manageSelectOrDeselectAllProductions: ProductionListActions.manageSelectOrDeselectAllProductions,
};

export default connect(mapStatToProps, mapDispatchToProps)(ActionsPanel);
