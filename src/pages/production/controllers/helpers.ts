/* eslint-disable no-restricted-syntax */
import { DateRange } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import {
  ProductionIssueEnum,
  ProductionWorkflow,
  ProductionWorkflowProductT,
  ProductionWorkflowResponseDataT,
} from 'services/production-workflow.model';
import { IdName } from 'types/common-types';

type UpdateProductionRecursivelyArgs = {
  id: string;
  value: Partial<ProductionWorkflow>;
  productions: ProductionWorkflowResponseDataT;
  isNested?: boolean;
  isReplaceComponent?: boolean;
};

export const returnParams = (values: IdName[], isGetName?: boolean) => {
  let valuesToReturn = [];
  if (isGetName) valuesToReturn = values.map((value) => value.name);

  if (!isGetName) valuesToReturn = values.map((value) => value.id);

  return valuesToReturn.length ? valuesToReturn : undefined;
};

export const convertToStockFilterParams = (values: IdName[]): boolean | undefined => {
  const hasYes = values.some((value) => value.name === 'Yes');
  const hasNo = values.some((value) => value.name === 'No');

  switch (true) {
    case hasYes && hasNo:
      return undefined;

    case hasYes:
      return true;

    case hasNo:
      return false;

    default:
      return undefined;
  }
};

function mapArrayToObjectById(array) {
  return array.reduce((result, item) => {
    const res = { ...result };
    res[item.id] = { ...item };
    return res;
  }, {});
}

function mapArrayToObjectByName(array) {
  return array.reduce((result, item) => {
    const res = { ...result };
    res[item.name] = { ...item };
    return res;
  }, {});
}

export const convertToStockFilterOptions = (value: boolean | undefined, options: IdName[]): IdName[] => {
  if (value === true) {
    const yesOption = options.find((option) => option.name === 'Yes');
    return yesOption ? [yesOption] : [];
  }
  if (value === false) {
    const noOption = options.find((option) => option.name === 'No');
    return noOption ? [noOption] : [];
  }
  return [];
};

export const getValueFromIds = (values: string[] | undefined, options: IdName[]): IdName[] => {
  if (values) {
    const optionsMap = mapArrayToObjectById(options);
    return values.map((item) => optionsMap[item]);
  }
  return [];
};

export const getValues = (values: IdName[] | undefined): IdName[] => {
  if (values) {
    return values.map((i) => ({
      id: i.id === null ? 'null' : i.id,
      name: i.name,
    }));
  }
  return [];
};

export const getValueFromNames = (values: string[] | undefined, options: IdName[]): IdName[] => {
  if (values) {
    const optionsMap = mapArrayToObjectByName(options);
    return values.map((item) => optionsMap[item]);
  }
  return [];
};

export const getDatesForFilters = (value: DateRange<Dayjs>) => {
  const [from, to] = value;
  const valuesToReturn = [from?.startOf('day')?.toISOString() || null, to?.endOf('day')?.toISOString() || null].filter(
    (item) => !!item,
  );

  return valuesToReturn.length ? valuesToReturn : undefined;
};

export const stringArrayToDateRange = (dateStrings: string[]): DateRange<Dayjs> => {
  if (!!dateStrings[0] && !dateStrings[1]) {
    const singleDate = dayjs(dateStrings[0]);
    return [singleDate, null];
  }
  if (!dateStrings[0] && !!dateStrings[1]) {
    const singleDate = dayjs(dateStrings[1]);
    return [null, singleDate];
  }
  const startDate = dayjs(dateStrings[0]);
  const endDate = dayjs(dateStrings[1]);
  return [startDate, endDate];
};

const updateProduction = (
  id: string,
  value: Partial<ProductionWorkflow>,
  workflow: ProductionWorkflow,
  isReplaceComponent: boolean,
) => {
  if ((!value.order && workflow.id === id) || (isReplaceComponent && workflow.id === id)) {
    return {
      ...workflow,
      ...value,
    };
  }

  if (workflow.order.id === id) {
    return {
      ...workflow,
      order: { ...workflow.order, priority: value.order.priority },
      nested_workflows: workflow.nested_workflows.length
        ? updateProductionRecursively({ productions: workflow.nested_workflows, isNested: true, id, value })
        : [],
    };
  }

  if (workflow.nested_workflows.length) {
    return {
      ...workflow,
      nested_workflows: updateProductionRecursively({ productions: workflow.nested_workflows, isNested: true, id, value }),
    };
  }

  return workflow;
};

export const updateProductionRecursively = ({ value, id, productions, isReplaceComponent }: UpdateProductionRecursivelyArgs) => {
  if (!productions.length) return productions;

  let newProductions: ProductionWorkflowResponseDataT;

  if ('production_workflows' in productions[0]) {
    newProductions = (productions as ProductionWorkflowProductT[]).map((workflow) => ({
      ...workflow,
      production_workflows: workflow.production_workflows.map((item) => {
        return updateProduction(id, value, item, isReplaceComponent);
      }),
    }));

    return newProductions;
  }

  newProductions = (productions as ProductionWorkflow[]).map((workflow) => {
    return updateProduction(id, value, workflow, isReplaceComponent);
  });

  return newProductions;
};

