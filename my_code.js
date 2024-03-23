const { app, BrowserWindow } = require('electron')
const puppeteer = require('puppeteer');
const fs = require('fs');


app.on('ready', () => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win = new BrowserWindow({ show: !!argv.debug,
     })
    if (argv.debug) win.webContents.openDevTools()
    // win.webContents.openDevTools()
    // and load the index.html of the app.
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
});

// Async function to run Puppeteer script

// (async () => {
//     // Launch the browser and open a new blank page
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
  
//     // Navigate the page to a URL
//     await page.goto(`file://${__dirname}/index.html`);    
  
//     // Set screen size
//     await page.setViewport({width: 1080, height: 1024});
  
//     // Take a screenshot of the page
//     // await page.screenshot({path: 'dupa.png'});


  
//     // await browser.close();
//   })();