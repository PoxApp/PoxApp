import { Questionnaire } from '@covopen/covquestions-js';
import { QUESTION_SHARE_DATA } from '../components/views/questionnaire/utils';
import { LOCAL_STORAGE_KEYS } from './constants';
import { ASK_FOR_DATADONATION } from './custom';


export let questionnaire: Questionnaire = undefined;
export let cacheKey: string = '';
export let baseUrl = '/assets/questionnaire/';
export function getQuestionnaire(language = 'de'): Promise<Questionnaire> {
  // TODO implement Update Mechanism
  //   let cachedQuestionnaire = JSON.parse(
  //     localStorage.getItem(LOCAL_STORAGE_KEYS.QUESTIONNAIRE)
  //   );
  //   if (cachedQuestionnaire) {
  //     return new Promise(() => cachedQuestionnaire);
  //   }
  if (questionnaire != undefined && cacheKey === language) {
    return new Promise((resolve) => resolve(addAdditionalQuestions(questionnaire)));
  }
  // Make sure it is ending with a slash
  if (!baseUrl.endsWith('/')) baseUrl = baseUrl + '/';
  return fetch(`${baseUrl}${language}.json`)
    .then((response: Response) => response.json())
    .then((response) => {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.QUESTIONNAIRE,
        JSON.stringify(response)
      );
      questionnaire = { ...response };
      cacheKey = language;

      return addAdditionalQuestions(response);
    });
  // .catch(() => {
  //     // do nothing for now
  //   });
}

function addAdditionalQuestions(
  functionQuestionnaire: Questionnaire
): Questionnaire {
  if(ASK_FOR_DATADONATION){
    return {
      ...functionQuestionnaire,
      questions: [...functionQuestionnaire.questions, QUESTION_SHARE_DATA()],
    };
  }
  return functionQuestionnaire;
}

export const QUESTION = {
  POSTAL_CODE: 'V1',
  ABOVE_65: 'P1',
  HOUSING: 'P2',
  CARING: 'P3',
  WORKSPACE: 'P4',
  CONTACT_DATE: 'CZ',
  OUT_OF_BREATH: 'SB',
  SYMPTOM_DATE: 'SZ',
  DATA_DONATION: 'X1',
};

export const XML_ORDER = ['V', 'P', 'C', 'S', 'D', 'M', 'T'];
