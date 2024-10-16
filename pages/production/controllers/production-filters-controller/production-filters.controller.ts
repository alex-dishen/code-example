/* eslint-disable no-restricted-imports */
import { Dayjs } from 'dayjs';
import { Url } from 'utils/url';
import { DateRange } from '@mui/lab';
import { AppState } from 'redux/store';
import { notify } from 'notifications';
import { debounce } from 'utils/debounce';
import {
  GroupByEnum,
  ProductionIssueEnum,
  ShowCompletedPeriodEnum,
  ProductionFilterCriteriaEnum,
  GetProductionWorkflowsFilteredRequest,
} from 'services/production-workflow.model';
import {
  getValues,
  getIdName,
  returnParams,
  getValueFromIds,
  getDatesForFilters,
  stringArrayToDateRange,
  convertToStockFilterParams,
  convertToStockFilterOptions,
} from 'pages/production/controllers/helpers';
import { StateController } from 'state-controller';
import { UserService } from 'services/user.service';
import { IdName, MinMax } from 'types/common-types';
import { ProductTypeService } from 'services/product-type.service';
import {
  ShowMoreArgs,
  FilterDataType,
  DisplayRangeType,
  OnChangeFilterParam,
  ProductionFiltersState,
  GetProductionsByFilterArgs,
  HandleAdditionalFilterArgs,
} from 'pages/production/controllers/production-filters-controller/types';
import {
  productionFilters,
  productionFiltersDefaultState,
} from 'pages/production/controllers/production-filters-controller/constants';
import { ProductionWorkflowService } from 'services/production-workflow.service';
import { ProductionListActions } from 'pages/production/controllers/production-list-controller/production-list.controller';
import { ProductionsLaunchingProgressActions } from 'pages/production/production-launching-progress-modal/production-launching-progress-modal.controller';

const stateController = new StateController<ProductionFiltersState>('PRODUCTION_FILTERS', productionFiltersDefaultState);

class ProductionFiltersActions {
  public static onChange(values: Partial<ProductionFiltersState>) {
    return async (dispatch) => {
      dispatch(stateController.setState((prev) => ({ ...prev, ...values })));
    };
  }

  public static loadAndSetDefaultFiltersState() {
    return async (dispatch, getState: () => AppState) => {
      try {
        const { user: currentUser } = getState().auth;
        const [productTypes, estimated_time] = await Promise.all([
          ProductTypeService.getAllProductTypes('', 0, 9000),
          ProductionWorkflowService.getEstimatedInfo(),
        ]);

        dispatch(
          stateController.setState((prev) => ({
            ...prev,
            currentUser: {
              id: currentUser.id,
              departmentIds: currentUser.user_position_slots.map((slot) => slot.position_slot.department_id),
            },
            filters: {
              ...prev.filters,
              responsible: {
                ...prev.filters.responsible,
                shortcutOptions: [
                  { id: currentUser.id, name: 'Me', value: `${currentUser.first_name} ${currentUser.last_name}` },
                  { id: 'null', name: 'No responsible' },
                ],
              },
              involved_department: {
                ...prev.filters.involved_department,
                shortcutOptions: [
                  {
                    id: currentUser?.user_position_slots?.map((slot) => slot.position_slot.department_id)[0],
                    name: 'My department',
                  },
                  { id: 'null', name: 'No involved department' },
                ],
              },
              client: {
                ...prev.filters.client,
                shortcutOptions: [{ id: 'null', name: 'No client' }],
              },
              primary_client: {
                ...prev.filters.primary_client,
                shortcutOptions: [{ id: 'null', name: 'No client' }],
              },
              responsibility_department: {
                ...prev.filters.responsibility_department,
                shortcutOptions: [
                  {
                    id: currentUser?.user_position_slots?.map((slot) => slot.position_slot.department_id)[0],
                    name: 'My department',
                  },
                  { id: 'null', name: 'No responsibility department' },
                ],
              },
              product_type: {
                ...prev.filters.product_type,
                options: productTypes.data,
              },
              first_workflow_estimated_time: {
                value: estimated_time,
                minMaxPossible: { min: 0, max: estimated_time.max },
              },
            },
          })),
        );
      } catch (err) {
        console.error(err);
        throw err;
      }
    };
  }

