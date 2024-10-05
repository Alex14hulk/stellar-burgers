const bun = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`;
const filling = `[data-cy=${'643d69a5c3f7b9001cfa093e'}]`;

describe('Тесты', () => {
  beforeEach('перехват запросов на эндпоинты', () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', `api/orders`, { fixture: 'order.json'}).as('order');
    cy.intercept('POST', 'api/auth/login', { fixture: 'user.json' }).as(
      'login'
    );
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('Добавление ингредиентов, авторизация и оформление заказа', () => {
    cy.get(bun).children('button').click();
    cy.get(bun).find('.counter__num').contains('2');
    cy.get(filling).children('button').click();
    cy.get(filling).find('.counter__num').contains('1');
    cy.contains('button', 'Оформить заказ').click();
    cy.url().should('include', '/login');
    
    cy.get('input[name="email"]').type('140395@mail.ru');
    cy.get('input[name="password"]').type('140395Sasha');
    cy.get('button').contains('Войти').click();
    cy.wait('@login');
    cy.url().should('not.include', '/login');
    cy.contains('Оформить заказ').as('orderButton');
    cy.get('@orderButton').should('be.enabled').click();
    cy.wait(10000);
    cy.get('#modals').should('exist').and('be.visible');
    cy.get('[data-cy=close-button]').click();
    cy.get('#modals')
      .should('not.be.visible')
      .children('')
      .should('have.length', 0);
  });
});