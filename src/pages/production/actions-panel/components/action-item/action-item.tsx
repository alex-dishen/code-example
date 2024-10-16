import { ComponentType, SVGProps } from 'react';
import { Tooltip } from '@mui/material';
import s from './action-item.module.scss';

type Props = {
  text: string;
  enable?: boolean;
  visible?: boolean;
  tooltipText?: string;
  color?: 'blue' | 'red';
  withLeftDivider?: boolean;
  enableWithoutVisualEffect?: boolean;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick: VoidFunction;
};

const ActionItem = ({
  Icon,
  text,
  enable,
  tooltipText,
  color = 'blue',
  visible = true,
  withLeftDivider = true,
  enableWithoutVisualEffect,
  onClick,
}: Props) => {
  const handleOnClick = () => {
    if (enable || enableWithoutVisualEffect) onClick();
  };

  return (
    <Tooltip placement="top" disableHoverListener={!tooltipText} title={tooltipText} classes={{ popper: s.tooltip }}>
      <div
        data-visible={visible}
        data-with-left-divider={withLeftDivider}
        className={`
          ${s.action_item} 
          ${enable ? s[color] : ''}
          ${enableWithoutVisualEffect ? s.enabled_without_visual_effect : ''}
        `}
        onClick={handleOnClick}
      >
        <Icon height={16} width={16} />
        <div>{text}</div>
      </div>
    </Tooltip>
  );
};

export default ActionItem;
