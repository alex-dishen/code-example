import { AutoIcon } from 'icons/auto';
import { memo, useState } from 'react';
import { AppState } from 'redux/store';
import { useSelector } from 'react-redux';
import Panel from 'components/panel/panel';
import { User } from 'services/user.model';
import { WarningIcon } from 'icons/warning';
import { Stack, Collapse } from '@mui/material';
import Tag from 'components/tag-outline/tag-outline';
import { ProductionStatusEnum } from 'types/status-enums';
import { CalendarWarningIcon } from 'icons/calendar-warning';
import TextEditable from 'components/text-editable/text-editable';
import { ConnectorSplitRightIcon } from 'icons/connector-split-right';
import { getProductionIssues } from 'pages/production/controllers/helpers';
import { LightTooltip } from 'components/ui-new/light-tooltip/light-tooltip';
import ActionsMenu from 'pages/production/components/action-menu/actions-menu';
import Controls from 'pages/production/components/production-item/controls/controls';
import { Page } from 'pages/production/controllers/production-list-controller/types';
import { HandleProductionStatusArgs } from 'pages/production-workflow/controllers/types';
import { ProductionIssueEnum, ProductionWorkflow } from 'services/production-workflow.model';
import IssuesList from 'pages/production/components/production-item/issues-list/issues-list';
import ItemInfo from 'pages/production/components/production-item/components/item-info/item-info';
import NestedComponents from 'pages/production/components/production-item/components/nested-components/nested-components';
import { ProductionListSelectors } from 'pages/production/controllers/production-list-controller/production-list.controller';
import AdditionalComponents from 'pages/production/components/production-item/components/additional-components/additional-components';
import ProductionCheckboxWrapper from 'pages/production/components/production-item/components/production-checkbox-wrapper/production-checkbox-wrapper';
import OpenNestedProductionsButton from 'pages/production/components/production-item/components/open-nested-productions-button/open-nested-productions-button';
import s from './production-item.module.scss';

type Props = {
  users?: User[];
  mainItemId?: string;
  isChildren?: boolean;
  isExternal?: boolean;
  nestedLevel?: number;
  isLastOnList: boolean;
  withCheckbox?: boolean;
  highlitedValue?: string;
  item: ProductionWorkflow;
  isEditPermitted: boolean;
  isForProductionList?: boolean;
  extendLeftDashedLine?: boolean;
  isAdditionalComponent?: boolean;
  deleteAction: (id: string) => void;
  onNavigateToProductionWorkflow?: VoidFunction;
  setProductionsWithOpenedNestedProductions: (productionId: string) => void;
  setSelectedProductions: (production: ProductionWorkflow, parentItemId?: string) => void;
  handleProductionStatus: (args: Omit<HandleProductionStatusArgs, 'updatingStatusFrom'>) => void;
  updateProduction: (id: string, value: Partial<ProductionWorkflow>, isUpdateResponsible?: boolean) => void;
};

