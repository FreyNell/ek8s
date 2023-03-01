const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const k8s = require('@kubernetes/client-node')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
		preload: path.join(__dirname, 'preload.js'),
	}
  })

  win.loadURL('http://localhost:3000')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  }) 

	const kc = new k8s.KubeConfig()
	kc.loadFromDefault()
	
	const k8sApi = kc.makeApiClient(k8s.CoreV1Api)

	ipcMain.on('getContexts',(event,arg)=>{
		console.log('getContexts called')
		event.reply('receiveContexts',kc.getContexts())
	})
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
