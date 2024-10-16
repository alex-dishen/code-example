import { Active, Over } from '@dnd-kit/core';
import { ProductionStatusEnum } from 'types/status-enums';
import { SLOT } from 'pages/production/controllers/constants';
import { findMyParentIds } from 'pages/production/controllers/manage-components-modal.controller/helpers';
import { Component } from 'pages/production/controllers/manage-components-modal.controller/manage-components-modal.controller';
import { Page } from 'pages/production/controllers/production-list-controller/types';

export const checkIfDropDisabledOnAnotherComponent = (
  active: Active,
  over: Over,
  productions: Component[],
  metaIdsOfActiveItem: string[],
) => {
  const isOverSelf = active?.id === over?.id;
  const overData = over?.data?.current as Component;
  const activeData = active?.data?.current as Component;
  const isOverEmpty = over && (over.id as string).startsWith(SLOT);
  const isOverRoot = overData?.parent_production_workflow_id === null;
  const isActiveRoot = activeData?.parent_production_workflow_id === null;
  const activeItemAdditionalZoneId = activeData?.additionalZoneId?.length && activeData?.additionalZoneId;
  const parentMetaIds = overData ? findMyParentIds(productions, overData.id, overData.main_root_id) : [];

  const isDropDisabled =
    isOverSelf || // can't be dropped on itself
    activeData?.id === overData?.main_root_id || // can't be dropped on his children
    activeData?.id === overData?.parent_production_workflow_id || // can't be dropped on his children
    overData?.id === activeData?.parent_production_workflow_id || // can't be dropped on his parrent
    isOverRoot || // can't be dropped on root
    (isActiveRoot && !isOverEmpty && overData?.main_root_id) || // root can't be dropped on other child
    (activeItemAdditionalZoneId && !isOverEmpty && overData?.parent_production_workflow_id) || // can't be dropped additional on other component
    (activeItemAdditionalZoneId && overData?.additionalZoneId) || // can't be dropped additional on other additional
    (activeData?.parent_production_workflow_id && overData?.additionalZoneId) || // can't be dropped component on additional component
    (isOverEmpty && overData?.parent_production_workflow_id === activeData?.id) || // can't be dropped component on his children empty slot
    overData?.parentStatus === ProductionStatusEnum.Done || // can't be dropped component on component or slot with target parent status Done
    overData?.parentStatus === ProductionStatusEnum.From_Stock || // can't be dropped component on component or slot with target parent status From Stock
    overData?.parentStatus === ProductionStatusEnum.Canceled || // can't be dropped component on component or slot with target parent status Canceled
    (activeData?.parentStatus === ProductionStatusEnum.Canceled && !isOverEmpty) || // can't be dropped component with parent status Canceled on another component
    parentMetaIds.some((v) => metaIdsOfActiveItem.includes(v)) || // circle relation check
    (isOverEmpty && overData?.additionalZoneId); // can't be dropped on empty slot in additional zone

  return isDropDisabled;
};

export const checkIfDropToAdditionalDisabled = (
  active: Active,
  over: Over,
  productions: Component[],
  metaIdsOfActiveItem: string[],
) => {
  const overData = over?.data?.current;
  const activeData = active?.data?.current as Component;
  const mainRootId = (over?.id as string)?.split('_')[2];
  const parentProduction = overData?.production as Component;
  const additionalZoneId = (over?.id as string)?.split('_')[1] || '';
  const rootId = mainRootId === 'null' ? additionalZoneId : mainRootId;
  const isNestedAdditionalComponent = Boolean(activeData?.parent_production_workflow_id);
  const isChildOrSelfAdditionalZone = overData?.treeProductionIds?.includes(active?.id);
  const parentMetaIds = over ? findMyParentIds(productions, additionalZoneId, rootId, true) : [];
  const activeAdditionalZoneId = activeData?.additionalZoneId?.length && activeData?.additionalZoneId;
  const isActiveItemNotCompleted =
    activeData?.status === ProductionStatusEnum.In_Progress || activeData?.status === ProductionStatusEnum.To_Do;
  const isOverItemCompleted =
    parentProduction?.status === ProductionStatusEnum.Done || parentProduction?.status === ProductionStatusEnum.From_Stock;

  const isDropDisabled =
    (isChildOrSelfAdditionalZone && !isNestedAdditionalComponent) || // can't be dropped on his or children additional zone
    (activeAdditionalZoneId === additionalZoneId && !isNestedAdditionalComponent) || // can't be dropped additional on his additional zone
    parentMetaIds.some((v) => metaIdsOfActiveItem.includes(v)) || // circle relation check
    (!isActiveItemNotCompleted && isOverItemCompleted); // can't be dropped completed item on completed additional zone

  return isDropDisabled;
};

export const checkIfMoveOutOfProductionDisabled = (active: Active, over: Over) => {
  const activeData = active?.data?.current as Component;

  return !activeData?.additionalZoneId && !activeData?.parent_production_workflow_id && over?.id === 'outsiders_zone';
};

export const checkIfDragDisabled = (data: Component) => {
  const isDragDisabled =
    data.id.startsWith(SLOT) ||
    (data.parentStatus === ProductionStatusEnum.Done && !data.isComponentMoved) ||
    (data.parentStatus === ProductionStatusEnum.From_Stock && !data.isComponentMoved);

  return isDragDisabled;
};

export const getPageType = (isTaskPage: boolean, isOnWorkflowHeader: boolean) => {
  if (isTaskPage) return Page.InfoDropdownTask;
  if (isOnWorkflowHeader) return Page.InfoDropdownWorkflow;
  return Page.InfoDropdownProduction;
};
