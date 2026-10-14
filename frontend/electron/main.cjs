const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'HypKraft - AI Video & Motion Graphics Studio',
    icon: path.join(__dirname, '../public/assets/hypkraft_icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    backgroundColor: '#f1f4fb',
    show: false
  });

  // Load Vite Dev Server if running (dev mode), otherwise load packaged dist
  const DEV_URL = process.env.ELECTRON_START_URL || 'http://localhost:5173';
  const PROD_FILE = path.join(__dirname, '../dist/index.html');

  const http = require('http');

  function tryLoadDevServer() {
    return new Promise((resolve) => {
      const req = http.get(DEV_URL, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(1500, () => { req.destroy(); resolve(false); });
    });
  }

  tryLoadDevServer().then((devRunning) => {
    if (devRunning) {
      mainWindow.loadURL(DEV_URL);
    } else {
      mainWindow.loadFile(PROD_FILE).catch(() => {
        mainWindow.loadURL(DEV_URL);
      });
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Native Menu Bar
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu-action', 'new-project')
        },
        {
          label: 'Open Project...',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('menu-action', 'open-project')
        },
        {
          label: 'Save Project',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu-action', 'save-project')
        },
        { type: 'separator' },
        {
          label: 'Import Media...',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow.webContents.send('menu-action', 'import-media')
        },
        {
          label: 'Export Video (FFmpeg)...',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow.webContents.send('menu-action', 'export-video')
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          click: () => mainWindow.webContents.send('menu-action', 'undo')
        },
        {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Y',
          click: () => mainWindow.webContents.send('menu-action', 'redo')
        },
        { type: 'separator' },
        {
          label: 'Split Clip at Playhead',
          accelerator: 'CmdOrCtrl+K',
          click: () => mainWindow.webContents.send('menu-action', 'split-clip')
        },
        {
          label: 'Delete Selected Clip',
          accelerator: 'Delete',
          click: () => mainWindow.webContents.send('menu-action', 'delete-clip')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'AI Models',
      submenu: [
        {
          label: 'Model Hub Settings...',
          accelerator: 'CmdOrCtrl+M',
          click: () => mainWindow.webContents.send('menu-action', 'open-models')
        },
        {
          label: 'Switch to Cloud Models (Gemini/OpenAI/Runway)',
          click: () => mainWindow.webContents.send('menu-action', 'use-cloud-models')
        },
        {
          label: 'Switch to Local Models (Ollama/ComfyUI/AudioCraft)',
          click: () => mainWindow.webContents.send('menu-action', 'use-local-models')
        }
      ]
    },
    {
      label: 'MCP Server',
      submenu: [
        {
          label: 'MCP Server Status: Active (Port 8000 / Stdio)',
          enabled: false
        },
        {
          label: 'Copy MCP Config for Cursor & Claude Desktop',
          click: () => mainWindow.webContents.send('menu-action', 'copy-mcp-config')
        },
        {
          label: 'View Registered MCP Tools',
          click: () => mainWindow.webContents.send('menu-action', 'view-mcp-tools')
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'HypKraft Documentation',
          click: async () => {
            await shell.openExternal('http://localhost:5173');
          }
        },
        {
          label: 'About HypKraft Studio',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About HypKraft',
              message: 'HypKraft Studio v1.0.0',
              detail: 'AI Video and Motion Graphics Non-Linear Editor with Cloud & Local Models orchestration and Model Context Protocol (MCP) integration.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
