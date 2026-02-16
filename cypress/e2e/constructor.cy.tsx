describe('Проверяем работу BurgerConstructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '*/ingredients', {fixture: 'ingredients.json'}).as('getIngredients');

    cy.intercept('GET', '*/auth/user', {fixture: 'user.json'}).as('getUser');

    cy.intercept('POST', '*/orders', { fixture: 'order.json' }).as('createOrder');

    cy.setCookie('accessToken', 'mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Тестирование добавления ингредиентов в заказ', () => {

    cy.get('[data-cy="add-ingredient-bun"]').find('button').click({ force: true });
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');


    cy.get('[data-cy="add-ingredient-main"]').find('button').click({ force: true });
    cy.get('[data-cy="constructor-filling"]').should('exist');
  });

  it('Тестирование открытия и закрытия модального окна ингредиента', () => {
    cy.get('[data-cy="ingredient-bun"]').first().within(() => {
      cy.get('p.text_type_main-default').invoke('text').as('ingredientName');
    });

    cy.get('[data-cy="ingredient-bun"]').first().click()

    cy.url().should('include', '/ingredients/');

    cy.get('@ingredientName').then((name) => {
      cy.contains(name.trim()).should('be.visible');
    });

    cy.get('[data-cy="modal-close"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    cy.get('[data-cy="ingredient-bun"]').first().click()

    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('Тестирование процесса создания заказа', () => {
    cy.wait('@getUser').its('response.statusCode').should('eq', 200);
    cy.wait('@getUser').then((interception) => {
      expect(interception.response?.body).to.have.property('success', true);
      expect(interception.response?.body.user).to.have.property('email');
    });

    cy.getCookie('accessToken').should('have.property', 'value', 'mock-access-token');
    cy.window().its('localStorage').invoke('getItem', 'refreshToken')
      .should('eq', 'mock-refresh-token');
    
    cy.get('[data-cy="add-ingredient-bun"]').find('button').click({ force: true });
    cy.get('[data-cy="add-ingredient-main"]').find('button').click({ force: true });

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

    cy.get('[data-cy="modal-order"]').should('be.visible');
    cy.contains('12345').should('be.visible');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal-order"]').should('not.exist');

    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
    cy.get('[data-cy="constructor-filling"]').should('not.exist');
  });
})