/* eslint-disable react/no-array-index-key */
import { getDateWithTime } from 'utils/time';
import { HistoryUser } from 'services/production-workflow.model';
import s from './info-dropdown-item-tooltip.module.scss';

type TypeExtension = {
  user: HistoryUser;
  created_at: string;
  changed_by_external_system?: boolean;
};

type Props<T> = {
  data: T[];
  title: string;
  newKey: keyof T;
  previousKey: keyof T;
  isDateFormat?: boolean;
};

const InfoDropdownItemTooltip = <T extends TypeExtension>({ data, title, newKey, previousKey, isDateFormat }: Props<T>) => {
  if (!data.length) return null;
  return (
    <div>
      <span>{title}</span>
      <div className={s.column}>
        {data.slice(0, 2).map((i, index) => {
          const curr = i[newKey];
          const prev = i[previousKey];
          const changedBy =
            i.changed_by_external_system && !i.user ? 'External system' : `${i.user?.first_name} ${i.user?.last_name}`;

          return (
            <p key={index} className={s.title_row}>
              <span className={s.solid}>was changed from</span>
              <span className={s.ellipsis}>{(isDateFormat ? getDateWithTime(prev as string) : prev) ?? '-'}</span>
              <span className={s.solid}>to</span>
              <b className={s.ellipsis}>{isDateFormat ? getDateWithTime(curr as string) : curr}</b>
              <span className={s.solid}>by</span>
              <b className={s.ellipsis}>{changedBy}</b>
              <span className={s.solid}>{`at ${getDateWithTime(i.created_at)}`}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default InfoDropdownItemTooltip;
