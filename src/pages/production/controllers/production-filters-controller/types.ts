// eslint-disable-next-line no-restricted-imports
import { DateRange } from '@mui/lab';
import { Dayjs } from 'dayjs';
import {
  FilterCriteriasUnion,
  GroupByEnum,
  ProductionFilterCriteriaEnum,
  ProductionSortByEnum,
  ProductionWorkflowOrderT,
  ProductionWorkflowProductT,
  ShowCompletedPeriodEnum,
} from 'services/production-workflow.model';
import { IdName, MinMax, SortOrderOption } from 'types/common-types';
import { User } from 'services/user.model';

export type GetProductionsByFilterArgs = {
  resetSkipAndSetTakeToDefault?: boolean;
  showFetchEffect?: boolean;
  isInfinityScroll?: boolean;
  customGroupBy?: GroupByEnum;
  resetSkipPreserveTake?: boolean;
};

export type DisplayRangeType = {
  value: IdName;
  options: IdName[];
  radioValue: ShowCompletedPeriodEnum;
};

export type HandleAdditionalFilterArgs = {
  clear?: boolean;
  additionalFilter?: IdName;
};

export type ShowMoreArgs = {
  item: ProductionWorkflowOrderT | ProductionWorkflowProductT;
};

export type FilterDataValueType =
  | boolean
  | null
  | Dayjs
  | MinMax
  | string
  | IdName[]
  | ProductT
  | DateRange<Dayjs>
  | ProductionValueIdNameT
  | ProductionValueIdNameT[];

export type FilterDataType = {
  disabled?: boolean;
  minMaxPossible?: MinMax;
  isOptionsLoading?: boolean;
  radioValue?: ShowCompletedPeriodEnum;
  options?: Array<IdName | { [key: string]: any }>;
  shortcutOptions?: { id: string | string[]; name: string; value?: string }[];
  value?: FilterDataValueType;
};

export type ProductionValueIdNameT = {
  id: string | string[];
  name: string;
};

export type ProductT = {
  id: string;
  name: string;
  product_type?: string;
  product_vendor?: string;
};

export type ProductionSortType = {
  sort_order: {
    value: SortOrderOption;
  };
  sort_by: {
    value: {
      id: ProductionSortByEnum;
      name: string;
    };
    options?: IdName[];
  };
};

export type FilterSelectorState = {
  value: IdName[];
  options: IdName[];
};

export type OnChangeFilterParam = Partial<{ [key in FilterCriteriasUnion]: FilterDataType['value'] }>;

export type PaginationState = {
  total: number;
  perPage: number;
  lastPage: number;
  currentPage: number;
  prev?: number | null;
  next?: number | null;
};

export type IssueInfo = {
  issueType: string;
  issuesCount: number;
};

export type ProductionFiltersState = {
  isLoadingFilters: boolean;
  issues: {
    issuesCount: number;
    rootProductionWithIssuesCount: number;
    nestedProductionWithIssuesCount: number;
    mainProductionsIssuesInfo: IssueInfo[];
    nestedProductionsIssuesInfo: IssueInfo[];
  };
  filters: {
    [ProductionFilterCriteriaEnum.Vendor]: {
      value: ProductionValueIdNameT[];
      options: IdName[];
      additionalOptions: IdName[];
    };
    [ProductionFilterCriteriaEnum.TaskKey]: {
      value: ProductionValueIdNameT[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.Issues]: {
      value: IdName[];
      options: IdName[];
      additionalOptions: IdName[];
    };
    [ProductionFilterCriteriaEnum.Source]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.Option]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.Client]: {
      value: IdName[];
      options: IdName[];
      shortcutOptions: ProductionValueIdNameT[];
    };
    [ProductionFilterCriteriaEnum.PrimaryClient]: {
      value: IdName[];
      options: IdName[];
      shortcutOptions: ProductionValueIdNameT[];
    };
    [ProductionFilterCriteriaEnum.WorkflowName]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.ConfigurationName]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.Product]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.OrderKey]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.SearchQuery]: {
      value: string;
    };
    [ProductionFilterCriteriaEnum.CreatedBy]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.ProductType]: {
      value: IdName[];
      options: IdName[];
      additionalOptions: IdName[];
    };
    [ProductionFilterCriteriaEnum.ProductionKey]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.MarketplaceOrderNumber]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.OrderPriority]: {
      value: IdName[];
      options: (IdName & { icon: JSX.Element })[];
    };
    [ProductionFilterCriteriaEnum.MakeToStock]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.ExternalOrderNumber]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.ProductionStatus]: {
      value: IdName[];
      options: (IdName & { icon: JSX.Element })[];
    };
    [ProductionFilterCriteriaEnum.ProductionPriority]: {
      value: IdName[];
      options: (IdName & { icon: JSX.Element })[];
    };
    [ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks]: {
      value: IdName[];
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.ShowCompleted]: {
      radioValue: ShowCompletedPeriodEnum;
      value: IdName;
      options: IdName[];
    };
    [ProductionFilterCriteriaEnum.ResponsibilityDepartment]: {
      value: ProductionValueIdNameT[];
      options: { id: string; name: string; path: string }[];
      shortcutOptions: ProductionValueIdNameT[];
    };
    [ProductionFilterCriteriaEnum.InvolvedDepartment]: {
      value: ProductionValueIdNameT[];
      options: { id: string; name: string; path: string }[];
      shortcutOptions: ProductionValueIdNameT[];
    };
    [ProductionFilterCriteriaEnum.Responsible]: {
      value: ProductionValueIdNameT[];
      options: (User & { name: string })[];
      shortcutOptions: (IdName & { value?: string })[];
    };
    [ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime]: {
      value: MinMax;
      minMaxPossible: MinMax;
    };
    [ProductionFilterCriteriaEnum.LimitBy]?: { by: 'order_key' | 'product_id'; value: string } | {};
    [ProductionFilterCriteriaEnum.CreatedDate]: { value: DateRange<Dayjs> };
    [ProductionFilterCriteriaEnum.StartedDate]: { value: DateRange<Dayjs> };
    [ProductionFilterCriteriaEnum.DeadlineDate]: { value: DateRange<Dayjs> };
    [ProductionFilterCriteriaEnum.CompletedDate]: { value: DateRange<Dayjs> };
    [ProductionFilterCriteriaEnum.ExcludeUnknownProducts]: { value: boolean };
    [ProductionFilterCriteriaEnum.ShowAllSubItems]: { value: boolean };
    [ProductionFilterCriteriaEnum.ShowParentIfSubItemsMatchFilters]: { value: boolean };
  };
  groupBy: GroupByEnum;
  isFetchingData: boolean;
  additionalFilter: IdName;
  sort: ProductionSortType;
  pagination: PaginationState;
  filterWithAllIssues: boolean;
  isInfinityScrollLoad?: boolean;
  filterSelector: FilterSelectorState;
  currentUser: { id: string; departmentIds: string[] };
};
