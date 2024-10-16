import { useRef, FC, ReactNode, useEffect, useState } from 'react';
import WrapperWithCopyButton from 'components/wrapper-with-copy-button/wrapper-with-copy-button';
import s from './list-item.module.scss';

type OwnProps = {
  title: string;
  value: string;
  icon: ReactNode;
  maxWidth?: number;
  isEdited?: boolean;
  isWideTooltip?: boolean;
  historyTooltip?: string | ReactNode;
};

const ListItem: FC<OwnProps> = ({ icon, value, title, historyTooltip, isEdited, isWideTooltip, maxWidth = 'auto' }) => {
  const spanRef = useRef<HTMLDivElement>(null);
  const [isShowValueTooltip, setIsShowValueTooltip] = useState(false);

  useEffect(() => {
    if (spanRef.current.scrollWidth > spanRef.current.clientWidth) {
      setIsShowValueTooltip(true);
    } else {
      setIsShowValueTooltip(false);
    }
  }, [value, maxWidth]);

  const defaultTooltip = isShowValueTooltip ? (
    <span>
      {title}: <b>{value}</b>
    </span>
  ) : (
    <span>{title}</span>
  );

  const tooltipText = historyTooltip && isEdited ? historyTooltip : defaultTooltip;

  return (
    <WrapperWithCopyButton
      copyOnClick
      isEdited={isEdited}
      tooltip={tooltipText}
      copiedText={value || ''}
      isWideTooltip={isWideTooltip}
    >
      <div className={s.item_container}>
        <div className={s.icon}>{icon}</div>
        <span ref={spanRef} style={{ maxWidth }}>
          {value || '-'}
        </span>
      </div>
    </WrapperWithCopyButton>
  );
};

export default ListItem;
