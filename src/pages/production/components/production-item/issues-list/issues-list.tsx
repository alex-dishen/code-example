import { Stack, Typography } from '@mui/material';
import { IdName } from 'types/common-types';
import s from './issues-list.module.scss';

type Props = {
  issues: IdName[];
};

const IssuesList = ({ issues }: Props) => {
  return (
    <>
      {issues.map(({ id, name }) => (
        <Stack key={id} direction="row" alignItems="center" gap="6px">
          <div className={s.bullet_point} />
          <Typography>{name}</Typography>
        </Stack>
      ))}
    </>
  );
};

export default IssuesList;
