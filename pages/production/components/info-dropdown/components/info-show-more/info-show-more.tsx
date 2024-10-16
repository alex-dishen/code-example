import Button from 'components/button/button';
import { Avatar, Menu, Tooltip } from '@mui/material';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { FC, ReactNode, useRef, useState, useEffect } from 'react';
import { bindMenu, bindTrigger } from 'material-ui-popup-state/core';
import { TextEllipsis } from 'components/text-ellipsis/text-ellipsis';
import WrapperWithCopyButton from 'components/wrapper-with-copy-button/wrapper-with-copy-button';
import s from './info-show-more.module.scss';

export type OwnProps = {
  itemsArray:
    | { id: string; first_name: string; last_name: string; avatar_image: string }[]
    | { id: string; name: string; icon: ReactNode }[];
};

const InfoShowMore: FC<OwnProps> = ({ itemsArray }) => {
  const [isOpen, setIsOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const visibleNameRef = useRef<HTMLDivElement>(null);
  const [isShowValueTooltip, setIsShowValueTooltip] = useState(false);

  const popupState = usePopupState({ variant: 'popover', popupId: `actions-info` });

  const visibleNames = itemsArray
    .slice(0, 1)
    .map((item) => item.name || `${item.first_name} ${item.last_name}`)
    .join(',');

  useEffect(() => {
    if (visibleNameRef) {
      const { scrollWidth, clientWidth } = visibleNameRef.current;
      if (scrollWidth > clientWidth) {
        setIsShowValueTooltip(true);
      } else {
        setIsShowValueTooltip(false);
      }
    }
  }, [visibleNameRef]);

  return (
    <div className={s.list_container} onClick={(event) => event.stopPropagation()} ref={rootRef} {...bindTrigger(popupState)}>
      <WrapperWithCopyButton copyOnClick isWideTooltip copiedText={visibleNames}>
        <Tooltip placement="top-start" title={isShowValueTooltip ? visibleNames : ''}>
          <div className={s.visible_items} ref={visibleNameRef}>
            {visibleNames}
          </div>
        </Tooltip>
      </WrapperWithCopyButton>

      {itemsArray.length > 1 && (
        <Button className={s.button} color="secondary" variant="outlined" size="XXS" onClick={() => setIsOpen(true)}>
          {`+${itemsArray.length - 1}`}
        </Button>
      )}

      <Menu
        {...bindMenu(popupState)}
        open={isOpen}
        className={s.menu_container}
        anchorEl={rootRef.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{ vertical: -10, horizontal: 0 }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: -100,
        }}
      >
        {/* Don't delete this strange div! */}
        <div />
        <div className={s.body_container}>
          {itemsArray.map((item) => {
            let abbreviation = '';
            const name = item.name || `${item.first_name} ${item.last_name}`;
            if (item.first_name && item.last_name) {
              abbreviation = `${item.first_name[0] || ''}${item.last_name[0] || ''}`.toUpperCase();
            }

            return (
              <div className={s.item_container} key={item.id}>
                {item.icon ? (
                  <div className={s.item_icon}>{item.icon}</div>
                ) : (
                  <Avatar className={s.item_image} src={item.avatar_image}>
                    {abbreviation}
                  </Avatar>
                )}
                <WrapperWithCopyButton copyOnClick isWideTooltip copiedText={name}>
                  <TextEllipsis maxWidth="180px" tooltipTitle={name}>
                    <span className={s.item_title}>{name}</span>
                  </TextEllipsis>
                </WrapperWithCopyButton>
              </div>
            );
          })}
        </div>
      </Menu>
    </div>
  );
};

export default InfoShowMore;
