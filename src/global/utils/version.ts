import { LOCAL_STORAGE_KEYS, QUESTIONNAIRE_VERSION } from '../constants';
import settings, { COMPLETED } from './settings';

//TODO: Use JSON Questionnaire Version
const match = (): boolean => {
  const setVersion = sessionStorage.getItem(LOCAL_STORAGE_KEYS.VERSION);
  return setVersion === QUESTIONNAIRE_VERSION;
};

const set = () => {
  sessionStorage.setItem(LOCAL_STORAGE_KEYS.VERSION, QUESTIONNAIRE_VERSION);
};

const reset = () => {
  settings.remove(COMPLETED);

  for (const key in LOCAL_STORAGE_KEYS) {
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS[key]);
  }
};

const version = {
  match,
  set,
  reset,
};

export default version;
