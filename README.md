# GamiF - Quiz Interativo & Gamificado

![GamiF Logo](assets/image/gamif_logo.png) ## 🚀 Visão Geral do Projeto

O **GamiF** é um sistema de quiz interativo e gamificado meticulosamente projetado para auxiliar estudantes na fixação de conteúdos teóricos. Com foco inicial nos desafios do curso de Análise e Desenvolvimento de Sistemas (ADS), a plataforma transcende os formatos tradicionais de avaliação, combinando a seriedade dos quizzes com a leveza e o dinamismo da gamificação. Ao incorporar mecânicas de jogos (pontuação, níveis, desafios e recompensas), o GamiF visa aumentar o engajamento, a retenção de conhecimento e a autonomia dos estudantes, transformando o processo de estudo em uma jornada contínua de aprendizado e superação.

## ✨ Funcionalidades Principais

* **Quizzes Interativos:** Teste de conhecimentos em tempo real com feedback imediato.
* **Gamificação:** Elementos como pontuação, progresso individual e mensagens motivacionais.
* **Módulos de Aprendizado:** Conteúdos organizados por disciplinas (Ex: Algoritmos, Banco de Dados, POO).
* **Acompanhamento de Progresso:** Visualização do desempenho em cada módulo (porcentagem de acerto, estrelas/troféus).
* **Acesso Flexível:** Jogue quizzes sem necessidade de cadastro (progresso não salvo) ou realize login para acompanhar seu desempenho.
* **Login Conveniente:** Opções de login tradicional (e-mail/senha) e social (via Google).
* **Interface Responsiva:** Design adaptável para diferentes dispositivos (desktop, tablet, mobile).

## 🎯 Objetivos do Projeto

### Objetivo Geral
Desenvolver um sistema de quiz interativo e gamificado que proporcione uma experiência dinâmica, personalizada e motivadora para estudantes na aprendizagem de conteúdos teóricos.

### Objetivos Específicos
* Proporcionar uma ferramenta de apoio ao aprendizado baseada em quizzes e desafios.
* Aplicar técnicas de gamificação para aumentar o engajamento dos usuários.
* Permitir acompanhamento de desempenho e progresso individual.
* Desenvolver uma interface simples, acessível e responsiva.
* Oferecer feedback instantâneo para reforçar o aprendizado.
* Tornar o sistema aplicável a diferentes disciplinas e conteúdos teóricos.

## 👥 Público-Alvo

* Alunos do curso de Análise e Desenvolvimento de Sistemas (ADS) do IFBA - Campus Valença.
* Estudantes de outras áreas do conhecimento interessados em aprender de forma interativa.
* Professores em busca de ferramentas de apoio ao processo de ensino.

## 🛠️ Tecnologias Utilizadas

O GamiF foi desenvolvido utilizando um stack de tecnologias moderno e robusto:

* **Frontend:**
    * **HTML5:** Estrutura e semântica do conteúdo.
    * **CSS3:** Estilização e layout responsivo.
    * **JavaScript (ES6+):** Lógica da aplicação e interatividade.
    * **Módulos ES com `importmap`:** Organização e carregamento otimizado do código JavaScript.
    * **`confetti-js`:** Biblioteca para efeitos visuais de confetes na gamificação.
* **Backend:**
    * **Firebase Functions (Sugestão):** Backend serverless para gerenciar a lógica de negócio, autenticação e interação com o banco de dados.
* **Banco de Dados:**
    * **Firebase Realtime Database / Firestore (Sugestão):** Armazenamento e sincronização de dados em tempo real, com integração nativa para autenticação.

## 🧩 Arquitetura do Sistema

O GamiF segue uma arquitetura em camadas, facilitando a separação de responsabilidades e a escalabilidade:

* **Frontend:** Interface do usuário (UI) que interage diretamente com o navegador.
* **Backend:** Servidor de aplicação (API) que processa a lógica de negócio e se comunica com o banco de dados.
* **Database:** Armazenamento persistente dos dados do sistema (usuários, quizzes, progresso).

*([https://drive.google.com/file/d/19_QBu7iIXAPJTy9l_coCD9qG3TbkelO1/view?usp=drive_link](url))*

## ⚙️ Metodologia de Desenvolvimento

O projeto adota a **metodologia ágil XP (Extreme Programming)**, priorizando:
* Entrega rápida de funcionalidades.
* Desenvolvimento incremental e melhoria contínua.
* Feedback constante.
* Simplicidade no código e comunicação aberta.
* Testes frequentes e integração contínua.

As etapas de desenvolvimento são organizadas em um backlog, incluindo planejamento, levantamento de requisitos, prototipagem, configuração de ambiente, criação de banco de dados, desenvolvimento de frontend e backend, testes e documentação.

## 🚀 Como Executar o Projeto Localmente

Para rodar o GamiF em sua máquina, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone [[https://github.com/micaelrosario/Projeto_GamiF](url)]
    cd GAMiF
    ```
2.  **Abra no Navegador:**
    * Este é um projeto **Frontend puro** que pode ser aberto diretamente no navegador.
    * Abra o arquivo `index.html` em seu navegador web preferido.
    * **Recomendado:** Utilize uma extensão como o "Live Server" do VS Code para servir os arquivos localmente e habilitar a recarga automática.

3.  **Configuração do Backend (se aplicável):**
    * Se você estiver usando Firebase Functions, certifique-se de que suas funções estão deployadas e acessíveis publicamente.
    * As credenciais de acesso ao Firebase e URLs de API devem ser configuradas conforme as variáveis de ambiente ou arquivos de configuração do projeto (se houver).

## 🤝 Contribuição

Contribuições são bem-vindas! Se você tiver sugestões, melhorias ou encontrar bugs, por favor, abra uma issue ou envie um pull request.

## 📝 Licença

[Micael Santos do Rosário]

## 📞 Contato

Micael Santos do Rosário - [[202216360004@ifba.edu.br](url)]

---
