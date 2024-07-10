context ('MÚLTIPLAS ABAS - Exercícios relacionados ao arquivo Lessons > 07.md', ()=>{
    it ('Exercício 07 - Extra 02 - Testa a página da política de privacidade de forma independente', ()=>{
        cy.visit ('./src/privacy.html');
        cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade').should('be.visible');
    })
})