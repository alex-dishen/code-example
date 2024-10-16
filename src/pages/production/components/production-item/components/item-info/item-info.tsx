import { SettingsIcon } from 'icons/settings';
import { SettingsCollectionIcon } from 'icons/settings-collection';
import { CalendarTickIcon } from 'icons/calendar-tick';
import { getDateWithTime } from 'utils/time';
import { ProductTypeIcon } from 'icons/product-type';
import { OrderKeyIcon } from 'icons/order-key';
import { Calendar3Icon } from 'icons/calendar-3';
import { OrderNumberIcon } from 'icons/order-number';
import { ProductionStatusEnum } from 'types/status-enums';
import {
  DeadlineHistoryItem,
  VariantHistoryItem,
  OrdersHistoryItem,
  NoteHistoryItem,
  ExternalOrderNumberHistoryItem,
} from 'services/production-workflow.model';
import InfoDropdown from 'pages/production/components/info-dropdown/info-dropdown';
import { Products2Icon } from 'icons/products-2';
import ListItem from 'pages/production/components/list-item/list-item';
import { Page } from 'pages/production/controllers/production-list-controller/types';
import s from './item-info.module.scss';

export type ItemInfoDataT = {
  id: string;
  title: string;
  version: number;
  orderKey: string;
  startedAt?: string;
  deadlineAt: string;
  productType: string;
  productionKey: string;
  notes: NoteHistoryItem[];
  status: ProductionStatusEnum;
  externalOrderNumber?: string;
  ordersHistory?: OrdersHistoryItem[];
  variantsHistory: VariantHistoryItem[];
  deadlineHistory: DeadlineHistoryItem[];
  productionStatus: ProductionStatusEnum;
  variant: { name: string; sku: string };
  configuration: { name: string; sku: string };
  externalOrderNumberHistory: ExternalOrderNumberHistoryItem[];
};

type Props = {
  data: ItemInfoDataT;
  isReadOnly?: boolean;
  isShowTitle?: boolean;
  isOnWorkflowHeader?: boolean;
  onOpen?: (id: string) => void;
};

const ItemInfo = ({ data, isShowTitle, isReadOnly, isOnWorkflowHeader, onOpen }: Props) => {
  const renderOrderKeyTooltip = () => {
    return (
      <div>
        <span>Order key</span>
        {Boolean(data.ordersHistory?.length) && <span>:</span>}
        {Boolean(data.ordersHistory?.length) && (
          <div className={s.column}>
            {data.ordersHistory?.slice(0, 2).map((i, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={index} className={s.title_row}>
                <span>{`was changed from ${i.previousOrderKey ?? '-'} to`}</span>
                <b>{i.newOrderKey}</b>
                <span>by</span>
                <b>
                  {i?.user?.first_name} {i?.user?.last_name}
                </b>
                <span>{`at ${getDateWithTime(i.created_at)}`}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };
  const renderDeadlineTooltip = () => {
    return (
      <div>
        <span>Deadline</span>
        {Boolean(data.deadlineHistory?.length) && <span>:</span>}
        {Boolean(data.deadlineHistory?.length) && (
          <div className={s.column}>
            {data.deadlineHistory?.slice(0, 2).map((item, index) => {
              const changedBy =
                item.changed_by_external_system && !item.user
                  ? 'External system'
                  : `${item.user?.first_name} ${item.user?.last_name}`;

              return (
                // eslint-disable-next-line react/no-array-index-key
                <p key={index} className={s.title_row}>
                  <span>{`was changed from ${getDateWithTime(item.previous_deadline)} to`}</span>
                  <b>{getDateWithTime(item.new_deadline)}</b>
                  <span>by</span>
                  <b>{changedBy}</b>
                  <span>{`at ${getDateWithTime(item.created_at)}`}</span>
                </p>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  const renderExternalOrderNumberTooltip = () => {
    return (
      <div>
        <span>External order number</span>
        {Boolean(data.externalOrderNumberHistory?.length) && <span>:</span>}
        {Boolean(data.externalOrderNumberHistory?.length) && (
          <div className={s.column}>
            {data.externalOrderNumberHistory?.slice(0, 2).map((i, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={index} className={s.title_row}>
                <span>{`was changed from ${i.previous_external_order_number ?? '-'} to`}</span>
                <b>{i.new_external_order_number}</b>
                <span>by</span>
                <b>
                  {i?.user?.first_name} {i?.user?.last_name}
                </b>
                <span>{`at ${getDateWithTime(i.created_at)}`}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };
  const renderVariantTooltip = () => {
    return (
      <div>
        <span>Variant</span>
        {Boolean(data.variantsHistory?.length) && <span>:</span>}
        {Boolean(data.variantsHistory?.length) && (
          <div className={s.column}>
            {data.variantsHistory?.slice(0, 2).map((i, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={index} className={s.title_row}>
                <span>{`was changed from ${i.previousVariant ?? '-'} to`}</span>
                <b>{i.newVariant}</b>
                <span>by</span>
                <b>
                  {i?.user?.first_name} {i?.user?.last_name}
                </b>
                <span>{`at ${getDateWithTime(i.created_at)}`}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={s.items_container} data-is-read-only={isReadOnly}>
      <ListItem
        isWideTooltip
        maxWidth={145}
        title="Deadline"
        historyTooltip={renderDeadlineTooltip()}
        isEdited={Boolean(data.deadlineHistory?.length)}
        icon={<Calendar3Icon width={16} height={16} />}
        value={data.deadlineAt ? getDateWithTime(data.deadlineAt) : ''}
      />
      {isShowTitle && (
        <ListItem
          maxWidth={180}
          value={data.title}
          title="Product name"
          icon={<Products2Icon width={16} height={16} className={s.black_icon} />}
        />
      )}
      <ListItem maxWidth={145} title="Product type" value={data.productType} icon={<ProductTypeIcon width={16} height={16} />} />
      <ListItem
        maxWidth={145}
        title="Configuration"
        value={data.configuration.name}
        icon={<SettingsIcon width={16} height={16} />}
        isEdited={Boolean(data.notes.some((i) => i.is_configuration_change))}
      />
      <ListItem
        isWideTooltip
        maxWidth={145}
        title="Variant"
        value={data.variant.name}
        historyTooltip={renderVariantTooltip()}
        isEdited={Boolean(data.variantsHistory?.length)}
        icon={<SettingsCollectionIcon width={16} height={16} />}
      />
      <ListItem
        maxWidth={145}
        isWideTooltip
        title="External order number"
        value={data.externalOrderNumber}
        historyTooltip={renderExternalOrderNumberTooltip()}
        icon={<OrderNumberIcon width={15} height={15} />}
        isEdited={Boolean(data.externalOrderNumberHistory?.length)}
      />
      {!isOnWorkflowHeader && (
        <ListItem
          isWideTooltip
          maxWidth={145}
          title="Order key"
          value={data.orderKey}
          historyTooltip={renderOrderKeyTooltip()}
          isEdited={Boolean(data.ordersHistory?.length)}
          icon={<OrderKeyIcon width={16} height={16} />}
        />
      )}
      {isOnWorkflowHeader && (
        <ListItem
          maxWidth={145}
          title="Start date"
          icon={<CalendarTickIcon width={16} height={16} />}
          value={data.startedAt ? getDateWithTime(data.startedAt) : ''}
        />
      )}
      {!isReadOnly && (
        <InfoDropdown
          data={data}
          onOpen={onOpen}
          page={isOnWorkflowHeader ? Page.InfoDropdownWorkflow : Page.InfoDropdownProduction}
        />
      )}
    </div>
  );
};

export default ItemInfo;
