import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem } from '@mui/material';
import { KubernetesClient } from './kubernetes-client';
import { setContexts, setCurrentContext, setNamespaces, setCurrentNamespace, setPods } from './store/kubeSlice';

function App() {
  const dispatch = useDispatch();
  const { contexts, currentContext, namespaces, currentNamespace, pods } = useSelector((state) => state.kube);

  useEffect(() => {
    const client = new KubernetesClient();

    // Get available contexts
    client.getContexts().then((contexts) => {
      dispatch(setContexts(contexts));
      dispatch(setCurrentContext(contexts[0]));
    });
  }, [dispatch]);

  useEffect(() => {
    const client = new KubernetesClient();

    // Get namespaces for current context
    client.getNamespaces(currentContext).then((namespaces) => {
      dispatch(setNamespaces(namespaces));
      dispatch(setCurrentNamespace(namespaces[0]));
    });
  }, [currentContext, dispatch]);

  useEffect(() => {
    const client = new KubernetesClient();

    // Get pods for current context and namespace
    client.getPods(currentContext, currentNamespace).then((pods) => {
      dispatch(setPods(pods));
    });
  }, [currentContext, currentNamespace, dispatch]);

  const handleContextChange = (event) => {
    dispatch(setCurrentContext(event.target.value));
  };

  const handleNamespaceChange = (event) => {
    dispatch(setCurrentNamespace(event.target.value));
  };

  return (
    <div>
      <h1>Kubernetes Pods</h1>
      <div>
        <Select value={currentContext} onChange={handleContextChange}>
          {contexts.map((context) => (
            <MenuItem key={context} value={context}>
              {context.name}
            </MenuItem>
          ))}
        </Select>
        <Select value={currentNamespace} onChange={handleNamespaceChange}>
          {namespaces.map((namespace) => (
            <MenuItem key={namespace} value={namespace}>
              {namespace}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Ready</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Restarts</TableCell>
            <TableCell>Age</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pods.map((pod) => {
            return (
              <TableRow key={pod.metadata.uid}>
                <TableCell>{pod.metadata.name}</TableCell>
                <TableCell>{`${pod.status.containerStatuses.reduce((total, currentValue, currentIndex, arr) => currentValue.ready ? 1 : 0, 0)}/${pod.status.containerStatuses.length}`}</TableCell>
                <TableCell>{pod.status.phase}</TableCell>
                <TableCell>{pod.status.containerStatuses[0].restartCount}</TableCell>
                <TableCell>{new Date(pod.metadata.creationTimestamp).toLocaleString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default App;
