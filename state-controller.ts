import { Dispatch } from 'redux';
import { AppState } from 'redux/store';

export type ActionPayload<State> = {
  type: string;
  payload: object | ((state: State) => State);
};

type AsyncActionFunc = (dispatch: Dispatch, getState: () => AppState) => void | Promise<void>;
type ActionFunc = (...args: any) => AsyncActionFunc;
export interface IActions {
  [key: string]: ActionFunc;
}

export class StateController<State> {
  private name: string;

  private extension = '__state-creator';

  private defaultState: State;

  constructor(name: string, defaultState: State) {
    this.name = name;
    this.defaultState = defaultState;
  }

  public setState<K extends keyof State>(state: ((state: State) => State) | (Pick<State, K> | State)): ActionPayload<State> {
    const typeExtension = typeof state === 'function' ? this.extension : '';
    return {
      type: this.name + typeExtension,
      payload: state,
    };
  }

  public getReducer() {
    // eslint-disable-next-line @typescript-eslint/default-param-last
    return (state: State = this.defaultState, { payload, type }: ActionPayload<State>): State => {
      if (type !== this.name && type !== `${this.name}${this.extension}`) return state;
      if (typeof payload === 'function') {
        return payload(state);
      }
      return { ...state, ...payload };
    };
  }
}
