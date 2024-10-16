import { useEffect, useState } from 'react';
import Checkbox from 'components/checkbox/checkbox';
import arrowRight from 'icons/emoji-png/arrow-right.png';
import { FormControlLabel, Stack, Typography } from '@mui/material';
import { TextEllipsis } from 'components/text-ellipsis/text-ellipsis';
import { ProductionWorkflowHierarchy } from 'services/production-workflow.model';
import { getDate } from 'utils/time';
import { WarningIcon } from 'icons/warning';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import s from './deadline-item-body-modal.module.scss';

type Props = {
  productions: ProductionWorkflowHierarchy[];
  newDeadline: string;
  targetProductionName: string;
  onChangeProduction: (productionId: string[]) => void;
};

const DeadlineItemBodyModal = ({ productions, newDeadline, targetProductionName, onChangeProduction }: Props) => {
  const [productionToUpdateDeadline, setProductionToUpdateDeadline] = useState(productions.map((t) => t.id));
  const isDeadlineWarning = useSelector((state: AppState) => state.production_workflow.isDeadlineWarningActive);
  const handleProductionClick = (id: string) => {
    if (productionToUpdateDeadline.some((item) => item === id)) {
      setProductionToUpdateDeadline((prev) => prev.filter((item) => item !== id));
      return;
    }
    setProductionToUpdateDeadline((prev) => [...prev, id]);
  };

  useEffect(() => {
    onChangeProduction(productionToUpdateDeadline);
  }, [onChangeProduction, productionToUpdateDeadline]);

  return (
    <Stack gap="12px">
      <Stack className={s.list}>
        {Boolean(productions.length) && (
          <div className={s.checkboxes_container}>
            {productions.map(({ id: productionId, product_name, deadline_at, production_key }) => (
              <FormControlLabel
                key={productionId}
                className={s.row}
                control={
                  <Checkbox
                    size="medium"
                    color="error"
                    checked={productionToUpdateDeadline.some((item) => item === productionId)}
                    onChange={() => handleProductionClick(productionId)}
                  />
                }
                label={
                  <div className={s.list_item}>
                    <div className={s.name_container}>
                      <TextEllipsis maxWidth="100%" tooltipTitle={product_name}>
                        {product_name}
                      </TextEllipsis>
                    </div>
                    <div className={s.status_row}>
                      <b>
                        ({production_key}) - {getDate(deadline_at, 'dot')}
                      </b>
                      &nbsp;
                      <img src={arrowRight} alt="arrow" className={s.icon} />
                      &nbsp;
                      <b>{getDate(newDeadline, 'dot')}</b>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </Stack>
      <Typography className={s.confirm_message}>
        Are you sure you want to change deadline of all production items connected with <b>{targetProductionName}</b> production?
      </Typography>
      {isDeadlineWarning && (
        <div className={s.warning}>
          <WarningIcon className={s.warning_icon} />
          <p>Deadline of the child component must be earlier than deadline of the parent component</p>
        </div>
      )}
    </Stack>
  );
};

export default DeadlineItemBodyModal;
