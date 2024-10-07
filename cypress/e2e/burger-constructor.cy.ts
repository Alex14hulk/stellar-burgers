import { bunSelector, common_button, constructor_element, modal, modal_close, testUrl } from "./constants";

describe('Тесты', () => {
  const email = 'input[name=email]';
  const password = 'input[name=password]';
  
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
    cy.get(common_button).eq(0).click({ force: true });
    cy.get(constructor_element).should('contain', bunSelector);
    cy.contains('button', 'Оформить заказ').click({force: true}); 
    
    cy.visit(`${testUrl}/login`);
    cy.get(email).click({force: true});
    cy.get(password).click({force: true});
    cy.get('button').contains('Войти').click({force: true});
    cy.wait('@login');
    cy.url().should('not.include', '/login');
    cy.get(common_button).eq(0).click({ force: true });
    cy.get(constructor_element).should('contain', bunSelector);
    cy.contains('Оформить заказ').as('orderButton');
    cy.get('@orderButton').should('be.enabled').click({force: true});
    cy.wait(1000);
    cy.get(modal).should('exist');
    cy.get(modal_close).click();
    cy.get(modal).should('not.exist');
    cy.get(constructor_element).should('not.exist');
  });
});