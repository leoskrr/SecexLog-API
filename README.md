# Secex-Backend

## Considerações:

- 1.Quanto ao uso do banco de dados: 

--> Fora utilizada a biblioteca Sequelize (https://sequelize.org/) para facilitar os processos envolvendo o MySQL e, para realizar qualquer comando dessa lib (como criar uma migration ou model) é necessário entrar na pasta src (cd src).

# --

- 2.Quanto à estrutura do código e pastas:

--> Todos os códigos que criarmos/editarmos estão na pasta "app" dentro de "src" e, dentro dessa pasta, estão contidas os models, controllers e utils (classes/funções do sistema, que não se encaixam em controller ou model, como por exemplo criptografar senha)

--> Todas as configurações do banco de dados (como nome e senha) estão dentro da pasta src>config>database

--> Todas as migrations estão/devem estar na dentro da pasta src>config>migrations (o sequelize criará automaticamente as migrations dentro dessa pasta ao rodar o comando "npx sequelize migration:create --name=nome_da_migração" NÃO ESQUECER DO QUE FOI FALADO NO TÓPICO 1).

--> Para requisições de autenticações (como por exemplo login), é de padrão criar uma pasta dentro de src>app chamada "middlewares"

--> as variáveis, campo dos bancos e etc estão em inglês, estando somente os comentários em português.

# --

# Sintam-se à vontade para modificar este arquivo com as considerações de vocês sobre qualquer coisa que fizerem no projeto. Vamos rumo ao sucesso!