  public static prepareRequestBody(customGroupBy: GroupByEnum, resetSkipPreserveTake: boolean) {
    return (dispatch, getState: () => AppState): GetProductionWorkflowsFilteredRequest => {
      const { filters, pagination, sort, groupBy, additionalFilter, filterWithAllIssues, filterSelector } =
        getState().production.filters;
      const showCompletedPeriod = Number((filters.show_completed.value as IdName).id);
      const isSource = (filters.source.value as IdName[]).length === 1;
      const { min: valueMin, max: valueMax } = filters.first_workflow_estimated_time.value;
      const { min, max } = filters.first_workflow_estimated_time.minMaxPossible;
      const isEstimatedTimeDefaultSelected = valueMin === min && valueMax === max;
      const skip = resetSkipPreserveTake ? 0 : pagination.next;
      const take = resetSkipPreserveTake ? pagination.next : pagination.perPage;

      return {
        chosen_filters: filterSelector.value.map((item: { id: ProductionFilterCriteriaEnum; name: string }) => item.id),
        filters: {
          option: getIdName(filters.option.value),
          client: getIdName(filters.client.value),
          order_key: getIdName(filters.order_key.value),
          created_by: getIdName(filters.created_by.value),
          vendor: getIdName(filters.vendor.value as IdName[]),
          product: getIdName(filters.product.value as IdName[]),
          production_key: getIdName(filters.production_key.value),
          task_key: getIdName(filters.task_key.value as IdName[]),
          responsible: getIdName(filters.responsible.value as IdName[]),
          product_type: getIdName(filters.product_type.value as IdName[]),
          search_query: (filters.search_query.value.trim() as string) || undefined,
          primary_client: getIdName(filters.primary_client.value as IdName[]),
          external_order_number: getIdName(filters.external_order_number.value),
          order_priority: returnParams(filters.order_priority.value as IdName[]),
          to_stock: convertToStockFilterParams(filters.to_stock.value as IdName[]),
          marketplace_order_number: getIdName(filters.marketplace_order_number.value),
          created_at: getDatesForFilters(filters.created_at.value as DateRange<Dayjs>),
          started_at: getDatesForFilters(filters.started_at.value as DateRange<Dayjs>),
          involved_department: getIdName(filters.involved_department.value as IdName[]),
          production_status: returnParams(filters.production_status.value as IdName[]),
          deadline_at: getDatesForFilters(filters.deadline_at.value as DateRange<Dayjs>),
          completed_at: getDatesForFilters(filters.completed_at.value as DateRange<Dayjs>),
          production_priority: returnParams(filters.production_priority.value as IdName[]),
          source: isSource ? returnParams(filters.source.value as IdName[])[0] : undefined,
          workflow_template_name: getIdName(filters.workflow_template_name.value as IdName[]),
          responsibility_department: getIdName(filters.responsibility_department.value as IdName[]),
          product_configuration_name: getIdName(filters.product_configuration_name.value as IdName[]),
          users_assigned_to_production_tasks: getIdName(filters.users_assigned_to_production_tasks.value as IdName[]),
          issues: filterWithAllIssues ? Object.values(ProductionIssueEnum) : returnParams(filters.issues.value),
          first_workflow_estimated_time: !isEstimatedTimeDefaultSelected
            ? (filters.first_workflow_estimated_time.value as MinMax)
            : undefined,
          limit_by: additionalFilter.id
            ? {
                by: additionalFilter.name.includes('Order') ? 'order_key' : 'product_id',
                value: additionalFilter.id,
              }
            : undefined,
          show_completed: {
            type: filters.show_completed.radioValue,
            period: filters.show_completed.radioValue === ShowCompletedPeriodEnum.Some ? showCompletedPeriod : undefined,
          },
          exclude_unknown_products: filters.exclude_unknown_products.value,
        },
        sort: {
          sortBy: sort.sort_by.value.id,
          order: sort.sort_order.value,
        },
        group_by: customGroupBy || groupBy,
        show_parent_items_if_subitems_match_filters: filters.show_parent_items_if_sub_items_match_filters.value,
        show_all_subitems: filters.show_all_sub_items.value,
        pagination: {
          skip,
          take,
        },
      };
    };
  }

