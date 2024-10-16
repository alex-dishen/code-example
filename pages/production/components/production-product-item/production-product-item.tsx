import React, { useState } from 'react';
import Panel from 'components/panel/panel';
import { Collapse, Stack, Typography } from '@mui/material';
import { TabDownIcon } from 'icons/tab-down';
import Button from 'components/button/button';
import { User } from 'services/user.model';
import { ProductionWorkflow, ProductionWorkflowProductT } from 'services/production-workflow.model';
import ProductionItem from 'pages/production/components/production-item/production-item';
import { TypeIcon } from 'icons/type';
import { VendorIcon } from 'icons/vendor';
import { ShowMoreArgs } from 'pages/production/controllers/production-filters-controller/types';
import { HandleProductionStatusArgs } from 'pages/production-workflow/controllers/types';
import s from './production-product-item.module.scss';

type Props = {
  users?: User[];
  isEditPermitted: boolean;
  item: ProductionWorkflowProductT;
  deleteAction: (id: string) => void;
  handleShowMore: (args: ShowMoreArgs) => void;
  setSelectedProductions: (production: ProductionWorkflow) => void;
  setProductionsWithOpenedNestedProductions: (productionId: string) => void;
  updateProduction: (id: string, value: Partial<ProductionWorkflow>) => void;
  handleProductionStatus: (args: Omit<HandleProductionStatusArgs, 'updatingStatusFrom'>) => void;
};

const ProductionProductItem = ({
  item,
  users,
  isEditPermitted,
  deleteAction,
  handleShowMore,
  updateProduction,
  handleProductionStatus,
  setSelectedProductions,
  setProductionsWithOpenedNestedProductions,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={s.production_wrapper}>
      <Panel className={`${s.production_item}`}>
        <Stack direction="row" gap="10px" alignItems="center">
          <Button
            size="S"
            color="info_light"
            variant="contained"
            className={`${s.collapse_button} ${isOpen && s.collapse_button_expanded}`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {item.totalCount} <TabDownIcon />
          </Button>
          <Typography fontWeight={600}>{item.name || 'Unknown product'}</Typography>
        </Stack>
        <Stack direction="row" gap="12px">
          <Stack direction="row" gap="6px" alignItems="center">
            <TypeIcon />
            <Typography>{item.type || 'No type'}</Typography>
          </Stack>
          <Stack direction="row" gap="6px" alignItems="center">
            <VendorIcon />
            <Typography>{item.vendor || 'No Vendor'}</Typography>
          </Stack>
        </Stack>
      </Panel>

      <Collapse in={isOpen} className={s.production_content_collapse}>
        {item.production_workflows.map((el, index) => (
          <React.Fragment key={el.id}>
            <ProductionItem
              item={el}
              isChildren
              users={users}
              nestedLevel={1}
              withCheckbox={false}
              isEditPermitted={isEditPermitted}
              isLastOnList={index === item.production_workflows.length - 1}
              deleteAction={deleteAction}
              updateProduction={updateProduction}
              handleProductionStatus={handleProductionStatus}
              setSelectedProductions={setSelectedProductions}
              setProductionsWithOpenedNestedProductions={setProductionsWithOpenedNestedProductions}
            />
          </React.Fragment>
        ))}
        {item.totalCount > 5 && (
          <div className={s.show_more_wrap}>
            <div className={s.show_more} onClick={() => handleShowMore({ item })}>
              Show More <TabDownIcon height="16px" width="16px" />
            </div>
          </div>
        )}
      </Collapse>
    </div>
  );
};

export default ProductionProductItem;
