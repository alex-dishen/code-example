import {
  GroupByEnum,
  ProductionFilterCriteriaEnum,
  ProductionIssueEnum,
  ProductionItemSourceEnum,
  ProductionSortByEnum,
  ShowCompletedPeriodEnum,
} from 'services/production-workflow.model';
import { SortOrderOption } from 'types/common-types';
import { PriorityEnum } from 'types/priority-enums';
import { ProductionStatusEnum } from 'types/status-enums';
import { ProductionFiltersState } from 'pages/production/controllers/production-filters-controller/types';
import { ToDoIcon } from 'icons/to-do';
import { BlockedIcon } from 'icons/blocked';
import { PlayCircleIcon } from 'icons/play-circle';
import { DoneIcon } from 'icons/done';
import { StockIcon } from 'icons/stock';
import { CanceledIcon } from 'icons/canceled';
import { PriorityLowestIcon } from 'icons/priority-lowest';
import { PriorityLowest2Icon } from 'icons/priority-lowest-2';
import { PriorityMediumIcon } from 'icons/priority-medium';
import { PriorityHighest2Icon } from 'icons/priority-highest-2';
import { PriorityHighestIcon } from 'icons/priority-highest';
import s from './production-filters.module.scss';

export const productionFilters = {
  [ProductionFilterCriteriaEnum.ResponsibilityDepartment]: {
    id: ProductionFilterCriteriaEnum.ResponsibilityDepartment,
    name: 'Responsibility Department',
  },
  [ProductionFilterCriteriaEnum.InvolvedDepartment]: {
    id: ProductionFilterCriteriaEnum.InvolvedDepartment,
    name: 'Involved Department',
  },
  [ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime]: {
    id: ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime,
    name: 'Estimated time',
  },
  [ProductionFilterCriteriaEnum.ProductType]: { id: ProductionFilterCriteriaEnum.ProductType, name: 'Product type' },
  [ProductionFilterCriteriaEnum.CreatedDate]: { id: ProductionFilterCriteriaEnum.CreatedDate, name: 'Created date' },
  [ProductionFilterCriteriaEnum.StartedDate]: { id: ProductionFilterCriteriaEnum.StartedDate, name: 'Started date' },
  [ProductionFilterCriteriaEnum.DeadlineDate]: { id: ProductionFilterCriteriaEnum.DeadlineDate, name: 'Deadline' },
  [ProductionFilterCriteriaEnum.CompletedDate]: { id: ProductionFilterCriteriaEnum.CompletedDate, name: 'Completion date' },
  [ProductionFilterCriteriaEnum.Vendor]: { id: ProductionFilterCriteriaEnum.Vendor, name: 'Vendor' },
  [ProductionFilterCriteriaEnum.ProductionStatus]: {
    id: ProductionFilterCriteriaEnum.ProductionStatus,
    name: 'Production status',
  },
  [ProductionFilterCriteriaEnum.ProductionKey]: { id: ProductionFilterCriteriaEnum.ProductionKey, name: 'Production key' },
  [ProductionFilterCriteriaEnum.ExternalOrderNumber]: {
    id: ProductionFilterCriteriaEnum.ExternalOrderNumber,
    name: 'External order number',
  },
  [ProductionFilterCriteriaEnum.Responsible]: { id: ProductionFilterCriteriaEnum.Responsible, name: 'Responsible' },
  [ProductionFilterCriteriaEnum.CreatedBy]: { id: ProductionFilterCriteriaEnum.CreatedBy, name: 'Created by' },
  [ProductionFilterCriteriaEnum.OrderPriority]: { id: ProductionFilterCriteriaEnum.OrderPriority, name: 'Order priority' },
  [ProductionFilterCriteriaEnum.MakeToStock]: { id: ProductionFilterCriteriaEnum.MakeToStock, name: 'Make to stock' },

  [ProductionFilterCriteriaEnum.ProductionPriority]: {
    id: ProductionFilterCriteriaEnum.ProductionPriority,
    name: 'Production priority',
  },
  [ProductionFilterCriteriaEnum.Option]: { id: ProductionFilterCriteriaEnum.Option, name: 'Options' },
  [ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks]: {
    id: ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks,
    name: 'Users assigned',
  },
  [ProductionFilterCriteriaEnum.OrderKey]: { id: ProductionFilterCriteriaEnum.OrderKey, name: 'Order key' },
  [ProductionFilterCriteriaEnum.Issues]: { id: ProductionFilterCriteriaEnum.Issues, name: 'Issues' },
  [ProductionFilterCriteriaEnum.Source]: { id: ProductionFilterCriteriaEnum.Source, name: 'Source' },
  [ProductionFilterCriteriaEnum.Client]: { id: ProductionFilterCriteriaEnum.Client, name: 'Client' },
  [ProductionFilterCriteriaEnum.Product]: { id: ProductionFilterCriteriaEnum.Product, name: 'Product' },
  [ProductionFilterCriteriaEnum.TaskKey]: { id: ProductionFilterCriteriaEnum.TaskKey, name: 'Task key' },
  [ProductionFilterCriteriaEnum.MarketplaceOrderNumber]: {
    id: ProductionFilterCriteriaEnum.MarketplaceOrderNumber,
    name: 'Marketplace order number',
  },
  [ProductionFilterCriteriaEnum.PrimaryClient]: { id: ProductionFilterCriteriaEnum.PrimaryClient, name: 'Primary client' },
  [ProductionFilterCriteriaEnum.ConfigurationName]: {
    id: ProductionFilterCriteriaEnum.ConfigurationName,
    name: 'Configuration name',
  },
  [ProductionFilterCriteriaEnum.WorkflowName]: { id: ProductionFilterCriteriaEnum.WorkflowName, name: 'Workflow name' },
};

