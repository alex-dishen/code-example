import { SkuIcon } from 'icons/sku';
import { CostIcon } from 'icons/cost';
import { TimeIcon } from 'icons/time';
import { BookIcon } from 'icons/book';
import ProfileIcon from 'icons/profile';
import { PluginIcon } from 'icons/plugin';
import { VendorIcon } from 'icons/vendor';
import { ClientIcon } from 'icons/client';
import TripleCopy from 'icons/triple-copy';
import { BarcodeIcon } from 'icons/barcode';
import { DiamondIcon } from 'icons/diamond';
import { Menu, Tooltip } from '@mui/material';
import Button from 'components/button/button';
import { SettingsIcon } from 'icons/settings';
import { ProductsIcon } from 'icons/products';
import { Hierarchy1 } from 'icons/hierarchy-1';
import { Hierarchy2 } from 'icons/hierarchy-2';
import { Hierarchy3 } from 'icons/hierarchy-3';
import { OrderKeyIcon } from 'icons/order-key';
import { BuildingsIcon } from 'icons/buildings';
import { Products3Icon } from 'icons/products-3';
import { SandClockIcon } from 'icons/sand-clock';
import { ComponentsIcon } from 'icons/components';
import { PerformersIcon } from 'icons/performers';
import { DepartmentsIcon } from 'icons/departments';
import { ProductTypeIcon } from 'icons/product-type';
import { OrderNumberIcon } from 'icons/order-number';
import { TaskNumbersIcon } from 'icons/task-numbers';
import { CheckboxFailIcon } from 'icons/checkbox-fail';
import { EditCalendarIcon } from 'icons/edit-calendar';
import { TickCalendarIcon } from 'icons/tick-calendar';
import { ProductionKeyIcon } from 'icons/production-key';
import { EstimatedTimeIcon } from 'icons/estimated-time';
import { EstimatedCostIcon } from 'icons/estimated-cost';
import { ProductCategoryIcon } from 'icons/product-category';
import { getDateWithTime, getTimeFromSeconds } from 'utils/time';
import { SettingsCollectionIcon } from 'icons/settings-collection';
import { bindMenu, bindTrigger } from 'material-ui-popup-state/core';
import { Page } from 'pages/production/controllers/production-list-controller/types';
import VerticalShiftAnimation from 'components/wrapper-with-shift-animation/vertical-shift-animation';
import useInfoDorpDown, { loadData } from 'pages/production/components/info-dropdown/use-info-dropdown';
import { ItemInfoDataT } from 'pages/production/components/production-item/components/item-info/item-info';
import { ComponentsHistoryActions } from 'pages/production/controllers/components-history-modal.controller';
import DeadlineItem from 'pages/production/components/info-dropdown/components/deadline-item/deadline-item';
import InfoShowMore from 'pages/production/components/info-dropdown/components/info-show-more/info-show-more';
import NoteComponent from 'pages/production/components/info-dropdown/components/note-component/note-component';
import InfoDropdownItem from 'pages/production/components/info-dropdown/components/info-dropdown-item/info-dropdown-item';
import InfoDropdownItemTooltip from 'pages/production/components/info-dropdown/components/info-dropdown-item-tooltip/info-dropdown-item-tooltip';
import { MarketPlaceNoteIcon } from 'icons/marketplace-note';
import { LineItemNoteIcon } from 'icons/line-item-note';
import { MakeToStockIcon } from 'icons/make-to-stock';
import { EyeIcon } from 'icons/eye';
import { Paths } from 'routes/paths';
import s from './info-dropdown.module.scss';

export type Props = {
  page: Page;
  data: ItemInfoDataT;
  onOpen?: (id: string) => void;
};

