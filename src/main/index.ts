import { app, BrowserWindow, shell } from 'electron'
import { join } from 'node:path'

// Sin preload ni IPC: todo el aplicativo vive en el renderer.
function crearVentana(): void {
  const ventana = new BrowserWindow({
    width: 1366, height: 800, minWidth: 1024, minHeight: 680,
    show: false, backgroundColor: '#F6F4EF', title: 'Algoritmos de Ordenamiento', autoHideMenuBar: true,
    webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, spellcheck: false }
  })
  ventana.once('ready-to-show', () => {
    ventana.maximize()
    ventana.show()
  })
  // Los enlaces a las fuentes se abren en el navegador; nada más sale de la app.
  ventana.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url)
    return { action: 'deny' }
  })
  ventana.webContents.on('will-navigate', (e) => e.preventDefault())
  if (process.env.ELECTRON_RENDERER_URL) ventana.loadURL(process.env.ELECTRON_RENDERER_URL)
  else ventana.loadFile(join(__dirname, '../renderer/index.html'))
}

app.whenReady().then(crearVentana)
app.on('window-all-closed', () => app.quit())
