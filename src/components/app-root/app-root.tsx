import { Component, State, Listen, h, Prop } from '@stencil/core';
import i18next, { initialLanguage, LANGUAGES } from '../../global/utils/i18n';

import { ROUTES, IS_DEV, APP_RECOMMENDATIONS_ID } from '../../global/constants';
import {
  IS_CHARITE,
  IS_CUSTOM,
  IS_BZGA,
  IS_RKI,
  IS_BMG,
} from '../../global/layouts';
import settings, { COMPLETED, SOURCE } from '../../global/utils/settings';

import { Language } from '@d4l/web-components-library/dist/types/components/LanguageSwitcher/language-switcher';
import { trackEvent, TRACKING_EVENTS } from '../../global/utils/track';
import { RouterHistory, injectHistory } from '@stencil/router';
import { HASH_LONG, VERSION } from '../../global/version';

navigator.doNotTrack === '1';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  private connectTranslationsEl: HTMLConnectTranslationsElement;
  @Prop() history: RouterHistory;
  @State() language: Language;
  @State() showLogoHeader: boolean = false;
  @State() d4lBannerIdentity: number = Date.now();
  @State() isEmbedded: boolean = false;
  @State() hasMadeCookieChoice: boolean;
  @State() showErrorBanner: boolean = false;

  @Listen('changedLanguage', {
    target: 'window',
  })
  async changedLanguageHandler(event: CustomEvent) {
    const { detail: language } = event;
    document.body.parentElement.setAttribute('lang', language.code);
    this.language = language;
  }

  getLanguageByCode(languageCode: Language['code']) {
    return LANGUAGES.find(({ code }) => code === languageCode);
  }

  @Listen('showErrorBanner', { target: 'window' })
  handleShowErrorBanner() {
    this.showErrorBanner = true;
  }

  @Listen('showLogoHeader')
  showLogoHeaderListener(event: CustomEvent) {
    this.showLogoHeader = event.detail.show;
  }

  @Listen('isEmbedded')
  isEmbeddedListener(event: CustomEvent) {
    this.isEmbedded = !!event.detail;
  }

  saveSettings = ({ acceptCookies, acceptTracking }) => {
    settings.acceptsCookies = acceptCookies;
    settings.acceptsTracking = acceptCookies && acceptTracking;

    this.hasMadeCookieChoice = true;

    this.trackConsentIfGiven();
  };

  trackConsentIfGiven() {
    if (settings.acceptsTracking) {
      trackEvent([], 'setConsentGiven');
    }
  }

  handleBannerClick() {
    const element = document.getElementById(
      APP_RECOMMENDATIONS_ID
    ) as HTMLD4lAccordionElement;
    if (element) {
      const scrollOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      } as ScrollIntoViewOptions;
      // https://caniuse.com/mdn-api_resizeobserver
      // @ts-ignore
      if (window.ResizeObserver) {
        // @ts-ignore
        const resizeObserver = new ResizeObserver(() => {
          element.scrollIntoView(scrollOptions);
          resizeObserver.unobserve(element);
        });
        // CC-515 wait for opening so scroll into view has correct position
        resizeObserver.observe(element);
        element.open = true;
      } else {
        element.open = true;
        element.scrollIntoView(scrollOptions);
      }
    } else {
      this.history.push(`${ROUTES.SUMMARY}#${APP_RECOMMENDATIONS_ID}`, {
        openAppRecommendationsAccordion: true,
      });
    }
    trackEvent(TRACKING_EVENTS.HEADER_BANNER_CLICK);
  }

  async componentWillLoad() {
    // check for native date picker support
    // inspired by https://github.com/Modernizr/Modernizr/blob/master/feature-detects/inputtypes.js
    const testDateElement = document.createElement('input');
    testDateElement.setAttribute('type', 'date');
    testDateElement.value = 'text'; // should be sanitized away
    sessionStorage.setItem(
      'supportsDateElement',
      String(
        testDateElement.getAttribute('type') !== 'text' &&
          testDateElement.value !== 'text'
      )
    );

    this.language = this.getLanguageByCode(await initialLanguage);
    this.hasMadeCookieChoice = IS_DEV || settings.hasMadeCookieChoice;
    settings.onChange(
      key =>
        [COMPLETED, SOURCE].includes(key) &&
        (this.d4lBannerIdentity = new Date().getTime())
    );
  }

  componentDidLoad() {
    this.connectTranslationsEl.changedLanguageHandler(this.language);
    this.trackConsentIfGiven();
  }

  render() {
    const { language, showLogoHeader, showErrorBanner, isEmbedded } = this;

    return (
      <connect-translations ref={el => (this.connectTranslationsEl = el)}>
        {showErrorBanner && (
          <d4l-banner
            noreferrer={false}
            classes="banner--slim banner--error"
            handleClick={() => location.reload()}
            handleClose={() => (this.showErrorBanner = false)}
          >
            <div class="d4l-banner__content">
              <div innerHTML={i18next.t('error_reload_snackbar')}></div>
            </div>
          </d4l-banner>
        )}
        {showLogoHeader && !isEmbedded && IS_CUSTOM && (
          <ia-logo-component classes="logo-component--collaboration" />
        )}
        {!isEmbedded && (
          <header class="c-header">
            {showLogoHeader && !IS_CUSTOM && (
              <div class="app__logo-container">
                {IS_CHARITE && <ia-logo-charite big />}
                {IS_BZGA && <ia-logo-bzga big />}
                {IS_BMG && <ia-logo-bmg big />}
                {IS_RKI && <ia-logo-rki big />}
              </div>
            )}
            {!showLogoHeader && (
              <stencil-route-link
                url="/"
                anchorTitle="Home link"
                anchorClass="u-display-block c-logo"
              >
                <h1>{i18next.t('app_name')}</h1> 
              </stencil-route-link>
            )}
            {LANGUAGES.length > 1 && (
              <d4l-language-switcher
                languages={LANGUAGES}
                activeLanguage={language}
                class="u-margin-left--auto"
              />
            )}
          </header>
        )}
        <main class={{ 'layout--embedded': isEmbedded }}>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0.1}>
              <stencil-route url="/" component="ia-start" exact />
              <stencil-route
                url={ROUTES.QUESTIONNAIRE}
                component="ia-questionnaire"
              />
              <stencil-route url={ROUTES.SUMMARY} component="ia-summary" />
              <stencil-route url={ROUTES.IMPRINT} component="ia-imprint" />
              <stencil-route url={ROUTES.LEGAL} component="ia-legal" />
              <stencil-route url={ROUTES.DISCLAIMER} component="ia-disclaimer" />
              <stencil-route url={ROUTES.FAQ} component="ia-faq" />
              <stencil-route url={ROUTES.DATA_PRIVACY} component="ia-data-privacy" />
              <stencil-route url={ROUTES.EXPORT} component="ia-export" />
              <stencil-route
                url={ROUTES.RECOMMENDATIONS}
                component="ia-recommendation"
              />
              <stencil-route url={ROUTES.ANSWERS} component="ia-answers-overview" />
              <stencil-route component="ia-start" />
            </stencil-route-switch>
          </stencil-router>
        </main>
        <div class="c-footer version">
            Version &#8287;<a href={"https://github.com/CovOpen/Covapp-2.0/commit/" + HASH_LONG}
                     target="_blank"
                     rel="noopener"
                     aria-label="Link to the Version on Github"
                     >{VERSION}</a>
        </div>
        {!isEmbedded && (
          <footer class="c-footer">
            <ul class="u-list-reset">
              <li>
                <stencil-route-link
                  anchorClass="o-link o-link--gray"
                  url={ROUTES.IMPRINT}
                >
                  {i18next.t('app_root_imprint_link')}
                </stencil-route-link>
              </li>
              <li>
                <stencil-route-link
                  anchorClass="o-link o-link--gray"
                  url={ROUTES.LEGAL}
                >
                  {i18next.t('app_root_legal_link')}
                </stencil-route-link>
              </li>
              <li>
                <stencil-route-link
                  anchorClass="o-link o-link--gray"
                  url={ROUTES.FAQ}
                >
                  {i18next.t('app_root_faq_link')}
                </stencil-route-link>
              </li>
              <li>
                <stencil-route-link
                  anchorClass="o-link o-link--gray"
                  url={ROUTES.DATA_PRIVACY}
                >
                  {i18next.t('app_root_data_privacy_link')}
                </stencil-route-link>
              </li>
            </ul>
            <p>
              © {new Date().getFullYear()}{' '}
              {i18next.t('app_root_all_rights_reserved')}
            </p>
          </footer>
        )}
      </connect-translations>
    );
  }
}
injectHistory(AppRoot);
