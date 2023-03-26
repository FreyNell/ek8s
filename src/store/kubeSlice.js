import { createSlice } from '@reduxjs/toolkit';

const kubeSlice = createSlice({
    name: 'kube',
    initialState: {
        contexts: [],
        currentContext: 'default',
        namespaces: [],
        currentNamespace: 'default',
        pods: [],
    },
    reducers: {
        setContexts: (state, action) => {
            state.contexts = action.payload;
        },
        setCurrentContext: (state, action) => {
            state.currentContext = action.payload;
        },
        setNamespaces: (state, action) => {
            state.namespaces = action.payload;
        },
        setCurrentNamespace: (state, action) => {
            state.currentNamespace = action.payload;
        },
        setPods: (state, action) => {
            state.pods = action.payload;
        },  
    },
});

export const { setContexts, setCurrentContext, setNamespaces, setCurrentNamespace, setPods } = kubeSlice.actions;

export default kubeSlice.reducer;
