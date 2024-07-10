/// <reference types="Cypress"/>
import { faker } from '@faker-js/faker';

describe('Central de Atendimento ao cliente TAT', () => {
    const THREE_SECONDS_IN_MS = 3000;

    const person = {
        firstName: "",
        lastName: "",
        email: "",
        obs: "",
        phone: ""
    }

    beforeEach('Exercício 02 - Acessando a aplicação.', () => {
        cy.visit('./src/index.html');

        person.firstName = faker.person.firstName();
        person.lastName = faker.person.lastName();
        person.email = faker.internet.email({ firstName: person.firstName });
        person.obs = Cypress._.repeat('123456789 !@#$%ˆ&*', 10) + '.';// faker.string.alphanumeric();
        person.phone = faker.phone.number('3#######');
    })

    context('Exercícios relacionados ao arquivo Lessons > 01.md', () => {

        it('Exercício 01 - Verifica o título da aplicação', () => {
            cy.title().should('to.be.equal', 'Central de Atendimento ao Cliente TAT');
        })

    });

    context('CAMPOS DE TEXTO - Exercícios relacionados ao arquivo Lessons > 02.md', () => {

        it('Exercício 02 - Extra 01 e 08 - Preenche os campos obrigatórios e envia o formulário', () => {
            cy.clock();
            cy.get('input#firstName').type(person.firstName);
            cy.get('input#lastName').type(person.lastName);
            cy.get('input#email').type(person.email);
            cy.get('textarea#open-text-area').type(person.obs, { delay: 0 });
            cy.contains('button', 'Enviar').click();
            cy.get('.success').should('be.visible');
            cy.tick(THREE_SECONDS_IN_MS);
            cy.get('.success').should('not.be.visible');

        })

        it('Exercício 02 - Extra 02 e 08  - Verifica que e-mail inválido não é permitido', () => {
            cy.get('input#email').type(person.email);
            cy.contains('button', 'Enviar').click();
            cy.get('.error').should('be.visible');

        })

        it('Exercício 02 - Extra 03 - Verifica que o telefone continua vazio ao informar caracteres alfabéticos', () => {
            cy.get('input#phone').type('ABCDEFGH').should('be.empty');

        })

        it('Exercício 02 - Extra 04 e 08  - Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
            cy.get('input#firstName').type(person.firstName);
            cy.get('input#lastName').type(person.lastName);
            cy.get('input#email').type(person.email);
            cy.get('#check #phone-checkbox').check();
            cy.get('textarea#open-text-area').type(person.obs, { delay: 50 });
            cy.contains('button', 'Enviar').click();
            cy.get('.error').should('be.visible');

        })

        it('Exercício 02 - Extra 05 - Preenche e limpa os campos nome, sobrenome, email e telefone', () => {
            cy.get('input#firstName').type(person.firstName).should('have.value', person.firstName).clear().should('be.empty');
            cy.get('input#lastName').type(person.lastName).should('have.value', person.lastName).clear().should('be.empty');
            cy.get('input#email').type(person.email).should('have.value', person.email).clear().should('be.empty');
            cy.get('input#phone').type(person.phone).should('have.value', person.phone).clear().should('be.empty');
        })

        it('Exercício 02 - Extra 06 e 08  - Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
            cy.contains('button', 'Enviar').click();
            cy.get('.error').should('be.visible');
        })

        it('Exercício 02 - Extra 07 e 08 - Envia o formuário com sucesso usando um comando customizado', () => {
            cy.fillMandatoryFieldsAndSubmit(person);
            cy.get('.success').should('be.visible');
        })
    });

    context('CAMPOS DE SELEÇÃO - Exercícios relacionados ao arquivo Lessons > 03.md', () => {
        it('Exercício 03 - Seleciona um produto (YouTube) por seu texto', () => {
            cy.get('#product').select('YouTube');
            cy.get('#product option:selected').should('have.text', 'YouTube')
        })

        it('Exercício 03 - Extra 01 - Seleciona um produto (Mentoria) por seu valor (value)', () => {
            cy.get('#product').select('mentoria').should('have.value', 'mentoria');
        })

        it('Exercício 03 - Extra 02 - Seleciona um produto (Blog) por seu índice', () => {
            cy.get('#product').select(1);
            cy.get('#product option:selected').should('have.text', 'Blog')
        })
    })

    context('RADIOBUTTONS - Exercícios relacionados ao arquivo Lessons > 04.md', () => {
        it('Exercício 04 - Marca o tipo de atendimento "Feedback"', () => {
            cy.get('#support-type input').check('feedback').should('be.checked').and('have.value', 'feedback');
        })

        it('Exercício 04 - Extra - Marca cada tipo de atendimento', () => {
            cy.get('#support-type input').should('have.length', 3).each(option => {
                cy.wrap(option).check().should('be.checked');
            })
        })
    })

    context('CHECKBOXES - Exercícios relacionados ao arquivo Lessons > 05.md', () => {
        it('Exercício 05 - Marca ambos checkboxes, depois desmarca o último', () => {
            cy.get('#check input').
                as('checkboxesContato').
                each(option => {
                    cy.wrap(option).should('not.be.checked');
                    cy.wrap(option).check().should('be.checked');
                })

            cy.get('@checkboxesContato').last().uncheck().should('not.be.checked');
        })
    })

    context('COMPONENTE DE UPLOAD - Exercícios relacionados ao arquivo Lessons > 06.md', () => {
        it('Exercício 06 - Seleciona um arquivo da pasta fixtures', () => {
            cy.get('#file-upload').
                should('not.have.value').
                selectFile('cypress/fixtures/example.json').
                should((inputFile) => {
                    console.log(inputFile);
                    expect(inputFile[0].files[0].name).to.be.equal('example.json');
                });
        })

        it('Exercício 06 - Extra 01 - Seleciona um arquivo simulando um drag-and-drop', () => {
            cy.get('#file-upload').selectFile('cypress/fixtures/example.json', { action: 'drag-drop' }).
                should((inputFile) => {
                    console.log(inputFile);
                    expect(inputFile[0].files[0].name).to.be.equal('example.json');
                })
        })

        it('Exercício 06 - Extra 02 - Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
            cy.fixture('example.json').as('sampleFile');
            cy.get('#file-upload').selectFile('@sampleFile').
                should((inputFile) => {
                    console.log(inputFile);
                    expect(inputFile[0].files[0].name).to.be.equal('example.json');
                })
        })
    })

    context('MÚLTIPLAS ABAS - Exercícios relacionados ao arquivo Lessons > 07.md', () => {
        it('Exercício 07 - Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
            cy.get('#privacy a').should('have.attr', 'target', '_blank');
        })

        it('Exercício 07 - Extra 01 - Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
            cy.contains('Política de Privacidade').
                should('have.attr', 'target', '_blank').
                invoke('removeAttr', 'target').
                click();
            cy.url().should('include', 'src/privacy.html');
        })
    })

    context('AVANÇADO - Exercícios relacionados ao arquivo Lessons > 11.md', () => {
        it('Exercício 11 - Exibe mensagem por 3 segundos', () => {
            cy.clock();
            cy.fillMandatoryFieldsAndSubmit(person);
            cy.get('.success').should('be.visible');
            cy.tick(THREE_SECONDS_IN_MS)
            cy.get('.success').should('not.be.visible');
        })

        it('Exercício 11 - Extra 01 - Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
            cy.contains('Política de Privacidade').
                should('have.attr', 'target', '_blank').
                invoke('removeAttr', 'target').
                click();
            cy.url().should('include', 'src/privacy.html');
        })

        it ('Exercício 11 - Extra 02 - Exibe e esconde as mensagens de sucesso e erro usando o .invoke()', () => {
            cy.get('.success')
                .should('not.be.visible')
                .invoke('show')
                .should('be.visible')
                .and('contain', 'Mensagem enviada com sucesso.')
                .invoke('hide')
                .should('not.be.visible');
            
            cy.get('.error')
                .should('not.be.visible')
                    .invoke('show')
                .should('be.visible')
                    .and('contain', 'Valide os campos obrigatórios!')
                    .invoke('hide')
                .should('not.be.visible');
        })

        it ('Exercício 11 - Extra 03 - Preenche a area de texto usando o comando invoke', ()=>{
            cy.get('textarea#open-text-area')
                .invoke('val', person.obs)
                .should('have.value', person.obs);
        })

        it ('Exercício 11 - Extra 04 - Preenche a area de texto usando o comando invoke', ()=>{
            cy.get('textarea#open-text-area')
                .invoke('val', person.obs)
                .should('have.value', person.obs);
        })

        it ('Exercício 11 - Extra 04 - Faz uma requisição HTTP', ()=>{
            cy.request('GET', 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
                .should((response)=>{
                    const {status, statusText, body} = response;
                    expect (status).to.be.equal (200);
                    expect (statusText).to.be.equal ('OK');
                    expect (body).to.include ('CAC TAT');
                })
        })

        it.only ('Exercício 12 - Desafio - Desafio (encontre o gato)', () => {
            cy.get('#cat')
                .should('not.be.visible')
                .invoke('show')
                .should('be.visible');
        })
    })
})
