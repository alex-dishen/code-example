import { t } from 'setup-localization';
import { notify } from 'notifications';
import { AppState } from 'redux/store';
import { User } from 'services/user.model';
import {
  GroupByEnum,
  ProductionWorkflow,
  ProductionWorkflowUpdateBody,
  ProductionWorkflowResponseDataT,
  AssignResponsibleToProductionsBody,
} from 'services/production-workflow.model';
import FireMinusIcon from 'icons/fire-minus';
import {
  checkIsPlaneView,
  updateProductionRecursively,
  getAllProductionsOnTheScreen,
} from 'pages/production/controllers/helpers';
import { StateController } from 'state-controller';
import { MODALS } from 'modules/root-modals/modals';
import { UserService } from 'services/user.service';
import { WebsocketEvent } from 'types/common-enums';
import { OrdersService } from 'services/orders.service';
import { ProductionStatusEnum } from 'types/status-enums';
import { AccessLevel, Permission } from 'services/permission.model';
import {
  ProductionItemsT,
  HandleLaunchingProductionsIdsArgs,
  WebsocketResponseMessageForProductionWorkflowT,
} from 'pages/production/controllers/production-list-controller/types';
import { ModalActions } from 'modules/root-modals/root-modals.controller';
import { ProductionWorkflowService } from 'services/production-workflow.service';
import { PermissionGuardActions } from 'modules/permission-guard/permission-guard.controller';
import { ManageSelectOrDeselectAllProductionsArgs } from 'pages/production/controllers/types';
import { PAGE_SIZE, UNASSIGNED } from 'components/ui-new/dropdown-user-search-selector/dropdown-user-search-selector';
import { DeleteConfirmationOwnProps } from 'modules/root-modals/modals/confirmation-modal/confirmation-modal';
import { ProductionFiltersActions } from 'pages/production/controllers/production-filters-controller/production-filters.controller';
import { ProductionsLaunchingProgressActions } from 'pages/production/production-launching-progress-modal/production-launching-progress-modal.controller';

export type ProductionState = {
  users: Array<User>;
  issuesCount: number;
  isEnableMultiActions: boolean;
  launchingProductionIds: string[];
  productionItems: ProductionItemsT;
  parentIdsOfSelectedProductions: string[];
  selectedProductions: ProductionWorkflow[];
  assigningResponsibleToProductionIds: string[];
  productionWithOpenedNestedProductions: string[];
};

const defaultState: ProductionState = {
  users: [],
  issuesCount: 0,
  selectedProductions: [],
  launchingProductionIds: [],
  isEnableMultiActions: false,
  parentIdsOfSelectedProductions: [],
  assigningResponsibleToProductionIds: [],
  productionWithOpenedNestedProductions: [],
  productionItems: { groupBy: GroupByEnum.None, data: [] },
};

const stateController = new StateController<ProductionState>('PRODUCTION', defaultState);

export class ProductionListActions {
  public static initPageData() {
    return async (dispatch) => {
      dispatch(ProductionListActions.loadUsers());
      await dispatch(ProductionFiltersActions.loadFilters());
      dispatch(ProductionFiltersActions.getProductionsByFilter({}));
    };
  }

