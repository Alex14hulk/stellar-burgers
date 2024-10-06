const bun = 'Краторная булка N-200i';
const filling = `[data-cy=${'643d69a5c3f7b9001cfa093e'}]`;
const testUrl = 'http://localhost:4000';

describe('Тесты', () => {
  const email = 'input[name=email]';
  const password = 'input[name=password]';
  const user = {
    email: '140395@mail.ru',
    password: '140395Sasha'
  };
  
  beforeEach('перехват запросов на эндпоинты', () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', `api/orders`, { fixture: 'order.json'}).as('order');
    cy.intercept('POST', 'api/auth/login', { fixture: 'user.json' }).as('login');
    cy.visit(testUrl);
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Добавление ингредиентов, авторизация и оформление заказа', () => {
    cy.get('button.common_button.HR_H4Fj42ZLB21Nz5vxx.mt-8').eq(0).click({ force: true });
    cy.get('.constructor-element__row').should('contain', bun);
    cy.contains('button', 'Оформить заказ').click({force: true}); 
    
    cy.visit('http://localhost:4000/login');
    cy.get(email).click({force: true});
    cy.get(password).click({force: true});
    cy.get('button').contains('Войти').click({force: true});
    cy.wait('@login');
    cy.url().should('not.include', '/login');
    cy.contains('Оформить заказ').as('orderButton');
    cy.get('@orderButton').should('be.enabled').click({force: true});
    cy.wait(1000);
    cy.get('[data-test-id="modal"]').should('exist');
    cy.get('[data-test-id="modal-close"]').click();
    cy.get('[data-test-id="modal"]')
      .should('not.be.visible')
      .children('')
      .should('have.length', 0);
  });
});