# React
Programação Orientada a Eventos

Desenvolvido por: [Amandio Arnoldo Hoffmann](https://github.com/AmandioHoffmanna) e [Vinícius da Veiga](https://github.com/viniciusdaveigaa)

As configurações foram realizadas com base na documentação disponível pelo professor, seguindo os seguintes passos:

Passo a Passo:
Configuração do Ambiente
Backend (Node.js):
Certifique-se de que o Node.js está instalado na sua máquina. Você pode verificar usando o comando: 
node -v
Instale o TypeScript globalmente: 
npm install -g typescript
Criar o Projeto Front-End:
Crie uma pasta para o seu projeto de front-end, por exemplo:
pasta: smart-home-frontend
Obs: Acesse a pasta smart-home para executar os próximos comandos.
npx create-react-app frontend --template typescript

Criar o Projeto Back-End:
Crie uma pasta para o seu projeto de back-end:
pasta: smart-home-backend
Acesse a pasta do backend e inicie um novo projeto Node.js:
npm init -y
Instale as dependências necessárias no back-end:
npm install express socket.io cors typescript ts-node-dev @types/node @types/express @types/socket.io npx tsc --init

Configurar o TypeScript no Back-End:
Configure o arquivo tsconfig.json criando anteriormente:
encontre o arquivo tsconfig.json no projeto, se não existir, pode ser criado.
Substitui o conteúdo gerado pelo conteúdo abaixo:
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}

Desenvolvimento do Backend (Node.js):
O servidor será responsável por simular os dispositivos e comunicar as atualizações para o front-end via eventos.
Dentro da pasta backend, crie o diretório src e o arquivo index.ts.
Configurar o nodemon para TypeScript:
Instale o nodemon:  npm install nodemon
Crie um arquivo nodemon.json na raiz do projeto com o seguinte conteúdo:
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/index.ts"
}
Adicione o seguinte script ao seu package.json localizado na raiz do projeto, localize a lista "scripts":
"scripts": { 
"start": "nodemon" 
}

Desenvolvimento do Frontend (React):
Instale as dependências do projeto:
npm install socket.io-client
Como você está utilizando TypeScript, é necessário instalar também as definições de tipo para o socket.io-client. Execute o seguinte comando:
npm install @types/socket.io-client --save-dev