  public static handleLaunchingProductionIds = ({
    value,
    replaceWithNewValue,
    removeLaunchedProductionIds,
  }: HandleLaunchingProductionsIdsArgs) => {
    return (dispatch) => {
      if (removeLaunchedProductionIds) {
        dispatch(
          stateController.setState((prev) => ({
            ...prev,
            launchingProductionIds: prev.launchingProductionIds.filter((launchingId) => !value.includes(launchingId)),
          })),
        );

        return;
      }

      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          launchingProductionIds: replaceWithNewValue ? value : [...prev.launchingProductionIds, ...value],
        })),
      );
    };
  };

  public static setProductionItems(data: ProductionWorkflowResponseDataT, newGroupBy?: GroupByEnum) {
    return (dispatch, getState: () => AppState) => {
      const { groupBy } = getState().production.filters;

      dispatch(stateController.setState({ productionItems: { groupBy: newGroupBy || groupBy, data } }));
    };
  }

  public static setProductionItemsAfterLoadMore(data: ProductionWorkflowResponseDataT, newGroupBy?: GroupByEnum) {
    return (dispatch, getState: () => AppState) => {
      const { groupBy } = getState().production.filters;
      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          productionItems: {
            ...prev.productionItems,
            groupBy: newGroupBy || groupBy,
            data: [...prev.productionItems.data, ...data],
          },
        })),
      );
    };
  }

  public static loadUsers() {
    return async (dispatch) => {
      try {
        const users = (await UserService.getAllUsers({ skip: 0, take: PAGE_SIZE })).data;
        dispatch(stateController.setState({ users }));
      } catch (err) {
        console.error(err);
        throw err;
      }
    };
  }

  public static openDeleteConfirmationModal(isExternal: boolean, productionWorkflowTitle: string, action: () => void) {
    return (dispatch) => {
      if (!dispatch(PermissionGuardActions.checkPermissionAndShowModal(Permission.webProductionEdit, [AccessLevel.access]))) {
        return;
      }
      dispatch(
        ModalActions.openModal<DeleteConfirmationOwnProps>({
          id: MODALS.CONFIRM,
          props: {
            title: <>Delete production?</>,
            text: (
              <>
                <div style={{ marginBottom: '7px' }}>
                  Are you sure you want to delete <strong>{productionWorkflowTitle}</strong> production item?
                </div>
                {isExternal ? (
                  <>
                    <br />
                    <div>
                      This production item was synced from external system. We highly recommend to not delete it, but change
                      status to <strong>“Cancelled”</strong>. It will keep data integrity.
                    </div>
                  </>
                ) : null}
                <br />
                <div>You can`t undo this action.</div>
              </>
            ),
            icon: <FireMinusIcon />,
            withCloseButton: false,
            actionText: <>{t('global.button_delete')}</>,
            action: () => {
              dispatch(action);
            },
          },
        }),
      );
    };
  }

  public static copyProductionWorkflowLink(id: string) {
    return async () => {
      const { origin } = window.location;
      const link = `${origin}/production-workflow/${id}`;
      await navigator.clipboard.writeText(link);
      notify.success('The link copied');
    };
  }

  public static replaceProduction(id: string, production: ProductionWorkflow) {
    return (dispatch) => {
      dispatch(
        stateController.setState((prev) => {
          return {
            ...prev,
            productionItems: {
              ...prev.productionItems,
              data: updateProductionRecursively({
                id,
                value: production,
                isReplaceComponent: true,
                productions: prev.productionItems.data,
              }),
            },
          };
        }),
      );
    };
  }

  public static assignResponsibleToProductions(responsibleId: string) {
    return async (dispatch, getState: () => AppState) => {
      const { selectedProductions } = getState().production.productionList;
      const selectedProductionIds = selectedProductions.map((production) => production.id);
      const responsibleIdForRequest = responsibleId === UNASSIGNED ? null : responsibleId;

      dispatch(stateController.setState({ assigningResponsibleToProductionIds: selectedProductionIds }));

      try {
        const assignToManyProductionsBody: AssignResponsibleToProductionsBody = {
          production_ids: selectedProductionIds,
          responsible_id: responsibleIdForRequest,
        };

        await ProductionWorkflowService.assignResponsibleToProductions(assignToManyProductionsBody);
        await dispatch(ProductionFiltersActions.getProductionsByFilter({ showFetchEffect: false, resetSkipPreserveTake: true }));
      } catch (error) {
        notify.error(error);
      } finally {
        dispatch(stateController.setState({ assigningResponsibleToProductionIds: [] }));
        notify.success('Successfully updated');
      }
    };
  }

  public static updateProduction(id: string, value: Partial<ProductionWorkflow>, isUpdateResponsible?: boolean) {
    return async (dispatch, getState: () => AppState) => {
      if (!dispatch(PermissionGuardActions.checkPermissionAndShowModal(Permission.webProductionEdit, [AccessLevel.access]))) {
        return;
      }

      const { data } = getState().production.productionList.productionItems;

      const newProductions = updateProductionRecursively({
        value,
        productions: data,
        id: value.order ? value.order.id : id,
      });

      const updateData: ProductionWorkflowUpdateBody = {
        title: value.title,
        status: value.status,
        priority: value.priority,
        ...(isUpdateResponsible ? { responsible_id: value.responsible?.id || null } : {}),
      };

      try {
        dispatch(
          stateController.setState((prev) => ({
            ...prev,
            productionItems: {
              ...prev.productionItems,
              data: newProductions,
            },
          })),
        );

        if (value.order) await OrdersService.updateOrder(id, { priority: value.order.priority });
        if (!value.order) await ProductionWorkflowService.update(id, updateData);
        dispatch(ProductionFiltersActions.getProductionsByFilter({ showFetchEffect: false, resetSkipPreserveTake: true }));
      } catch (error) {
        dispatch(
          stateController.setState((prev) => ({
            ...prev,
            productionItems: {
              ...prev.productionItems,
              data,
            },
          })),
        );
        notify.error(error);
      }
    };
  }

  public static deleteProductionWorkflow(id: string) {
    return async (dispatch) => {
      const filterData = (productionItems: ProductionState['productionItems']) => {
        return productionItems.groupBy === GroupByEnum.None
          ? productionItems.data?.filter((item) => item.id !== id)
          : productionItems.data
              .map((item) => {
                return {
                  ...item,
                  production_workflows: item.production_workflows.filter((i) => i.id !== id),
                };
              })
              .filter((item) => item.production_workflows.length);
      };

      await ProductionWorkflowService.delete(id);
      await dispatch(ProductionFiltersActions.getProductionsByFilter({ showFetchEffect: false, resetSkipPreserveTake: true }));
      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          productionItems: { ...prev.productionItems, data: filterData(prev.productionItems) },
        })),
      );
      notify.success('Deleted successfully');
    };
  }

  public static toggleIsEnableMultiActions = (value: boolean) => {
    return (dispatch) => {
      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          isEnableMultiActions: value,
          selectedProductions: !value ? [] : prev.selectedProductions,
          parentIdsOfSelectedProductions: !value ? [] : prev.parentIdsOfSelectedProductions,
        })),
      );
    };
  };

  public static manageSelectOrDeselectAllProductions = ({ resetAll }: ManageSelectOrDeselectAllProductionsArgs) => {
    return (dispatch, getState: () => AppState) => {
      const state = getState();
      const { selectedProductions, productionItems } = state.production.productionList;

      if (resetAll || selectedProductions.length) {
        dispatch(
          stateController.setState((prev) => ({
            ...prev,
            selectedProductions: [],
            parentIdsOfSelectedProductions: [],
          })),
        );
        return;
      }

      const workflows = productionItems.data;
      if (!checkIsPlaneView(workflows)) return;

      const productions = getAllProductionsOnTheScreen(workflows);
      const parentIds = workflows.map((workflow) => workflow.id);

      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          selectedProductions: productions,
          parentIdsOfSelectedProductions: parentIds,
          productionWithOpenedNestedProductions: productions
            .filter((workflow) => workflow.nested_workflows.length)
            .map((workflow) => workflow.id),
        })),
      );
    };
  };

  public static handleSelectDeselectProductions = (
    production: ProductionWorkflow | ProductionWorkflow[],
    parentItemId?: string,
  ) => {
    return (dispatch, getState: () => AppState) => {
      if (Array.isArray(production)) {
        dispatch(
          stateController.setState((prev) => {
            const newSelectedProductions = production.reduce((acc, item) => {
              if (acc.some((selectedProduction) => selectedProduction.id === item.id)) {
                return acc.filter((selectedProduction) => selectedProduction.id !== item.id);
              }
              return [...acc, item];
            }, prev.selectedProductions);

            return {
              ...prev,
              isEnableMultiActions: true,
              selectedProductions: newSelectedProductions,
            };
          }),
        );

        return;
      }

      const parentIds = getState().production.productionList.parentIdsOfSelectedProductions;
      const { selectedProductions } = getState().production.productionList;

      const isSelected = selectedProductions.some((item) => item.id === production.id);

      let updatedSelectedProductions = [];
      let updatedParentIds = [...parentIds];

      if (isSelected) {
        const index = parentIds.indexOf(parentItemId);
        // This logic prevents removing parent id when child is deselected //! Don't use filter
        if (index !== -1) updatedParentIds.splice(index, 1);
        updatedSelectedProductions = selectedProductions.filter((item) => item.id !== production.id);
      } else {
        updatedSelectedProductions = [...selectedProductions, production];
        updatedParentIds = [...parentIds, parentItemId];
      }

      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          isEnableMultiActions: true,
          selectedProductions: updatedSelectedProductions,
          parentIdsOfSelectedProductions: updatedParentIds,
        })),
      );
    };
  };

  public static setProductionsWithOpenedNestedProductions = (productionId: string) => {
    return (dispatch) => {
      dispatch(
        stateController.setState((prev) => ({
          ...prev,
          productionWithOpenedNestedProductions: prev.productionWithOpenedNestedProductions.some(
            (openedProductionId) => openedProductionId === productionId,
          )
            ? prev.productionWithOpenedNestedProductions.filter((openedProductionId) => openedProductionId !== productionId)
            : [...prev.productionWithOpenedNestedProductions, productionId],
        })),
      );
    };
  };

  public static handleWebsocketResponse = (message: WebsocketResponseMessageForProductionWorkflowT) => {
    return (dispatch) => {
      if (message.event === WebsocketEvent.LaunchFailed) {
        const { id, title, production_key } = message.data.production;
        notify.error(
          <>
            Production{' '}
            <b>
              {title} ({production_key})
            </b>{' '}
            wasn’t launched
          </>,
        );

        dispatch(
          ProductionListActions.handleLaunchingProductionIds({
            value: [id],
            removeLaunchedProductionIds: true,
          }),
        );

        return;
      }

      const { launchingProductionsCount, production } = message.data;

      dispatch(ProductionListActions.replaceProduction(production.id, production));
      dispatch(ProductionListActions.handleLaunchingProductionIds({ value: [production.id], removeLaunchedProductionIds: true }));

      if (!launchingProductionsCount) {
        notify.success('Successfully launched');
        dispatch(ProductionsLaunchingProgressActions.hideModal());

        return;
      }

      dispatch(ProductionsLaunchingProgressActions.setProductionsLaunchingCount(launchingProductionsCount));
    };
  };
}

export class ProductionListSelectors {
  public static isSelectedProduction = (state: AppState, productionId: string) => {
    return state.production.productionList.selectedProductions.some(
      (selectedProduction) => selectedProduction.id === productionId,
    );
  };

  public static isOpenedProduction = (state: AppState, productionId: string) => {
    return state.production.productionList.productionWithOpenedNestedProductions.some(
      (openedProductionId) => openedProductionId === productionId,
    );
  };

  public static checkIfMassLaunchPossible = (state: AppState) => {
    const { productionList } = state.production;
    const { selectedProductions, launchingProductionIds } = productionList;

    const areAllSelectedProductionsNotInLaunching = !selectedProductions.some(
      (production) => launchingProductionIds.includes(production.id) || production.is_launch_in_progress,
    );
    const areAllMainProductionsAndInTodo = selectedProductions.every(
      (selectedProduction) =>
        selectedProduction.status === ProductionStatusEnum.To_Do &&
        productionList.productionItems.data.some((production) => selectedProduction.id === production.id),
    );

    return !!selectedProductions.length && areAllSelectedProductionsNotInLaunching && areAllMainProductionsAndInTodo;
  };

  public static checkIfProductionMasLaunching = (state: AppState, productionId: string) => {
    return state.production.productionList.launchingProductionIds.includes(productionId);
  };

  public static isDeleteEnabled = (state: AppState) => {
    const { selectedProductions } = state.production.productionList;

    const canEveryComponentBeDeleted = selectedProductions.every(({ main_root_id, status, additionalComponents }) => {
      const flattenedAdditionalComponentsTree = getAllProductionsOnTheScreen(additionalComponents);
      const everyComponentFromAdditionalComponentsTreeInToDo = flattenedAdditionalComponentsTree.every(
        (production) => production.status === ProductionStatusEnum.To_Do,
      );

      return !main_root_id && status === ProductionStatusEnum.To_Do && everyComponentFromAdditionalComponentsTreeInToDo;
    });

    return selectedProductions.length > 0 && canEveryComponentBeDeleted;
  };
}

export const reducer = stateController.getReducer();