  public static loadFilters() {
    return async (dispatch) => {
      dispatch(stateController.setState({ isLoadingFilters: true }));
      await dispatch(ProductionFiltersActions.loadAndSetDefaultFiltersState());

      const userFilters = await UserService.getUserProductionFilters();

      if (userFilters) {
        await dispatch(ProductionFiltersActions.setUserFilters(userFilters));
      }

      dispatch(stateController.setState({ isLoadingFilters: false }));
    };
  }

  public static setUserFilters(userFilters: GetProductionWorkflowsFilteredRequest) {
    return async (dispatch) => {
      dispatch(
        stateController.setState((prevState) => ({
          ...prevState,
          groupBy: userFilters.group_by,
          sort: {
            ...prevState.sort,
            sort_by: {
              ...prevState.sort.sort_by,
              value: {
                id: userFilters.sort.sortBy,
                name: productionFiltersDefaultState.sort.sort_by.options.find((i) => i.id === userFilters.sort.sortBy).name,
              },
            },
            sort_order: {
              value: userFilters.sort?.order || 'asc',
            },
          },
          filterSelector: {
            ...prevState.filterSelector,
            value: userFilters.chosen_filters?.map((chosen_filter) => productionFilters[chosen_filter]) || [],
          },
          filters: {
            ...prevState.filters,
            [ProductionFilterCriteriaEnum.SearchQuery]: {
              value: userFilters.filters[ProductionFilterCriteriaEnum.SearchQuery] || '',
            },
            [ProductionFilterCriteriaEnum.Vendor]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.Vendor],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.Vendor])],
            },
            [ProductionFilterCriteriaEnum.Issues]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.Issues],
              value: [
                ...getValueFromIds(
                  userFilters.filters[ProductionFilterCriteriaEnum.Issues],
                  prevState.filters[ProductionFilterCriteriaEnum.Issues].options.concat(
                    prevState.filters[ProductionFilterCriteriaEnum.Issues].additionalOptions,
                  ),
                ),
              ],
            },
            [ProductionFilterCriteriaEnum.Source]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.Source],
              value: [
                ...getValueFromIds(
                  userFilters.filters[ProductionFilterCriteriaEnum.Source]
                    ? [userFilters.filters[ProductionFilterCriteriaEnum.Source]]
                    : undefined,
                  prevState.filters[ProductionFilterCriteriaEnum.Source].options,
                ),
              ],
            },
            [ProductionFilterCriteriaEnum.Option]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.Option],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.Option])],
            },
            [ProductionFilterCriteriaEnum.Client]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.Client],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.Client])],
            },
            [ProductionFilterCriteriaEnum.Product]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.Product],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.Product])],
            },
            [ProductionFilterCriteriaEnum.OrderKey]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.OrderKey],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.OrderKey])],
            },
            [ProductionFilterCriteriaEnum.ProductType]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.ProductType],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.ProductType])],
            },
            [ProductionFilterCriteriaEnum.ProductionKey]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.ProductionKey],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.ProductionKey])],
            },
            [ProductionFilterCriteriaEnum.TaskKey]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.TaskKey],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.TaskKey])],
            },
            [ProductionFilterCriteriaEnum.ExternalOrderNumber]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.ExternalOrderNumber],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.ExternalOrderNumber])],
            },
            [ProductionFilterCriteriaEnum.OrderPriority]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.OrderPriority],
              value: [
                ...getValueFromIds(
                  userFilters.filters[ProductionFilterCriteriaEnum.OrderPriority],
                  prevState.filters[ProductionFilterCriteriaEnum.OrderPriority].options,
                ),
              ],
            },
            [ProductionFilterCriteriaEnum.MakeToStock]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.MakeToStock],
              value: [
                ...convertToStockFilterOptions(
                  userFilters.filters[ProductionFilterCriteriaEnum.MakeToStock],
                  prevState.filters[ProductionFilterCriteriaEnum.MakeToStock].options,
                ),
              ],
            },

            [ProductionFilterCriteriaEnum.ProductionStatus]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.ProductionStatus],
              value: [
                ...getValueFromIds(
                  userFilters.filters[ProductionFilterCriteriaEnum.ProductionStatus],
                  prevState.filters[ProductionFilterCriteriaEnum.ProductionStatus].options,
                ),
              ],
            },
            [ProductionFilterCriteriaEnum.ProductionPriority]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.ProductionPriority],
              value: [
                ...getValueFromIds(
                  userFilters.filters[ProductionFilterCriteriaEnum.ProductionPriority],
                  prevState.filters[ProductionFilterCriteriaEnum.ProductionPriority].options,
                ),
              ],
            },
            [ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks])],
            },
            [ProductionFilterCriteriaEnum.ShowCompleted]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.ShowCompleted],
              radioValue: userFilters.filters[ProductionFilterCriteriaEnum.ShowCompleted].type,
              value:
                prevState.filters[ProductionFilterCriteriaEnum.ShowCompleted].options.find(
                  (item) => item.id === userFilters.filters[ProductionFilterCriteriaEnum.ShowCompleted].period?.toString(),
                ) || prevState.filters[ProductionFilterCriteriaEnum.ShowCompleted].options[0],
            },
            [ProductionFilterCriteriaEnum.ResponsibilityDepartment]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.ResponsibilityDepartment],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.ResponsibilityDepartment])],
            },
            [ProductionFilterCriteriaEnum.MarketplaceOrderNumber]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.MarketplaceOrderNumber],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.MarketplaceOrderNumber])],
            },
            [ProductionFilterCriteriaEnum.InvolvedDepartment]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.InvolvedDepartment],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.InvolvedDepartment])],
            },
            [ProductionFilterCriteriaEnum.Responsible]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.Responsible],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.Responsible])],
            },
            [ProductionFilterCriteriaEnum.CreatedBy]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.CreatedBy],
              value: [...getValues(userFilters.filters[ProductionFilterCriteriaEnum.CreatedBy])],
            },
            [ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime]: {
              ...prevState.filters[ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime],
              value:
                userFilters.filters[ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime] ||
                prevState.filters[ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime].value,
            },
            [ProductionFilterCriteriaEnum.LimitBy]: userFilters.filters[ProductionFilterCriteriaEnum.LimitBy]
              ? userFilters.filters[ProductionFilterCriteriaEnum.LimitBy]
              : {},
            [ProductionFilterCriteriaEnum.CreatedDate]: userFilters.filters[ProductionFilterCriteriaEnum.CreatedDate]
              ? { value: stringArrayToDateRange(userFilters.filters[ProductionFilterCriteriaEnum.CreatedDate] as string[]) }
              : prevState.filters[ProductionFilterCriteriaEnum.CreatedDate],
            [ProductionFilterCriteriaEnum.StartedDate]: userFilters.filters[ProductionFilterCriteriaEnum.StartedDate]
              ? { value: stringArrayToDateRange(userFilters.filters[ProductionFilterCriteriaEnum.StartedDate] as string[]) }
              : prevState.filters[ProductionFilterCriteriaEnum.StartedDate],
            [ProductionFilterCriteriaEnum.DeadlineDate]: userFilters.filters[ProductionFilterCriteriaEnum.DeadlineDate]
              ? { value: stringArrayToDateRange(userFilters.filters[ProductionFilterCriteriaEnum.DeadlineDate] as string[]) }
              : prevState.filters[ProductionFilterCriteriaEnum.DeadlineDate],
            [ProductionFilterCriteriaEnum.CompletedDate]: userFilters.filters[ProductionFilterCriteriaEnum.CompletedDate]
              ? { value: stringArrayToDateRange(userFilters.filters[ProductionFilterCriteriaEnum.CompletedDate] as string[]) }
              : prevState.filters[ProductionFilterCriteriaEnum.CompletedDate],
            [ProductionFilterCriteriaEnum.ExcludeUnknownProducts]: userFilters.filters[
              ProductionFilterCriteriaEnum.ExcludeUnknownProducts
            ]
              ? { value: userFilters.filters[ProductionFilterCriteriaEnum.ExcludeUnknownProducts] }
              : prevState.filters[ProductionFilterCriteriaEnum.ExcludeUnknownProducts],
            [ProductionFilterCriteriaEnum.ShowAllSubItems]: {
              value: userFilters.show_all_subitems ?? true,
            },
            [ProductionFilterCriteriaEnum.ShowParentIfSubItemsMatchFilters]: {
              value: userFilters.show_parent_items_if_subitems_match_filters ?? true,
            },
          },
        })),
      );
    };
  }

  public static getProductionsByFilter({
    resetSkipAndSetTakeToDefault = false,
    isInfinityScroll = false,
    customGroupBy,
    showFetchEffect = true,
    resetSkipPreserveTake = false,
  }: GetProductionsByFilterArgs) {
    return async (dispatch) => {
      try {
        if (showFetchEffect) dispatch(stateController.setState({ isFetchingData: true }));

        if (resetSkipAndSetTakeToDefault) {
          dispatch(
            stateController.setState((prev) => ({
              ...prev,
              pagination: {
                ...prev.pagination,
                next: 0,
              },
            })),
          );
        }
        const requestBody: GetProductionWorkflowsFilteredRequest = dispatch(
          ProductionFiltersActions.prepareRequestBody(customGroupBy, resetSkipPreserveTake),
        );

        const [productions, issues, launchingProductionCount] = await Promise.all([
          ProductionWorkflowService.getAll(requestBody),
          ProductionWorkflowService.getProductionIssues(requestBody),
          ProductionWorkflowService.getLaunchingProductionCount(),
        ]);

        if (launchingProductionCount) {
          dispatch(ProductionsLaunchingProgressActions.showModalAndSetLaunchingProductionsCount(launchingProductionCount));
        }

        if (isInfinityScroll) {
          dispatch(ProductionListActions.setProductionItemsAfterLoadMore(productions.data, customGroupBy));
        } else {
          dispatch(ProductionListActions.setProductionItems(productions.data, customGroupBy));
        }

        if (!resetSkipPreserveTake) {
          dispatch(
            stateController.setState((prev) => ({
              ...prev,
              groupBy: customGroupBy || prev.groupBy,
              issues,
              pagination: {
                ...prev.pagination,
                total: productions.meta.total,
                lastPage: productions.meta.lastPage,
                currentPage: productions.meta.currentPage,
                prev: productions.meta.prev,
                next: productions.meta.next,
              },
            })),
          );
        }
      } catch (err) {
        notify.error('Something went wrong');
      } finally {
        if (showFetchEffect) dispatch(stateController.setState({ isFetchingData: false }));
      }
    };
  }

  public static handleAdditionalFilter(args: HandleAdditionalFilterArgs) {
    return async (dispatch) => {
      if (args.clear) Url.clear();
      dispatch(
        stateController.setState({ additionalFilter: args.additionalFilter || productionFiltersDefaultState.additionalFilter }),
      );
      dispatch(ProductionFiltersActions.clearFilters(false));
      dispatch(
        ProductionFiltersActions.getProductionsByFilter({ resetSkipAndSetTakeToDefault: true, customGroupBy: GroupByEnum.None }),
      );
    };
  }

  public static handleShowMore({ item }: ShowMoreArgs) {
    return async (dispatch) => {
      let customFilterText = '';

      if ('order_key' in item) {
        customFilterText = `Order: ${item.order_key}`;
        // temporary in case we have only two types
      } else {
        const name = item.name || 'Unknown';
        const type = item.type ? ` - ${item.type}` : '';
        const vendor = item.vendor ? ` - ${item.vendor}` : '';
        customFilterText = `Product: ${name}${type}${vendor}`;
      }

      dispatch(
        ProductionFiltersActions.handleAdditionalFilter({
          additionalFilter: { id: 'order_key' in item ? item.order_key : item.id, name: customFilterText },
        }),
      );
    };
  }

  public static onSelectFilters(values: IdName[], selectedItem: IdName) {
    return async (dispatch, getState: () => AppState) => {
      const { filters } = getState().production.filters;

      const setChosenFiltersBody = {
        chosen_filters: values.map((item: { id: ProductionFilterCriteriaEnum; name: string }) => item.id),
      };

      debounce(async () => {
        await ProductionWorkflowService.setChosenFilters(setChosenFiltersBody);
      }, 500);

      const isSelected = values.includes(selectedItem);
      let isFilterChanged: boolean;
      if (selectedItem.id === ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime) {
        isFilterChanged =
          filters[selectedItem.id].value.min !== filters[selectedItem.id].minMaxPossible.min ||
          filters[selectedItem.id].value.max !== filters[selectedItem.id].minMaxPossible.max;
      } else if (
        selectedItem.id === ProductionFilterCriteriaEnum.CreatedDate ||
        selectedItem.id === ProductionFilterCriteriaEnum.DeadlineDate ||
        selectedItem.id === ProductionFilterCriteriaEnum.CompletedDate ||
        selectedItem.id === ProductionFilterCriteriaEnum.StartedDate
      ) {
        isFilterChanged =
          filters[selectedItem.id].value[0] !== productionFiltersDefaultState.filters[selectedItem.id].value[0] ||
          filters[selectedItem.id].value[1] !== productionFiltersDefaultState.filters[selectedItem.id].value[1];
      } else {
        isFilterChanged =
          filters[selectedItem.id].value.length !== productionFiltersDefaultState.filters[selectedItem.id].value.length;
      }

      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          filterSelector: {
            ...prev.filterSelector,
            value: values,
          },
        })),
      );

      const allFilters = Object.keys(filters);
      const selectedFilters = values.map((i) => i.id);
      const deselectedFilters = allFilters.filter((item) => !selectedFilters.includes(item));

      if (!isSelected && isFilterChanged) {
        dispatch(ProductionFiltersActions.clearFilters(true, deselectedFilters));
      }
    };
  }

  public static loadMoreProductions() {
    return async (dispatch, getState: () => AppState) => {
      const { currentPage, lastPage } = getState().production.filters.pagination;
      if (currentPage >= lastPage) return;

      try {
        dispatch(stateController.setState({ isInfinityScrollLoad: true }));

        await dispatch(
          ProductionFiltersActions.getProductionsByFilter({
            isInfinityScroll: true,
            showFetchEffect: false,
          }),
        );
      } catch (error) {
        notify.error('Something went wrong');
      } finally {
        dispatch(stateController.setState({ isInfinityScrollLoad: false }));
      }
    };
  }

  public static onChangeSort(values: Partial<ProductionFiltersState['sort']>) {
    return async (dispatch, getState: () => AppState) => {
      const { sort_order, sort_by } = getState().production.filters.sort;
      if (values.sort_order?.value === sort_order.value || values.sort_by?.value.id === sort_by.value.id) return;

      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          sort: Object.keys(values).reduce(
            (acc, item) => ({
              ...acc,
              [item]: { ...prev.sort[item], value: values[item].value },
            }),
            { ...prev.sort },
          ),
        })),
      );
      dispatch(ProductionFiltersActions.getProductionsByFilter({ resetSkipAndSetTakeToDefault: true }));
    };
  }

  public static onFiltersChange(newValue: OnChangeFilterParam) {
    return async (dispatch) => {
      dispatch(
        stateController.setState((prevState) => ({
          ...prevState,
          filters: Object.keys(newValue).reduce(
            (acc, item) => ({
              ...acc,
              [item]: { ...prevState.filters[item], value: newValue[item] },
            }),
            { ...prevState.filters },
          ),
        })),
      );
      debounce(async () => {
        dispatch(ProductionFiltersActions.getProductionsByFilter({ resetSkipAndSetTakeToDefault: true }));
      }, 1000);
    };
  }

  public static changeFilterOptions(filterOptions: OnChangeFilterParam) {
    return async (dispatch) => {
      dispatch(
        stateController.setState((prevState) => ({
          ...prevState,
          filters: {
            ...Object.keys(filterOptions).reduce(
              (acc, item) => ({
                ...acc,
                [item]: { ...prevState.filters[item], options: filterOptions[item] },
              }),
              { ...prevState.filters },
            ),
          },
        })),
      );
    };
  }

  public static changeDisplayRange(value: Partial<DisplayRangeType>) {
    return async (dispatch) => {
      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          filters: {
            ...prev.filters,
            show_completed: {
              ...prev.filters.show_completed,
              ...value,
            },
          },
        })),
      );

      dispatch(ProductionFiltersActions.getProductionsByFilter({ resetSkipAndSetTakeToDefault: true }));
    };
  }

  public static clearFilters(fetchData?: boolean, filtersArray?: string[]) {
    return (dispatch, getState: () => AppState) => {
      const { filters } = getState().production.filters;

      const resetFilters = Object.keys(filters).reduce((acc, filterKey) => {
        let exceptionFilter: FilterDataType;
        const isNeedToClearEstimatedTime = filtersArray
          ? filterKey === ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime && filtersArray.includes(filterKey)
          : filterKey === ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime;

        if (filtersArray && !filtersArray.includes(filterKey)) {
          exceptionFilter = filters[filterKey];
        }

        if (isNeedToClearEstimatedTime) {
          exceptionFilter = { value: { ...filters[filterKey].minMaxPossible, min: 0 } };
        }
        if (filterKey === ProductionFilterCriteriaEnum.ShowCompleted) {
          exceptionFilter = filters[filterKey];
        }
        if (filterKey === ProductionFilterCriteriaEnum.ExcludeUnknownProducts) {
          exceptionFilter = filters[filterKey];
        }
        if (filtersArray && filterKey === ProductionFilterCriteriaEnum.SearchQuery) {
          exceptionFilter = filters[filterKey];
        }

        return {
          ...acc,
          [filterKey]: {
            ...filters[filterKey],
            value: productionFiltersDefaultState.filters[filterKey]?.value,
            ...exceptionFilter,
          },
        };
      }, {});

      dispatch(
        stateController.setState((prevState) => ({
          ...prevState,
          filters: resetFilters,
        })),
      );

      if (fetchData) {
        dispatch(ProductionFiltersActions.getProductionsByFilter({ resetSkipAndSetTakeToDefault: true }));
      }
    };
  }

  public static onGroupByChange(value: GroupByEnum) {
    return (dispatch, getState: () => AppState) => {
      const { groupBy, additionalFilter } = getState().production.filters;

      if (groupBy === value) return;
      if (additionalFilter.name) Url.clear();

      dispatch(stateController.setState({ groupBy: value, additionalFilter: productionFiltersDefaultState.additionalFilter }));
      dispatch(ProductionListActions.toggleIsEnableMultiActions(false));
      dispatch(ProductionFiltersActions.getProductionsByFilter({ resetSkipAndSetTakeToDefault: true }));
    };
  }

  public static clearFilterState() {
    return (dispatch) => dispatch(stateController.setState(productionFiltersDefaultState));
  }
}