export const getProductionIssues = (production: ProductionWorkflow) => {
  const issues: IdName[] = [];
  if (!production.variant.id) {
    issues.push({
      id: ProductionIssueEnum.UndefinedProduct,
      name: `Undefined product from ${production.order.external_system_name}. Barcode ${production.barcode || '-'}`,
    });
  }
  if (production.deadline_at && new Date(production.deadline_at) < new Date()) {
    issues.push({
      id: ProductionIssueEnum.ProductionDeadlineExpired,
      name: 'The deadline has been reached',
    });
  }
  if (production.is_manual_assignmet_required) {
    issues.push({
      id: ProductionIssueEnum.TasksRequiringManualAssignment,
      name: 'Manual assignment for a task required',
    });
  }
  if (production.is_any_task_time_limit_exceeded) {
    issues.push({
      id: ProductionIssueEnum.TaskTimeLimitExceeded,
      name: 'The task tracker time has exceeded the task time limit',
    });
  }
  if (production.nested_production_component_has_issues) {
    issues.push({
      id: ProductionIssueEnum.IssuesInNestedComponents,
      name: 'Nested production component has an issue',
    });
  }

  return issues;
};

export const getDefaultSimilarValue = (targetName: string, valuesArray: { name: string; [key: string]: any }[]): any => {
  const caseSensitiveMatch = valuesArray?.find((i) => i.name === targetName);
  if (caseSensitiveMatch) {
    return caseSensitiveMatch;
  }
  return null;
};

export const getDefaultVariantValue = (
  targetName: string,
  valuesArray: { name: string; [key: string]: any }[],
  isStrictMode?: boolean,
): any => {
  if (targetName && valuesArray?.length) {
    const targetNamesArray = targetName.split(' / ');
    for (const item of valuesArray) {
      const valueNamesArray = item.name?.split(' / ');
      if (targetNamesArray.slice().sort().join('/') === valueNamesArray.slice().sort().join('/')) {
        return item;
      }
    }

    const targetNamesLowerCase = targetNamesArray.map((i) => i.toLowerCase());
    for (const item of valuesArray) {
      const valueNamesArray = item.name?.split(' / ').map((i) => i.toLowerCase());
      if (targetNamesLowerCase.slice().sort().join('/') === valueNamesArray.slice().sort().join('/')) {
        return item;
      }
    }

    if (!isStrictMode) {
      for (const item of valuesArray) {
        const valueNamesArray = item.name?.split(' / ').map((i) => i.toLowerCase());
        if (targetNamesLowerCase.some((name) => valueNamesArray.includes(name))) {
          return item;
        }
      }
    }
  }

  return null;
};

export const checkAllValuesIsSimilar = (targetName: string, valuesArray: { name: string; [key: string]: any }[]): any => {
  if (!valuesArray?.length) return false;

  return valuesArray.every((item) => {
    return item.name === targetName;
  });
};

export const checkAllVariantsIsSimilar = (targetName: string, valuesArray: { name: string; [key: string]: any }[]): boolean => {
  if (targetName) {
    const targetNamesArray = targetName.split(' / ').map((i) => i.toLowerCase());

    if (!valuesArray?.length) return false;

    return valuesArray.every((item) => {
      const valueNamesArray = item.name?.split(' / ').map((i) => i.toLowerCase());
      return targetNamesArray.slice().sort().join('/') === valueNamesArray?.slice().sort().join('/');
    });
  }

  return false;
};

export const getIdName = (values: { id: string; name: string; [key: string]: any }[]) => {
  const valuesToReturn = values.map((i) => ({
    id: i.id === 'null' ? null : i.id,
    name: i.name,
  }));
  return valuesToReturn.length ? valuesToReturn : undefined;
};

export const getIdFullName = (items: { first_name: string; last_name: string; id: string; [key: string]: any }[]) => {
  return items.map((item) => ({ ...item, name: `${item.first_name} ${item.last_name}` }));
};

export const getDepartmentPath = (items: { path: IdName[]; id: string; name: string; [key: string]: any }[]) => {
  return items.map((item) => ({ ...item, path: item.path.map((i) => i.name).join('/') }));
};

export const checkIsPlaneView = (workflows: ProductionWorkflowResponseDataT): workflows is ProductionWorkflow[] => {
  return !('production_workflows' in workflows);
};

export const getAllProductionsOnTheScreen = (productions: ProductionWorkflow[]): ProductionWorkflow[] => {
  const selectedProductions = [];

  productions.forEach((workflow) => {
    selectedProductions.push(workflow);

    if (workflow.nested_workflows.length) {
      selectedProductions.push(...getAllProductionsOnTheScreen(workflow.nested_workflows));
    }
  });

  return selectedProductions;
};
