import { Paths } from 'routes/paths';
import { AppState } from 'redux/store';
import { getDateWithTime } from 'utils/time';
import { PriorityEnum } from 'types/priority-enums';
import { ProductionStatusEnum } from 'types/status-enums';
import StatusSelector from 'components/status-selector/status-selector';
import PrioritySelector from 'components/priority-select/priority-select';
import CustomProgress from 'components/ui-new/custom-progress/custom-progress';
import { returnProgressColor } from 'pages/production/components/production-item/controls/helpers';
import { ProductionWorkflow, ProductionWorkflowResponsibleT } from 'services/production-workflow.model';
import { MouseEvent } from 'react';
import ProductionItemDropDownSearchSelector from 'pages/production/components/production-item/components/produciton-item-controls/production-item-controls';
import s from './controls.module.scss';

type DataT = {
  id: string;
  progress: number;
  variantId: string;
  finished_at: string;
  main_root_id: string;
  priority: PriorityEnum;
  status: ProductionStatusEnum;
  responsible: ProductionWorkflowResponsibleT;
  is_root_workflow_completed?: boolean;
  order: {
    id: string;
    order_key: string;
    priority: PriorityEnum;
    external_product_id: string;
    external_system_name: string;
    external_order_number?: string;
    external_order_id: string;
  };
};

type ControlsProps = {
  data: DataT;
  isEditPermitted?: boolean;
  users: AppState['production']['productionList']['users'];
  tooltip?: string;
  className?: string;
  isReadOnly?: boolean;
  productionPage?: boolean;
  onNavigateToProductionWorkflow?: VoidFunction;
  onStatusUpdate?: (id: string, status: ProductionStatusEnum) => void;
  onUpdate?: (id: string, value: Partial<ProductionWorkflow>, isUpdateResponsible?: boolean) => void;
};

export const Controls = ({
  data,
  users,
  tooltip,
  className,
  isReadOnly,
  productionPage,
  isEditPermitted = true,
  onUpdate,
  onStatusUpdate,
  onNavigateToProductionWorkflow,
}: ControlsProps) => {
  const finishedAt = data.finished_at ? getDateWithTime(new Date(data.finished_at).toISOString()) : '-';
  const isProgressClickable = data.variantId && productionPage;
  const isBlockedLaunchTitle = !data.variantId
    ? `You can't launch an unknown product in production`
    : `You can't launch nested workflow when main workflow has been completed`;
  const tooltipText =
    (data.status === ProductionStatusEnum.Done && `Produced ${finishedAt}`) ||
    (data.status === ProductionStatusEnum.Canceled && `Canceled ${finishedAt}`) ||
    (data.status === ProductionStatusEnum.Launching && 'Status will be changed once the request is processed');

  const handleOnProgressClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isProgressClickable) {
      event.preventDefault();

      return;
    }

    if (onNavigateToProductionWorkflow) {
      event.preventDefault();
      onNavigateToProductionWorkflow();
    }
  };

  const isRootCompleted = data.main_root_id && data.is_root_workflow_completed;

  return (
    <div className={className || s.container}>
      <div className={s.assignee} data-is-read-only={isReadOnly}>
        <ProductionItemDropDownSearchSelector
          users={users}
          productionId={data.id}
          isEditPermitted={isEditPermitted}
          responsibleId={data.responsible?.id}
          currentlyResponsible={data.responsible}
          onUpdate={onUpdate}
        />
      </div>
      <div className={s.status} data-is-read-only={isReadOnly}>
        <StatusSelector
          status={data.status}
          toolTip={tooltipText}
          optionsFor="production"
          productionStatus={data.status}
          isEditPermitted={isEditPermitted}
          blockedLaunchTitle={isBlockedLaunchTitle}
          isBlockedLaunch={!data.variantId || isRootCompleted}
          onSelect={async (status) => {
            await onStatusUpdate(data.id, status);
          }}
        />
      </div>
      <a
        href={isProgressClickable ? `${Paths.ProductionWorkflow}/${data.id}` : ''}
        data-is-read-only={isReadOnly}
        data-clickable={isProgressClickable}
        onClick={handleOnProgressClick}
        className={`
          ${s.progress}
          ${isProgressClickable ? s.hover_on_progress : ''}
        `}
      >
        {data.progress}%
        <CustomProgress
          tooltip={tooltip}
          value={data.progress}
          variant="determinate"
          type={returnProgressColor(data.progress, data.status)}
        />
      </a>
      <div className={s.priorities} data-is-read-only={isReadOnly}>
        {productionPage && (
          <PrioritySelector
            tooltipTitle="Order priority"
            enableStopPropagation={false}
            priority={data.order?.priority}
            isEditPermitted={isEditPermitted}
            onSelect={(priority) => onUpdate(data.order?.id, { order: { ...data.order, priority } })}
          />
        )}
        <PrioritySelector
          tooltipTitle="Production priority"
          priority={data.priority}
          enableStopPropagation={false}
          isEditPermitted={isEditPermitted}
          onSelect={(priority) => onUpdate(data.id, { priority })}
        />
      </div>
    </div>
  );
};

export default Controls;
