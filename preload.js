const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("k8s", {
	send: (channel, data) => {
		// whitelist channels
		let validChannels = ["getContexts", "getNamespaces", "getCurrentContext", "getPods",];
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data);
		}
	},
	receive: (channel, func) => {
		let validChannels = ["receiveContexts", "receiveNamespaces", "receiveCurrentContext", "receivePods"];
		if (validChannels.includes(channel)) {
			// Deliberately strip event as it includes `sender` 
			ipcRenderer.on(channel, (event, ...args) => func(...args));
		}
	},
});