import { useState } from 'react';
import Button from 'components/button/button';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { ProductionListSelectors } from 'pages/production/controllers/production-list-controller/production-list.controller';
import { TabDownIcon } from 'icons/tab-down';
import s from './open-nested-productions-button.module.scss';

type Props = {
  productionId: string;
  nestedWorkflowsCount: number;
  isForProductionList?: boolean;
  onCollapseOpen?: (isOpen: boolean) => void;
  setProductionsWithOpenedNestedProductions: (productionId: string) => void;
};

const OpenNestedProductionsButton = ({
  productionId,
  isForProductionList,
  nestedWorkflowsCount,
  onCollapseOpen,
  setProductionsWithOpenedNestedProductions,
}: Props) => {
  const [isItemOpen, setItemOpen] = useState(false);

  const isOpen = isForProductionList
    ? useSelector((state: AppState) => ProductionListSelectors.isOpenedProduction(state, productionId))
    : isItemOpen;

  const handleIsOpen = () => {
    if (isForProductionList) {
      setProductionsWithOpenedNestedProductions(productionId);
    } else {
      setItemOpen(!isItemOpen);
      onCollapseOpen(!isItemOpen);
    }
  };

  if (!nestedWorkflowsCount) return null;

  return (
    <Button
      size="XS"
      color="info_light"
      variant="contained"
      iconStyle="fill_icon"
      sx={{ minWidth: 'unset' }}
      className={`${s.collapse_button} ${isOpen && s.collapse_button_expanded}`}
      onClick={handleIsOpen}
    >
      {nestedWorkflowsCount} <TabDownIcon width={16} height={16} />
    </Button>
  );
};

export default OpenNestedProductionsButton;
