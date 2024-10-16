import { DropdownMenuItem } from 'components/dropdown-menu/dropdown-menu';
import { ProductionStatusEnum } from 'types/status-enums';

export type ProductionItemsMapT = Record<ProductionStatusEnum, DropdownMenuItem[]>;
