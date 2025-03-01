# Sistema ERP de software Empresarial

Um sistema ERP completo para gerenciamento de empresarial, clientes, produtos, projetos, frota e facilities, desenvolvido com Vue 3, TypeScript e Vite.

## 📋 Funcionalidades

O sistema inclui os seguintes módulos:

- **Dashboard**: Visão geral com estatísticas e indicadores de desempenho
- **Clientes**: Cadastro e gerenciamento de clientes
- **Produtos**: Cadastro e controle de estoque de produtos e serviços
- **Faturas**: Emissão e controle de faturas
- **Projetos**: Gerenciamento de projetos com tarefas e recursos
- **Gestão de Frota**:
  - Veículos: Cadastro e manutenção de veículos
  - Motoristas: Gerenciamento de motoristas
  - Rotas: Planejamento e acompanhamento de rotas de entrega
- **Gestão de Facilities**:
  - Instalações: Gerenciamento de prédios e locais
  - Salas: Controle de salas e espaços
  - Manutenção: Agendamento e controle de manutenções
  - Consumo: Monitoramento de consumo de recursos (água, luz, etc.)

## 🚀 Tecnologias Utilizadas

- **Vue 3**: Framework JavaScript progressivo
- **TypeScript**: Superset tipado de JavaScript
- **Vite**: Build tool e servidor de desenvolvimento
- **Vue Router**: Roteamento oficial para Vue.js
- **Pinia**: Gerenciamento de estado para Vue
- **date-fns**: Biblioteca para manipulação de datas

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/simple-invoicing-erp.git
   cd simple-invoicing-erp
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Acesse o sistema no navegador:
   ```
   http://localhost:5173
   ```

## 📦 Build para Produção

Para gerar os arquivos de produção otimizados:

```bash
npm run build
# ou
yarn build
```

Os arquivos serão gerados na pasta `dist` e podem ser servidos por qualquer servidor web estático.

## 🧩 Estrutura do Projeto

```
simple-invoicing-erp/
├── public/              # Arquivos estáticos
├── src/
│   ├── assets/          # Recursos (imagens, fontes, etc.)
│   ├── components/      # Componentes Vue reutilizáveis
│   ├── router/          # Configuração de rotas
│   ├── stores/          # Stores Pinia para gerenciamento de estado
│   ├── types/           # Definições de tipos TypeScript
│   ├── views/           # Componentes de página
│   ├── App.vue          # Componente raiz
│   ├── main.ts          # Ponto de entrada da aplicação
│   └── style.css        # Estilos globais
├── index.html           # Template HTML
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração do TypeScript
└── vite.config.ts       # Configuração do Vite
```

## 📚 Guia de Uso

### Dashboard

O dashboard apresenta uma visão geral do sistema com estatísticas importantes como:
- Total de faturas e receita
- Número de clientes e produtos
- Projetos ativos
- Status da frota
- Informações sobre facilities

### Clientes

Neste módulo você pode:
- Visualizar a lista de clientes
- Adicionar novos clientes
- Editar informações de clientes existentes
- Excluir clientes

### Produtos

Gerenciamento completo de produtos e serviços:
- Cadastro de produtos
- Definição de preços
- Controle de estoque
- Edição e exclusão de produtos

### Faturas

Emissão e controle de faturas:
- Criar novas faturas
- Adicionar itens às faturas
- Definir datas de emissão e vencimento
- Acompanhar status de pagamento
- Visualizar detalhes de faturas

### Projetos

Gerenciamento de projetos:
- Criar projetos com orçamento e cronograma
- Adicionar tarefas e atribuir responsáveis
- Acompanhar progresso das tarefas
- Gerenciar recursos do projeto
- Visualizar custos e prazos

### Gestão de Frota

#### Veículos
- Cadastro de veículos com informações detalhadas
- Registro de manutenções
- Controle de abastecimento
- Gestão de documentos

#### Motoristas
- Cadastro de motoristas
- Controle de CNH e documentação
- Acompanhamento de status (disponível, em rota, etc.)

#### Rotas
- Planejamento de rotas de entrega
- Definição de destinos e horários
- Acompanhamento em tempo real
- Histórico de entregas

### Gestão de Facilities

#### Instalações
- Cadastro de prédios e locais
- Informações detalhadas (tamanho, tipo, endereço)
- Status de ocupação e manutenção

#### Salas
- Gerenciamento de salas e espaços
- Controle de equipamentos
- Sistema de reservas

#### Manutenção
- Agendamento de manutenções preventivas e corretivas
- Registro de fornecedores e custos
- Histórico de manutenções

#### Consumo
- Registro de consumo de recursos (água, luz, gás)
- Acompanhamento de custos
- Análise de tendências

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através de [seu-email@exemplo.com](mailto:seu-email@exemplo.com).