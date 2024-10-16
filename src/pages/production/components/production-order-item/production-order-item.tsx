import { getDate } from 'utils/time';
import { BookIcon } from 'icons/book';
import { ClientIcon } from 'icons/client';
import Panel from 'components/panel/panel';
import { User } from 'services/user.model';
import { TabDownIcon } from 'icons/tab-down';
import Button from 'components/button/button';
import { Calendar3Icon } from 'icons/calendar-3';
import React, { useMemo, useState } from 'react';
import { OrderNumberIcon } from 'icons/order-number';
import { EditCalendarIcon } from 'icons/edit-calendar';
import { Collapse, Stack, Typography } from '@mui/material';
import ListItem from 'pages/production/components/list-item/list-item';
import PrioritySelector from 'components/priority-select/priority-select';
import CustomProgress from 'components/ui-new/custom-progress/custom-progress';
import ActionsMenu from 'pages/production/components/production-order-item/actions-menu';
import ProductionItem from 'pages/production/components/production-item/production-item';
import { HandleProductionStatusArgs } from 'pages/production-workflow/controllers/types';
import { ShowMoreArgs } from 'pages/production/controllers/production-filters-controller/types';
import { ProductionWorkflow, ProductionWorkflowOrderT } from 'services/production-workflow.model';
import { returnProgressColor } from 'pages/production/components/production-item/controls/helpers';
import s from './production-order-item.module.scss';

type Props = {
  users: User[];
  isEditPermitted: boolean;
  item: ProductionWorkflowOrderT;
  deleteAction: (id: string) => void;
  handleShowMore: (args: ShowMoreArgs) => void;
  setSelectedProductions: (production: ProductionWorkflow) => void;
  setProductionsWithOpenedNestedProductions: (productionId: string) => void;
  updateProduction: (id: string, value: Partial<ProductionWorkflow>) => void;
  handleProductionStatus: (args: Omit<HandleProductionStatusArgs, 'updatingStatusFrom'>) => void;
};

const ProductionOrderItem = ({
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

  const orderProgress = useMemo(() => {
    return item.production_workflows.reduce((acc, value) => acc + value.progress, 0) / item.production_workflows.length;
  }, [item.production_workflows]);
  const progressFormatted = Math.round(orderProgress);

  const getClosestDeadline = () => {
    const currentDate: any = new Date();
    const futureDates = item.production_workflows.filter((i) => new Date(i.deadline_at) > currentDate).map((i) => i.deadline_at);
    if (futureDates.length > 0) {
      const closestDate = futureDates.reduce((prevDate, currDate) => {
        const prevDiff = Math.abs((new Date(prevDate) as any) - currentDate);
        const currDiff = Math.abs((new Date(currDate) as any) - currentDate);
        return currDiff < prevDiff ? currDate : prevDate;
      });
      return getDate(closestDate, 'dot');
    }
    return null;
  };

  return (
    <div className={s.production_wrapper}>
      <Panel className={s.production_item}>
        <Stack gap="10px">
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

            <Typography fontWeight={600} className={item.is_deleted ? s.order_key_deleted : ''}>
              {item.order_key}
            </Typography>

            {item.is_deleted && <div className={s.red_badge}>Deleted</div>}
          </Stack>
          <Stack direction="row" gap="6px" alignItems="center" className={s.info}>
            <ListItem
              maxWidth={145}
              title="Nearest deadline for an order item"
              value={getClosestDeadline()}
              icon={<Calendar3Icon width={16} height={16} />}
            />
            <ListItem
              maxWidth={145}
              title="Creation date"
              value={getDate(item.created_at, 'dot')}
              icon={<EditCalendarIcon width={16} height={16} />}
            />
            <ListItem maxWidth={145} title="Client" value={item.client?.name} icon={<ClientIcon width={16} height={16} />} />
            <ListItem
              maxWidth={145}
              title="External order number"
              value={item.external_order_number}
              icon={<OrderNumberIcon width={16} height={16} />}
            />
            <ListItem
              maxWidth={145}
              title="Marketplace order number"
              value={item.marketplace_order_number}
              icon={<BookIcon width={16} height={16} />}
            />
          </Stack>
        </Stack>
        <Stack direction="row" gap="16px">
          <div className={s.progress}>
            {progressFormatted}%
            <CustomProgress
              variant="determinate"
              value={progressFormatted}
              tooltip="Production status"
              type={returnProgressColor(progressFormatted)}
            />
          </div>
          <PrioritySelector
            priority={item.production_workflows[0].order.priority}
            onSelect={(status) =>
              updateProduction(item.id, { order: { ...item.production_workflows[0].order, priority: status } })
            }
          />
          <div className={s.actions}>
            <ActionsMenu
              client={item.client}
              order={{ id: item.id, name: item.order_key }}
              externalOrderNumber={{ id: '', name: item.external_order_number }}
              marketplaceOrderNumber={{ id: '', name: item.marketplace_order_number }}
            />
          </div>
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

export default ProductionOrderItem;
