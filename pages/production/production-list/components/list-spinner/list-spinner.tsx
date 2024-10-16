import { CircularProgressProps } from '@mui/material';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import Spinner from 'components/spinner/spinner';
import s from './list-spinner.module.scss';

type Props = CircularProgressProps & {
  containerClassName?: string;
};

const ListSpinner = ({ containerClassName, ...rest }: Props) => {
  const isInfinityScrollLoad = useSelector((state: AppState) => state.production.filters);
  return isInfinityScrollLoad ? <Spinner containerClassName={`${s.container} ${containerClassName}`} {...rest} /> : null;
};

export default ListSpinner;
