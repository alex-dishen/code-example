import { GroupByEnum, ProductionWorkflow, ProductionWorkflowResponseDataT } from 'services/production-workflow.model';
import { WebsocketEvent } from 'types/common-enums';

export enum Page {
  Workflow = 'workflow',
  Production = 'production',
  InfoDropdownWorkflow = 'info_dropdown_workflow',
  InfoDropdownProduction = 'info_dropdown_production',
  InfoDropdownTask = 'info_dropdown_task',
}

export type ProductionItemsT = {
  groupBy: GroupByEnum;
  data: ProductionWorkflowResponseDataT;
};

export type HandleLaunchingProductionsIdsArgs = {
  value: string[];
  replaceWithNewValue?: boolean;
  removeLaunchedProductionIds?: boolean;
};

type SuccessWebsocketResponseForProductionWorkflowT = {
  event: WebsocketEvent.LaunchFinished;
  data: {
    production: ProductionWorkflow;
    launchingProductionsCount: number;
  };
};

type ErrorWebsocketResponseForProductionWorkflowT = {
  event: WebsocketEvent.LaunchFailed;
  data: {
    error: Error;
    production: ProductionWorkflow;
  };
};

export type WebsocketResponseMessageForProductionWorkflowT =
  | SuccessWebsocketResponseForProductionWorkflowT
  | ErrorWebsocketResponseForProductionWorkflowT;