const InfoDropdown = ({ data, page, onOpen }: Props) => {
  const {
    isOpen,
    details,
    rootRef,
    isLoading,
    popupState,
    textareaRef,
    isLaunching,
    componentsHistory,
    involvedDepartments,
    responsibleDepartments,
    dispatch,
    setIsOpen,
    onOrderEdit,
    onClientEdit,
    onVariantEdit,
    onEditConfiguration,
  } = useInfoDorpDown({ data, page, onOpen });

  const handleOnEditEnd = async () => {
    if (data.id) {
      await loadData(data.id);
    }
  };

  return (
    <div ref={rootRef} {...bindTrigger(popupState)}>
      <Button className={s.button} color="secondary" variant="outlined" size="XXS" onClick={() => setIsOpen((prev) => !prev)}>
        Info
      </Button>

      <Menu
        {...bindMenu(popupState)}
        open={isOpen}
        anchorEl={rootRef.current}
        className={s.menu_container}
        onClose={() => setIsOpen(false)}
        transformOrigin={{ vertical: 'top', horizontal: 380 }}
      >
        {/* Don't delete this strange div! */}
        <div />
        <div className={s.info_container}>
          <VerticalShiftAnimation isVisible={Boolean(componentsHistory.length)} maxHeightWhenIsShown={31}>
            <div className={s.components_history_container}>
              <div
                className={s.components_history}
                onClick={() => dispatch(ComponentsHistoryActions.openModal(componentsHistory))}
              >
                <PluginIcon />
                <p>Components history</p>
              </div>
            </div>
          </VerticalShiftAnimation>
          <div className={s.header}>
            <div className={s.header_item}>
              <InfoDropdownItem
                isLoading={isLoading}
                title="Product name"
                SvgIcon={DiamondIcon}
                value={details.product?.name}
                titleClassName={s.header_item_title}
                valueClassName={s.header_item_value}
                viewProductInfoElement={
                  <Tooltip
                    title="Press to open last product published version"
                    placement="top"
                    componentsProps={{ tooltip: { style: { maxWidth: 350 } } }}
                  >
                    <a
                      href={`${Paths.Product}/${details.product.id}?product_preview=${details.product.lastPublishedVersion.id}`}
                      className={s.icon_wrapper}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <EyeIcon width={16} height={16} stroke="#7894FF" />
                    </a>
                  </Tooltip>
                }
              />
            </div>
            <div className={s.header_item}>
              <InfoDropdownItem
                title="Production key"
                value={data.productionKey}
                SvgIcon={ProductionKeyIcon}
                titleClassName={s.header_item_title}
                valueClassName={s.header_item_value}
              />
            </div>
          </div>
          <div className={s.border} />
          {!isLaunching && (
            <>
              <NoteComponent
                page={page}
                isFetching={isLoading}
                productionId={data.id}
                textareaRef={textareaRef}
                value={details.notes[0]?.note}
              />
              <div className={s.border} />
            </>
          )}
          <div className={s.body}>
            <div className={s.left_container}>
              <div className={s.items_container}>
                <span className={s.item_title}>Order</span>

                {!isLoading && details.order.is_deleted && (
                  <div className={s.red_badge}>
                    <CheckboxFailIcon />
                    The order was deleted
                  </div>
                )}

                <InfoDropdownItem
                  title="Order key"
                  isLoading={isLoading}
                  SvgIcon={OrderKeyIcon}
                  value={details.order.order_key}
                  editIconTooltip="Change order for production"
                  isEdited={Boolean(details.ordersHistory.length)}
                  renderTooltip={
                    <InfoDropdownItemTooltip
                      title="Order key:"
                      newKey="newOrderKey"
                      data={details.ordersHistory}
                      previousKey="previousOrderKey"
                    />
                  }
                  onEditClick={onOrderEdit}
                />
                <InfoDropdownItem
                  title="External order id"
                  isLoading={isLoading}
                  SvgIcon={ProductsIcon}
                  value={details.order.external_order_id}
                />
                <InfoDropdownItem
                  title="External order number"
                  isLoading={isLoading}
                  SvgIcon={OrderNumberIcon}
                  value={details.order.external_order_number}
                  editIconTooltip="Change order for production"
                  isEdited={Boolean(details.externalOrderNumberHistory.length)}
                  renderTooltip={
                    <InfoDropdownItemTooltip
                      title="External order number:"
                      newKey="new_external_order_number"
                      data={details.externalOrderNumberHistory}
                      previousKey="previous_external_order_number"
                    />
                  }
                  onEditClick={onOrderEdit}
                />
                <InfoDropdownItem
                  SvgIcon={BookIcon}
                  isLoading={isLoading}
                  title="Marketplace order number"
                  editIconTooltip="Change order for production"
                  value={details.order.marketplace_order_number}
                  isEdited={Boolean(details.marketplaceOrderNumberHistory.length)}
                  renderTooltip={
                    <InfoDropdownItemTooltip
                      title="Marketplace order number:"
                      newKey="new_marketplace_order_number"
                      data={details.marketplaceOrderNumberHistory}
                      previousKey="previous_marketplace_order_number"
                    />
                  }
                  onEditClick={onOrderEdit}
                />
                <InfoDropdownItem
                  title="Client"
                  SvgIcon={ClientIcon}
                  isLoading={isLoading}
                  value={details.order.client?.name}
                  editIconTooltip="Edit client info"
                  isEdited={Boolean(details.clientHistory.length)}
                  renderTooltip={
                    <InfoDropdownItemTooltip
                      title="Client:"
                      newKey="newClient"
                      data={details.clientHistory}
                      previousKey="previousClient"
                    />
                  }
                  onEditClick={onClientEdit}
                />
                <InfoDropdownItem
                  SvgIcon={ClientIcon}
                  isLoading={isLoading}
                  title="Primary client"
                  value={details.order.primary_client?.name}
                />

                <InfoDropdownItem
                  isLoading={isLoading}
                  title="Marketplace note"
                  SvgIcon={MarketPlaceNoteIcon}
                  value={details.order.comment}
                />
                <InfoDropdownItem
                  isLoading={isLoading}
                  title="Make to stock"
                  SvgIcon={MakeToStockIcon}
                  value={details.order.to_stock ? 'Yes' : 'No'}
                />
              </div>
              <div className={s.items_container}>
                <span className={s.item_title}>Product details</span>
                <InfoDropdownItem
                  isLoading={isLoading}
                  title="Product category"
                  SvgIcon={ProductCategoryIcon}
                  value={details.order.product_category}
                />
                <InfoDropdownItem title="Product type" value={data.productType} SvgIcon={ProductTypeIcon} isLoading={isLoading} />
                <InfoDropdownItem
                  title="Workflow"
                  isLoading={isLoading}
                  SvgIcon={SettingsIcon}
                  value={details.workflowTemplate?.name}
                  viewProductInfoElement={
                    details.workflowTemplate?.id && (
                      <Tooltip title="Press to open workflow template" placement="top">
                        <a
                          href={`${Paths.WorkFlowTemplate}/${details.workflowTemplate?.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className={s.icon_wrapper}
                        >
                          <EyeIcon width={16} height={16} stroke="#7894FF" />
                        </a>
                      </Tooltip>
                    )
                  }
                />
                <InfoDropdownItem
                  title="Configuration"
                  isLoading={isLoading}
                  SvgIcon={SettingsIcon}
                  value={data.configuration.name}
                  editIconTooltip="Left note to warn about changes in configuration"
                  isEdited={Boolean(details.notes.some((i) => i.is_configuration_change))}
                  onEditClick={onEditConfiguration}
                  viewProductInfoElement={
                    <Tooltip title="Press to open product configuration" placement="top">
                      <a
                        href={`${Paths.Product}/${details.product?.id}?configuration=${details.product?.product_configuration_id}`}
                        className={s.icon_wrapper}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <EyeIcon width={16} height={16} stroke="#7894FF" />
                      </a>
                    </Tooltip>
                  }
                />

                <InfoDropdownItem
                  title="Variant"
                  isLoading={isLoading}
                  value={details.product.variant}
                  SvgIcon={SettingsCollectionIcon}
                  isEdited={Boolean(details.variantsHistory.length)}
                  onEditClick={onVariantEdit}
                  editIconTooltip="Edit product variant"
                  renderTooltip={
                    <InfoDropdownItemTooltip
                      title="Variant:"
                      newKey="newVariant"
                      previousKey="previousVariant"
                      data={details.variantsHistory}
                    />
                  }
                />

                <InfoDropdownItem
                  title="Version"
                  value={data.version}
                  SvgIcon={TripleCopy}
                  isLoading={isLoading}
                  viewProductInfoElement={
                    <Tooltip title="Press to open product version" placement="top">
                      <a
                        href={`${Paths.Product}/${details.product?.id}`}
                        className={s.icon_wrapper}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <EyeIcon width={16} height={16} stroke="#7894FF" />
                      </a>
                    </Tooltip>
                  }
                />

                <InfoDropdownItem title="SKU" value={data.configuration.sku} SvgIcon={SkuIcon} isLoading={isLoading} />
                <InfoDropdownItem title="Variant SKU" value={data.variant.sku} SvgIcon={SkuIcon} isLoading={isLoading} />
                <InfoDropdownItem title="Barcode" value={details.product.barcode} SvgIcon={BarcodeIcon} isLoading={isLoading} />
                <InfoDropdownItem title="Vendor" value={details.product.vendor} SvgIcon={VendorIcon} isLoading={isLoading} />

                <InfoDropdownItem
                  isLoading={isLoading}
                  title="Line item note"
                  SvgIcon={LineItemNoteIcon}
                  value={details.product.comment}
                />
              </div>
              <div className={s.items_container}>
                <span className={s.item_title}>Cost</span>

                <InfoDropdownItem
                  title="Estimated cost"
                  value={details.cost?.estimated_cost}
                  SvgIcon={CostIcon}
                  isLoading={isLoading}
                />
                <InfoDropdownItem
                  title="Estimated cost without components tasks"
                  value={details.cost?.estimated_cost_without_nested_components}
                  SvgIcon={EstimatedCostIcon}
                  isLoading={isLoading}
                />
              </div>
            </div>
            <div className={s.right_container}>
              <div className={s.items_container}>
                <span className={s.item_title}>Time</span>

                <DeadlineItem
                  page={page}
                  onEditEnd={handleOnEditEnd}
                  isLoading={isLoading}
                  productionId={data.id}
                  date={details.time.deadline_at}
                  productionStatus={data.productionStatus}
                  deadlineHistory={details.deadlineHistory}
                  productionName={details.product.name}
                />
                <InfoDropdownItem
                  title="Creation date"
                  value={getDateWithTime(details.time.created_at)}
                  isLoading={isLoading}
                  SvgIcon={EditCalendarIcon}
                />
                <InfoDropdownItem
                  title="Started date"
                  value={getDateWithTime(details.time.started_at)}
                  isLoading={isLoading}
                  SvgIcon={TickCalendarIcon}
                />
                <InfoDropdownItem
                  title="Estimated time"
                  value={getTimeFromSeconds(details.time.estimated_time_with_components_tasks, true)}
                  SvgIcon={TimeIcon}
                  isLoading={isLoading}
                />
                <InfoDropdownItem
                  title="Estimated time without components tasks"
                  value={getTimeFromSeconds(details.time.estimated_time, true)}
                  isLoading={isLoading}
                  SvgIcon={EstimatedTimeIcon}
                />
                <InfoDropdownItem
                  title="Time spent"
                  value={getTimeFromSeconds(details.time.time_spent, true)}
                  SvgIcon={SandClockIcon}
                  isLoading={isLoading}
                />
              </div>
              <div className={s.items_container}>
                <span className={s.item_title}>Tasks</span>

                <InfoDropdownItem
                  title="Number of tasks"
                  value={details.tasks.tasksCount}
                  SvgIcon={Products3Icon}
                  isLoading={isLoading}
                />
                <InfoDropdownItem
                  title="Number of tasks with components tasks"
                  value={details.tasks.tasksWithComponentsTasksCount}
                  SvgIcon={TaskNumbersIcon}
                  isLoading={isLoading}
                />
                <InfoDropdownItem
                  title="Number of components"
                  value={details.tasks.componentsCount}
                  SvgIcon={ComponentsIcon}
                  isLoading={isLoading}
                />
              </div>
              <div className={s.items_container}>
                <span className={s.item_title}>Organization</span>

                <InfoDropdownItem
                  title="Responsible departments"
                  value={responsibleDepartments.length ? <InfoShowMore itemsArray={responsibleDepartments} /> : null}
                  SvgIcon={DepartmentsIcon}
                  isLoading={isLoading}
                />
                <InfoDropdownItem
                  title="Involved departments"
                  value={involvedDepartments.length ? <InfoShowMore itemsArray={involvedDepartments} /> : null}
                  SvgIcon={BuildingsIcon}
                  isLoading={isLoading}
                />
                <InfoDropdownItem
                  title="Created by"
                  value={
                    details.organization.created_by
                      ? `${details.organization.created_by.first_name} ${details.organization.created_by.last_name}`
                      : '-'
                  }
                  SvgIcon={ProfileIcon}
                  isLoading={isLoading}
                />
                <InfoDropdownItem
                  title="Performers"
                  value={
                    details.organization.performers.length ? (
                      <InfoShowMore
                        itemsArray={details.organization.performers.map((performer) => ({
                          id: performer.id,
                          avatar_image: performer.avatar_image_url,
                          first_name: performer.first_name,
                          last_name: performer.last_name,
                        }))}
                      />
                    ) : null
                  }
                  SvgIcon={PerformersIcon}
                  isLoading={isLoading}
                />
              </div>
              <div className={s.items_container}>
                <span className={s.item_title}>Hierarchy</span>

                <InfoDropdownItem
                  title="Root production"
                  value={details.hierarchy?.root_production_key}
                  SvgIcon={Hierarchy1}
                  isLoading={isLoading}
                />
                <InfoDropdownItem
                  title="Parent production"
                  value={details.hierarchy?.parent_production_key}
                  SvgIcon={Hierarchy2}
                  isLoading={isLoading}
                />
                <InfoDropdownItem
                  title="Root product"
                  value={details.hierarchy?.root_product_name}
                  SvgIcon={Hierarchy3}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default InfoDropdown;
