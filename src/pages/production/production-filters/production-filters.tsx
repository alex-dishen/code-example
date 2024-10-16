import { useCallback } from 'react';
import { Chip } from '@mui/material';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import Button from 'components/button/button';
import { Calendar2Icon } from 'icons/calendar-2';
import { UserService } from 'services/user.service';
import { DepartmentsIcon } from 'icons/departments';
import { IdName } from 'types/common-types';
import { OrdersService } from 'services/orders.service';
import { ClientService } from 'services/client.service';
import Skeleton from 'components/ui-new/skeleton/skeleton';
import { ProductsService } from 'services/products.service';
import { DepartmentService } from 'services/department.service';
import { SearchInput } from 'components/ui-new/inputs/search-input';
import HighlightText from 'components/highlight-text/highlight-text';
import { ProductVendorService } from 'services/product-vendor.service';
import SortSelector from 'components/ui-new/sort-selector/sort-selector';
import { ProductionTaskService } from 'services/production-task.service';
import {
  ProductionSortType,
  OnChangeFilterParam,
  ProductionFiltersState,
  HandleAdditionalFilterArgs,
} from 'pages/production/controllers/production-filters-controller/types';
import { AvatarCircle } from 'components/ui-new/avatar-circle/avatar-circle';
import { ProductionWorkflowService } from 'services/production-workflow.service';
import { ProductOptionValuesService } from 'services/product-option-values.service';
import { getIdFullName, getDepartmentPath } from 'pages/production/controllers/helpers';
import DateRangeSelector from 'components/ui-new/date-range-selector/date-range-selector';
import {
  ProductionFiltersActions,
  ProductionFiltersSelectors,
} from 'pages/production/controllers/production-filters-controller/production-filters.controller';
import DropdownRangeSelector from 'components/ui-new/dropdown-range-selector/dropdown-range-selector';
import { ProductionFilterCriteriaEnum, ProductionIssueEnum } from 'services/production-workflow.model';
import FilterSelector from 'pages/production/production-filters/components/filter-selector/filter-selector';
import DropdownCheckboxSelector from 'components/ui-new/dropdown-checkbox-selector/dropdown-checkbox-selector';
import DropdownSearchChipsSelector from 'components/ui-new/dropdown-search-chips-selector/dropdown-search-chips-selector';
import ProductionSelectItem from 'pages/production/production-filters/components/product-select-item/product-select-item';
import ProductionViewPopup from 'pages/production/production-filters/components/production-view-popup/production-view-popup';
import { ProductConfigurationService } from 'services/product-configurations.service';
import { WorkflowTemplatesService } from 'services/workflow-templates.service';
import s from './production-filters.module.scss';

type StateProps = {
  isLoading: boolean;
  isFiltersDirty: boolean;
  additionalFilter: IdName;
  sort: ProductionSortType;
  filters: ProductionFiltersState['filters'];
  filterSelectorValues: { [key: string]: string };
};

type DispatchProps = {
  clearFilters: VoidFunction;
  onFiltersChange: (newValue: OnChangeFilterParam) => void;
  changeFilterOptions: (filterOptions: OnChangeFilterParam) => void;
  handleAdditionalFilter: (args: HandleAdditionalFilterArgs) => void;
  onChangeSort: (values: Partial<ProductionFiltersState['sort']>) => void;
};

type Props = StateProps & DispatchProps;

const skeleton = (
  <div className={s.skeleton_container}>
    <div className={s.skeleton}>
      <Skeleton variant="text" style={{ width: '113px', height: '40px' }} />
      <Skeleton variant="text" style={{ width: '200px', height: '40px' }} />
      <Skeleton variant="text" style={{ width: '42px', height: '40px' }} />
    </div>
    <Skeleton style={{ width: '40px', height: '40px' }} />
  </div>
);

