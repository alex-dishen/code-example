import { Button, Stack } from '@mui/material';
import { FC } from 'react';
import { SearchIcon } from 'icons/search';
import s from './no-results.module.scss';

type Props = {
  clearFilters: () => void;
};

const NoResults: FC<Props> = ({ clearFilters }) => {
  return (
    <div className={s.container}>
      <Stack gap={0.5} alignItems="center">
        <div className={s.heading}>
          <SearchIcon /> No results
        </div>
        <p>Please select different filters</p>
      </Stack>
      <Button className={s.button} onClick={clearFilters} variant="outlined">
        Clear filters
      </Button>
    </div>
  );
};

export default NoResults;
