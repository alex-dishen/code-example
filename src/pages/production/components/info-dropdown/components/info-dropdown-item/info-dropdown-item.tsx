import { Skeleton, Tooltip } from '@mui/material';
import { EditPencilIcon } from 'icons/edit-pencil';
import { ComponentType, ReactNode, SVGProps, useState } from 'react';
import HorizontalShiftAnimation from 'components/wrapper-with-shift-animation/horisontal-shift-animation';
import { ValueItem } from 'pages/production/components/info-dropdown/components/info-dropdown-item/components/value-item';
import { Actions as ProductionWorkflowActions } from 'pages/production-workflow/controllers/production-workflow.controller';
import { useDispatch } from 'react-redux';
import s from './info-dropdown-item.module.scss';

type Props = {
  title: string;
  isEdited?: boolean;
  isLoading?: boolean;
  productionId?: string;
  titleClassName?: string;
  valueClassName?: string;
  editIconTooltip?: string;
  value: string | ReactNode;
  isEditableEmpty?: boolean;
  isNeededHierarchy?: boolean;
  renderTooltip?: ReactNode | string;
  viewProductInfoElement?: ReactNode;
  SvgIcon: ComponentType<SVGProps<SVGSVGElement>>;
  onEditClick?: () => void;
};

const InfoDropdownItem = ({
  title,
  value,
  SvgIcon,
  isEdited,
  isLoading,
  productionId,
  renderTooltip,
  titleClassName,
  valueClassName,
  editIconTooltip,
  isNeededHierarchy,
  viewProductInfoElement,
  isEditableEmpty = true,
  onEditClick,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const isShowEditButton = value ? Boolean(onEditClick) : Boolean(onEditClick) && isEditableEmpty;

  if (isLoading) return <Skeleton className={s.skeleton} variant="rectangular" />;

  const handleOnEditClick = async () => {
    if (productionId && isNeededHierarchy) {
      await dispatch(ProductionWorkflowActions.getProductionWorkflowHierarchy(productionId));
    }
    onEditClick();
  };
  return (
    <div className={s.item_container}>
      <SvgIcon width={16} height={16} />
      <div className={`${titleClassName} ${s.text}`}>{title}</div>
      <div className={s.value_wrapper}>
        <div className={s.flex} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <ValueItem value={value} isEdited={isEdited} className={valueClassName} renderTooltip={renderTooltip} />

          {isShowEditButton && (
            <HorizontalShiftAnimation isVisible={isHovered} isReservedPlaceForIcon maxWidthWhenIsShown={15}>
              <Tooltip placement="top" title={editIconTooltip}>
                <span onClick={handleOnEditClick} className={s.edit_icon}>
                  <EditPencilIcon width={16} height={16} />
                </span>
              </Tooltip>
            </HorizontalShiftAnimation>
          )}

          {viewProductInfoElement && !isLoading && (
            <HorizontalShiftAnimation isVisible={isHovered} isReservedPlaceForIcon maxWidthWhenIsShown={15}>
              {viewProductInfoElement}
            </HorizontalShiftAnimation>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoDropdownItem;
