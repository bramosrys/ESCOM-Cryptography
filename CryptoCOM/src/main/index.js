import {app, BrowserWindow, ipcMain, dialog} from 'electron'

var fs = require('fs')
var path = require('path')
var _ = require('lodash')


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 900,
        useContentSize: true,
        width: 800
    })

    mainWindow.loadURL(winURL)
    mainWindow.maximize()

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
/************* PRACTICE ZERO ***************/
ipcMain.on('p0:fileSelector:requestedPlainText', (event, configurations) => {
    console.log('Event received to open a plain file selector and emmit the path')
    dialog.showOpenDialog(mainWindow, {
        title: "Select the plain text file",
        filters: [{name: 'Text files', extensions: ['txt']}],
        properties: ['openFile']
    }, (fileNames) => {
        if (fileNames === undefined) {
            console.log("No file selected")
            return
        }
        if (fileNames) {
            fs.readFile(fileNames[0].toString(), (err, data) => {
                if (err) {
                    throw err;
                }
                fs.writeFile(cipheredFileName, shiftedText.join('').toString('utf8'), 'utf8', (err) => {
                    if (err) {
                        throw  err;
                    }
                    event.sender.send('p0:fileSelector:plainTextSelected', {
                        fileName: fileNames[0],
                        contents: data.toString('utf8'),
                        cipheredFileName: cipheredFileName,
                        cipheredContents: shiftedText.join('').toString('utf8')
                    })
                })
            })
        }
    })
})
ipcMain.on('p0:fileSelector:requestedEncryptedText', (event, configurations) => {
    console.log('Event received to open a file selector and emmit the decrypted path')
    dialog.showOpenDialog(mainWindow, {
        title: "Select the encrypted text file",
        filters: [{name: 'Text files', extensions: ['txt']}],
        properties: ['openFile']
    }, (fileNames) => {
        if (fileNames === undefined) {
            console.log("No file selected")
            return
        }
        if (fileNames) {
            fs.readFile(fileNames[0].toString(), (err, data) => {
                if (err) {
                    throw err;
                }
                fs.writeFile(decryptedFileName, shiftedText.join('').toString('utf8'), 'utf8', (err) => {
                    if (err) {
                        throw err
                    }
                    event.sender.send('p0:fileSelector:cipheredTextSelected', {
                        fileName: fileNames[0],
                        contents: data.toString('utf8'),
                        decryptedFileName: decryptedFileName,
                        decryptedContents: shiftedText.join('').toString('utf8')
                    })
                })
            })
        }
    })
})

/****** PRACTICE ONE ************/
ipcMain.on('fileSelector:requestedPlainText', (event, configurations) => {
    console.log('Event received to open a plain file selector and emmit the path')
    dialog.showOpenDialog(mainWindow, {
        title: "Select the plain text file",
        filters: [{name: 'Text files', extensions: ['txt']}],
        properties: ['openFile']
    }, (fileNames) => {
        if (fileNames === undefined) {
            console.log("No file selected")
            return
        }
        if (fileNames) {
            fs.readFile(fileNames[0].toString(), (err, data) => {
                if (err) {
                    throw err;
                }
                var removedAccents = data.toString('utf8').normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\r?\n|\r/g, '').replace(/\s/g, '').replace(/[^A-Za-z]/g, '')
                var alphabet = [];
                for (var i = 97; i < 123; i++) {
                    alphabet.push(String.fromCharCode(i))
                }
                var shiftedText = [];
                for (var i = 0; i < removedAccents.length; i++) {
                    shiftedText.push(String.fromCharCode(alphabet[(_.indexOf(alphabet, removedAccents.charAt(i)) + configurations.shiftNumber) % configurations.alphabetLength].charCodeAt(0)-32))
                }
                var cipheredFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_encrypted.txt'
                fs.writeFile(cipheredFileName, shiftedText.join('').toString('utf8'), 'utf8', (err) => {
                    if (err) {
                        throw  err;
                    }
                    event.sender.send('fileSelector:plainTextSelected', {
                        fileName: fileNames[0],
                        contents: data.toString('utf8'),
                        cipheredFileName: cipheredFileName,
                        cipheredContents: shiftedText.join('').toString('utf8')
                    })
                })
            })
        }
    })
})
ipcMain.on('fileSelector:requestedEncryptedText', (event, configurations) => {
    console.log('Event received to open a file selector and emmit the decrypted path')
    dialog.showOpenDialog(mainWindow, {
        title: "Select the encrypted text file",
        filters: [{name: 'Text files', extensions: ['txt']}],
        properties: ['openFile']
    }, (fileNames) => {
        if (fileNames === undefined) {
            console.log("No file selected")
            return
        }
        if (fileNames) {
            fs.readFile(fileNames[0].toString(), (err, data) => {
                if (err) {
                    throw err;
                }
                var removedAccents = data.toString('utf8').normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\r?\n|\r/g, '').replace(/\s/g, '').replace(/[^A-Za-z]/g, '')
                var alphabet = [];
                for (var i = 65; i < 91; i++) {
                    alphabet.push(String.fromCharCode(i))
                }
                var shiftedText = [];
                var keyToDecrypt = configurations.alphabetLength - configurations.shiftNumber;
                for (var i = 0; i < removedAccents.length; i++) {
                    shiftedText.push(String.fromCharCode(alphabet[(_.indexOf(alphabet, removedAccents.charAt(i)) + keyToDecrypt) % (configurations.alphabetLength)].charCodeAt(0)+32))
                }
                var decryptedFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_decrypted.txt'
                fs.writeFile(decryptedFileName, shiftedText.join('').toString('utf8'), 'utf8', (err) => {
                    if (err) {
                        throw err
                    }
                    event.sender.send('fileSelector:cipheredTextSelected', {
                        fileName: fileNames[0],
                        contents: data.toString('utf8'),
                        decryptedFileName: decryptedFileName,
                        decryptedContents: shiftedText.join('').toString('utf8')
                    })
                })
            })
        }
    })
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
