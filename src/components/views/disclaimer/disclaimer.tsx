import { Component, h, State, Listen, Event, EventEmitter } from '@stencil/core';
import i18next from '../../../global/utils/i18n';
import { ROUTES } from '../../../global/constants';
import settings from '../../../global/utils/settings';

@Component({
  styleUrl: 'disclaimer.css',
  tag: 'ia-disclaimer',
})
export class Disclaimer {
  @State() language: string = settings.languageCode;
  @State() checkboxes = {};

  @Event() showLogoHeader: EventEmitter;
  @Listen('changedLanguage', {
    target: 'window',
  })
  changedLanguageHandler(event: CustomEvent) {
    this.language = event.detail.code;
  }

  componentWillLoad() {
    this.showLogoHeader.emit({ show: false });
    if (i18next.t('disclaimer_checkbox_1') != 'disclaimer_checkbox_1') {
      this.checkboxes['checkbox-1'] = false;
    }
    if (i18next.t('disclaimer_checkbox_2') != 'disclaimer_checkbox_2') {
      this.checkboxes['checkbox-2'] = false;
    }
    if (i18next.t('disclaimer_checkbox_3') != 'disclaimer_checkbox_3') {
      this.checkboxes['checkbox-3'] = false;
    }
    if (i18next.t('disclaimer_checkbox_4') != 'disclaimer_checkbox_4') {
      this.checkboxes['checkbox-4'] = false;
    }
  }

  get currentLanguage() {
    return this.language || 'en';
  }

  get checkboxesChecked() {
    return Object.values(this.checkboxes).every((value) => value === true);
  }

  render() {
    return (
      <div class="c-card-wrapper disclaimer">
        <d4l-card classes="card--desktop card--text-center">
          <div slot="card-header">
            <h2>{i18next.t('disclaimer_headline')}</h2>
          </div>
          <div
            class="disclaimer__content u-text-align--left u-padding-bottom--normal"
            slot="card-content"
          >
            <p innerHTML={i18next.t('disclaimer_paragraph_1')} />
          </div>
          <div class="disclaimer__footer" slot="card-footer">
            <p innerHTML={i18next.t('disclaimer_footer_text')} />
            {i18next.t('disclaimer_checkbox_1') != 'disclaimer_checkbox_1' ? (
              <d4l-checkbox
                key={'checkbox-1'}
                checkbox-id={`checkbox-1`}
                name={'checkbox-1'}
                label={i18next.t('disclaimer_checkbox_1')}
                onChange={(event: any) =>
                  (this.checkboxes = {
                    ...this.checkboxes,
                    'checkbox-1': event.target.checked,
                  })
                }
              ></d4l-checkbox>
            ) : null}
            {i18next.t('disclaimer_checkbox_2') != 'disclaimer_checkbox_2' ? (
              <d4l-checkbox
                key={'checkbox-2'}
                checkbox-id={`checkbox-2`}
                name={'checkbox-2'}
                label={i18next.t('disclaimer_checkbox_2')}
                onChange={(event: any) =>
                  (this.checkboxes = {
                    ...this.checkboxes,
                    'checkbox-2': event.target.checked,
                  })
                }
              ></d4l-checkbox>
            ) : null}
            {i18next.t('disclaimer_checkbox_3') != 'disclaimer_checkbox_3' ? (
              <d4l-checkbox
                key={'checkbox-3'}
                checkbox-id={`checkbox-3`}
                name={'checkbox-3'}
                label={i18next.t('disclaimer_checkbox_3')}
                onChange={(event: any) =>
                  (this.checkboxes = {
                    ...this.checkboxes,
                    'checkbox-3': event.target.checked,
                  })
                }
              ></d4l-checkbox>
            ) : null}
            {i18next.t('disclaimer_checkbox_4') != 'disclaimer_checkbox_4' ? (
              <d4l-checkbox
                key={'checkbox-4'}
                checkbox-id={`checkbox-4`}
                name={'checkbox-4'}
                label={i18next.t('disclaimer_checkbox_4')}
                onChange={(event: any) =>
                  (this.checkboxes = {
                    ...this.checkboxes,
                    'checkbox-4': event.target.checked,
                  })
                }
              ></d4l-checkbox>
            ) : null}
            <stencil-route-link
              anchor-id="d4l-button-register"
              url={ROUTES.QUESTIONNAIRE}
            >
              <d4l-button
                disabled={!this.checkboxesChecked}
                classes="button--block"
                data-test="continueButton"
                text={
                  i18next.t('button_disclaimer_continue') ??
                  i18next.t('button_continue')
                }
              />
            </stencil-route-link>
          </div>
        </d4l-card>
      </div>
    );
  }
}
