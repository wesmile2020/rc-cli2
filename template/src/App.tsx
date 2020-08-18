import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, Reducer, AnyAction, Store } from 'redux';

interface Reducers {
    [K: string]: Reducer;
}

interface Model {
    namespace: string;
    state: MapLike;
    reducers: Reducers;
}

class App {
    private _modelList: Model[] = [];
    private _reducer?: Reducer;
    private _store?: Store;
    private _app?: React.ComponentClass | React.FunctionComponent;

    model(model: Model) {
        if (!this._checkModel(model)) return;
        this._modelList.push(model);
    }

    private _checkModel(model: Model) {
        const arr = this._modelList;
        for (let i = 0; i < arr.length; i += 1) {
            if (arr[i].namespace === model.namespace) {
                console.error('namespace already exits');
                return false;
            }
        }

        return true;
    }

    private _generateStore(list: Model[]) {
        if (list.length === 0) return;
        const reducerObj: Reducers = {};
        for (let i = 0; i < list.length; i += 1) {
            reducerObj[list[i].namespace] = (state: MapLike = list[i].state, action: AnyAction) => {
                const typeArr = action.type.split('/');
                const reducer = list[i].reducers[typeArr[1]];
                if (typeArr[0] === list[i].namespace && reducer) {
                    return reducer(state, action);
                }
                return state;
            };
        }
        this._reducer = combineReducers(reducerObj);
    }

    setApp(app: React.ComponentClass | React.FunctionComponent) {
        this._app = app;
    }

    start(id: string) {
        if (!this._app) {
            console.error('please set app before start');
            return;
        }
        this._generateStore(this._modelList);
        const noop = () => {};
        const __DEV_TOOL = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
        this._store = createStore(
            this._reducer || noop,
            __DEV_TOOL && __DEV_TOOL()
        );

        render(
            <Provider store={this._store}>
                <this._app />
            </Provider>,
            document.getElementById(id)
        );
    }
}

export default App;
