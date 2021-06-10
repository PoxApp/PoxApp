import i18next from '../../../global/utils/i18n';

export const QUESTION_SHARE_DATA = {
  options: [
    {
      scores: {},
      text: i18next.t(`q_X1_option0`),
      value: 'yes',
    },
    {
      scores: {},
      value: 'no',
      text: i18next.t(`q_X1_option1`),
    },
  ],
  id: 'covapp_data_donation',
  text: i18next.t(`q_X1_text`),
  type: 'select',
  details: i18next.t(`q_X1_comment`),
};
export const QUESTION_SHARE_DATA_PLZ = {
  id: 'covapp_plz',
  text: i18next.t(`q_V1_text`),
  type: 'text',
  details: i18next.t(`q_V1_comment`),
  enableWhenExpression: {
    var: `${QUESTION_SHARE_DATA.id}.option.yes`,
  },
};
