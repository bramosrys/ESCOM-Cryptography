import {app, BrowserWindow, ipcMain, dialog, shell} from 'electron'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const math = require('mathjs')
const cryptojs = require('crypto-js')
const crypto = require('crypto')
const bmp = require('bmp-js')
var randomstring = require('randomstring')


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

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    useContentSize: true,
    width: 800,
    icon: path.join(__dirname, '/../renderer/assets/icons/icon.ico')
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
  console.log('Event received to open a plain file selector and emmit the path', configurations)
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
        console.log('data.toString(): ', data.toString('utf8'))
        var encryptedData = cryptojs.AES.encrypt(data.toString('utf8'), configurations.password)
        var encryptedDatabase64 = Buffer.from(encryptedData.toString()).toString('base64')
        //var decryptedBytes = cryptojs.AES.decrypt(encryptedData.toString(),'holamundo')
        //var plainText = decryptedBytes.toString(cryptojs.enc.Utf8)
        var cipheredFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_encrypted.txt'
        fs.writeFile(cipheredFileName, encryptedDatabase64, 'utf8', (err) => {
          if (err) {
            throw  err;
          }
          event.sender.send('p0:fileSelector:plainTextSelected', {
            fileName: fileNames[0],
            contents: data.toString('utf8'),
            cipheredFileName: cipheredFileName,
            cipheredContents: encryptedDatabase64
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
        var decryptedBytes = cryptojs.AES.decrypt(Buffer.from(data.toString(), 'base64').toString('utf8'), configurations.password)
        console.log('decryptedBytes: ', decryptedBytes)
        var plainText = decryptedBytes.toString(cryptojs.enc.Utf8)
        if (plainText === "") {
          event.sender.send('p0:fileSelector:cipheredTextSelected', {
            fileName: fileNames[0],
            contents: data.toString('utf8'),
            decryptedFileName: NA,
            decryptedContents: "Error al leer el archivo"
          })
        } else {
          var decryptedFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_decrypted.txt'
          fs.writeFile(decryptedFileName, plainText, 'utf8', (err) => {
            if (err) {
              throw err
            }
            event.sender.send('p0:fileSelector:cipheredTextSelected', {
              fileName: fileNames[0],
              contents: data.toString('utf8'),
              decryptedFileName: decryptedFileName,
              decryptedContents: plainText
            })
          })
        }
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
          shiftedText.push(String.fromCharCode(alphabet[(_.indexOf(alphabet, removedAccents.charAt(i)) + configurations.shiftNumber) % configurations.alphabetLength].charCodeAt(0) - 32))
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
          shiftedText.push(String.fromCharCode(alphabet[(_.indexOf(alphabet, removedAccents.charAt(i)) + keyToDecrypt) % (configurations.alphabetLength)].charCodeAt(0) + 32))
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
/******* PRACTICE TWO *********/
ipcMain.on('p2:fileSelector:requestedPlainText', (event, configurations) => {
  console.log('Event received to open a plain file selector and emmit the path', configurations)
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
        var rejected = false
        var removedAccents = data.toString('utf8').normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\r?\n|\r/g, '').replace(/\s/g, '').replace(/[^A-Za-z]/g, '')
        var alphabet = []
        var shiftedText = []
        //AlphabetRange must be a string like this 'a-z'
        for (var i = configurations.alphabetRange.charCodeAt(0); i <= configurations.alphabetRange.charCodeAt(2); i++) {
          alphabet.push(String.fromCharCode(i))
        }
        var alpha = configurations.alphaNumber
        var beta = configurations.betaNumber
        for (i = 0; i < removedAccents.length; i++) {
          let indexOfChar = _.indexOf(alphabet, removedAccents.charAt(i))
          if (indexOfChar === -1) {
            rejected = true
            event.sender.send('p2:fileSelector:plainTextSelected', {
              fileName: fileNames[0],
              contents: data.toString('utf8'),
              cipheredFileName: "NA",
              cipheredContents: "Error, one or more characters doesn't belong to the alphabet: " + removedAccents.charAt(i),
              rejected: rejected
            })
            break
          }
          let cFormula = (alpha * indexOfChar + beta) % configurations.alphabetLength
          let charCiphered = String.fromCharCode(alphabet[cFormula].charCodeAt(0) - 32)
          shiftedText.push(charCiphered)
        }
        if (!rejected) {
          var cipheredFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_encrypted.txt'
          fs.writeFile(cipheredFileName, shiftedText.join('').toString('utf8'), 'utf8', (err) => {
            if (err) {
              throw  err;
            }
            event.sender.send('p2:fileSelector:plainTextSelected', {
              fileName: fileNames[0],
              contents: data.toString('utf8'),
              cipheredFileName: cipheredFileName,
              cipheredContents: shiftedText.join('').toString('utf8')
            })
          })
        }

      })
    }
  })
})
ipcMain.on('p2:fileSelector:requestedEncryptedText', (event, configurations) => {
  console.log('Event received to open a file selector and emmit the decrypted path', configurations)
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
        var rejected = false
        var removedAccents = data.toString('utf8').normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\r?\n|\r/g, '').replace(/\s/g, '').replace(/[^A-Za-z]/g, '')
        var alphabet = []
        var shiftedText = []
        var coprimesWithAlpha = []
        var multiplicativeInverseIndex = []
        var availableMultiplicativeInverse = []
        //AlphabetRange must be a string like this 'a-z'
        for (var i = configurations.alphabetRange.charCodeAt(0); i <= configurations.alphabetRange.charCodeAt(2); i++) {
          alphabet.push(String.fromCharCode(i - 32))
        }
        console.log('alphabet: ', alphabet)
        //Check if numbers are coprimes using the GCD formula
        for (var i = 1; i < configurations.alphabetLength; i++) {
          if (math.gcd(configurations.alphabetLength, i) === 1) {
            coprimesWithAlpha.push(i)
            availableMultiplicativeInverse.push(i)
          }
        }
        //Iterate with every coprime and find the inverse multiplicative for each number in the array
        for (var i = 0; i < coprimesWithAlpha.length; i++) {
          let j = 0
          while (availableMultiplicativeInverse.length > 0 && j < configurations.alphabetLength) {
            if ((coprimesWithAlpha[i] * availableMultiplicativeInverse[j]) % configurations.alphabetLength === 1) {
              let multiplicativeInverseElement = {}
              multiplicativeInverseElement.number = coprimesWithAlpha[i]
              multiplicativeInverseElement.multiplicativeInverse = availableMultiplicativeInverse[j]
              multiplicativeInverseIndex.push(multiplicativeInverseElement)
              multiplicativeInverseElement = {}
              multiplicativeInverseElement.number = availableMultiplicativeInverse[j]
              multiplicativeInverseElement.multiplicativeInverse = coprimesWithAlpha[i]
              multiplicativeInverseIndex.push(multiplicativeInverseElement)
              availableMultiplicativeInverse.splice(availableMultiplicativeInverse.indexOf(availableMultiplicativeInverse[j]), 1)
              break
            }
            j++
          }
        }
        var multiplicativeInverseIndex = _.sortBy(_.uniqBy(multiplicativeInverseIndex, 'number'), 'number')
        console.log(_.sortBy(_.uniqBy(multiplicativeInverseIndex, 'number'), 'number'))
        var alpha = configurations.alphaNumber
        var beta = configurations.betaNumber
        var inverseAlpha = _.find(multiplicativeInverseIndex, {number: alpha}).multiplicativeInverse
        var inverseBeta = configurations.alphabetLength - beta
        for (i = 0; i < removedAccents.length; i++) {
          let indexOfChar = _.indexOf(alphabet, removedAccents.charAt(i))
          if (indexOfChar === -1) {
            rejected = true
            event.sender.send('p2:fileSelector:cipheredTextSelected', {
              fileName: fileNames[0],
              contents: data.toString('utf8'),
              decryptedFileName: "NA",
              decryptedContents: "Error, one or more characters doesn't belong to the alphabet: " + removedAccents.charAt(i),
              rejected: rejected
            })
            break
          }
          let cFormula = inverseAlpha * (indexOfChar + inverseBeta) % configurations.alphabetLength
          let charCiphered = String.fromCharCode(alphabet[cFormula].charCodeAt(0) + 32)
          shiftedText.push(charCiphered)
        }
        if (!rejected) {
          var decryptedFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_decrypted.txt'
          fs.writeFile(decryptedFileName, shiftedText.join('').toString('utf8'), 'utf8', (err) => {
            if (err) {
              throw err
            }
            event.sender.send('p2:fileSelector:cipheredTextSelected', {
              fileName: fileNames[0],
              contents: data.toString('utf8'),
              decryptedFileName: decryptedFileName,
              decryptedContents: shiftedText.join('').toString('utf8')
            })
          })
        }

      })
    }
  })
})
/**************************** PRACTICE FOUR *********************************/
ipcMain.on('p4:fileSelector:requestedPlainImage', (event, configurations) => {
  console.log('Event received to open a file selector and emmit the encrypted path', configurations)
  dialog.showOpenDialog(mainWindow, {
    title: "Select the plain image",
    filters: [{name: 'Bitmap files', extensions: ['bmp']}],
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
        var bmpLib = bmp.decode(data)
        console.log('index - bmpLib - 399 - bmpLib: ', bmpLib)
        var bmpHeader = data.toString('hex', 0, 54)
        var bmpImageData = data.toString('hex', 54)
        var cipher = crypto.createCipher(configurations.algorithm.text, configurations.password)
        var encrypted = Buffer.concat([cipher.update(new Buffer(bmpImageData, 'hex')), cipher.final()]).toString('hex')
        var encryptedFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_encrypted' + configurations.algorithm.text + '.bmp'
        fs.writeFile(encryptedFileName, bmpHeader + encrypted, 'hex', (err) => {
          if (err) {
            throw  err;
          }
          dialog.showMessageBox(mainWindow,
            {
              title: 'Encryption done',
              type: 'info',
              message: 'The file was encrypted correctly',
              buttons: ["Ok,thanks!"]
            })
          shell.openItem(encryptedFileName)
          event.sender.send('p4:fileSelector:plainImageSelected', {
            fileName: fileNames[0],
            cipheredFileName: encryptedFileName,
          })
        })

      })
    }
  })
})
ipcMain.on('p4:fileSelector:requestedEncryptedImage', (event, configurations) => {
  console.log('Event received to open a file selector and emmit the decrypted path', configurations)
  dialog.showOpenDialog(mainWindow, {
    title: "Select the encrypted image",
    filters: [{name: 'Bitmap files', extensions: ['bmp']}],
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
        var bmpHeader = data.toString('hex', 0, 54)
        var bmpImageData = data.toString('hex', 54)
        try {
          var cipher = crypto.createDecipher(configurations.algorithm.text, configurations.password)
          var encrypted = Buffer.concat([cipher.update(new Buffer(bmpImageData, 'hex')), cipher.final()]).toString('hex')
        } catch (e) {
          console.log(e)
          dialog.showErrorBox('Wrong password or algorithm', 'The password its wrong or the algorithm its no the original used at encryption, please retry')
          return
        }
        var decryptedFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_decrypted' + configurations.algorithm.text + '.bmp'
        fs.writeFile(decryptedFileName, bmpHeader + encrypted, 'hex', (err) => {
          if (err) {
            throw  err;
          }
          dialog.showMessageBox(mainWindow,
            {
              title: 'Decryption done',
              type: 'info',
              message: 'The file was decrypted correctly',
              buttons: ["Ok,thanks!"]
            })
          shell.openItem(decryptedFileName)
          event.sender.send('p4:fileSelector:encryptedImageSelected', {
            fileName: fileNames[0],
            decryptedFileName: decryptedFileName,
          })
        })

      })
    }
  })
})
/**************************** PRACTICE FIVE *********************************/
ipcMain.on('p5:fileSelector:requestPlainTextFile', (event, configurations) => {
  console.log('Event received to open a file selector and emmit the encrypted path', configurations)
  dialog.showOpenDialog(mainWindow, {
    title: "Select the plain text file",
    filters: [{name: 'Text files', extensions: ['txt']}],
    properties: ['openFile']
  }, (fileNames) => {
    if (fileNames) {
      fs.readFile(fileNames[0].toString(), (err, plainTextData) => {
        if (err) {
          throw err;
        }
        dialog.showOpenDialog(mainWindow, {
          title: "Select the key file",
          filters: [{name: 'PEM files', extensions: ['pem']}],
          properties: ['openFile']
        }, (keyFile) => {
          if (keyFile) {
            try {
              fs.readFile(keyFile[0].toString(), (err, keyData) => {
                var key = keyData.toString()
                var encrypted = null
                if (configurations.keyType === 'Public') {
                  try {
                    console.log('Cifrando con llave pública - : ')
                    encrypted = crypto.publicEncrypt(key, plainTextData);
                  } catch (e) {
                    console.log(e)
                    dialog.showErrorBox('Something bad happened', 'There was an error trying to encrypt the data. \n Error: ' + e)
                    return
                  }
                } else {
                  try {
                    console.log('Cifrando con llave privada - : ')
                    encrypted = crypto.privateEncrypt(key, plainTextData)
                  } catch (e) {
                    console.log(e)
                    dialog.showErrorBox('Something bad happened', 'There was an error trying to decrypt the data. \n Error: ' + e)
                    return
                  }
                }
                console.log('encrypted data: ', encrypted)
                console.log('encrypted contents - encryptedTextData.toString: ', encrypted.toString())
                var encryptedFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_encrypted' + '.txt'
                fs.writeFile(encryptedFileName, encrypted, 'utf8', (err) => {
                  if (err) {
                    throw  err;
                  }
                  dialog.showMessageBox(mainWindow,
                    {
                      title: 'Encryption done',
                      type: 'info',
                      message: 'The file was encrypted correctly',
                      buttons: ["Ok,thanks!"]
                    })
                  shell.openItem(encryptedFileName)
                  event.sender.send('p5:fileSelector:plainTextSelected', {
                    fileName: fileNames[0],
                    encryptedFileName,
                  })
                })
              })
            } catch (e) {
              console.log(e)
              dialog.showErrorBox('Something bad happened', 'There was an error trying to encrypt the data. \n Error: ' + e)
            }
          }
        })
      })
    }
  })
})
ipcMain.on('p5:fileSelector:requestEncryptedFile', (event, configurations) => {
  console.log('Event received to open a file selector and emmit the decrypted path', configurations)
  dialog.showOpenDialog(mainWindow, {
    title: "Select the encrypted text file",
    filters: [{name: 'Text files', extensions: ['txt']}],
    properties: ['openFile']
  }, (fileNames) => {
    if (fileNames) {
      fs.readFile(fileNames[0].toString(), (err, encryptedTextData) => {
        if (err) {
          throw err;
        }
        dialog.showOpenDialog(mainWindow, {
          title: "Select the key file",
          filters: [{name: 'PEM files', extensions: ['pem']}],
          properties: ['openFile']
        }, (keyFile) => {
          if (keyFile) {
            try {
              fs.readFile(keyFile[0].toString(), (err, keyData) => {
                var key = keyData.toString()
                if (configurations.keyType === 'Public') {
                  try {
                    console.log('Descifrando con llave pública - : ')
                    var decrypted = crypto.publicDecrypt(key, encryptedTextData);
                  } catch (e) {
                    console.log(e)
                    dialog.showErrorBox('Something bad happened', 'There was an error trying to decrypt the data. \n Error: ' + e)
                    return
                  }
                } else {
                  try {
                    console.log('Descifrando con llave privada - : ')
                    var decrypted = crypto.privateDecrypt(key, encryptedTextData)
                  } catch (e) {
                    console.log(e)
                    dialog.showErrorBox('Something bad happened', 'There was an error trying to decrypt the data. \n Error: ' + e)
                    return
                  }
                }
                console.log('decrypted data: ', decrypted)
                console.log('decrypted contents - encryptedTextData.toString: ', decrypted.toString())
                var decryptedFileName = path.parse(fileNames[0]).dir + '/' + path.parse(fileNames[0]).name + '_decrypted' + '.txt'
                fs.writeFile(decryptedFileName, decrypted, 'utf8', (err) => {
                  if (err) {
                    throw  err;
                  }
                  dialog.showMessageBox(mainWindow,
                    {
                      title: 'Decryption done',
                      type: 'info',
                      message: 'The file was decrypted correctly',
                      buttons: ["Ok,thanks!"]
                    })
                  shell.openItem(decryptedFileName)
                  event.sender.send('p5:fileSelector:encryptedTextSelected', {
                    fileName: fileNames[0],
                    decryptedFileName,
                  })
                })
              })
            } catch (e) {
              console.log(e)
              dialog.showErrorBox('Something bad happened', 'There was an error trying to decrypt the data. \n Error: ' + e)
            }
          }
        })
      })
    }
  })
})
/**************************** PRACTICE SIX *********************************/
ipcMain.on('p6:fileSelector:requestPlainTextFile', (event, configurations) => {
  console.log('Event received to open a file selector and emmit the encrypted path', configurations)
  readTextFile('Plain Text', (err, plainTextFile, plainTextData) => {
    readRSAKeyFile('Public', (err, publicKeyFile, publicKeyData) => {
      readRSAKeyFile('Private', (err, privateKeyFile, privateKeyData) => {
        hashFile(plainTextFile, privateKeyData, (err, encryptedSign) => {
          /*Encrypt the file contents with AES*/
          try {
            console.log('Cifrando el archivo con AES 256')
            let encryptionKey = randomstring.generate({length: 32, charset: 'alphabetic'})
            encryptAES256(encryptionKey, plainTextData.toString(), (encryptedObject) => {
              console.log('El mensaje cifrado con aes 256: ', encryptedObject, 'La llave usada: ' + encryptionKey)
              /*Encrypt the AES key used*/
              encryptAESKey(publicKeyData, encryptionKey, (encryptedKeyAES) => {
                /*Concatenate the message with it's sign*/
                let encryptedAndSignedMessageObj = {
                  message: encryptedObject,
                  sign: encryptedSign,
                  messageKey: encryptedKeyAES
                }
                let encryptedAndSignedMessage = JSON.stringify(encryptedAndSignedMessageObj, null, 2)
                let encryptedFileName = path.parse(plainTextFile).dir + '/' + path.parse(plainTextFile).name + '_encrypted' + '.txt'
                writeFile(encryptedFileName, encryptedAndSignedMessage, () => {
                  event.sender.send('p6:fileSelector:plainTextSelected', {
                    fileName: plainTextFile,
                    encryptedFileName,
                  })
                  dialog.showMessageBox(mainWindow,
                    {
                      title: 'Encryption done',
                      type: 'info',
                      message: 'The file was encrypted correctly',
                      buttons: ["Ok,thanks!"]
                    })
                  shell.openItem(encryptedFileName)
                })
              })
            })
          } catch (e) {
            console.log(e)
            dialog.showErrorBox('Something bad happened', 'There was an error trying to encrypt the message with AES. \n Error: ' + e)
          }
        })
      })
    })
  })
})

