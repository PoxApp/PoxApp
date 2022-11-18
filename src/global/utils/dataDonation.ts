import { DATA_DONATION_URL, DATA_DONATION_PUBLIC_KEY } from '../custom';

export let baseUrl = DATA_DONATION_URL;

export let rawPublicKey = DATA_DONATION_PUBLIC_KEY;

// Only use for Development:
// rawPublicKey = `-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1O2IB+zQH01J6MW+ZpyH/lENnr1ny9et
// GHi7H2xvo/l4yeJXIQg0H8rJfp59wxtEL0YnOzB9SFByNEwoDsd7D03PvLOhth6605Yp9Tk2mTxf
// 9YFdXD+voWhjInvl+2X+Ny8OUctdOS1P/3GOBn4+AHBd6QCyMxRUljOx7khzTkWckPafk6Ft9k1W
// zkVso0ID+Yr553g4VOn8UBIYP/61x5GP/WlWvUnKnQw5x+gXEYEBW0uJ5zNqkh/AB851SWsWCoPz
// D2PiHKGrUygRVSzjZa1fJhP+fa/29SxWnH6IiEmrVXHyTYkZ4gVYTLX31cKv6yM9w4BcgCe2Gy65
// vyP63QIDAQAB
// -----END PUBLIC KEY-----`;

// donateAnswers({ test: 'test' }).then((request) => {
//   console.log('send');
// });

export function donateAnswers(answers: any): Promise<undefined> {
  // Make sure it is ending with a slash
  if (!baseUrl.endsWith('/')) baseUrl = baseUrl + '/';

  // If a public key is supplied then encrypt the data with the public key before sending it to the server
  // Because the JSON can get quite big we encrypt the answers with AES before and only encrypt the AES key with the public key.
  // Much Code from https://github.com/diafygi/webcrypto-examples/
  if (rawPublicKey) {
    // Load RSA Key from variable
    importRsaKey(rawPublicKey)
      .then(function (publicKey) {
        // Generate AES key for this data donation.
        window.crypto.subtle
          .generateKey(
            {
              name: 'AES-GCM',
              length: 256,
            },
            true, //whether the key is extractable, used in exportKey
            ['encrypt', 'decrypt']
          )
          .then(function (aesKey) {
            var iv = window.crypto.getRandomValues(new Uint8Array(12));
            var enc = new TextEncoder();

            // Encrypt donated Data
            window.crypto.subtle
              .encrypt(
                {
                  name: 'AES-GCM',
                  //Don't re-use initialization vectors!
                  //Always generate a new iv every time your encrypt!
                  //Recommended to use 12 bytes length
                  iv: iv,
                },
                aesKey,
                enc.encode(JSON.stringify(answers)) // data you want to encrypt
              )
              .then(function (encryptedAnswers) {
                window.crypto.subtle
                  .exportKey('raw', aesKey)
                  .then(function (aesPrivateKey) {
                    // Encrypt AES Key
                    window.crypto.subtle
                      .encrypt(
                        {
                          name: 'RSA-OAEP',
                          //label: Uint8Array([...]) //optional
                        },
                        publicKey, //from generateKey or importKey above
                        aesPrivateKey //ArrayBuffer of data you want to encrypt
                      )
                      .then(function (encryptedAesKey) {
                        // Tie everything together to one JSON Request and send it
                        var answer: any = {
                          encryptedAnswers: base64ArrayBuffer(encryptedAnswers),
                          encryptedKey: base64ArrayBuffer(encryptedAesKey),
                          iv: base64ArrayBuffer(iv),
                          signingKey: rawPublicKey,
                        };
                        sendData(baseUrl, answer);
                      })
                      .catch(function (err) {
                        console.error(err);
                      });
                  })
                  .catch(function (err) {
                    console.error(err);
                  });
              })
              .catch(function (err) {
                console.error(err);
              });
          })
          .catch(function (err) {
            console.error(err);
          });
      })
      .catch(function (err) {
        console.error(err);
      });
  } else {
    // Send data unencrypted
    return sendData(baseUrl, answers);
  }
}

function sendData(baseUrl, data) {
  return fetch(`${baseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(() => {
      return undefined;
    })
    .catch((err: any) => {
      console.error(err);
    });
}

// from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
function importRsaKey(pem) {
  // fetch the part of the PEM string between header and footer
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    'spki', //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

// Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. According to my tests, this appears to be a faster approach:
// http://jsperf.com/encoding-xhr-image-data/5

/*
MIT LICENSE
Copyright 2011 Jon Leighton
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function base64ArrayBuffer(arrayBuffer) {
  var base64 = '';
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  var bytes = new Uint8Array(arrayBuffer);
  var byteLength = bytes.byteLength;
  var byteRemainder = byteLength % 3;
  var mainLength = byteLength - byteRemainder;

  var a, b, c, d;
  var chunk;

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '==';
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }

  return base64;
}