export const productionFiltersDefaultState: ProductionFiltersState = {
  filterWithAllIssues: false,
  issues: {
    issuesCount: 0,
    rootProductionWithIssuesCount: 0,
    nestedProductionWithIssuesCount: 0,
    mainProductionsIssuesInfo: [],
    nestedProductionsIssuesInfo: [],
  },
  currentUser: { id: '', departmentIds: [] },
  additionalFilter: {
    id: '',
    name: '',
  },
  isFetchingData: false,
  isLoadingFilters: false,
  isInfinityScrollLoad: false,
  groupBy: GroupByEnum.None,
  pagination: {
    total: 0,
    lastPage: 0,
    currentPage: 1,
    perPage: 25,
    next: 0,
    prev: 0,
  },
  sort: {
    sort_order: { value: SortOrderOption.Ascending },
    sort_by: {
      value: {
        id: ProductionSortByEnum.DeadlineAt,
        name: 'Deadline',
      },
      options: [
        { id: ProductionSortByEnum.CreatedAt, name: 'Created at' },
        { id: ProductionSortByEnum.DeadlineAt, name: 'Deadline' },
        { id: ProductionSortByEnum.EstimatedTime, name: 'Estimated time' },
        { id: ProductionSortByEnum.OrderPriority, name: 'Order priority' },
        { id: ProductionSortByEnum.Progress, name: 'Progress' },
        { id: ProductionSortByEnum.Responsible, name: 'Responsible' },
        { id: ProductionSortByEnum.StartedAt, name: 'Started at' },
        { id: ProductionSortByEnum.Status, name: 'Status' },
      ],
    },
  },
  filters: {
    to_stock: {
      value: [],
      options: [
        { id: '1', name: 'Yes' },
        { id: '2', name: 'No' },
      ],
    },
    responsibility_department: {
      value: [],
      options: [],
      shortcutOptions: [],
    },
    involved_department: {
      value: [],
      options: [],
      shortcutOptions: [],
    },
    limit_by: {},
    search_query: { value: '' },
    created_by: {
      value: [],
      options: [],
    },
    created_at: {
      value: [null, null],
    },
    deadline_at: {
      value: [null, null],
    },
    issues: {
      value: [],
      options: [
        { id: ProductionIssueEnum.UndefinedProduct, name: 'Undefined product' },
        { id: ProductionIssueEnum.ProductionDeadlineExpired, name: 'Production deadline expired' },
        { id: ProductionIssueEnum.TaskTimeLimitExceeded, name: 'Task time limit exceeded' },
        { id: ProductionIssueEnum.TasksRequiringManualAssignment, name: 'Tasks requiring manual assignment' },
        { id: ProductionIssueEnum.IssuesInNestedComponents, name: 'Issues in nested components' },
      ],
      additionalOptions: [{ id: 'no_issues', name: 'No issues' }],
    },
    order_key: {
      value: [],
      options: [],
    },
    production_key: {
      value: [],
      options: [],
    },
    external_order_number: {
      value: [],
      options: [],
    },
    order_priority: {
      value: [],
      options: [
        {
          id: PriorityEnum.Lowest,
          name: PriorityEnum.Lowest,
          icon: (
            <div className={`${s.icon_container} ${s.lowest}`}>
              <PriorityLowestIcon width="16px" height="16px" />
            </div>
          ),
        },
        {
          id: PriorityEnum.Low,
          name: PriorityEnum.Low,
          icon: (
            <div className={`${s.icon_container} ${s.low}`}>
              <PriorityLowest2Icon width="16px" height="16px" />
            </div>
          ),
        },
        {
          id: PriorityEnum.Medium,
          name: PriorityEnum.Medium,
          icon: (
            <div className={`${s.icon_container} ${s.medium}`}>
              <PriorityMediumIcon width="16px" height="16px" />
            </div>
          ),
        },
        {
          id: PriorityEnum.High,
          name: PriorityEnum.High,
          icon: (
            <div className={`${s.icon_container} ${s.high}`}>
              <PriorityHighest2Icon width="16px" height="16px" />
            </div>
          ),
        },
        {
          id: PriorityEnum.Highest,
          name: PriorityEnum.Highest,
          icon: (
            <div className={`${s.icon_container} ${s.highest}`}>
              <PriorityHighestIcon width="16px" height="16px" />
            </div>
          ),
        },
      ],
    },
    production_priority: {
      value: [],
      options: [
        {
          id: PriorityEnum.Lowest,
          name: PriorityEnum.Lowest,
          icon: (
            <div className={`${s.icon_container} ${s.lowest}`}>
              <PriorityLowestIcon width="16px" height="16px" />
            </div>
          ),
        },
        {
          id: PriorityEnum.Low,
          name: PriorityEnum.Low,
          icon: (
            <div className={`${s.icon_container} ${s.low}`}>
              <PriorityLowest2Icon width="16px" height="16px" />
            </div>
          ),
        },
        {
          id: PriorityEnum.Medium,
          name: PriorityEnum.Medium,
          icon: (
            <div className={`${s.icon_container} ${s.medium}`}>
              <PriorityMediumIcon width="16px" height="16px" />
            </div>
          ),
        },
        {
          id: PriorityEnum.High,
          name: PriorityEnum.High,
          icon: (
            <div className={`${s.icon_container} ${s.high}`}>
              <PriorityHighest2Icon width="16px" height="16px" />
            </div>
          ),
        },
        {
          id: PriorityEnum.Highest,
          name: PriorityEnum.Highest,
          icon: (
            <div className={`${s.icon_container} ${s.highest}`}>
              <PriorityHighestIcon width="16px" height="16px" />
            </div>
          ),
        },
      ],
    },
    production_status: {
      value: [],
      options: [
        {
          id: ProductionStatusEnum.To_Do,
          name: 'To Do',
          icon: <ToDoIcon width="16px" height="16px" />,
        },
        { id: ProductionStatusEnum.Stopped, name: 'Stopped', icon: <BlockedIcon width="16px" height="16px" stroke="#fc7070" /> },
        {
          id: ProductionStatusEnum.In_Progress,
          name: 'In progress',
          icon: <PlayCircleIcon width="16px" height="16px" stroke="#7894ff" />,
        },
        {
          id: ProductionStatusEnum.Done,
          name: 'Done',
          icon: <DoneIcon width="16px" className="done" height="16px" stroke="#c3df50" />,
        },
        {
          id: ProductionStatusEnum.From_Stock,
          name: 'From stock',
          icon: <StockIcon width="16px" height="16px" stroke="#c3df50" />,
        },
        {
          id: ProductionStatusEnum.Canceled,
          name: 'Canceled',
          icon: <CanceledIcon width="16px" height="16px" stroke="#c3df50" />,
        },
      ],
    },
    product_type: {
      value: [],
      options: [],
      additionalOptions: [{ id: 'null', name: 'No type' }],
    },
    responsible: {
      value: [],
      options: [],
      shortcutOptions: [],
    },
    source: {
      value: [],
      options: [
        { id: ProductionItemSourceEnum.Manual, name: 'Manual' },
        { id: ProductionItemSourceEnum.External, name: 'External' },
      ],
    },
    started_at: {
      value: [null, null],
    },
    users_assigned_to_production_tasks: {
      value: [],
      options: [],
    },
    option: {
      value: [],
      options: [],
    },
    vendor: {
      value: [],
      options: [],
      additionalOptions: [{ id: 'null', name: 'No vendor' }],
    },
    task_key: {
      value: [],
      options: [],
    },
    marketplace_order_number: {
      value: [],
      options: [],
    },
    first_workflow_estimated_time: {
      value: { min: 0, max: 0 },
      minMaxPossible: { min: 0, max: 0 },
    },
    completed_at: {
      value: [null, null],
    },
    client: {
      value: [],
      options: [],
      shortcutOptions: [],
    },
    product: {
      value: [],
      options: [],
    },
    primary_client: {
      value: [],
      options: [],
      shortcutOptions: [],
    },
    product_configuration_name: {
      value: [],
      options: [],
    },
    workflow_template_name: {
      value: [],
      options: [],
    },
    show_completed: {
      radioValue: ShowCompletedPeriodEnum.Some,
      value: { id: '1', name: '1 day' },
      options: [
        { id: '1', name: '1 day' },
        { id: '3', name: '3 days' },
        { id: '7', name: '7 days' },
        { id: '30', name: '30 days' },
        { id: '90', name: '90 days' },
      ],
    },
    exclude_unknown_products: { value: false },
    show_parent_items_if_sub_items_match_filters: { value: false },
    show_all_sub_items: { value: true },
  },
  filterSelector: {
    value: [
      { id: ProductionFilterCriteriaEnum.ResponsibilityDepartment, name: 'Responsibility Department' },
      { id: ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime, name: 'Estimated time' },
    ],
    options: Object.values(productionFilters),
  },
};
