interface Action<T = unknown> {
  type: T;
}

interface AnyAction extends Action {
  [extraProps: string]: any;
}

type Reducer<S = any, A extends Action = AnyAction> = (
  state?: S,
  action?: A
) => S;

type Dispatch<A extends Action = AnyAction> = <T extends A>(
  action: T,
  ...extraArgs: unknown[]
) => T;

type ExtendState<State, Extension> = [Extension] extends [never]
  ? State
  : State & Extension;

type Unsubscribe = () => void;

interface Store<
  S = unknown,
  A extends Action = AnyAction,
  StateExt = never,
  Ext = Record<string, unknown>
> {
  dispatch: Dispatch<A>;
  getState(): S;
  subscribe(listener: () => void): Unsubscribe;
  replaceReducer<NewState, NewActions extends Action>(
    nextReducer: Reducer<NewState, NewActions>
  ): Store<ExtendState<NewState, StateExt>, NewActions, StateExt, Ext> & Ext;
}

declare const $CombinedState: unique symbol;

type CombinedState<S> = { readonly [$CombinedState]?: undefined } & S;

type PreloadedState<S> = Required<S> extends {
  [$CombinedState]: undefined;
}
  ? S extends CombinedState<infer S1>
    ? {
        [K in keyof S1]?: S1[K] extends Record<string, unknown>
          ? PreloadedState<S1[K]>
          : S1[K];
      }
    : never
  : {
      [K in keyof S]: S[K] extends string | number | boolean | symbol
        ? S[K]
        : PreloadedState<S[K]>;
    };

type StoreEnhancerStoreCreator<
  Ext = Record<string, unknown>,
  StateExt = never
> = <S = unknown, A extends Action = AnyAction>(
  reducer: Reducer<S, A>,
  preloadedState?: PreloadedState<S>
) => Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext;

export interface ReactNativeFeedbackReporterEnhancerOptions<S = any> {
  stateTransformer(state: S | undefined): (S & any) | null;
  actionTransformer(action?: AnyAction): AnyAction | null;
}

const defaultOptions: ReactNativeFeedbackReporterEnhancerOptions = {
  actionTransformer: (action) => action!!,
  stateTransformer: (state) => state || null,
};

export function createReduxEnhancer(
  enhancerOptions?: Partial<ReactNativeFeedbackReporterEnhancerOptions>
): any {
  // Note: We return an any type as to not have type conflicts.
  const options = {
    ...defaultOptions,
    ...enhancerOptions,
  };

  return (next: StoreEnhancerStoreCreator): StoreEnhancerStoreCreator => <
    S = any,
    A extends Action = AnyAction
  >(
    reducer: Reducer<S, A>,
    initialState?: PreloadedState<S>
  ) => {
    const ReactNativeFeedbackReporterReducer: Reducer<S, A> = (
      state,
      action
    ): S => {
      const newState = reducer(state, action);
      const transformedAction = options.actionTransformer(action);
      var transformedState = options.stateTransformer(newState);
      console.log('transformedAction', transformedAction);
      console.log('transformedState', transformedState);

      return newState;
    };

    return next(ReactNativeFeedbackReporterReducer, initialState);
  };
}
