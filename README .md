
# 🏦 Bank Statement Analyzer AI

Uma aplicação inteligente que utiliza a **Gemini API** para analisar extratos bancários em PDF ou Excel, filtrar transações por nome e gerar relatórios profissionais em PDF.

## 🚀 Como Executar

Este projeto utiliza módulos ES6 nativos e TypeScript diretamente no navegador. Para rodar localmente:

1. Clone o repositório.
2. Certifique-se de ter uma `API_KEY` da Google Gemini configurada no seu ambiente.
3. Utilize um servidor estático simples (como a extensão "Live Server" do VS Code ou `npx serve .`).

## 📁 Estrutura do Projeto

- `components/`: Componentes React (Interface).
- `services/`: Lógica de extração de arquivos e integração com a IA Gemini.
- `index.html`: Ponto de entrada com todas as dependências via CDN.
- `App.tsx`: Gerenciamento de estado e fluxo principal.

## 🔒 Segurança

A aplicação processa os arquivos localmente no navegador e envia apenas o texto extraído para a API do Gemini via conexão segura. Nenhuma informação bancária é armazenada em servidores externos.

## 📄 Licença

MIT
