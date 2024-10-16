import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { FilterIcon } from 'icons/filter';
import { IdName } from 'types/common-types';
import { useRef, useState, FC } from 'react';
import { bindTrigger } from 'material-ui-popup-state';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material';
import { ProductionFilterCriteriaEnum } from 'services/production-workflow.model';
import CheckboxItem from 'pages/production/production-filters/components/filter-selector/checkbox-item/checkbox-item';
import { ProductionFiltersActions } from 'pages/production/controllers/production-filters-controller/production-filters.controller';
import { FilterSelectorState } from 'pages/production/controllers/production-filters-controller/types';
import s from './filter-selector.module.scss';

type StateProps = {
  filterSelector: FilterSelectorState;
};

type DispatchProps = {
  onSelectFilters: (value: IdName[], selectedItem: IdName) => void;
};

type Props = StateProps & DispatchProps;

const FilterSelector: FC<Props> = ({ filterSelector, onSelectFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const { options, value } = filterSelector;

  const popupState = usePopupState({ variant: 'popper', popupId: `filter-selector` });
  popupState.close = () => {
    setIsOpen(false);
  };

  const onSelect = (item: IdName) => {
    if (value.some((val) => val.id === item.id)) {
      onSelectFilters(
        value.filter((val) => val.id !== item.id),
        item,
      );
    } else {
      onSelectFilters([...value, item], item);
    }
  };

  return (
    <div ref={rootRef} {...bindTrigger(popupState)}>
      <div className={s.container} onClick={() => setIsOpen(true)}>
        <FilterIcon />
      </div>
      <Popper
        transition
        open={isOpen}
        disablePortal
        role={undefined}
        placement="bottom-start"
        anchorEl={rootRef.current}
        style={{ zIndex: 10, userSelect: 'none' }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            timeout={100}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}
          >
            <Paper sx={{ borderRadius: '8px' }}>
              <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <div className={s.menu_container}>
                  <p className={s.title}>Filters</p>
                  <div className={s.grid}>
                    <div className={s.column}>
                      <p>Production</p>
                      <CheckboxItem
                        label="Production status"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.ProductionStatus)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.ProductionStatus))}
                      />
                      <CheckboxItem
                        label="Production priority"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.ProductionPriority)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.ProductionPriority))}
                      />
                      <CheckboxItem
                        label="Production key"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.ProductionKey)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.ProductionKey))}
                      />
                      <CheckboxItem
                        label="Issues"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.Issues)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.Issues))}
                      />
                      <CheckboxItem
                        label="Source"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.Source)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.Source))}
                      />
                      <CheckboxItem
                        label="Task key"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.TaskKey)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.TaskKey))}
                      />
                    </div>
                    <div className={s.column}>
                      <p>People</p>
                      <CheckboxItem
                        label="Responsible"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.Responsible)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.Responsible))}
                      />
                      <CheckboxItem
                        label="Created by"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.CreatedBy)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.CreatedBy))}
                      />
                      <CheckboxItem
                        label="Users assigned to tasks"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks)}
                        onSelect={() =>
                          onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.UsersAssignedToProductionTasks))
                        }
                      />
                    </div>
                    <div className={s.column}>
                      <p>Department</p>
                      <CheckboxItem
                        label="Responsible departments"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.ResponsibilityDepartment)}
                        onSelect={() =>
                          onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.ResponsibilityDepartment))
                        }
                      />
                      <CheckboxItem
                        label="Involved department"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.InvolvedDepartment)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.InvolvedDepartment))}
                      />
                    </div>
                    <div className={s.column}>
                      <p>Time</p>
                      <CheckboxItem
                        label="Deadline"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.DeadlineDate)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.DeadlineDate))}
                      />
                      <CheckboxItem
                        label="Estimated time"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime)}
                        onSelect={() =>
                          onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.FirstWorkflowEstimatedTime))
                        }
                      />
                      <CheckboxItem
                        label="Creation date"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.CreatedDate)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.CreatedDate))}
                      />
                      <CheckboxItem
                        label="Started date"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.StartedDate)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.StartedDate))}
                      />
                      <CheckboxItem
                        label="Completion date"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.CompletedDate)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.CompletedDate))}
                      />
                    </div>
                    <div className={s.column}>
                      <p>Order</p>
                      <CheckboxItem
                        label="Client"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.Client)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.Client))}
                      />
                      <CheckboxItem
                        label="Primary client"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.PrimaryClient)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.PrimaryClient))}
                      />
                      <CheckboxItem
                        label="External order number"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.ExternalOrderNumber)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.ExternalOrderNumber))}
                      />
                      <CheckboxItem
                        label="Marketplace order number"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.MarketplaceOrderNumber)}
                        onSelect={() =>
                          onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.MarketplaceOrderNumber))
                        }
                      />
                      <CheckboxItem
                        label="Order key"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.OrderKey)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.OrderKey))}
                      />
                      <CheckboxItem
                        label="Order priority"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.OrderPriority)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.OrderPriority))}
                      />
                      <CheckboxItem
                        label="Make to stock"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.MakeToStock)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.MakeToStock))}
                      />
                    </div>
                    <div className={s.column}>
                      <p>Product</p>
                      <CheckboxItem
                        label="Product"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.Product)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.Product))}
                      />
                      <CheckboxItem
                        label="Options (Variant)"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.Option)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.Option))}
                      />
                      {/* <CheckboxItem
                        label="Barcode"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.))}
                      /> */}
                      <CheckboxItem
                        label="Product type"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.ProductType)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.ProductType))}
                      />
                      <CheckboxItem
                        label="Vendor"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.Vendor)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.Vendor))}
                      />
                      <CheckboxItem
                        label="Configuration name"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.ConfigurationName)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.ConfigurationName))}
                      />
                      <CheckboxItem
                        label="Workflow name"
                        checked={value.some((i) => i.id === ProductionFilterCriteriaEnum.WorkflowName)}
                        onSelect={() => onSelect(options.find((i) => i.id === ProductionFilterCriteriaEnum.WorkflowName))}
                      />
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  filterSelector: state.production.filters.filterSelector,
});
const mapDispatchToProps: DispatchProps = {
  onSelectFilters: ProductionFiltersActions.onSelectFilters,
};
export default connect(mapStateToProps, mapDispatchToProps)(FilterSelector);
