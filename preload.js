const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('k8s', {
	getContexts: () => ipcRenderer.send('getContexts',''),
	getNamespaces: () => ipcRenderer.send('getNamespaces',''),
	receiveContexts: (callback) => ipcRenderer.on('receiveContexts',callback),

})
