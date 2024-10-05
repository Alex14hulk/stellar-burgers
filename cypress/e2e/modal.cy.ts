describe('Открытие/закрытие модальных окон', () => {
    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
        cy.visit('http://localhost:4000');
      });
      
    it('Открытие модального окна', () => {
      cy.get('#modals').should('be.empty');
      cy.get("Краторная булка N-200i").click();
      cy.wait(10000);
      cy.get('#modals').should('not.be.empty');
      cy.url().should('include', '643d69a5c3f7b9001cfa093e');
    });
    it('Закрытие модального окна по клику на крестик', () => {
      cy.get('#modals').should('be.empty');
      cy.get("Краторная булка N-200i").click();
      cy.get('#modals').should('not.be.empty');
      cy.get('#modals').find('button').click();
      cy.get('#modals').should('empty');
    });
    it('Закрытие модального окна по клику на overlay', () => {
      cy.get('#modals').should('be.empty');
      cy.get("Краторная булка N-200i").click();
      cy.get('#modals').should('not.be.empty');
      cy.get('overlay').click({ force: true });
      cy.get('#modals').should('be.empty');
    });
  });