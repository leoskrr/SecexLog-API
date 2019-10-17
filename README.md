# Secex-Backend

## Considerações:

- 1.Quanto ao uso do banco de dados: 

--> Fora utilizada a biblioteca Sequelize (https://sequelize.org/) para facilitar os processos envolvendo o MySQL e, para realizar qualquer comando dessa lib (como criar uma migration ou model) é necessário entrar na pasta src (cd src).

--> Sempre que for necessário criar uma nova tabela no banco de dados é aconselhável, pelo próprio Sequelize, criar um model (rodando o comando "npx sequelize-cli --name Nome_Do_Model --attributes atributo1:tipo,atributo2:tipo,...), pois assim as migrations já serão criadas automaticamente e podem ser encontradas na pasta migrations (src>config>migrations) (parte da documentação: https://sequelize.org/master/manual/migrations.html)

--> LEMBRANDO: Para rodar comandos do Sequelize (e somente dele) é necessário entrar na pasta src 

# --

- 2.Quanto à estrutura do código e pastas:

--> Todos os códigos que criarmos/editarmos estão na pasta "app" dentro de "src" e, dentro dessa pasta, estão contidas os models, controllers e utils (classes/funções do sistema que não se encaixam em controller ou model.Exemplo: criptografar senha)

--> Todas as configurações do banco de dados (como nome e senha) estão dentro da pasta src>config>database (um arquivo .env deve ser criado)

--> Para requisições de autenticações (como por exemplo login), é de padrão criar uma pasta dentro de src>app chamada "middlewares"

--> as variáveis, campos dos models e etc estão em inglês, estando somente os comentários em português.

# --

# Sintam-se à vontade para modificar este arquivo com as considerações de vocês sobre qualquer coisa que fizerem no projeto. Vamos rumo ao sucesso!
