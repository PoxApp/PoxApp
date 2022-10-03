import {
  Component,
  Event,
  EventEmitter,
  h,
  Prop,
  State,
} from '@stencil/core';
import * as tf from '@tensorflow/tfjs';
//import * as tfnode from '@tensorflow/tfjs-node';

import i18next from 'i18next';
import * as forge from 'node-forge';

@Component({
  tag: 'ai-image-recognizer',
  styleUrl: 'ai-image-recognizer.css',
})
export class AiImageRecognizer {
  @Prop() inputId: string;
  @Event() updateFormData: EventEmitter;
  updateFormDataHandler(key: string, value: object) {
    this.updateFormData.emit({ key, value });
  }

  @State() tookPicture = false;

  _player;
  _canvas;
  _model;
  _videoStream;
  _img_preview;
  _input;

  IMAGE_SIZE = 224;

  async componentWillLoad() {
    

  }

  async componentDidLoad() {
    document.getElementById("upload_button").style.visibility = "hidden";
    tf.loadGraphModel('assets/ai/model.json').then(model => {
      var answer = model.predict(tf.zeros([1, this.IMAGE_SIZE, this.IMAGE_SIZE, 3]));
      console.log(answer)
      this._model = model;
      const status = document.getElementById('status');
      status.textContent = '';
      document.getElementById("upload_button").style.visibility = "visible";
      console.log('model loaded');
    });
  }

  disconnectedCallback(){
  }

  encrypt = async() =>  {
    var someBytes = 'hello world!';

    
    var keypair = forge.pki.rsa.generateKeyPair(4096);
    
    
    // generate and encapsulate a 16-byte secret key
    var kdf1 = new forge.kem.kdf1(forge.md.sha1.create());
    var kem = forge.kem.rsa.create(kdf1);
    var result = kem.encrypt(keypair.publicKey, 16); //Alex: increase to 256 bit
    // result has 'encapsulation' and 'key'
    
    // encrypt some bytes
    var iv = forge.random.getBytesSync(12);
    var someBytes = 'hello world!';
    var cipher = forge.cipher.createCipher('AES-GCM', result.key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(someBytes));
    cipher.finish();
    var encrypted = cipher.output.getBytes();
    var tag = cipher.mode.tag.getBytes() as any;
    
    // send 'encrypted', 'iv', 'tag', and result.encapsulation to recipient
    
    // decrypt encapsulated 16-byte secret key
    var kdf1 = new forge.kem.kdf1(forge.md.sha1.create());
    var kem = forge.kem.rsa.create(kdf1);
    var key = kem.decrypt(keypair.privateKey, result.encapsulation, 16);
    
    // decrypt some bytes
    var decipher = forge.cipher.createDecipher('AES-GCM', key);
    decipher.start({iv: iv, tag: tag});
    decipher.update(forge.util.createBuffer(encrypted));
    var pass = decipher.finish();
    // pass is false if there was a failure (eg: authentication tag didn't match)
    if(pass) {
      // outputs 'hello world!'
      console.log(decipher.output.getBytes());
    }
  }

  predict = async(img2) =>  {
    this.encrypt()

    const img = tf.cast(tf.image.resizeBilinear(tf.browser.fromPixels(img2), [this.IMAGE_SIZE, this.IMAGE_SIZE]), 'float32');
    const batch = tf.expandDims(img, 0);
    var score = this._model.predict(batch).dataSync();
    var confidence = 1 - parseFloat(tf.sigmoid(score).dataSync());
    console.log("confidence: " + confidence);
    console.log("score: " + score);
    this.updateFormDataHandler(this.inputId,{ confidence: confidence });
    img.dispose();
  }



  uploadPicture = async (event: any) => {
    
    if(event.target.files.length >= 1){
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = e => {
        let img = document.createElement('img');
        this._img_preview.src = e.target.result;
        img.src = e.target.result as string;
        //img.width = this.IMAGE_SIZE;
        //img.height = this.IMAGE_SIZE;
        img.onload = () => this.predict(img);
      };
      reader.readAsDataURL(file);
      /*reader.onload = e => {
        var arrayBuffer = new Uint8Array(e.target.result as ArrayBuffer);
        var img = tfnode.node.decodeImage(arrayBuffer);
        this.predict(img);
      };

      reader.readAsArrayBuffer(file);*/
    }
  }

  removePicture = async () => {
    this.tookPicture = false;
    this.updateFormDataHandler(this.inputId, undefined)
  }


  render() {
    return [

      <label id="status">{i18next.t("load_ai")}</label>,
      <label id="upload_button" htmlFor="file-upload" class="file-upload">{i18next.t('upload_picture')}</label>,
      <input ref={el => (this._input = el)} type="file" id="file-upload" accept="image/*" onChange={this.uploadPicture}/>,
      <img ref={el => (this._img_preview = el)} style={{"width" : "100%"}}  />,
        // <canvas ref={el => (this._canvas = el)} width="640" height="640" style={{display: this.tookPicture ? "block" : "none"}}></canvas>,
        // <video ref={el => (this._player = el)} width="640" height="640" autoplay playsinline muted style={{display: this.tookPicture ? "none" : "block"}}></video>,
        //(this.tookPicture ?
        //  <d4l-button
        //  type="button"
        //  classes="button--block answers-table__button"
        //  data-test="removePictureButton"
        //  text={i18next.t('ai_remove_picture')}
          //handleClick={this._input.click()}
        //  />, 
        //  <d4l-button
        //    type="button"
        //    classes="button--block answers-table__button"
        //    data-test="takePictureButton"
        //    text={i18next.t('ai_take_picture')}
        //    handleClick={this.takePicture}
        //  />)
        ];
  }

}
