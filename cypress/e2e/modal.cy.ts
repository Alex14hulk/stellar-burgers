import { bunSelector, modal, modal_close, testUrl } from "./constants";

describe('Открытие/закрытие модальных окон', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });

  it('Открытие и закрытие модального окна через крестик', () => {
    cy.get(modal).should('not.exist');
    cy.contains(bunSelector).click({ force: true });
    cy.get(modal).should('exist');
    cy.get(modal_close).click({ force: true });
    cy.get(modal).should('not.exist');
  });

  it('Открытие и закрытие модального окна по клику на overlay', () => {
    cy.contains(bunSelector).click({ force: true });
    cy.get(modal).should('exist');
    cy.get('[data-test-id="modal-overlay"]').click({ force: true });
    cy.get(modal).should('not.exist');
  });
});