import {
  Component,
  Event,
  EventEmitter,
  h,
  Prop,
  State,
} from '@stencil/core';
import * as tf from '@tensorflow/tfjs';
import i18next from 'i18next';


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
1111
  @State() tookPicture = false;

  _player;
  _canvas;
  _model;
  _videoStream;
  _img_preview;
  _input;

  IMAGE_SIZE = 160;

  componentWillLoad() {
    tf.loadGraphModel('assets/ai/model.json').then(model => {
      this._model = model;
      console.log('model loaded');
    });
  }

  async componentDidLoad() {

  }

  disconnectedCallback(){
  }


  predict = async(imgElement) =>  {

      const img = tf.cast(tf.browser.fromPixels(imgElement), 'float32');
      const batch = tf.expandDims(img, 0)
    var score = this._model.predict(batch)
    var confidence = parseFloat(tf.sigmoid(score).dataSync())
    console.log("confidence: " + confidence)
    this.updateFormDataHandler(this.inputId,{ confidence: confidence, img: btoa(imgElement.src) })
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
        img.width = this.IMAGE_SIZE;
        img.height = this.IMAGE_SIZE;
        img.onload = () => this.predict(img);
      };
      reader.readAsDataURL(file);
    }
  }

  removePicture = async () => {
    this.tookPicture = false;
    this.updateFormDataHandler(this.inputId, undefined)
  }


  render() {
    return [
      <label htmlFor="file-upload" class="file-upload">{i18next.t('upload_picture')}</label>,
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
