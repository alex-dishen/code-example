import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';
import { PositionSlotModel } from 'services/production-task.model';
import { IdName, SortBy, SortOrderOption } from 'types/common-types';
import { PriorityEnum } from '../types/priority-enums';
import { ProductionStatusEnum, TaskStatusEnum } from '../types/status-enums';

export type ProductionWorkflowCreateRequest = {
  order_id: string;
  product_variant_id: string;
  order_production_item_ids: string[];
};

export enum ProductionFilterCriteriaEnum {
  Client = 'client',
  Vendor = 'vendor',
  Issues = 'issues',
  Source = 'source',
  Option = 'option',
  Product = 'product',
  LimitBy = 'limit_by',
  TaskKey = 'task_key',
  OrderKey = 'order_key',
  MakeToStock = 'to_stock',
  CreatedBy = 'created_by',
  CreatedDate = 'created_at',
  StartedDate = 'started_at',
  Responsible = 'responsible',
  DeadlineDate = 'deadline_at',
  ProductType = 'product_type',
  SearchQuery = 'search_query',
  CompletedDate = 'completed_at',
  PrimaryClient = 'primary_client',
  OrderPriority = 'order_priority',
  ProductionKey = 'production_key',
  ShowCompleted = 'show_completed',
  ShowAllSubItems = 'show_all_sub_items',
  ProductionStatus = 'production_status',
  WorkflowName = 'workflow_template_name',
  InvolvedDepartment = 'involved_department',
  ProductionPriority = 'production_priority',
  ExternalOrderNumber = 'external_order_number',
  ConfigurationName = 'product_configuration_name',
  MarketplaceOrderNumber = 'marketplace_order_number',
  ExcludeUnknownProducts = 'exclude_unknown_products',
  ResponsibilityDepartment = 'responsibility_department',
  FirstWorkflowEstimatedTime = 'first_workflow_estimated_time',
  UsersAssignedToProductionTasks = 'users_assigned_to_production_tasks',
  ShowParentIfSubItemsMatchFilters = 'show_parent_items_if_sub_items_match_filters',
}
export type FilterCriteriasUnion = `${ProductionFilterCriteriaEnum}`;

export enum ProductionSortByEnum {
  Status = 'status',
  Progress = 'progress',
  CreatedAt = 'created_at',
  StartedAt = 'started_at',
  DeadlineAt = 'deadline_at',
  OrderPriority = 'priority',
  MakeToStock = 'to_stock',
  Responsible = 'responsible',
  EstimatedTime = 'estimated_time',
}
export enum GroupByEnum {
  None = 'none',
  Order = 'order',
  Product = 'product',
}

export type GetProductionWorkflowsFilteredRequest = {
  chosen_filters?: ProductionFilterCriteriaEnum[];
  filters: {
    [ProductionFilterCriteriaEnum.Vendor]: IdName[];
    [ProductionFilterCriteriaEnum.Issues]: string[];
    [ProductionFilterCriteriaEnum.Source]: string;
    [ProductionFilterCriteriaEnum.Option]: IdName[];
    [ProductionFilterCriteriaEnum.Client]: IdName[];
    [ProductionFilterCriteriaEnum.PrimaryClient]: IdName[];
    [ProductionFilterCriteriaEnum.ConfigurationName]: IdName[];
    [ProductionFilterCriteriaEnum.WorkflowName]: IdName[];
    [ProductionFilterCriteriaEnum.Product]: IdName[];
    [ProductionFilterCriteriaEnum.TaskKey]: IdName[];
    [ProductionFilterCriteriaEnum.OrderKey]: IdName[];
    [ProductionFilterCriteriaEnum.SearchQuery]: string;
    [ProductionFilterCriteriaEnum.CreatedBy]: IdName[];
    [ProductionFilterCriteriaEnum.ResponsibilityDepartment]: IdName[];
    [ProductionFilterCriteriaEnum.InvolvedDepartment]: IdName[];
    [ProductionFilterCriteriaEnum.ProductType]: IdName[];
    [ProductionFilterCriteriaEnum.Responsible]: IdName[];
    [ProductionFilterCriteriaEnum.ProductionKey]: IdName[];
    [ProductionFilterCriteriaEnum.ExternalOrderNumber]: IdName[];
    [ProductionFilterCriteriaEnum.OrderPriority]: string[];
    [ProductionFilterCriteriaEnum.MakeToStock]: boolean;
    [ProductionFilterCriteriaEnum.ProductionStatus]: string[];
    [ProductionFilterCriteriaEnum.ProductionPriority]: string[];
    [ProductionFilterCriteriaEnum.ExcludeUnknownProducts]: boolean;
    [ProductionFilterCriteriaEnum.MarketplaceOrderNumber]: IdName[];
    [ProductionFilterCriteriaEnum.CreatedDate]: DateRange<Dayjs> | string[];
    [ProductionFilterCriteriaEnum.StartedDate]: DateRange<Dayjs> | string[];
    [ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks]: IdName[];
    [ProductionFilterCriteriaEnum.DeadlineDate]: DateRange<Dayjs> | string[];
    [ProductionFilterCriteriaEnum.CompletedDate]: DateRange<Dayjs> | string[];
    [ProductionFilterCriteriaEnum.LimitBy]?: { by: 'order_key' | 'product_id'; value: string };
    [ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime]: { min: number | null; max: number | null };
  };
  sort: SortBy<ProductionSortByEnum>;
  group_by: GroupByEnum;
  show_parent_items_if_subitems_match_filters: boolean;
  show_all_subitems: boolean;
  pagination: {
    skip: number;
    take: number;
  };
};