// eslint-disable-next-line react/display-name
const ProductionItem = memo(
  ({
    item,
    users,
    isChildren,
    isExternal,
    mainItemId,
    isLastOnList,
    highlitedValue,
    isEditPermitted,
    nestedLevel = 0,
    withCheckbox = true,
    extendLeftDashedLine,
    isAdditionalComponent,
    isForProductionList = true,
    deleteAction,
    updateProduction,
    setSelectedProductions,
    handleProductionStatus,
    onNavigateToProductionWorkflow,
    setProductionsWithOpenedNestedProductions,
  }: Props) => {
    const [openedItemId, setOpenedItemId] = useState(null);
    const [isCollapseOpen, seCollapseOpen] = useState(false);
    const isLaunchingBasedOnState = useSelector((state: AppState) =>
      ProductionListSelectors.checkIfProductionMasLaunching(state, item.id),
    );

    const isLaunching = isLaunchingBasedOnState || item.is_launch_in_progress;
    const production = { ...item, status: isLaunching ? ProductionStatusEnum.Launching : item.status };
    const isLastItem = extendLeftDashedLine ? false : isLastOnList;
    const productionIssues = getProductionIssues(item);
    const hasUndefinedProductWarning = productionIssues.some((issue) => issue.id === ProductionIssueEnum.UndefinedProduct);
    const nestedItemsCount = production.nested_workflows.length + production.additionalComponents.length;
    const isDeadlineExpired = productionIssues.find((i) => i.id === ProductionIssueEnum.ProductionDeadlineExpired);
    const filteredIssues = productionIssues.filter((i) => i.id !== ProductionIssueEnum.ProductionDeadlineExpired);

    const isOpen = isForProductionList
      ? useSelector((state: AppState) => ProductionListSelectors.isOpenedProduction(state, production.id))
      : isCollapseOpen;

    return (
      <Stack style={{ position: 'relative' }}>
        {isLastItem && <div className={s.clear_big_road_line} data-is-additional={isAdditionalComponent} />}
        <ProductionCheckboxWrapper
          mainItemId={mainItemId}
          production={production}
          nestedLevel={nestedLevel}
          withCheckbox={withCheckbox}
        >
          <div className={s.inner_container}>
            {isChildren && <div className={`${s.left_line} ${isLastOnList && s.last_on_list}`} />}
            <div className={s.production_panel_wrapper}>
              <Panel
                data-is-additional={isAdditionalComponent}
                data-is-dropdown-open={openedItemId === production.id}
                className={`${s.production_item} ${hasUndefinedProductWarning ? s.orange_border : ''}`}
              >
                <div className={s.details}>
                  <div className={s.row}>
                    <OpenNestedProductionsButton
                      productionId={production.id}
                      nestedWorkflowsCount={nestedItemsCount}
                      isForProductionList={isForProductionList}
                      onCollapseOpen={(isOpenn) => seCollapseOpen(isOpenn)}
                      setProductionsWithOpenedNestedProductions={setProductionsWithOpenedNestedProductions}
                    />

                    {!!filteredIssues?.length && (
                      <LightTooltip className={s.tooltip} placement="top-start" title={<IssuesList issues={filteredIssues} />}>
                        <div className={s.warning_wrapper}>
                          <Tag
                            color="orange"
                            className={s.badge}
                            iconLeft={
                              <Stack direction="row" alignItems="center" gap="3px">
                                <WarningIcon width={20} height={20} />
                                {filteredIssues.some((issue) => issue.id === ProductionIssueEnum.IssuesInNestedComponents) && (
                                  <ConnectorSplitRightIcon width={13} height={13} />
                                )}
                              </Stack>
                            }
                          />
                        </div>
                      </LightTooltip>
                    )}

                    {isDeadlineExpired && (
                      <LightTooltip className={s.tooltip} placement="top-start" title={isDeadlineExpired.name}>
                        <div className={s.deadline_expired_wrapper}>
                          <Tag
                            color="red"
                            className={s.badge}
                            iconLeft={
                              <Stack direction="row" alignItems="center" gap="3px">
                                <CalendarWarningIcon width={20} height={20} />
                              </Stack>
                            }
                          />
                        </div>
                      </LightTooltip>
                    )}

                    {production.is_external && (
                      <Tag color="green" className={s.badge} iconLeft={<AutoIcon width={20} height={20} />} />
                    )}

                    <div className={s.title_container}>
                      <TextEditable
                        previewMinWidth="auto"
                        textClassName={s.title}
                        value={production.title}
                        highlitedValue={highlitedValue}
                        isNotClickable={!isEditPermitted}
                        onEditEnd={(value) => updateProduction(production.id, { title: value })}
                      />
                    </div>
                  </div>
                  <ItemInfo
                    data={{
                      id: production.id,
                      notes: production.notes,
                      title: production.title,
                      status: production.status,
                      variant: production.variant,
                      version: production.version,
                      deadlineAt: production.deadline_at,
                      productionStatus: production.status,
                      orderKey: production.order.order_key,
                      productType: production.product_type,
                      ordersHistory: production.ordersHistory,
                      configuration: production.configuration,
                      productionKey: production.production_key,
                      variantsHistory: production.variantsHistory,
                      deadlineHistory: production.deadlineHistory,
                      externalOrderNumber: production.order.external_order_number,
                      externalOrderNumberHistory: production.externalOrderNumberHistory,
                    }}
                    onOpen={setOpenedItemId}
                  />
                </div>
                <div className={s.controls}>
                  <div className={s.row}>
                    <Controls
                      users={users}
                      productionPage
                      tooltip="Production progress"
                      isEditPermitted={isEditPermitted}
                      data={{
                        id: production.id,
                        order: production.order,
                        status: production.status,
                        priority: production.priority,
                        progress: production.progress,
                        variantId: production.variant.id,
                        finished_at: production.finished_at,
                        responsible: production.responsible,
                        main_root_id: production.main_root_id,
                      }}
                      onUpdate={updateProduction}
                      onNavigateToProductionWorkflow={onNavigateToProductionWorkflow}
                      onStatusUpdate={(id, status) =>
                        handleProductionStatus({
                          status,
                          production,
                          productionIdToUpdate: id,
                        })
                      }
                    />
                  </div>
                  <div className={s.row}>{/* Something may be here */}</div>
                </div>

                <div className={s.actions}>
                  <ActionsMenu
                    page={Page.Production}
                    production={production}
                    isExternal={isExternal}
                    productVariant={production.variant}
                    productionWorkflowId={production.id}
                    productionKey={production.production_key}
                    productionWorkflowTitle={production.title}
                    configurationId={production.configuration.id}
                    externalOrderNumber={item.order.external_order_number}
                    marketplaceOrderNumber={item.order.marketplace_order_number}
                    order={{ id: production.order.id, name: production.order.order_key }}
                    client={{ id: production.order.client?.id, name: production.order.client?.name }}
                    deleteAction={() => deleteAction(production.id)}
                  />
                </div>
              </Panel>
            </div>
          </div>
        </ProductionCheckboxWrapper>

        <Collapse in={isOpen}>
          <NestedComponents
            users={users}
            isExternal={isExternal}
            mainItemId={mainItemId}
            withCheckbox={withCheckbox}
            nestedLevel={nestedLevel + 1}
            isEditPermitted={isEditPermitted}
            isForProductionList={isForProductionList}
            isAdditionalComponent={isAdditionalComponent}
            nestedWorkflows={production.nested_workflows}
            extendLeftDashedLine={!!production.additionalComponents?.length}
            deleteAction={deleteAction}
            updateProduction={updateProduction}
            setSelectedProductions={setSelectedProductions}
            handleProductionStatus={handleProductionStatus}
            onNavigateToProductionWorkflow={onNavigateToProductionWorkflow}
            setProductionsWithOpenedNestedProductions={setProductionsWithOpenedNestedProductions}
          />

          <AdditionalComponents
            isLastOnList
            users={users}
            isExternal={isExternal}
            nestedLevel={nestedLevel + 1}
            isEditPermitted={isEditPermitted}
            additionalComponents={production.additionalComponents}
            deleteAction={deleteAction}
            updateProduction={updateProduction}
            handleProductionStatus={handleProductionStatus}
            setSelectedProductions={setSelectedProductions}
            onNavigateToProductionWorkflow={onNavigateToProductionWorkflow}
            setProductionsWithOpenedNestedProductions={setProductionsWithOpenedNestedProductions}
          />
        </Collapse>
      </Stack>
    );
  },
);

export default ProductionItem;
