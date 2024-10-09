
# Desafio 01 conceitos de nodejs

Crud de tarefas e importação de arquivo csv.

## Instalação

```bash
  git clone https://github.com/andersonpensephp/desafio-node.git
  cd desafio-node
  npm i 
  npm run dev
```

## Rotas

```bash
  GET - /tasks
  POST - /tasks  // title e description, são obrigatórios na criação das tarefas
  PUT - /tasks/:id
  DELETE - /tasks/:id
  PATCH - /tasks/:id/complete
```

## Importação

```bash
  npm run import
```