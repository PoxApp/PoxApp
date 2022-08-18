import {
  Component,
  Event,
  EventEmitter,
  h,
  Listen,
  Prop,
  State,
} from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { LOCAL_STORAGE_KEYS, ROUTES } from '../../../global/constants';
import i18next from '../../../global/utils/i18n';
import version from '../../../global/utils/version';
import { Answers } from '../questionnaire/questionnaire';
import settings from '../../../global/utils/settings';
import { QuestionnaireEngine, Result } from '@covopen/covquestions-js';
import { getQuestionnaire } from '../../../global/questions';
import DOMPurify from 'dompurify';

@Component({
  styleUrl: 'summary.css',
  tag: 'ia-summary',
})
export class Summary {
  @Prop() history: RouterHistory;
  @State() language: string = settings.languageCode;
  @State() answers: Answers = {};
  @State() result: Result[] = [];
  @Event() showLogoHeader: EventEmitter;

  @Listen('changedLanguage', {
    target: 'window',
  })
  changedLanguageHandler(event: CustomEvent) {
    this.language = event.detail.code;
    this.loadSummary();
  }

  @Listen('popstate', {
    target: 'window',
  })
  handlePopStateChange() {
    const answerKeys = Object.keys(this.answers);
    delete this.answers[answerKeys[answerKeys.length - 1]];
    sessionStorage.setItem(LOCAL_STORAGE_KEYS.ANSWERS, JSON.stringify(this.answers));
    settings.completed = false;
  }

  resetFormAndStartAgain = () => {
    version.reset();
    this.history.push(ROUTES.QUESTIONNAIRE, {});
  };

  componentWillLoad = () => {
    this.showLogoHeader.emit({ show: false });
    if (!version.match()) {
      this.resetFormAndStartAgain();
      return;
    }
    const availableAnswers = JSON.parse(
      sessionStorage.getItem(LOCAL_STORAGE_KEYS.ANSWERS)
    );
    this.answers = availableAnswers ? availableAnswers : {};
    this.loadSummary();
    settings.completed = true;
  };

  private loadSummary() {
    getQuestionnaire(this.language).then(questionnaire => {
      const engine = new QuestionnaireEngine(questionnaire);
      // TODO:https://github.com/CovOpen/CovQuestions/issues/148
      engine.setAnswersPersistence({
        answers: Object.keys(this.answers).reduce((accumulator, key) => {
          accumulator.push({
            questionId: key,
            rawAnswer: this.answers[key],
          });
          return accumulator;
        }, []),
        version: 2,
        timeOfExecution: 23,
      });
      this.result = engine.getResults().results;
    });
  }

  render() {
    const { result } = this;
    return (
      <div class="c-card-wrapper summary">
        <d4l-card classes="card--desktop">
          <div slot="card-content">
            <div class="summary__content" slot="card-content">
              <h2>{i18next.t('summary_headline')}</h2>
              {
                result.length > 0 ? 
                <ia-accordion
                headline={result[0].resultCategory.description}
                open={true}
                >
                <div slot="accordion-children">
                  <div innerHTML={DOMPurify.sanitize(result[0].result.text)} />
                </div>
              </ia-accordion> : undefined
              }
              {
                result.length > 1 ? 
                <ia-accordion
                headline={result[1].resultCategory.description}
                open={false}
                >
                <div slot="accordion-children">
                  <div innerHTML={DOMPurify.sanitize(result[1].result.text)} />
                </div>
              </ia-accordion> : undefined
              }
              {result.slice(2).map(r => (
                <ia-accordion headline={r.resultCategory.description} open={true}>
                  <div slot="accordion-children">
                    <div innerHTML={DOMPurify.sanitize(r.result.text)} />
                  </div>
                </ia-accordion>
              ))}
              <h3 class="u-text-align--center">{i18next.t('summary_next')}</h3>
              <ia-accordion
                headline={i18next.t('summary_contact_health_headline')}
                slotContent={i18next.t('summary_contact_health_content')}
              />
              <ia-accordion headline={i18next.t('summary_show_doctor_headline')}>
                <div slot="accordion-children">
                  <div innerHTML={i18next.t('summary_show_doctor_content')} />
                  <stencil-route-link url={ROUTES.ANSWERS}>
                    <d4l-button
                      classes="button--block"
                      data-test="answers-button"
                      text={i18next.t('summary_show_doctor_button')}
                      is-route-link
                    />
                  </stencil-route-link>
                </div>
              </ia-accordion>
              <ia-accordion headline={i18next.t('summary_feedback_headline')}>
                <div slot="accordion-children">
                  <div innerHTML={i18next.t('summary_feedback_content')} />
                </div>
              </ia-accordion>
              {/* {!IS_COLLABORATION && <ia-app-recommendations />} */}
            </div>
          </div>
        </d4l-card>
      </div>
    );
  }
}