export type ProductionWorkflow = {
  id: string;
  title: string;
  version: number;
  barcode: string;
  progress: number;
  created_at: string;
  product_id: string;
  is_external: boolean;
  product_type: string;
  product_name: string;
  priority: PriorityEnum;
  production_key: string;
  product_meta_id: string;
  finished_at: string | null;
  deadline_at: string | null;
  main_root_id: string | null;
  status: ProductionStatusEnum;
  issues: ProductionIssueEnum[];
  is_launch_in_progress: boolean;
  parentStatus?: ProductionStatusEnum;
  is_manual_assignmet_required: boolean;
  deadlineHistory: DeadlineHistoryItem[];
  nested_workflows: ProductionWorkflow[];
  is_any_task_time_limit_exceeded: boolean;
  additionalComponents: ProductionWorkflow[];
  responsible: ProductionWorkflowResponsibleT;
  parent_production_workflow_id: string | null;
  nested_production_component_has_issues: boolean;
  productionWorkflowItems: ProductionWorkflowItems[];
  nestedProductionWorkflowItems: NestedProductionWorkflowItem[];
  configuration: {
    id: string;
    name: string;
    sku: string;
  };
  variant: {
    sku: string;
    id: string;
    name: string;
  };
  order: {
    client?: {
      company: string;
      email: string;
      external_client_id: string;
      id: string;
      name: string;
      phone: string;
    };
    id: string;
    order_key: string;
    client_name?: string;
    priority: PriorityEnum;
    external_order_id: string;
    external_product_id: string;
    external_system_name: string;
    external_order_number?: string;
    marketplace_order_number?: string;
    to_stock?: boolean;
  };
  notes: NoteHistoryItem[];
  ordersHistory: OrdersHistoryItem[];
  variantsHistory: VariantHistoryItem[];
  externalOrderNumberHistory: ExternalOrderNumberHistoryItem[];
};

export type ProductionWorkflowOrderT = {
  id: string;
  client?: IdName;
  order_key: string;
  created_at: string;
  totalCount: number;
  is_deleted: boolean;
  order_number: string;
  external_order_number?: string;
  marketplace_order_number?: string;
  to_stock?: boolean;
  production_workflows: ProductionWorkflow[];
};

export type ProductionWorkflowProductT = {
  id: string;
  name: string;
  type: string;
  vendor: string;
  totalCount: number;
  production_workflows: ProductionWorkflow[];
};

export type ProductionWorkflowResponseDataT = ProductionWorkflow[] | ProductionWorkflowOrderT[] | ProductionWorkflowProductT[];

export type ProductionWorkflowResponse = {
  data: ProductionWorkflowResponseDataT;
  meta: {
    prev: number;
    next: number;
    total: number;
    perPage: number;
    lastPage: number;
    currentPage: number;
  };
};

export type ProductionWorkflowRequest = {
  filters: {};
  sort: {
    order: SortOrderOption;
    sortBy: ProductionSortByEnum;
  };
  group_by: GroupByEnum;
  show_parent_items_if_subitems_match_filters: boolean;
  show_all_subitems: boolean;
  pagination: {
    skip: number;
    take: number;
  };
};