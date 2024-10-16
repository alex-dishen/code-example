import { User } from 'services/user.model';
import React, { useEffect, useState } from 'react';
import { TabDownIcon } from 'icons/tab-down';
import { ProductionWorkflow } from 'services/production-workflow.model';
import ProductionItem from 'pages/production/components/production-item/production-item';
import { HandleProductionStatusArgs } from 'pages/production-workflow/controllers/types';
import s from './nested-components.module.scss';

type Props = {
  users?: User[];
  mainItemId?: string;
  isExternal?: boolean;
  nestedLevel?: number;
  withCheckbox?: boolean;
  isEditPermitted: boolean;
  extendLeftDashedLine: boolean;
  isForProductionList?: boolean;
  isAdditionalComponent: boolean;
  nestedWorkflows: ProductionWorkflow[];
  deleteAction: (id: string) => void;
  onNavigateToProductionWorkflow: VoidFunction;
  handleProductionStatus: (args: HandleProductionStatusArgs) => void;
  setProductionsWithOpenedNestedProductions: (productionId: string) => void;
  updateProduction: (id: string, value: Partial<ProductionWorkflow>) => void;
  setSelectedProductions: (production: ProductionWorkflow, parentItemId?: string) => void;
};

const NestedComponents = ({
  users,
  isExternal,
  mainItemId,
  nestedLevel,
  withCheckbox,
  nestedWorkflows,
  isEditPermitted,
  isForProductionList,
  extendLeftDashedLine,
  isAdditionalComponent,
  deleteAction,
  updateProduction,
  handleProductionStatus,
  setSelectedProductions,
  onNavigateToProductionWorkflow,
  setProductionsWithOpenedNestedProductions,
}: Props) => {
  const [isSubListExpanded, setIsSubListExpanded] = useState(false);
  const [subItemsToShow, setSubItemsToShow] = useState<ProductionWorkflow[]>([]);
  const expandSubList = () => {
    setSubItemsToShow([...nestedWorkflows]);
    setIsSubListExpanded(true);
  };

  const collapseSubList = () => {
    setSubItemsToShow([...nestedWorkflows.slice(0, 5)]);
    setIsSubListExpanded(false);
  };

  useEffect(() => {
    if (nestedWorkflows.length > 5) {
      collapseSubList();
    } else {
      expandSubList();
    }
  }, [nestedWorkflows]);

  return (
    <div className={s.production_content_collapse} data-show-left-dashed-line={extendLeftDashedLine}>
      {subItemsToShow
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((el, index) => {
          return (
            <React.Fragment key={el.id}>
              <ProductionItem
                item={el}
                isChildren
                users={users}
                isExternal={isExternal}
                mainItemId={mainItemId}
                nestedLevel={nestedLevel}
                withCheckbox={withCheckbox}
                isEditPermitted={isEditPermitted}
                isForProductionList={isForProductionList}
                extendLeftDashedLine={extendLeftDashedLine}
                isAdditionalComponent={isAdditionalComponent}
                isLastOnList={index === subItemsToShow.length - 1}
                deleteAction={deleteAction}
                updateProduction={updateProduction}
                setSelectedProductions={setSelectedProductions}
                handleProductionStatus={handleProductionStatus}
                onNavigateToProductionWorkflow={onNavigateToProductionWorkflow}
                setProductionsWithOpenedNestedProductions={setProductionsWithOpenedNestedProductions}
              />
            </React.Fragment>
          );
        })}

      {!isSubListExpanded && (
        <div className={s.show_more_wrapper}>
          <div className={s.show_more} onClick={expandSubList}>
            Show More <TabDownIcon height="16px" width="16px" />
          </div>
        </div>
      )}
    </div>
  );
};

export default NestedComponents;
