import { ReactNode, useState } from 'react';
import { ProductionWorkflow } from 'services/production-workflow.model';
import Checkbox from 'components/checkbox/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import {
  ProductionListActions,
  ProductionListSelectors,
} from 'pages/production/controllers/production-list-controller/production-list.controller';
import s from './production-checkbox-wrapper.module.scss';

type Props = {
  mainItemId: string;
  nestedLevel: number;
  children: ReactNode;
  withCheckbox: boolean;
  production: ProductionWorkflow;
};

const ProductionCheckboxWrapper = ({ children, withCheckbox, mainItemId, production, nestedLevel }: Props) => {
  const dispatch = useDispatch();

  const [isProductionHovered, setIsProductionHovered] = useState(false);

  const isEnableMultiActions = useSelector((state: AppState) => state.production.productionList.isEnableMultiActions);
  const isSelectedProduction = useSelector((state: AppState) =>
    ProductionListSelectors.isSelectedProduction(state, production.id),
  );

  return (
    <div
      className={s.production_wrapper}
      onMouseEnter={() => setIsProductionHovered(true)}
      onMouseLeave={() => setIsProductionHovered(false)}
    >
      <Checkbox
        size="medium"
        className={s.checkbox}
        checked={isSelectedProduction}
        style={{ left: nestedLevel ? -36 * nestedLevel - 25 : -25 }}
        data-is-checkbox-visible={withCheckbox && (isEnableMultiActions || isProductionHovered)}
        onClick={() => dispatch(ProductionListActions.handleSelectDeselectProductions(production, mainItemId))}
      />
      {children}
    </div>
  );
};

export default ProductionCheckboxWrapper;
