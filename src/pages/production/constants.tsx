import { CheckMarksInSquareIcon } from 'icons/checkmarks-in-square';
import { Products2Icon } from 'icons/products-2';
import { ViewsIcon } from 'icons/view';
import ProductionItem from 'pages/production/components/production-item/production-item';
import ProductionOrderItem from 'pages/production/components/production-order-item/production-order-item';
import ProductionProductItem from 'pages/production/components/production-product-item/production-product-item';
import { GroupByEnum } from 'services/production-workflow.model';

export const modes = {
  none: {
    id: GroupByEnum.None,
    name: 'Plane',
    tooltipText: 'Plane View',
    icon: <ViewsIcon />,
    component: ProductionItem,
  },
  order: {
    id: GroupByEnum.Order,
    name: 'Order',
    tooltipText: 'Order View',
    icon: <Products2Icon />,
    component: ProductionOrderItem,
  },
  product: {
    id: GroupByEnum.Product,
    name: 'Product',
    tooltipText: 'Product View',
    icon: <CheckMarksInSquareIcon />,
    component: ProductionProductItem,
  },
};
