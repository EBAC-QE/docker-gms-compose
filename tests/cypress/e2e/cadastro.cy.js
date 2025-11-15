describe('Cadastro de Usuário', () => {

  beforeEach(() => {
    cy.visit('/')
  });

  it('Deve fazer cadastro com sucesso', () => {
    let email = `usuario${Date.now()}@example.com`;
    cy.get('#signup-firstname').type('Fabio');
    cy.get('#signup-lastname').type('Araujo');
    cy.get('#signup-email').type(email);
    cy.get('#signup-phone').type('1234567890');
    cy.get('#signup-password').type('senhaSegura@123');
    cy.get('#signup-button').click();
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!');
  })
})