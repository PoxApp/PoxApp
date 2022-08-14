describe('original_questionnaire', () => {
  it('passes', () => {
    const date = new Date();

    cy.intercept('/assets/questionnaire/en.json', {
      fixture: 'questionnaire_all_types.json',
    }).as('getQuestionnaire');

    cy.intercept('api/donate', (req) => {
      req.reply();
      expect('Unexpected Https call').to.be.false;
    }).as('dataDonation');

    cy.visit('http://localhost:3333');
    cy.contains('Start questionnaire').click();
    cy.contains('button_disclaimer_continue').click();
    cy.wait('@getQuestionnaire');

    cy.contains('Under 30 years').click();
    cy.clickNextButton();

    cy.contains('Living alone').click();
    cy.clickNextButton();

    cy.contains('No').click();
    cy.clickNextButton();

    cy.contains('No, in none of the above').click();
    cy.clickNextButton();

    cy.contains('No').click();
    cy.clickNextButton();

    cy.contains('No').click();
    cy.clickNextButton();

    cy.contains('Yes').click();
    cy.clickNextButton();

    date.setDate(date.getDate() - 7);
    cy.get("input[type='date']").type(date.toISOString().slice(0, 10));
    cy.clickNextButton();

    cy.contains('No').click();
    cy.clickNextButton();

    cy.contains('38°C').click();
    cy.contains('Chills').click();
    cy.clickNextButton();

    cy.contains('Feeling tired or weak').click();
    cy.contains('Sore throat').click();
    cy.clickNextButton();

    cy.contains('No').click();
    cy.clickNextButton();

    date.setDate(date.getDate() - 9);
    cy.get("input[type='date']").type(date.toISOString().slice(0, 10));
    cy.clickNextButton();

    cy.clickNextButton();

    cy.get("input[type='number']").type(180);
    cy.clickNextButton();

    cy.get("input[type='number']").type(90);
    cy.clickNextButton();

    cy.contains('No').click();
    cy.clickNextButton();

    cy.clickNextButton();

    cy.contains('Yes').click();
    cy.clickNextButton();

    cy.contains('Yes').click();
    cy.clickNextButton();

    cy.contains('Yes').click();
    cy.clickNextButton();

    date.setDate(date.getDate() - 30);
    cy.get("input[type='date']").type(date.toISOString().slice(0, 10));
    cy.clickNextButton();

    cy.contains('No').click();
    cy.clickNextButton();

    cy.contains('No').click();
    cy.clickNextButton();

    cy.contains(
      'No, I do not want to transfer my data and I only want to see my recommended action'
    ).click();
    // cy.contains('Yes, ').click();
    cy.clickNextButton();

    cy.wait(200);

    cy.contains('Show your answers to a doctor').click();
    cy.contains('View answers and QR code').click();

    cy.contains(date.toLocaleDateString());
  });
});
