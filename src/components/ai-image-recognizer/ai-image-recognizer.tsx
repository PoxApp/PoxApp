import {
  Component,
  Event,
  EventEmitter,
  h,
  Prop,
  State,
} from '@stencil/core';
import * as tf from '@tensorflow/tfjs';
import i18next from '../../global/utils/i18n';

const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;

@Component({
  tag: 'ai-image-recognizer',
  styleUrl: 'ai-image-recognizer.css',
  shadow: true,
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


  componentWillLoad() {
    tf.loadLayersModel('assets/ai/model.json').then(model => {
      this._model = model;
      console.log('model loaded');
    });
  }

  async componentDidLoad() {
    //this._videoStream = await tf.data.webcam(this._player, {
    //  resizeWidth: 180,
    //  resizeHeight: 180,
    //  facingMode: 'environment',
    //});
    // const track = this._videoStream.webcamVideoElement.srcObject.getVideoTracks()[0]
    // console.log(track.getCapabilities().torch)
    // track.applyConstraints({advanced: [{torch:true}]})
  }

  disconnectedCallback(){
    //this._videoStream.stop();
    //this._model.dispose();
  }

  takePicture = async () => {
    // Capture an image from the webcam using the Tensorflow.js data API
    //and store it as a tensor (resize to 224 x 224 size for mobilenet delivery).

    const img = await this._videoStream.capture();
    

    const offset = tf.scalar(255.0);
    const normalized = img.div(offset);
    await tf.browser.toPixels(normalized, this._canvas)
    this.tookPicture = true;

    const batch = tf.expandDims(normalized, 0)
    var score = tf.softmax(tf.tensor(this._model.predict(batch).arraySync()[0]));
    var confidence = tf.max(score).dataSync()[0];
    var labels = ['daisy', 'dandelion', 'roses', 'sunflowers', 'tulips'];
    console.log(labels[tf.argMax(score).dataSync()[0]] + ' with ' + confidence)

    img.dispose();
    //this.updateFormDataHandler(this.inputId, confidence)
  }

  predict = async(imgElement) =>  {
   
    const logits = tf.tidy(() => {
      //const IMAGE_SIZE = 224;
      //const img = tf.cast(tf.browser.fromPixels(imgElement), 'float32');
      //const offset = tf.scalar(127.5);
      //const normalized = img.sub(offset).div(offset);
      //const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
      //var confidence = this._model.predict(batched);
      var confidence = 1;
      debugger
      this.updateFormDataHandler(this.inputId, {confidence: confidence, img: btoa(imgElement.src) })
    });

  }

  uploadPicture = async (event: any) => {
    if(event.target.files.length >= 1){
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = e => {
        // Fill the image & call predict.
        this._img_preview.src = e.target.result;
        this._img_preview.width = 224;
        this._img_preview.height = 244;
        this._img_preview.onload = () => this.predict(this._img_preview);
      };

      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
    }
  }

  removePicture = async () => {
    this.tookPicture = false;
    this.updateFormDataHandler(this.inputId, undefined)
  }


  render() {
    return [
        (!SUPPORTS_MEDIA_DEVICES && i18next.t('no_camera_support')),
        <img ref={el => (this._img_preview = el)} width="640" height="640" />,
        <input type="file" accept="image/*" onChange={this.uploadPicture}/>,
        // <canvas ref={el => (this._canvas = el)} width="640" height="640" style={{display: this.tookPicture ? "block" : "none"}}></canvas>,
        // <video ref={el => (this._player = el)} width="640" height="640" autoplay playsinline muted style={{display: this.tookPicture ? "none" : "block"}}></video>,
        //(this.tookPicture ?
        //  <d4l-button
        //  type="button"
        //  classes="button--block answers-table__button"
        //  data-test="removePictureButton"
        //  text={i18next.t('ai_remove_picture')}
        //  handleClick={this.removePicture}
        //  /> : 
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
