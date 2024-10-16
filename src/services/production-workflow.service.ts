import { IdName, MinMax } from 'types/common-types';
import { PaginateResponse } from 'types/paginate-response';
import {
  AssignResponsibleToProductionsBody,
  ComponentHistoryItem,
  GetProductionWorkflowHierarchyArgs,
  ProductionWorkflowHierarchy,
  ProductionWorkflowUpdateBodyByHierarchy,
  UpdateProductionWorkflowByOrderBody,
} from 'services/production-workflow.model';
import { baseAxiosInstance } from '../axios-config';
import {
  ChangesLogObj,
  CanCancelProductionResponse,
  GetProductionWorkflowsFilteredRequest,
  ProductForLaunch,
  ProductionDetails,
  ProductionIssues,
  ProductionWorkflow,
  ManageTaskPriorityRequestBody,
  ProductionWorkflowCreateRequest,
  ProductionWorkflowInfo,
  ProductionWorkflowLaunchData,
  NestedComponentsResponse,
  ProductionWorkflowRequest,
  ProductionWorkflowResponse,
  ProductionWorkflowUpdateBody,
  updateWorkflowDetailsRequestBody,
  ProductionWorkflowMultiLaunchData,
  SetChosenFiltersBody,
} from './production-workflow.model';

export class ProductionWorkflowService {
  public static async create(newOrderData: ProductionWorkflowCreateRequest): Promise<ProductionWorkflow[]> {
    const { data } = await baseAxiosInstance.post('/production-workflows/create', newOrderData);
    return data;
  }

  public static async setChosenFilters(body: SetChosenFiltersBody): Promise<ProductionWorkflow[]> {
    const { data } = await baseAxiosInstance.post('/production-workflows/chosen-filters', body);
    return data;
  }

  public static async update(id: string, body: ProductionWorkflowUpdateBody): Promise<ProductionWorkflowUpdateBody> {
    const { data } = await baseAxiosInstance.put(`/production-workflows/${id}`, body);
    return data;
  }

  public static async assignResponsibleToProductions(body: AssignResponsibleToProductionsBody): Promise<{ message: string }> {
    const { data } = await baseAxiosInstance.put(`production-workflows/responsible`, body);
    return data;
  }

  public static async getEstimatedInfo(): Promise<MinMax> {
    const { data } = await baseAxiosInstance.get(`/production-workflows/estimation-info`);
    return data;
  }

  public static async getProductionWorkflowDetails(id: string): Promise<ProductionDetails> {
    const { data } = await baseAxiosInstance.get(`/production-workflows/details/${id}`);
    return data;
  }

  public static async updateProductionWorkflowDetails(
    id: string,
    body: updateWorkflowDetailsRequestBody,
  ): Promise<ProductionDetails> {
    const { data } = await baseAxiosInstance.put(`/production-workflows/details/${id}`, body);
    return data;
  }

  public static async updateProductionWorkflowDetailsByOrder(
    productionId: string,
    body: UpdateProductionWorkflowByOrderBody,
    params: { change_all_productions: boolean },
  ): Promise<ProductionDetails> {
    const { data } = await baseAxiosInstance.put(`/production-workflows/update-by-order/${productionId}`, body, { params });
    return data;
  }

  public static async getProductionIssues(options: ProductionWorkflowRequest): Promise<ProductionIssues> {
    const { data } = await baseAxiosInstance.post(`/production-workflows/get-issues`, options);
    return data;
  }

  public static async getProductionKeys(search?: string, skip?: number, take?: number): Promise<PaginateResponse<IdName>> {
    const { data } = await baseAxiosInstance.get(`/production-workflows/find-production-keys`, {
      params: {
        search,
        skip,
        take,
      },
    });
    return data;
  }

  public static async delete(id: string) {
    const { data } = await baseAxiosInstance.delete<{ message: string }>(`/production-workflows/${id}`);
    return data;
  }