ipcMain.on('p6:fileSelector:requestEncryptedFile', (event, configurations) => {
  console.log('Event received to open a file selector and emmit the decrypted path', configurations)
  readTextFile('Encrypted Text', (err, encryptedTextFile, encryptedTextData) => {
    readRSAKeyFile('Public', (err, publicKeyFile, publicKeyData) => {
      readRSAKeyFile('Private', (err, privateKeyFile, privateKeyData) => {
        /*Parse the JSON message*/
        let parsedEncryptedFile = JSON.parse(encryptedTextData)
        /*Decrypt the message key*/
        decryptAESKey(privateKeyData,new Buffer(parsedEncryptedFile.messageKey),(decryptedAESKey)=>{
          console.log('Decrypted Aes KEY - decryptedAESKey: ',decryptedAESKey)
          /*Decrypt the message contents*/
          decryptAES256(decryptedAESKey,parsedEncryptedFile.message,(decryptedContents)=>{
            console.log('El mensaje descifrado es - decryptedContents: ',decryptedContents)
            /*Decrypt the sign*/
            decryptSign(parsedEncryptedFile.sign,publicKeyData,(decryptedSign)=>{
              console.log('La firma descifrada es - decryptedSign: ',decryptedSign.toString('hex'))
              /*Hash the message and compare with decrypted sign*/
              var messageHash = crypto.createHash('sha512').update(decryptedContents).digest('hex')
              console.log('El digesto del mensaje es - messageHash: ',messageHash)
              /*If digest and decrypted sign are equals then the message it's valid*/
              if(decryptedSign.toString('hex') === messageHash){
                let decryptedAndSignedObj = {
                  message: decryptedContents.trim(),
                  sign: decryptedSign.toString('hex'),
                  messageKey: decryptedAESKey.toString('hex')
                }
                let decryptedAndSignedObjMsg = JSON.stringify(decryptedAndSignedObj, null, 2)
                let decryptedFileName = path.parse(encryptedTextFile).dir + '/' + path.parse(encryptedTextFile).name + '_decrypted' + '.txt'
                writeFile(decryptedFileName,decryptedAndSignedObjMsg,()=>{
                  event.sender.send('p6:fileSelector:encryptedTextSelected', {
                    fileName: encryptedTextFile,
                    decryptedFileName,
                  })
                  dialog.showMessageBox(mainWindow,
                    {
                      title: 'Decryption done',
                      type: 'info',
                      message: 'The file was decrypted correctly',
                      buttons: ["Ok,thanks!"]
                    })
                  shell.openItem(decryptedFileName)
                })
              }else{
                dialog.showMessageBox(mainWindow,
                  {
                    title: 'Decryption failed',
                    type: 'error',
                    message: 'The file signature doesnt match, be careful, there may be somebody pretending to be who you expect',
                    buttons: ["Ok,thanks!"]
                  })
              }
            })
          })
        })
      })
    })
  })
})


