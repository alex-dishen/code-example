import { Menu } from '@mui/material';
import { useDispatch } from 'react-redux';
import { MouseEvent, useRef, useState } from 'react';
import TagContain from 'components/tag-contain/tag-contain';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { bindMenu, bindTrigger } from 'material-ui-popup-state/core';
import { LightTooltip } from 'components/ui-new/light-tooltip/light-tooltip';
import { configurableStatuses, statuses } from 'components/status-selector/constants';
import { ProductionStatusEnum, TaskStatusEnum, UserStatusEnum } from 'types/status-enums';
import { PermissionGuardActions } from 'modules/permission-guard/permission-guard.controller';
import s from './status-selector.module.scss';

type StatusesT = ProductionStatusEnum | TaskStatusEnum | UserStatusEnum;

type Props<T extends StatusesT> = {
  status: T;
  toolTip?: string;
  tagClassName?: string;
  isBlockedLaunch?: boolean;
  isEditPermitted?: boolean;
  disableDropDown?: boolean;
  blockedLaunchTitle?: string;
  containerClassName?: string;
  isAdditionalTasks?: boolean;
  enableStopPropagation?: boolean;
  noDropDownOnExceptions?: boolean;
  productionStatus?: ProductionStatusEnum;
  optionsFor: keyof typeof configurableStatuses;
  onClose?: VoidFunction;
  onSelect?: (status: T) => Promise<void>;
};

function StatusSelector<T extends StatusesT>({
  status,
  toolTip,
  optionsFor,
  tagClassName,
  isBlockedLaunch,
  disableDropDown,
  productionStatus,
  blockedLaunchTitle,
  containerClassName,
  enableStopPropagation,
  isEditPermitted = true,
  onClose,
  onSelect,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const popupState = usePopupState({ variant: 'dialog', popupId: `actions-${status}` });
  const dispatch = useDispatch();

  const isDisabledByProductionStatus =
    productionStatus === ProductionStatusEnum.Done ||
    productionStatus === ProductionStatusEnum.Canceled ||
    productionStatus === ProductionStatusEnum.Launching;
  const isDisable = disableDropDown || isDisabledByProductionStatus || isLoading;

  const handleOptionSelect = async (value: StatusesT) => {
    setIsOpen(false);
    onClose?.();

    setLoading(true);
    setTimeout(async () => {
      try {
        await onSelect(value as T);
      } finally {
        setLoading(false);
      }
    }, 30);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>, value: boolean) => {
    if (enableStopPropagation) e.stopPropagation();
    if (!isEditPermitted) {
      dispatch(PermissionGuardActions.openModal());
      return;
    }
    if (isDisable) return;
    setIsOpen(value);
    if (!value) onClose?.();
  };

  return (
    <div ref={rootRef} className={`${s.select_wrapper} ${containerClassName}`} {...bindTrigger(popupState)}>
      <LightTooltip className={s.tooltip} title={toolTip} disableHoverListener={!toolTip} placement="bottom-start">
        <div onClick={(e) => handleClick(e, true)} className={s.status_container}>
          <TagContain
            color={isOpen && (status === UserStatusEnum.Active ? 'deep_green' : '')}
            {...statuses[status]}
            active={isOpen}
            disabled={isLoading}
            className={`${s.tag} ${tagClassName} ${s[statuses[status].className]}`}
            // onClick serves here as disable or enables hover effects on the tag
            // property disabled is not used because it changes the color which is not expected to happen
            onClick={() => {}}
          />
        </div>
      </LightTooltip>

      <div onClick={(e) => handleClick(e, false)}>
        <Menu
          {...bindMenu(popupState)}
          anchorEl={rootRef.current}
          open={isOpen}
          className={s.option_list}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {configurableStatuses[optionsFor][status as StatusesT]?.map((option) => {
            if (isBlockedLaunch && option.value === ProductionStatusEnum.In_Progress) {
              return (
                <LightTooltip
                  key={option.text}
                  className={s.tooltip}
                  placement="top-start"
                  title={blockedLaunchTitle}
                  disableHoverListener={!blockedLaunchTitle}
                >
                  <div className={`${s.container} ${s[option.className]} ${s.disabled}`}>
                    <div className={s.icon_container}>{option.iconLeft}</div>
                    <span className={s.title}>{option.text}</span>
                  </div>
                </LightTooltip>
              );
            }
            return (
              <div
                key={option.text}
                className={`${s.container} ${s[option.className]}`}
                onClick={() => handleOptionSelect(option.value)}
              >
                <div className={s.icon_container}>{option.iconLeft}</div>
                <span className={s.title}>{option.text}</span>
              </div>
            );
          })}
        </Menu>
      </div>
    </div>
  );
}

export default StatusSelector;