  public static async deleteMany(productions_ids: string[]) {
    const { data } = await baseAxiosInstance.post<{ message: string }>(`/production-workflows/delete-many`, {
      productions_ids,
    });
    return data;
  }

  public static async getAll(options: ProductionWorkflowRequest) {
    const { data } = await baseAxiosInstance.post<ProductionWorkflowResponse>('/production-workflows/all', options);
    return data;
  }

  public static async getLaunchingProductionCount() {
    const { data } = await baseAxiosInstance.get<number>('/production-workflows/count', { params: { countBy: 'launching' } });
    return data;
  }

  public static async launch(dto: ProductionWorkflowLaunchData[]) {
    const { data } = await baseAxiosInstance.post<ProductionWorkflowResponse>(`/production-workflows/launch`, dto);
    return data;
  }

  public static async multiLaunch(dto: ProductionWorkflowMultiLaunchData[]) {
    const { data } = await baseAxiosInstance.post<{ message: string }>(`/production-workflows/launch/bulk`, dto);
    return data;
  }

  public static async getProductionWorkflowInfo(id: string) {
    const { data } = await baseAxiosInstance.get<ProductionWorkflowInfo>(`/production-workflows/info/${id}`);
    return data;
  }

  public static async getCanCancelProduction(id: string) {
    const { data } = await baseAxiosInstance.get<CanCancelProductionResponse>(`/production-workflows/cancel/${id}`);
    return data;
  }

  public static async cancelProductionTasks(id: string, tasksIds: string[], componentsIds: string[]) {
    const { data } = await baseAxiosInstance.post<CanCancelProductionResponse>(`/production-workflows/cancel/${id}`, {
      tasksIds,
      componentsIds,
    });
    return data;
  }

  public static async getInfoForManage(id: string) {
    const { data } = await baseAxiosInstance.get<ProductForLaunch[]>(`/production-workflows/manage/${id}`);
    return data;
  }

  public static async getAllByCriteria(criteria: GetProductionWorkflowsFilteredRequest) {
    const { data } = await baseAxiosInstance.post<ProductionWorkflowResponse>('/production-workflows/all', criteria);
    return data;
  }

  public static async getDraftIdsOfParentProduction(id: string) {
    const { data } = await baseAxiosInstance.post<string[]>(`/production-workflows/parent-product-drafts/${id}`);
    return data;
  }

  public static async getInfoForStopping(id: string) {
    const { data } = await baseAxiosInstance.get<NestedComponentsResponse>(`/production-workflows/stop/${id}`);
    return data;
  }

  public static async stopProductionWorkflow(id: string, componentsIds: string[] = []) {
    const { data } = await baseAxiosInstance.put(`/production-workflows/stop/${id}`, { componentsIds });
    return data;
  }

  public static async manageComponents(body: ChangesLogObj[]) {
    const { data } = await baseAxiosInstance.put(`/production-workflows/manage-components`, body);
    return data;
  }

  public static async getComponentsHistory(id: string) {
    const { data } = await baseAxiosInstance.get<ComponentHistoryItem>(`/production-workflows/components-history/${id}`);
    return data;
  }

  public static async manageTaskPriority(id: string, body: ManageTaskPriorityRequestBody) {
    const { data } = await baseAxiosInstance.put(`/production-workflows/manage-tasks-priority/${id}`, body);
    return data;
  }

  public static async getProductionWorkflowHierarchy({
    id,
    status,
  }: GetProductionWorkflowHierarchyArgs): Promise<ProductionWorkflowHierarchy[]> {
    const { data } = await baseAxiosInstance.get(`/production-workflows/${id}/hierarchy`, {
      params: {
        status,
      },
    });
    return data;
  }

  public static async updateDeadlineByHierarchy(
    body: ProductionWorkflowUpdateBodyByHierarchy,
  ): Promise<ProductionWorkflowUpdateBodyByHierarchy> {
    const { data } = await baseAxiosInstance.put(`/production-workflows/deadline`, body);
    return data;
  }
}
