import { Question } from '@covopen/covquestions-js';
import i18n from '../../../global/utils/i18n';

export const QUESTION_SHARE_DATA = (): Question => {
  return {
    options: [
      {
        scores: {},
        text: i18n.t(`q_X1_option0`),
        value: 'yes',
      },
      {
        scores: {},
        value: 'no',
        text: i18n.t(`q_X1_option1`),
      },
    ],
    id: 'covapp_data_donation',
    text: i18n.t(`q_X1_text`),
    type: 'select',
    details: i18n.t(`q_X1_comment`),
  };
};
export const QUESTION_SHARE_DATA_PLZ = (): Question => {
  return {
    id: 'covapp_plz',
    text: i18n.t(`q_V1_text`),
    type: 'text',
    details: i18n.t(`q_V1_comment`),
    enableWhenExpression: {
      var: `${QUESTION_SHARE_DATA().id}.option.yes`,
    },
  };
};