export const ProductionFilters = ({
  sort,
  filters,
  isLoading,
  isFiltersDirty,
  additionalFilter,
  filterSelectorValues,
  clearFilters,
  onChangeSort,
  onFiltersChange,
  changeFilterOptions,
  handleAdditionalFilter,
}: Props) => {
  const removeFilter = useCallback(() => {
    handleAdditionalFilter({ clear: true });
  }, [handleAdditionalFilter]);

  return (
    <div className={s.container}>
      <div className={s.actions}>
        {isLoading || !filters ? (
          skeleton
        ) : (
          <>
            <div className={s.filters}>
              <SortSelector
                withTooltip
                sortBy={sort.sort_by.value}
                options={sort.sort_by.options}
                sortOrder={sort.sort_order.value}
                onSortOrderChange={(value) => onChangeSort({ sort_order: { value } })}
                onSortByChange={(value) => onChangeSort({ sort_by: { value } })}
              />
              <SearchInput
                size="small"
                sx={{ width: 200 }}
                placeholder="Search by keyword"
                value={filters.search_query.value}
                onChange={(e) => onFiltersChange({ search_query: e.target.value })}
              />
              <FilterSelector />
              {filterSelectorValues[ProductionFilterCriteriaEnum.ResponsibilityDepartment] && (
                <DropdownSearchChipsSelector
                  renderSelectItem={(item, keyword) => (
                    <div className={s.department}>
                      <DepartmentsIcon />
                      <div className={s.department_colRight}>
                        <HighlightText text={item.name} query={keyword} />
                        <div className={s.department_path}>{item.path}</div>
                      </div>
                    </div>
                  )}
                  withLazy
                  label="Responsible departments"
                  dataFormatting={(items) => getDepartmentPath(items)}
                  options={(filters.responsibility_department?.options ) || []}
                  headerCheckBoxes={filters.responsibility_department.shortcutOptions}
                  onClose={() => changeFilterOptions({ responsibility_department: [] })}
                  values={filters.responsibility_department.value }
                  onSelect={(values) => onFiltersChange({ responsibility_department: values })}
                  onChangeInput={(value) => changeFilterOptions({ responsibility_department: value })}
                  fetchData={(keyword, { skip, take }) => DepartmentService.getAllDepartaments(keyword, skip, take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.InvolvedDepartment] && (
                <DropdownSearchChipsSelector
                  headerCheckBoxes={filters[ProductionFilterCriteriaEnum.InvolvedDepartment].shortcutOptions}
                  renderSelectItem={(item, keyword) => (
                    <div className={s.department}>
                      <DepartmentsIcon />
                      <div className={s.department_colRight}>
                        <HighlightText text={item.name} query={keyword} />
                        <div className={s.department_path}>{item.path}</div>
                      </div>
                    </div>
                  )}
                  withLazy
                  label="Involved Department"
                  dataFormatting={(items) => getDepartmentPath(items)}
                  options={(filters.involved_department?.options ) || []}
                  onClose={() => changeFilterOptions({ involved_department: [] })}
                  values={filters.involved_department.value }
                  onSelect={(values) => onFiltersChange({ involved_department: values })}
                  onChangeInput={(value) => changeFilterOptions({ involved_department: value })}
                  fetchData={(keyword, { skip, take }) => DepartmentService.getAllDepartaments(keyword, skip, take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime] && (
                <DropdownRangeSelector
                  label="Estimated time (minutes)"
                  value={filters.first_workflow_estimated_time?.value }
                  minMaxRange={filters.first_workflow_estimated_time?.minMaxPossible}
                  onMinValueChange={(value) => {
                    if (value.min <= value.max) {
                      onFiltersChange({ first_workflow_estimated_time: value });
                    }
                  }}
                  onMaxValueChange={(value) => {
                    if (value.max < filters.first_workflow_estimated_time?.minMaxPossible?.max && value.max >= value.min) {
                      onFiltersChange({ first_workflow_estimated_time: value });
                    }
                  }}
                  onRangeChange={(newValue) => onFiltersChange({ first_workflow_estimated_time: newValue })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.ProductType] && (
                <DropdownCheckboxSelector
                  label="Product type"
                  options={(filters?.product_type.options ) || []}
                  values={filters?.product_type.value}
                  headerCheckBoxes={filters?.product_type.additionalOptions}
                  onChange={(values) => onFiltersChange({ product_type: values })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.CreatedDate] && (
                <DateRangeSelector
                  label="Created date"
                  icon={<Calendar2Icon />}
                  value={filters.created_at.value }
                  onChange={(value) => onFiltersChange({ created_at: value })}
                  onClear={() => onFiltersChange({ created_at: [null, null] })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.StartedDate] && (
                <DateRangeSelector
                  label="Started date"
                  icon={<Calendar2Icon />}
                  value={filters.started_at.value }
                  onChange={(value) => onFiltersChange({ started_at: value })}
                  onClear={() => onFiltersChange({ started_at: [null, null] })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.DeadlineDate] && (
                <DateRangeSelector
                  label="Deadline"
                  icon={<Calendar2Icon />}
                  value={filters.deadline_at.value }
                  onChange={(value) => onFiltersChange({ deadline_at: value })}
                  onClear={() => onFiltersChange({ deadline_at: [null, null] })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.CompletedDate] && (
                <DateRangeSelector
                  label="Completion date"
                  icon={<Calendar2Icon />}
                  value={filters.completed_at.value }
                  onChange={(values) => onFiltersChange({ completed_at: values })}
                  onClear={() => onFiltersChange({ completed_at: [null, null] })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.Vendor] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Vendor"
                  options={(filters?.vendor.options ) || []}
                  onClose={() => changeFilterOptions({ vendor: [] })}
                  headerCheckBoxes={filters?.vendor.additionalOptions}
                  values={filters?.vendor.value }
                  onSelect={(values) => onFiltersChange({ vendor: values })}
                  onChangeInput={(value) => changeFilterOptions({ vendor: value })}
                  fetchData={(keyword, { skip, take }) => ProductVendorService.getAll(keyword, skip, take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.ProductionStatus] && (
                <DropdownCheckboxSelector
                  label="Production status"
                  optionClassName={s.production_status}
                  options={(filters?.production_status.options ) || []}
                  values={filters?.production_status.value }
                  onChange={(values) => onFiltersChange({ production_status: values })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.TaskKey] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Task key"
                  options={(filters?.task_key.options ) || []}
                  onClose={() => changeFilterOptions({ task_key: [] })}
                  onSelect={(values) => onFiltersChange({ task_key: values })}
                  values={(filters?.task_key.value) || []}
                  onChangeInput={(value) => changeFilterOptions({ task_key: value })}
                  fetchData={(keyword, { skip, take }) => ProductionTaskService.getAllTasksKeys(keyword, skip, take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.MarketplaceOrderNumber] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Marketplace order number"
                  options={(filters?.marketplace_order_number.options ) || []}
                  onClose={() => changeFilterOptions({ marketplace_order_number: [] })}
                  values={filters?.marketplace_order_number.value }
                  onSelect={(values) => onFiltersChange({ marketplace_order_number: values })}
                  onChangeInput={(value) => changeFilterOptions({ marketplace_order_number: value })}
                  fetchData={(keyword, { skip, take }) => OrdersService.getMarketplaceOrderNumbers(keyword, skip, take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.ProductionKey] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Production key"
                  options={(filters?.production_key.options ) || []}
                  onClose={() => changeFilterOptions({ production_key: [] })}
                  onSelect={(values) => onFiltersChange({ production_key: values })}
                  values={(filters?.production_key.value) || []}
                  onChangeInput={(value) => changeFilterOptions({ production_key: value })}
                  fetchData={(keyword, { skip, take }) => ProductionWorkflowService.getProductionKeys(keyword, skip, take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.ExternalOrderNumber] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="External order number"
                  options={(filters?.external_order_number.options ) || []}
                  values={(filters?.external_order_number.value) || []}
                  onClose={() => changeFilterOptions({ external_order_number: [] })}
                  fetchData={(keyword, { skip, take }) => OrdersService.getExternalOrderNumbers(keyword, skip, take)}
                  onSelect={(values) => onFiltersChange({ external_order_number: values })}
                  onChangeInput={(value) => changeFilterOptions({ external_order_number: value })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.Responsible] && (
                <DropdownSearchChipsSelector
                  renderSelectItem={(item, keyword) => (
                    <div className={s.responsible}>
                      <div className={s.avatar_holder}>
                        <AvatarCircle
                          isEmpty={false}
                          className={s.avatar}
                          lastName={item.last_name || ''}
                          firstName={item.first_name || ''}
                          image={item.avatar_image_url || ''}
                        />
                      </div>
                      <HighlightText text={item.name} query={keyword} />
                    </div>
                  )}
                  withLazy
                  label="Responsible"
                  dataFormatting={(data) => getIdFullName(data)}
                  options={(filters.responsible.options ) || []}
                  headerCheckBoxes={filters.responsible.shortcutOptions}
                  onClose={() => changeFilterOptions({ responsible: [] })}
                  values={filters.responsible.value }
                  onSelect={(values) => onFiltersChange({ responsible: values })}
                  onChangeInput={(value) => changeFilterOptions({ responsible: value })}
                  fetchData={(keyword, { skip, take }) => UserService.getAllUsers({ search: keyword, skip, take })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.CreatedBy] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Created by"
                  options={(filters?.created_by.options ) || []}
                  dataFormatting={(data) => getIdFullName(data)}
                  onClose={() => changeFilterOptions({ created_by: [] })}
                  values={filters?.created_by.value }
                  onSelect={(values) => onFiltersChange({ created_by: values })}
                  onChangeInput={(value) => changeFilterOptions({ created_by: value })}
                  fetchData={(keyword, { skip, take }) => UserService.getAllUsers({ search: keyword, skip, take })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.OrderPriority] && (
                <DropdownCheckboxSelector
                  label="Order priority"
                  optionClassName={s.priorities}
                  options={(filters?.order_priority.options ) || []}
                  values={filters?.order_priority.value }
                  onChange={(values) => onFiltersChange({ order_priority: values })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.MakeToStock] && (
                <DropdownCheckboxSelector
                  label="Make to stock"
                  options={(filters?.to_stock.options ) || []}
                  values={filters?.to_stock.value }
                  onChange={(values) => onFiltersChange({ to_stock: values })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.ProductionPriority] && (
                <DropdownCheckboxSelector
                  label="Production priority"
                  optionClassName={s.priorities}
                  options={(filters?.production_priority.options ) || []}
                  values={filters?.production_priority.value }
                  onChange={(values) => onFiltersChange({ production_priority: values })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.Option] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Options"
                  options={(filters?.option.options ) || []}
                  onClose={() => changeFilterOptions({ option: [] })}
                  values={filters?.option.value }
                  onSelect={(values) => onFiltersChange({ option: values })}
                  onChangeInput={(value) => changeFilterOptions({ option: value })}
                  fetchData={(keyword, { skip, take }) => ProductOptionValuesService.getAllUniqueNames(keyword, skip, take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.OrderKey] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Order key"
                  options={(filters?.order_key.options ) || []}
                  onClose={() => changeFilterOptions({ order_key: [] })}
                  onSelect={(values) => onFiltersChange({ order_key: values })}
                  onChangeInput={(value) => changeFilterOptions({ order_key: value })}
                  values={(filters?.order_key.value) || []}
                  fetchData={(keyword, pagination) => OrdersService.getOrderKeys(keyword, pagination.skip, pagination.take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Users assigned"
                  dataFormatting={(data) => getIdFullName(data)}
                  options={(filters?.users_assigned_to_production_tasks.options ) || []}
                  onClose={() => changeFilterOptions({ users_assigned_to_production_tasks: [] })}
                  values={filters?.users_assigned_to_production_tasks.value}
                  onSelect={(values) => onFiltersChange({ users_assigned_to_production_tasks: values })}
                  onChangeInput={(value) => changeFilterOptions({ users_assigned_to_production_tasks: value })}
                  fetchData={(keyword, { skip, take }) => UserService.getAllUsers({ search: keyword, skip, take })}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.Issues] && (
                <DropdownCheckboxSelector
                  label="Issues"
                  values={filters?.issues.value}
                  headerCheckBoxes={filters?.issues.additionalOptions}
                  onChange={(values) => {
                    onFiltersChange({ issues: values });
                    if (values.some((item) => item.id === ProductionIssueEnum.UndefinedProduct)) {
                      onFiltersChange({ [ProductionFilterCriteriaEnum.ExcludeUnknownProducts]: false });
                    }
                  }}
                  options={(filters?.issues.options ) || []}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.Source] && (
                <DropdownCheckboxSelector
                  label="Source"
                  values={filters?.source.value}
                  onChange={(values) => onFiltersChange({ source: values })}
                  options={(filters?.source.options ) || []}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.Client] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Client"
                  headerCheckBoxes={filters.client.shortcutOptions}
                  options={(filters?.client.options ) || []}
                  onClose={() => changeFilterOptions({ client: [] })}
                  onSelect={(values) => onFiltersChange({ client: values })}
                  onChangeInput={(value) => changeFilterOptions({ client: value })}
                  values={(filters?.client.value) || []}
                  fetchData={(keyword, { skip, take }) => ClientService.getAllClients(keyword, skip, take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.Product] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Product"
                  options={(filters?.product.options ) || []}
                  onClose={() => changeFilterOptions({ product: [] })}
                  onSelect={(values) => onFiltersChange({ product: values })}
                  onChangeInput={(value) => changeFilterOptions({ product: value })}
                  values={(filters?.product.value) || []}
                  renderSelectItem={(item, keyword) => <ProductionSelectItem item={item} keyword={keyword} />}
                  fetchData={(keyword, { skip, take }) => ProductsService.getProductMeta(keyword, skip, take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.PrimaryClient] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Primary client"
                  headerCheckBoxes={filters.primary_client.shortcutOptions}
                  options={(filters?.primary_client.options ) || []}
                  onClose={() => changeFilterOptions({ primary_client: [] })}
                  onSelect={(values) => onFiltersChange({ primary_client: values })}
                  onChangeInput={(value) => changeFilterOptions({ primary_client: value })}
                  values={(filters?.primary_client.value) || []}
                  fetchData={(keyword, pagination) => ClientService.getAllClients(keyword, pagination.skip, pagination.take)}
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.ConfigurationName] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Configuration name"
                  options={(filters?.product_configuration_name.options ) || []}
                  onClose={() => changeFilterOptions({ product_configuration_name: [] })}
                  onSelect={(values) => onFiltersChange({ product_configuration_name: values })}
                  onChangeInput={(value) => changeFilterOptions({ product_configuration_name: value })}
                  values={(filters?.product_configuration_name.value) || []}
                  fetchData={(keyword, pagination) =>
                    ProductConfigurationService.getProductConfigurationNames(keyword, pagination.skip, pagination.take)
                  }
                />
              )}
              {filterSelectorValues[ProductionFilterCriteriaEnum.WorkflowName] && (
                <DropdownSearchChipsSelector
                  withLazy
                  label="Workflow name"
                  options={(filters?.workflow_template_name.options ) || []}
                  onClose={() => changeFilterOptions({ workflow_template_name: [] })}
                  onSelect={(values) => onFiltersChange({ workflow_template_name: values })}
                  onChangeInput={(value) => changeFilterOptions({ workflow_template_name: value })}
                  values={(filters?.workflow_template_name.value) || []}
                  fetchData={(keyword, pagination) =>
                    WorkflowTemplatesService.getWorkflowTemplateNames(keyword, pagination.skip, pagination.take)
                  }
                />
              )}
              {isFiltersDirty && (
                <Button color="black" variant="text_bg" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>
            <div className={s.additional_controls}>
              <ProductionViewPopup />
            </div>
          </>
        )}
      </div>
      {additionalFilter.name && <Chip label={additionalFilter.name} onDelete={removeFilter} className={s.chip} />}
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  sort: state.production.filters.sort,
  filters: state.production.filters.filters,
  isLoading: state.production.filters.isLoadingFilters,
  additionalFilter: state.production.filters.additionalFilter,
  isFiltersDirty: ProductionFiltersSelectors.isFiltersDirty(state),
  filterSelectorValues: ProductionFiltersSelectors.filterSelectorValueIds(state),
});

const mapDispatchToProps: DispatchProps = {
  clearFilters: ProductionFiltersActions.clearFilters,
  onChangeSort: ProductionFiltersActions.onChangeSort,
  onFiltersChange: ProductionFiltersActions.onFiltersChange,
  changeFilterOptions: ProductionFiltersActions.changeFilterOptions,
  handleAdditionalFilter: ProductionFiltersActions.handleAdditionalFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductionFilters);
