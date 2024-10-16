import { Stack, Typography } from '@mui/material';
import { issueKeywords } from 'types/common-types';
import { IssueInfo } from 'pages/production/controllers/production-filters-controller/types';
import s from './issues-details-list.module.scss';

type Props = {
  issues: {
    issuesCount: number;
    rootProductionWithIssuesCount: number;
    nestedProductionWithIssuesCount: number;
    mainProductionsIssuesInfo: IssueInfo[];
    nestedProductionsIssuesInfo: IssueInfo[];
  };
};

const IssuesDetailsList = ({ issues }: Props) => {
  const mainProductionsIssuesInfoFiltered = issues.mainProductionsIssuesInfo.filter((item) => item.issuesCount > 0);
  const nestedProductionsIssuesInfoFiltered = issues.nestedProductionsIssuesInfo.filter((item) => item.issuesCount > 0);
  const { rootProductionWithIssuesCount, nestedProductionWithIssuesCount } = issues;
  return (
    <>
      <Typography>
        {issues.issuesCount} issue{issues.issuesCount > 1 ? 's' : ''} detected in{' '}
        {rootProductionWithIssuesCount + nestedProductionWithIssuesCount} production
        {rootProductionWithIssuesCount + nestedProductionWithIssuesCount > 1 ? 's' : ''}:
      </Typography>

      {rootProductionWithIssuesCount > 0 && (
        <>
          <Typography>
            In {rootProductionWithIssuesCount} root production{rootProductionWithIssuesCount > 1 ? 's' : ''}:
          </Typography>
          {mainProductionsIssuesInfoFiltered.map((issue) => (
            <Stack key={`${issue.issueType}_root`} direction="row" alignItems="center" gap="6px">
              <div className={s.bullet_point} />
              <Typography>
                {issueKeywords[issue.issueType]} - {issue.issuesCount}
              </Typography>
            </Stack>
          ))}
        </>
      )}

      {nestedProductionWithIssuesCount > 0 && (
        <>
          <Typography>
            In {nestedProductionWithIssuesCount} component{nestedProductionWithIssuesCount > 1 ? 's' : ''}:
          </Typography>
          {nestedProductionsIssuesInfoFiltered.map((issue) => (
            <Stack key={`${issue.issueType}_nested`} direction="row" alignItems="center" gap="6px">
              <div className={s.bullet_point} />
              <Typography>
                {issueKeywords[issue.issueType]} - {issue.issuesCount}
              </Typography>
            </Stack>
          ))}
        </>
      )}
    </>
  );
};

export default IssuesDetailsList;
