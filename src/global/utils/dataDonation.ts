export let baseUrl = '/api/donate';
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
    .then((response: Response) => {
      return undefined;
    })
    .catch((err: any) => {
      console.error(err);
    });
}
