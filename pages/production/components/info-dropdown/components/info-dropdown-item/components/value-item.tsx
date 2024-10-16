import { Tooltip } from '@mui/material';
import { FC, useState, useRef, ReactNode, useEffect } from 'react';
import WrapperWithCopyButton from 'components/wrapper-with-copy-button/wrapper-with-copy-button';
import s from 'pages/production/components/info-dropdown/components/info-dropdown-item/info-dropdown-item.module.scss';

type OwnProps = {
  isEdited?: boolean;
  className?: string;
  value: string | ReactNode;
  renderTooltip?: ReactNode | string;
};

export const ValueItem: FC<OwnProps> = ({ value, isEdited, className, renderTooltip }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [isShowValueTooltip, setIsShowValueTooltip] = useState(false);

  const valueTooltip = isShowValueTooltip ? value : '';
  const isValueText = typeof value === 'string' || typeof value === 'number';
  const tooltipTitle = renderTooltip && isEdited ? renderTooltip : valueTooltip;

  useEffect(() => {
    const scrollWidth = divRef?.current?.scrollWidth || 0;
    const clientWidth = divRef?.current?.clientWidth || 0;

    const checkWidth = () => {
      if (scrollWidth > clientWidth) {
        setIsShowValueTooltip(true);
      } else {
        setIsShowValueTooltip(false);
      }
    };
    checkWidth();
  }, [value, divRef?.current?.scrollWidth, divRef?.current?.clientWidth]);

  return (
    <Tooltip placement="top" title={tooltipTitle} classes={{ tooltip: s.wide_tooltip }}>
      <div className={`${s.text} ${s.value}`}>
        <WrapperWithCopyButton copyOnClick isEdited={isEdited} disabled={!isValueText} copiedText={isValueText ? `${value}` : ''}>
          <div className={`${className} ${s.value}`} ref={divRef}>
            {value ?? '-'}
          </div>
        </WrapperWithCopyButton>
      </div>
    </Tooltip>
  );
};