class ProductionFiltersSelectors {
  public static filterSelectorValueIds(state: AppState) {
    return state.production.filters.filterSelector.value.reduce((acc, item) => ({ ...acc, [item?.id]: item?.id }), {});
  }

  public static isFiltersDirty(state: AppState) {
    const { filters } = state.production.filters;

    const maxValue = filters.first_workflow_estimated_time.minMaxPossible.max;
    const minValue = filters.first_workflow_estimated_time.minMaxPossible.min;
    const createdAt = filters.created_at.value[0] !== null || filters.created_at.value[1] !== null;
    const startedAt = filters.started_at.value[0] !== null || filters.started_at.value[1] !== null;
    const deadlineAt = filters.deadline_at.value[0] !== null || filters.deadline_at.value[1] !== null;
    const completedAt = filters.completed_at.value[0] !== null || filters.completed_at.value[1] !== null;
    const estimatedTime =
      filters.first_workflow_estimated_time.value.min !== minValue ||
      filters.first_workflow_estimated_time.value.max !== maxValue;

    return (
      createdAt ||
      startedAt ||
      deadlineAt ||
      completedAt ||
      estimatedTime ||
      !!filters.vendor.value.length ||
      !!filters.option.value.length ||
      !!filters.issues.value.length ||
      !!filters.source.value.length ||
      !!filters.client.value.length ||
      !!filters.product.value.length ||
      !!filters.task_key.value.length ||
      !!filters.order_key.value.length ||
      !!filters.created_by.value.length ||
      !!filters.responsible.value.length ||
      !!filters.search_query.value.length ||
      !!filters.product_type.value.length ||
      !!filters.production_key.value.length ||
      !!filters.order_priority.value.length ||
      !!filters.to_stock.value ||
      !!filters.production_status.value.length ||
      !!filters.involved_department.value.length ||
      !!filters.production_priority.value.length ||
      !!filters.external_order_number.value.length ||
      !!filters.marketplace_order_number.value.length ||
      !!filters.responsibility_department.value.length ||
      !!filters.users_assigned_to_production_tasks.value.length
    );
  }
}

const reducer = stateController.getReducer();

export { reducer as Reducer, ProductionFiltersActions, ProductionFiltersSelectors, stateController as Controller };
