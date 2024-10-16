export enum StateModeEnum {
  View = 'view',
  Create = 'create',
  Edit = 'edit',
}

export enum AppLanguage {
  English = 'en',
  Ukrainian = 'uk',
}

export enum WebsocketEvent {
  LaunchFinished = 'pw_launch_finished',
  LaunchFailed = 'pw_launch_failed',
}

export enum LocationTheProductionStatusIsChangingFrom {
  WorkflowItem = 'workflow_item',
  WorkflowHeader = 'workflow_header',
  ProductionList = 'production_list',
  NewProductionModal = 'new_production_modal',
  WorkflowItemAdditionalProduction = 'workflows_item_additional_production',
}
