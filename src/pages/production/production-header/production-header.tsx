import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import { AddLineIcon } from 'icons/addLine';
import Button from 'components/button/button';
import { PageTitle } from 'components/page-title/page-title';
import {
  IssueInfo,
  ProductionFiltersState,
  GetProductionsByFilterArgs,
} from 'pages/production/controllers/production-filters-controller/types';
import { LightTooltip } from 'components/ui-new/light-tooltip/light-tooltip';
import IssuesDetailsList from 'pages/production/production-header/issues-list/issues-details-list';
import { ProductionFiltersActions } from 'pages/production/controllers/production-filters-controller/production-filters.controller';
import { ProductionNewModalActions } from 'pages/production/controllers/production-new-modal-controller/production-new-modal.controller';
import s from './production-header.module.scss';

type StateProps = {
  totalItems: number;
  isFetchingData: boolean;
  isLoadingFilters: boolean;
  filterWithAllIssues: boolean;
  issues: {
    issuesCount: number;
    rootProductionWithIssuesCount: number;
    mainProductionsIssuesInfo: IssueInfo[];
    nestedProductionWithIssuesCount: number;
    nestedProductionsIssuesInfo: IssueInfo[];
  };
};
type DispatchProps = {
  openAddProductionModal: () => void;
  onChange: (values: Partial<ProductionFiltersState>) => void;
  getProductionsByFilter: (args: GetProductionsByFilterArgs) => void;
};
type Props = StateProps & DispatchProps;

export const ProductionHeader = ({
  issues,
  totalItems,
  isFetchingData,
  isLoadingFilters,
  filterWithAllIssues,
  onChange,
  getProductionsByFilter,
  openAddProductionModal,
}: Props) => {
  const handleClick = () => {
    onChange({ filterWithAllIssues: !filterWithAllIssues });
    getProductionsByFilter({ resetSkipAndSetTakeToDefault: true });
  };

  return (
    <header className={s.header}>
      <div className={s.row}>
        <PageTitle text={`Production `} />
        <span>{!isFetchingData && `(${totalItems})`}</span>
        <div className={s.row}>
          <LightTooltip
            className={s.tooltip}
            placement="bottom-start"
            title={issues?.issuesCount > 0 ? <IssuesDetailsList issues={issues} /> : ''}
          >
            <div>
              <Button
                color="warning"
                loading={isFetchingData}
                variant={filterWithAllIssues ? 'contained' : 'outlined'}
                onClick={handleClick}
              >
                {`Issues ${issues.issuesCount || '0'}`}
              </Button>
            </div>
          </LightTooltip>
        </div>
      </div>
      <div className={s.row}>
        <Button
          size="large"
          variant="contained"
          startIcon={<AddLineIcon />}
          disabled={isLoadingFilters || isFetchingData}
          style={{ paddingLeft: 34, paddingRight: 34 }}
          onClick={openAddProductionModal}
        >
          New Production
        </Button>
      </div>
    </header>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  issues: state.production.filters.issues,
  totalItems: state.production.filters.pagination.total,
  isFetchingData: state.production.filters.isFetchingData,
  isLoadingFilters: state.production.filters.isLoadingFilters,
  filterWithAllIssues: state.production.filters.filterWithAllIssues,
});
const mapDispatchToProps: DispatchProps = {
  onChange: ProductionFiltersActions.onChange,
  openAddProductionModal: ProductionNewModalActions.openModal,
  getProductionsByFilter: ProductionFiltersActions.getProductionsByFilter,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductionHeader);
