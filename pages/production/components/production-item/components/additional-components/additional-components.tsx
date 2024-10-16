import { User } from 'services/user.model';
import { memo, useState } from 'react';
import { ProductionWorkflow } from 'services/production-workflow.model';
import ProductionItem from 'pages/production/components/production-item/production-item';
import { Typography, Collapse } from '@mui/material';
import Button from 'components/button/button';
import { TabDownIcon } from 'icons/tab-down';
import { HandleProductionStatusArgs } from 'pages/production-workflow/controllers/types';
import s from './additional-components.module.scss';

type Props = {
  users: User[];
  isExternal: boolean;
  isLastOnList: boolean;
  isEditPermitted: boolean;
  additionalComponents: ProductionWorkflow[];
  nestedLevel?: number;
  deleteAction: (id: string) => void;
  onNavigateToProductionWorkflow: VoidFunction;
  setProductionsWithOpenedNestedProductions: (productionId: string) => void;
  updateProduction: (id: string, value: Partial<ProductionWorkflow>) => void;
  setSelectedProductions: (production: ProductionWorkflow, parentItemId?: string) => void;
  handleProductionStatus: (args: HandleProductionStatusArgs) => void;
};

const AdditionalComponents = ({
  users,
  isExternal,
  nestedLevel,
  isLastOnList,
  isEditPermitted,
  additionalComponents,
  deleteAction,
  updateProduction,
  setSelectedProductions,
  handleProductionStatus,
  onNavigateToProductionWorkflow,
  setProductionsWithOpenedNestedProductions,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!additionalComponents?.length) return null;

  return (
    <div className={s.wrapper}>
      <div className={s.left_line} data-no-items={Boolean(!additionalComponents?.length)} />
      <div className={s.additional_components}>
        <div className={s.additional_components_title}>
          <Button
            size="XS"
            color="info_light"
            variant="contained"
            iconStyle="fill_icon"
            sx={{ minWidth: 'unset' }}
            className={`${s.collapse_button} ${isOpen && s.collapse_button_expanded}`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {additionalComponents.length} <TabDownIcon width={16} height={16} />
          </Button>
          <Typography fontWeight={600}>Additional components</Typography>
        </div>

        <Collapse in={isOpen}>
          {additionalComponents?.map((item) => (
            <ProductionItem
              item={item}
              key={item.id}
              users={users}
              withCheckbox={false}
              isAdditionalComponent
              isExternal={isExternal}
              nestedLevel={nestedLevel}
              isLastOnList={isLastOnList}
              isEditPermitted={isEditPermitted}
              deleteAction={deleteAction}
              updateProduction={updateProduction}
              handleProductionStatus={handleProductionStatus}
              setSelectedProductions={setSelectedProductions}
              onNavigateToProductionWorkflow={onNavigateToProductionWorkflow}
              setProductionsWithOpenedNestedProductions={setProductionsWithOpenedNestedProductions}
            />
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default memo(AdditionalComponents);
