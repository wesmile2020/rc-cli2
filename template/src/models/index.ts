import { AnyAction } from "redux";

export interface State {
    int: string;
}

export default {
    namespace: 'mapView',
    state: {
        int: '123312',
    },
    reducers: {
        save(state: State, { payload }: AnyAction) {
            return { ...state, ...payload };
        },
    },
};
