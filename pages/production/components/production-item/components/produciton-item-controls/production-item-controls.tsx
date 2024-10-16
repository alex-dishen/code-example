import DropdownUserSearchSelector from 'components/ui-new/dropdown-user-search-selector/dropdown-user-search-selector';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { ProductionWorkflow, ProductionWorkflowResponsibleT } from 'services/production-workflow.model';
import { User } from 'services/user.model';

type Props = {
  users: User[];
  productionId: string;
  isEditPermitted: boolean;
  responsibleId: string | undefined;
  currentlyResponsible: ProductionWorkflowResponsibleT;
  onUpdate?: (id: string, value: Partial<ProductionWorkflow>, isUpdateResponsible?: boolean) => void;
};

const ProductionItemDropDownSearchSelector = ({
  users,
  productionId,
  responsibleId,
  isEditPermitted,
  currentlyResponsible,
  onUpdate,
}: Props) => {
  const updatingProductionIds = useSelector(
    (state: AppState) => state.production.productionList.assigningResponsibleToProductionIds,
  );

  return (
    <DropdownUserSearchSelector
      users={users}
      isAvatarOnly
      value={responsibleId}
      isTaskPerformerSelect={false}
      isEditPermitted={isEditPermitted}
      currentlySelectedUser={currentlyResponsible}
      showSpinnerOnUserSelector={updatingProductionIds.includes(productionId)}
      onSelect={(value, prev, next) => onUpdate(productionId, { responsible: next }, true)}
    />
  );
};

export default ProductionItemDropDownSearchSelector;
