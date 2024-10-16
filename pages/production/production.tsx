import { FC, useEffect } from 'react';
import { connect } from 'react-redux';
import WidthContainer from 'components/width-container/width-container';
import ActionsPanel from 'pages/production/actions-panel/actions-panel';
import ProductionList from 'pages/production/production-list/production-list';
import ProductionHeader from 'pages/production/production-header/production-header';
import ProductionFilters from 'pages/production/production-filters/production-filters';
import NewProductionModal from 'pages/production/new-production-modal/new-production-modal';
import CancelProductionModal from 'pages/production/cancel-production-modal/cancel-production-modal';
import StopProductionConfirmModal from 'pages/production/stop-production-modal/stop-production-modal';
import PrepareForPrintingModal from 'pages/production/prepare-for-printing-modal/prepare-for-printing-modal';
import NewComponentModal from 'pages/production/manage-components-modal/components/new-component-modal/new-component-modal';
import ProductionsLaunchingProgress from 'pages/production/production-launching-progress-modal/production-launching-progress-modal';
import { ManageComponentsActions } from 'pages/production/controllers/manage-components-modal.controller/manage-components-modal.controller';
import s from './production.module.scss';

type DispatchProps = {
  addNewComponent: () => void;
};
type Props = DispatchProps;

const ProductionEntry: FC<Props> = ({ addNewComponent }) => {
  useEffect(() => {
    document.title = 'Production';
  }, []);

  return (
    <WidthContainer>
      <div className={s.container}>
        <ProductionHeader />
        <ProductionFilters />
        <ActionsPanel />
        <ProductionsLaunchingProgress />
        <ProductionList />
        <NewProductionModal />
        <CancelProductionModal />
        <PrepareForPrintingModal />
        <StopProductionConfirmModal />
        <NewComponentModal onAddClick={addNewComponent} />
      </div>
    </WidthContainer>
  );
};

const mapDispatchToProps: DispatchProps = {
  addNewComponent: ManageComponentsActions.createNew,
};
export default connect(null, mapDispatchToProps)(ProductionEntry);
