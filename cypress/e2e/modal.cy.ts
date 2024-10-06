describe('Открытие/закрытие модальных окон', () => {
  const bunSelector = "Мясо бессмертных моллюсков Protostomia";
  const testUrl = 'http://localhost:4000';
  const modal = '[data-test-id="modal"]';


  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });

  it('Открытие и закрытие модального окна через крестик', () => {
    cy.get(modal).should('not.exist');
    cy.contains(bunSelector).click({ force: true });
    cy.get(modal).should('exist');
    cy.get('[data-test-id="modal-close"]').click({ force: true });
    cy.get(modal).should('not.exist');
  });

  it('Открытие и закрытие модального окна по клику на overlay', () => {
    cy.contains(bunSelector).click({ force: true });
    cy.get(modal).should('exist');
    cy.get('[data-test-id="modal-overlay"]').click({ force: true });
    cy.get(modal).should('not.exist');
  });
});