Cypress.Commands.add ('fillMandatoryFieldsAndSubmit', (person) => {
    cy.get('input#firstName').type(person.firstName);
    cy.get('input#lastName').type(person.lastName);
    cy.get('input#email').type(person.email);
    cy.get('textarea#open-text-area').type(person.obs);
    cy.contains('button', 'Enviar').click();
})