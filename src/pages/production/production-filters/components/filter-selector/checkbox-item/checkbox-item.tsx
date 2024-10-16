import { FC } from 'react';
import { FormControlLabel } from '@mui/material';
import Checkbox from 'components/checkbox/checkbox';
import { TextEllipsis } from 'components/text-ellipsis/text-ellipsis';
import s from './checkbox-item.module.scss';

type OwnProps = {
  label: string;
  checked?: boolean;
  onSelect: () => void;
};

const CheckboxItem: FC<OwnProps> = ({ label, checked, onSelect }) => {
  return (
    <div className={s.option_container} onClick={onSelect}>
      <FormControlLabel
        className={s.form_control}
        label={<TextEllipsis maxWidth="100%">{label}</TextEllipsis>}
        control={<Checkbox checked={checked} size="medium" />}
      />
    </div>
  );
};

export default CheckboxItem;
