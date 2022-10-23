require('dotenv').config();

const { join } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { stringify } = require('javascript-stringify');
const deepAssign = require('deep-assign');
const prettier = require('prettier');
const fs = require('fs-extra');

const prettierOptions = {
  ...JSON.parse(readFileSync(join(__dirname, '..', '.prettierrc'), 'utf8')),
  parser: 'typescript',
};

function tryToReadTranslationFile(filePath) {
  try {
    return require(filePath);
  } catch (error) {
    // only throw errors in case of JSON syntax errors
    // due to the fallback logic it might be okay to have missing files
    // later validations will catch missing files
    if (error instanceof SyntaxError) {
      throw new Error(
        `The translation file '${filePath}' does not include valid JSON`
      );
    }
    if (error.code === 'MODULE_NOT_FOUND') {
      console.info(`Info - The translation file '${filePath}' was not provided`);
    }
    //console.warn(`Something went wrong while reading the Translation file (${error.code})`)

    return {};
  }
}

function tryToReadLogo() {
  try {
    return readFileSync(join(__dirname, '..', 'custom', 'logo.svg'), 'utf8');
  } catch (error) {
    console.info('Info - no custom Logo provided.');
    return '';
  }
}

function getTranslationsForLanguageCode(code) {
  const rootPath = '..';
  const defaultTranslationPath = `${rootPath}/src/global/i18n/${code}.json`;
  const customTranslationsPath = `${rootPath}/custom/translations/${code}.json`;

  const defaultTranslations = tryToReadTranslationFile(defaultTranslationPath);
  const customTranslations = tryToReadTranslationFile(customTranslationsPath);

  const translations = deepAssign(defaultTranslations, customTranslations);

  if (!translations.keys) {
    throw new Error(
      `The translations for "${code}" is missing the "keys" property.\nPlease add it in "${customTranslationsPath}"`
    );
  }

  if (!translations.label) {
    throw new Error(
      `The translations for "${code}" is missing the "label" property.\nPlease add it in ${customTranslationsPath}`
    );
  }

  return translations;
}

function getTranslations(supportedLanguages) {
  return supportedLanguages.map((code) => ({
    code,
    translations: getTranslationsForLanguageCode(code),
  }));
}

function writeCustomizationAppFile({
  layout,
  logo,
  matomoUrl,
  matomoSiteId,
  sentryDSN,
  pandemicTrackingUrl,
  translations,
  data4lifeUrl,
  data4lifeAndroidBaseUrl,
  data4lifeIosBaseUrl,
  whitelistedData4LifeOrigins,
  dataDonationUrl,
}) {
  const appFilePath = join(__dirname, '..', 'src', 'global', 'custom.ts');

  const fileContent = prettier.format(
    `
  // THIS FILE IS GENERATED VIA 'npm run prepare-customization'
  // IT IS BASED ON CONTENT under /src/custom
  // ! DON'T EDIT IT – EDITS WILL BE OVERWRITTEN !

  export const LANGUAGES = ${stringify(
    translations.map(({ code, translations }) => ({
      code,
      label: translations.label,
    }))
  )};

  export const LANGUAGE_RESOURCES = ${stringify(
    translations.reduce((acc, cur) => {
      acc[cur.code] = { translation: cur.translations.keys };
      return acc;
    }, {})
  )};

  // layout flag to adjust the header layout for charite and official collaborations
  export const LAYOUT = '${layout}';

  // If specified ask for DataDonation at the end
  export const DATA_DONATION_URL = ${
    dataDonationUrl ? "'" + dataDonationUrl + "'" : undefined
  };

  // custom logo defined in /src/custom/logo.svg
  export const CUSTOM_LOGO = \`${logo}\`;

  export const TRACKING_IS_ENABLED = ${!!(matomoUrl && matomoSiteId)};
  export const MATOMO_URL = '${matomoUrl}';
  export const MATOMO_SITE_ID = '${matomoSiteId}';
  export const ERROR_TRACKING_ENABLED = ${!!sentryDSN};
  export const SENTRY_DSN = '${sentryDSN}';
  export const PANDEMIC_TRACKING_IS_ENABLED = ${!!pandemicTrackingUrl};
  export const PANDEMIC_TRACKING_URL = '${pandemicTrackingUrl}';
  export const DATA4LIFE_URL = ${
    data4lifeUrl ? '"' + data4lifeUrl + '"' : undefined
  };
  export const DATA4LIFE_ANDROID_BASEURL = '${data4lifeAndroidBaseUrl}';
  export const DATA4LIFE_IOS_BASEURL = '${data4lifeIosBaseUrl}';
  export const WHITELISTED_DATA4LIFE_ORIGINS = ${stringify(
    whitelistedData4LifeOrigins ? whitelistedData4LifeOrigins.split(',') : []
  )};
  `,
    prettierOptions
  );

  writeFileSync(appFilePath, fileContent);
}

function writeStyleOverwrite() {
  const styleFilePath = join(
    __dirname,
    '..',
    'src',
    'global',
    'styles',
    'overwrite.css'
  );
  let readContent = '';
  try {
    readContent = readFileSync(
      join(__dirname, '..', 'custom', 'overwrite.css'),
      'utf8'
    );
  } catch (error) {
    // No custom overwrite.css
    console.info('Info - no custom CSS provided.');
  }

  const fileContent = prettier.format(
    `
      /* THIS FILE IS GENERATED VIA 'npm run prepare-customization'
       * IT IS BASED ON CONTENT under /custom/
       * ! DON'T EDIT IT – EDITS WILL BE OVERWRITTEN !
       */

      ${readContent}
    
      `,
    { ...prettierOptions, parser: 'css' }
  );

  writeFileSync(styleFilePath, fileContent);
}

const {
  LAYOUT,
  MATOMO_URL,
  MATOMO_SITE_ID,
  SUPPORTED_LANGUAGES,
  SENTRY_DSN,
  PANDEMIC_TRACKING_URL,
  DATA4LIFE_URL,
  DATA4LIFE_ANDROID_BASEURL,
  DATA4LIFE_IOS_BASEURL,
  WHITELISTED_DATA4LIFE_ORIGINS,
  DATA_DONATION_URL,
} = process.env;
const supportedLanguages = SUPPORTED_LANGUAGES
  ? SUPPORTED_LANGUAGES.split(',')
  : ['de', 'en'];

const dataDonationUrl =
  DATA_DONATION_URL == 'false' ? undefined : DATA_DONATION_URL || '/api/donate';

const translations = getTranslations(supportedLanguages);
const logo = tryToReadLogo();

writeCustomizationAppFile({
  layout: LAYOUT,
  logo,
  matomoUrl: MATOMO_URL,
  matomoSiteId: MATOMO_SITE_ID,
  sentryDSN: SENTRY_DSN,
  pandemicTrackingUrl: PANDEMIC_TRACKING_URL,
  translations,
  data4lifeUrl: DATA4LIFE_URL,
  data4lifeAndroidBaseUrl: DATA4LIFE_ANDROID_BASEURL,
  data4lifeIosBaseUrl: DATA4LIFE_IOS_BASEURL,
  whitelistedData4LifeOrigins: WHITELISTED_DATA4LIFE_ORIGINS,
  dataDonationUrl: dataDonationUrl,
});

writeStyleOverwrite();

// Copy Questionnaires
let sourceDir = './custom/questionnaire';
let destDir = './src/assets/questionnaire';
try {
  fs.copySync(sourceDir, destDir, { recursive: true, overwrite: true });
} catch (err) {
  console.error(err);
}
