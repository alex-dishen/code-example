import dayjs from 'dayjs';
import { Menu } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getDateWithTime } from 'utils/time';
import Button from 'components/button/button';
import { Calendar3Icon } from 'icons/calendar-3';
import { ProductionStatusEnum } from 'types/status-enums';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { useRef, FC, useState, useMemo, useEffect } from 'react';
import { bindMenu, bindTrigger } from 'material-ui-popup-state/core';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DeadlineHistoryItem } from 'services/production-workflow.model';
import { Page } from 'pages/production/controllers/production-list-controller/types';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import InfoDropdownItem from 'pages/production/components/info-dropdown/components/info-dropdown-item/info-dropdown-item';
import { Actions as ProductionWorkflowActions } from 'pages/production-workflow/controllers/production-workflow.controller';
import InfoDropdownItemTooltip from 'pages/production/components/info-dropdown/components/info-dropdown-item-tooltip/info-dropdown-item-tooltip';
import { AccessLevel, Permission } from 'services/permission.model';
import { AppState } from 'redux/store';
import { PermissionGuardSelectors } from 'modules/permission-guard/permission-guard.controller';
import s from './deadline-item.module.scss';

type OwnProps = {
  page?: Page;
  date: string;
  isLoading: boolean;
  productionId: string;
  productionName: string;
  deadlineHistory: DeadlineHistoryItem[];
  productionStatus: ProductionStatusEnum;
  onEditEnd?: () => void | Promise<void>;
};

const DeadlineItem: FC<OwnProps> = ({
  date,
  page,
  isLoading,
  productionId,
  deadlineHistory,
  productionName,
  productionStatus,
}) => {
  const [day, setDay] = useState(null);
  const [year, setYear] = useState(null);
  const [hours, setHours] = useState(null);
  const [month, setMonth] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [minutes, setMinutes] = useState(null);
  const [initialDay, setInitialDay] = useState(null);
  const [initialYear, setInitialYear] = useState(null);
  const [initialHours, setInitialHours] = useState(null);
  const [initialMonth, setInitialMonth] = useState(null);
  const [dateD, setDateD] = useState<Date | string>(date);
  const [initialMinutes, setInitialMinutes] = useState(null);
  const [isDeadlineUpdating, setDeadlineUpdating] = useState(false);

  const dispatch = useDispatch();
  const rootRef = useRef<HTMLDivElement>(null);

  const popupState = usePopupState({ variant: 'popover', popupId: `deadline-edit` });

  const isEditPermitted = useSelector((state: AppState) =>
    PermissionGuardSelectors.checkEditLevel(state, Permission.webProductionEdit, [AccessLevel.access]),
  );

  const isEditDeadlineEnabled =
    productionStatus !== ProductionStatusEnum.Done && productionStatus !== ProductionStatusEnum.Canceled && isEditPermitted;

  const newDeadlineBody = useMemo(() => {
    return {
      day,
      year,
      hours,
      month,
      minutes,
    };
  }, [day, year, hours, month, minutes]);

  const isDateChanged = useMemo(() => {
    if (initialDay || initialYear || initialHours || initialMonth || initialMinutes) {
      return (
        day !== initialDay ||
        year !== initialYear ||
        hours !== initialHours ||
        month !== initialMonth ||
        minutes !== initialMinutes
      );
    }
    return true;
  }, [day, year, hours, month, minutes, initialDay, initialYear, initialHours, initialMonth, initialMinutes]);

  const getEditClickHandler = () => {
    return () => setIsOpen(true);
  };

  const onTimeChange = (e) => {
    setHours(e.$H);
    setMinutes(e.$m);
  };

  const onDateChange = (e) => {
    setDay(e.$D);
    setYear(e.$y);
    setMonth(e.$M + 1);
  };

  const handleUpdateDeadline = async () => {
    setDeadlineUpdating(true);
    await dispatch(ProductionWorkflowActions.updateOrConfirmDeadline({ productionId, newDeadlineBody, productionName, page }));
    setIsOpen(false);
    setDeadlineUpdating(false);
  };

  useEffect(() => {
    if (isOpen && date) {
      const dateFormatted = new Date(date);
      const D = dateFormatted.getDate();
      const h = dateFormatted.getHours();
      const M = dateFormatted.getMonth();
      const m = dateFormatted.getMinutes();
      const Y = dateFormatted.getFullYear();
      setDay(D);
      setYear(Y);
      setHours(h);
      setMinutes(m);
      setMonth(M + 1);
      if (!initialDay) {
        setInitialDay(D);
        setInitialYear(Y);
        setInitialHours(h);
        setInitialMinutes(m);
        setInitialMonth(M + 1);
      }
    }
  }, [isOpen, date, initialDay]);

  useEffect(() => {
    if (isOpen && !date) {
      const today = new Date();
      setHours(today.getHours());
      setDay(today.getDay() - 1);
      setYear(today.getFullYear());
      setMinutes(today.getMinutes());
      setMonth(today.getMonth() + 1);

      setDateD(today);
    } else if (isOpen && date) {
      setDateD(date);
    }
  }, [isOpen]);

  return (
    <div>
      <InfoDropdownItem
        title="Deadline"
        isNeededHierarchy
        isLoading={isLoading}
        SvgIcon={Calendar3Icon}
        productionId={productionId}
        value={getDateWithTime(date)}
        editIconTooltip="Edit deadline"
        isEdited={Boolean(deadlineHistory.length)}
        renderTooltip={
          <InfoDropdownItemTooltip
            isDateFormat
            title="Deadline:"
            newKey="new_deadline"
            data={deadlineHistory}
            previousKey="previous_deadline"
          />
        }
        onEditClick={isEditDeadlineEnabled ? getEditClickHandler() : null}
      />

      <div ref={rootRef} {...bindTrigger(popupState)}>
        <Menu
          {...bindMenu(popupState)}
          open={isOpen}
          anchorEl={rootRef.current}
          className={s.menu_container}
          onClose={() => setIsOpen(false)}
          transformOrigin={{ vertical: 'top', horizontal: 30 }}
        >
          {/* Don't delete this strange div! */}
          <div />
          <div className={s.menu_body}>
            <div className={s.date_and_time}>
              <StaticDatePicker
                className={s.date_picker}
                disabled={isDeadlineUpdating}
                onChange={(e) => onDateChange(e)}
                defaultValue={dayjs(dateD)}
                slotProps={{
                  toolbar: { hidden: true },
                  actionBar: { className: s.date_action_bar },
                  calendarHeader: {
                    className: s.date_header,
                    classes: { label: s.date_label },
                  },
                  nextIconButton: { className: s.date_button },
                  previousIconButton: { className: s.date_button },
                  switchViewButton: { className: s.date_switch_view },
                }}
              />
              <MultiSectionDigitalClock
                ampm={false}
                views={['hours', 'minutes']}
                disabled={isDeadlineUpdating}
                onChange={(e) => onTimeChange(e)}
                defaultValue={dayjs(dateD)}
                classes={{ root: s.time_selector }}
                timeSteps={{ hours: 1, minutes: 1 }}
              />
            </div>
            <Button
              size="M"
              fullWidth
              variant="contained"
              disabled={!isDateChanged}
              loading={isDeadlineUpdating}
              onClick={handleUpdateDeadline}
              style={{ paddingLeft: 34, paddingRight: 34 }}
            >
              Ok
            </Button>
          </div>
        </Menu>
      </div>
    </div>
  );
};

export default DeadlineItem;
