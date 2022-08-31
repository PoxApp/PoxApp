import { DATA_DONATION_URL } from '../custom';

export let baseUrl = DATA_DONATION_URL;
export function donateAnswers(answers: any): Promise<undefined> {
  // Make sure it is ending with a slash
  if (!baseUrl.endsWith('/')) baseUrl = baseUrl + '/';

  return fetch(`${baseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answers),
  })
    .then(() => {
      return undefined;
    })
    .catch((err: any) => {
      console.error(err);
    });
}
