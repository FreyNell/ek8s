import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem } from '@mui/material';
import { KubernetesClient } from './kubernetes-client';

function App() {
  const [contexts, setContexts] = useState([]);
  const [currentContext, setCurrentContext] = useState('');
  const [namespaces, setNamespaces] = useState([]);
  const [currentNamespace, setCurrentNamespace] = useState('');
  const [pods, setPods] = useState([]);

  useEffect(() => {
    const client = new KubernetesClient();

    // Get available contexts
    client.getContexts().then((contexts) => {
      setContexts(contexts);
      setCurrentContext(contexts[0]);
    });

    // Get namespaces for current context
    client.getNamespaces(currentContext).then((namespaces) => {
      setNamespaces(namespaces);
      setCurrentNamespace(namespaces[0]);
    });
  }, []);

  useEffect(() => {
    const client = new KubernetesClient();

    // Get namespaces for current context
    client.getNamespaces(currentContext).then((namespaces) => {
      setNamespaces(namespaces);
      setCurrentNamespace(namespaces[0]);
    });

    // Get pods for current context and namespace
    client.getPods(currentContext, currentNamespace).then((pods) => {
      setPods(pods);
    });
  }, [currentContext]);

  useEffect(() => {
    const client = new KubernetesClient();

    // Get pods for current context and namespace
    client.getPods(currentContext, currentNamespace).then((pods) => {
      setPods(pods);
    });
  }, [currentNamespace]);

  const handleContextChange = (event) => {
    setCurrentContext(event.target.value);
  };

  const handleNamespaceChange = (event) => {
    setCurrentNamespace(event.target.value);
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
          {pods.map((pod) => (
            <TableRow key={pod.metadata.uid}>
              <TableCell>{pod.metadata.name}</TableCell>
              <TableCell>{`${pod.status.readyReplicas || 0}/${pod.spec.replicas}`}</TableCell>
              <TableCell>{pod.status.phase}</TableCell>
              <TableCell>{pod.status.containerStatuses[0].restartCount}</TableCell>
              <TableCell>{new Date(pod.metadata.creationTimestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default App;
