import { DATA_DONATION_URL } from '../custom';

export let baseUrl = DATA_DONATION_URL;
export function donateAnswers(answers: any): Promise<undefined> {
  // Make sure it is ending with a slash
  if (!baseUrl.endsWith('/')) baseUrl = baseUrl + '/';

  // TODO: Encrypt Request #127

  // var someBytes = 'hello world!';
  // var keypair = forge.pki.rsa.generateKeyPair(4096);

  // // generate and encapsulate a 16-byte secret key
  // var kdf1 = new forge.kem.kdf1(forge.md.sha1.create());
  // var kem = forge.kem.rsa.create(kdf1);
  // var result = kem.encrypt(keypair.publicKey, 16); //Alex: increase to 256 bit
  // // result has 'encapsulation' and 'key'

  // // encrypt some bytes
  // var iv = forge.random.getBytesSync(12);
  // var someBytes = 'hello world!';
  // var cipher = forge.cipher.createCipher('AES-GCM', result.key);
  // cipher.start({iv: iv});
  // cipher.update(forge.util.createBuffer(someBytes));
  // cipher.finish();
  // var encrypted = cipher.output.getBytes();
  // var tag = cipher.mode.tag.getBytes() as any;

  // // send 'encrypted', 'iv', 'tag', and result.encapsulation to recipient

  // // decrypt encapsulated 16-byte secret key
  // var kdf1 = new forge.kem.kdf1(forge.md.sha1.create());
  // var kem = forge.kem.rsa.create(kdf1);
  // var key = kem.decrypt(keypair.privateKey, result.encapsulation, 16);

  // // decrypt some bytes
  // var decipher = forge.cipher.createDecipher('AES-GCM', key);
  // decipher.start({iv: iv, tag: tag});
  // decipher.update(forge.util.createBuffer(encrypted));
  // var pass = decipher.finish();
  // // pass is false if there was a failure (eg: authentication tag didn't match)
  // if(pass) {
  //   // outputs 'hello world!'
  //   console.log(decipher.output.getBytes());
  // }

  return fetch(`${baseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answers),
  })
    .then(() => {
      return undefined;
    })
    .catch((err: any) => {
      console.error(err);
    });
}
