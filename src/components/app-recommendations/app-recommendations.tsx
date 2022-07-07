import { Component, h, State, Listen, Prop } from '@stencil/core';
import { RouterHistory, injectHistory } from '@stencil/router';
import i18next from 'i18next';
import { APP_RECOMMENDATIONS_ID } from '../../global/constants';
import { DATA4LIFE_URL } from '../../global/custom';
import { trackEvent, TRACKING_EVENTS } from '../../global/utils/track';
import settings from '../../global/utils/settings';

@Component({
  styleUrl: 'app-recommendations.css',
  tag: 'ia-app-recommendations',
  assetsDirs: ['assets'],
})
export class AppRecommendationsComponent {
  protected containerElement: HTMLElement;

  @Prop() history: RouterHistory;
  @State() language: string = settings.languageCode;
  @Listen('changedLanguage', {
    target: 'window',
  })
  changedLanguageHandler(event: CustomEvent) {
    this.language = event.detail.code;
  }

  @Prop() isFromData4Life: boolean = false;

  componentDidRender() {
    this.containerElement
      .querySelectorAll('a')
      .forEach(
        el => el.href?.includes(DATA4LIFE_URL) && el.setAttribute('rel', 'noopener')
      );
  }

  render() {
    const slides = [
      {
        headerContent: `<img src="/assets/images/rki-app.png" class="app-recommendation__icon" alt="RKI diary app logo — coronavirus cell colored in blue" /><p class="app-recommendation__name">${i18next.t(
          'app_recommendation_rki_app_name'
        )}</p><ia-logo-rki></ia-logo-rki><p class="app-recommendation__paragraph">${i18next.t(
          'app_recommendation_rki_app_paragraph'
        )}</p>`,
        label: i18next.t('app_recommendation_rki_app_name'),
        text: '',
        ctaText: i18next.t('app_recommendation_learn_more_button'),
        ctaLink:
          'https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Kontaktperson/Tagebuch_Kontaktpersonen.html',
        ctaEventHandler: () => trackEvent(TRACKING_EVENTS.SUMMARY_LEARN_MORE_RKI),
      },
      {
        headerContent: `<img src="/assets/images/uni-freiburg-app.png" class="app-recommendation__icon" alt="Uni Freiburg COVID app logo - palm of a hand colored in blue with white heart in the middle" /><p class="app-recommendation__name">${i18next.t(
          'app_recommendation_uni-freiburg_app_name'
        )}</p><img src="/assets/images/uni-freiburg-logo.png" alt="Uni Freiburg logo" class="app-recommendation__logo" /><p class="app-recommendation__paragraph">${i18next.t(
          'app_recommendation_uni-freiburg_app_paragraph'
        )}</p>`,
        label: i18next.t('app_recommendation_uni-freiburg_app_name'),
        text: '',
        ctaText: i18next.t('app_recommendation_learn_more_button'),
        ctaLink: 'https://www.eureqa.io/covid-19',
        ctaEventHandler: () =>
          trackEvent(TRACKING_EVENTS.SUMMARY_LEARN_MORE_FREIBURG),
      },
      {
        headerContent: `<img src="/assets/images/million-friends-app.png" class="app-recommendation__icon" alt="MillionFriends App logo — abstract, crossed blue lines"/><p class="app-recommendation__name">${i18next.t(
          'app_recommendation_million-friends_app_name'
        )}</p><img src="/assets/images/million-friends-logo.png" alt="MillionFriends App logo — abstract, crossed blue lines" class="app-recommendation__logo" /><p class="app-recommendation__paragraph">${i18next.t(
          'app_recommendation_million-friends_app_paragraph'
        )}</p>`,
        label: i18next.t('app_recommendation_million-friends_app_name'),
        text: '',
        ctaText: i18next.t('app_recommendation_learn_more_button'),
        ctaLink: 'https://millionfriends.de/covid19/',
        ctaEventHandler: () =>
          trackEvent(TRACKING_EVENTS.SUMMARY_LEARN_MORE_MILLION_FRIENDS),
      },
    ];

    return (
      <ia-accordion
        elementId={APP_RECOMMENDATIONS_ID}
        headline={i18next.t('app_recommendation_headline')}
        open={this.history.location?.state?.openAppRecommendationsAccordion}
        ref={el => (this.containerElement = el)}
      >
        <d4l-slider slides={slides} slot="accordion-children" />
      </ia-accordion>
    );
  }
}

injectHistory(AppRecommendationsComponent);