/****** Encryption functions****************/
function encryptAES256 (encryptionKey, text, callback) {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(encryptionKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  let message = {
    iv: iv.toString('hex'),
    contents: encrypted.toString('hex')
  }
  callback(message)
}

function decryptAES256 (encryptionKey, encryptedMessage, callback) {
  try{
    let iv = new Buffer(encryptedMessage.iv,'hex')
    let encryptedText = new Buffer(encryptedMessage.contents,'hex')
    let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(encryptionKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    callback(decrypted.toString('utf8'))
  }catch (e) {
    console.log(e)
    dialog.showErrorBox('Something bad happened', 'There was an error trying to decrypt the message with AES. \n Error: ' + e)
  }
}

function readTextFile (fileType, callback) {
  dialog.showOpenDialog(mainWindow, {
    title: 'Select the ' + fileType + ' text file',
    filters: [{name: 'Text files', extensions: ['txt']}],
    properties: ['openFile']
  }, (fileNames) => {
    if (fileNames) {
      try {
        fs.readFile(fileNames[0].toString(), (err, plainTextData) => {
          if (err) {
            callback(err, null, null);
            throw err;
          }
          callback(null, fileNames[0].toString(), plainTextData)
        })
      } catch (e) {
        console.log(e)
        dialog.showErrorBox('Something bad happened', 'There was an error trying to open the text file. \n Error: ' + e)
      }
    }
  })
}

function readRSAKeyFile (keyType, callback) {
  dialog.showOpenDialog(mainWindow, {
    title: 'Select the ' + keyType + ' key file',
    filters: [{name: 'PEM files', extensions: ['pem']}],
    properties: ['openFile']
  }, (key) => {
    if (key) {
      try {
        fs.readFile(key[0].toString(), (err, keyData) => {
          if (err) {
            callback(err, null, null);
            throw err;
          }
          callback(null, key[0].toString(), keyData)
        })
      } catch (e) {
        console.log(e)
        dialog.showErrorBox('Something bad happened', 'There was an error trying to open the key file. \n Error: ' + e)
      }
    }
  })
}

function hashFile (filePath, privateKey, callback) {
  try {
    let digest = null
    let encryptedDigest = null
    const hash = crypto.createHash('sha512');
    const input = fs.createReadStream(filePath);
    input.on('readable', () => {
      const data = input.read();
      if (data)
        hash.update(data);
      else {
        digest = hash.digest()
        console.log('El digesto del mensaje es: ', digest.toString('hex'))
      }
    })
    input.on('close', () => {
      /*Encrypt the digest with RSA Private key*/
      try {
        encryptedDigest = crypto.privateEncrypt(privateKey, digest);
        //console.log('encrypted digest: ', encryptedDigest)
        callback(null, encryptedDigest,digest)
      } catch (e) {
        console.log(e)
        dialog.showErrorBox('Something bad happened', 'There was an error trying to encrypt the digest with RSA Private key. \n Error: ' + e)
      }
    })
  } catch (e) {
    console.log(e)
    dialog.showErrorBox('Something bad happened', 'There was an error trying to hash the data. \n Error: ' + e)
  }
}

function decryptSign(sign,publicKey,callback){
  let decryptedSignAes
  /*Encrypt the AES key with RSA public key*/
  try {
    decryptedSignAes = crypto.publicDecrypt(publicKey, new Buffer(sign))
    callback(decryptedSignAes)
  } catch (e) {
    console.log(e)
    dialog.showErrorBox('Something bad happened', 'There was an error trying to decrypt the AES key with private key RSA. \n Error: ' + e)
  }
}

function encryptAESKey (publicKey, password, callback) {
  let encryptedKeyAES
  /*Encrypt the AES key with RSA public key*/
  try {
    encryptedKeyAES = crypto.publicEncrypt(publicKey, new Buffer(password));
    callback(encryptedKeyAES)
  } catch (e) {
    console.log(e)
    dialog.showErrorBox('Something bad happened', 'There was an error trying to encrypt the AES key with public key RSA. \n Error: ' + e)
  }
}

function decryptAESKey (privateKey, encryptedPassword, callback) {
  let decryptedKeyAes
  /*Encrypt the AES key with RSA public key*/
  try {
    decryptedKeyAes = crypto.privateDecrypt(privateKey, new Buffer(encryptedPassword))
    callback(decryptedKeyAes)
  } catch (e) {
    console.log(e)
    dialog.showErrorBox('Something bad happened', 'There was an error trying to decrypt the AES key with private key RSA. \n Error: ' + e)
  }
}

function writeFile (filePath, data, callback) {
  console.log('filePath - filePath: ', filePath)
  console.log('data to write - data: ', data)
  fs.writeFile(filePath, data, 'utf8', (err) => {
    if (err) {
      throw  err;
    }
    callback();
  })
}

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
