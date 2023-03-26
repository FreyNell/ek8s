const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const k8s = require('@kubernetes/client-node')

function createWindow() {
	// Crear una nueva ventana del navegador
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			// Especificar el archivo de preload para inyectar código en la página web
			preload: path.join(__dirname, 'preload.js'),
		}
	})

	// Cargar la aplicación web
	win.loadURL('http://localhost:3000')
}

// Esperar a que la aplicación esté lista antes de crear la ventana
app.whenReady().then(() => {
	createWindow()

	// Crear una nueva ventana cuando se active la aplicación en macOS
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})

	// Crear una nueva instancia de la configuración de Kubernetes y cargarla desde el archivo de configuración por defecto
	const kc = new k8s.KubeConfig()
	kc.loadFromDefault()

	// Crear una nueva instancia de la API de Kubernetes
	const k8sApi = kc.makeApiClient(k8s.CoreV1Api)

	// Escuchar el evento 'getContexts' desde el archivo de preload
	ipcMain.on('getContexts', async (event, arg) => {
		try {
			// Obtener la lista de contextos de Kubernetes
			const contexts = await kc.getContexts()

			// Enviar la lista de contextos al archivo de preload
			event.reply('receiveContexts', contexts)
		} catch (error) {
			console.error(error)
		}
	})

	// Escuchar el evento 'getNamespaces' desde el archivo de preload
	ipcMain.on('getNamespaces', async (event, arg) => {
		try {
			// Obtener la lista de namespaces de Kubernetes
			const namespaces = await k8sApi.listNamespace();

			// Enviar la lista de namespaces al archivo de preload
			event.reply('receiveNamespaces', namespaces.body.items.map(namespace => namespace.metadata.name));
		} catch (error) {
			console.error(error)
		}
	})

	// Escuchar el evento 'getCurrentContext' desde el archivo de preload
	ipcMain.on('getCurrentContext', async (event, arg) => {
		try {
			// Obtener el contexto actual de Kubernetes
			const currentContext = kc.getCurrentContext();

			// Enviar el contexto actual al archivo de preload
			event.reply('receiveCurrentContext', currentContext);
		} catch (error) {
			console.error(error)
		}
	})

	// Escuchar el evento 'getPods' desde el archivo de preload
	ipcMain.on('getPods', async (event, arg) => {
		try {
			// Obtener la lista de pods de Kubernetes en el namespace especificado
			const pods = await k8sApi.listNamespacedPod(arg);

			// Enviar la lista de pods al archivo de preload
			event.reply('receivePods', pods.body.items);
		} catch (error) {
			console.error(error)
		}
	})
})

// Salir de la aplicación cuando todas las ventanas estén cerradas, a menos que se esté ejecutando en macOS
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
