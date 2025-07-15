// data.js - Módulo de Definição de Módulos e Dados de Quizzes

// modules: Array de objetos, onde cada objeto representa um módulo de quiz na aplicação.
// Contém metadados sobre cada módulo que serão exibidos na tela inicial.
export const modules = [
    { 
        id: "logica-programacao",        // ID único do módulo (usado para referenciar o quizData e o progresso)
        title: "Lógica de Programação", // Título visível do módulo
        description: "Pense e programe! Resolva problemas com lógica e algoritmos.", // Descrição convidativa do módulo
        image: "./assets/image/logica.png", // Caminho da imagem de capa do módulo
        locked: false                   // Indica se o módulo está bloqueado (true) ou disponível (false)
    },
    { id: "estruturas-dados", title: "Estruturas de Dados", description: "Aprenda sobre listas, filas, pilhas, árvores e grafos.", image: "./assets/image/estrutura-de-dados.png", locked: true },
    { id: "banco-dados", title: "Banco de Dados", description: "Aprenda conceitos de modelagem, SQL e NoSQL.", image: "./assets/image/banco_de_dados.png", locked: true },
    { id: "poo", title: "Programação Orientada a Objetos", description: "Entenda classes, objetos, herança e polimorfismo.", image: "./assets/image/poo1.png", locked: true },
    { id: "engenharia-software", title: "Engenharia de Software", description: "Transforme ideias em software de alta qualidade!", image: "./assets/image/engenharia-de-software.png", locked: true },
    { id: "redes-computadores", title: "Redes de Computadores", description: "Entenda redes, protocolos e a segurança que move a internet.", image: "./assets/image/redes_de_computadores.png", locked: true }
];

// quizData: Objeto que armazena as perguntas e respostas de cada quiz, indexado pelo ID do módulo.
// Cada chave neste objeto corresponde ao 'id' de um módulo definido no array 'modules'.
export const quizData = {
    // Dados do quiz para o módulo 'Lógica de Programação'
    "logica-programacao": {
        // 'questions': Um array de objetos, onde cada objeto é uma pergunta do quiz.
        questions: [
            {
                question: "O que é um algoritmo?", // O enunciado da pergunta.
                options: [ // Array de strings com as opções de resposta.
                    "Um tipo de linguagem de programação.",
                    "Uma sequência finita de instruções bem definidas para resolver um problema.",
                    "Um componente de hardware do computador.",
                    "Um software para debugging de código."
                ],
                correctAnswer: "Uma sequência finita de instruções bem definidas para resolver um problema.", // A resposta correta (deve corresponder a uma das opções).
                explanation: "Um <strong>algoritmo</strong> é como uma receita: um conjunto de passos claros e ordenados que, quando seguidos corretamente, levam à solução de um problema específico ou à execução de uma tarefa." // Explicação da resposta para feedback.
            },
            {
                question: "Qual dos seguintes é um exemplo de estrutura de repetição (loop)?",
                options: [
                    "IF...ELSE",
                    "SWITCH...CASE",
                    "FOR",
                    "TRY...CATCH"
                ],
                correctAnswer: "FOR",
                explanation: "Estruturas de repetição, como <strong>FOR, WHILE, DO...WHILE</strong>, permitem que um bloco de código seja executado múltiplas vezes. 'IF...ELSE' e 'SWITCH...CASE' são estruturas condicionais, e 'TRY...CATCH' é para tratamento de exceções."
            },
            {
                question: "Em pseudocódigo, o que representa a atribuição de um valor a uma variável?",
                options: [
                    "variavel == 10",
                    "variavel <- 10",
                    "variavel -> 10",
                    "variavel :: 10"
                ],
                correctAnswer: "variavel <- 10",
                explanation: "A seta para a esquerda (<strong>&lt;-</strong>) é comumente usada em pseudocódigo para indicar que o valor à direita está sendo atribuído à variável à esquerda. O símbolo '=' também é usado, mas '&lt;-' é mais distintivo para atribuição em contextos de aprendizado de algoritmos."
            },
            {
                question: "O que é uma variável em programação?",
                options: [
                    "Uma constante que nunca muda de valor.",
                    "Um local na memória do computador reservado para armazenar um valor que pode mudar.",
                    "Uma função que realiza uma tarefa específica.",
                    "Um comentário no código que explica uma parte do programa."
                ],
                correctAnswer: "Um local na memória do computador reservado para armazenar um valor que pode mudar.",
                explanation: "Uma <strong>variável</strong> é um espaço nomeado na memória que armazena dados. Seu valor pode ser alterado durante a execução do programa, daí o nome 'variável'."
            },
            {
                question: "Qual o objetivo principal da lógica de programação?",
                options: [
                    "Escrever código na linguagem mais rápida.",
                    "Aprender a sintaxe de várias linguagens de programação.",
                    "Desenvolver a capacidade de criar sequências lógicas para resolver problemas.",
                    "Criar interfaces gráficas atraentes para o usuário."
                ],
                correctAnswer: "Desenvolver a capacidade de criar sequências lógicas para resolver problemas.",
                explanation: "A <strong>lógica de programação</strong> é a base para a construção de qualquer software. Ela ensina a organizar o pensamento de forma estruturada para que um computador possa entender e executar as instruções para resolver o problema."
            }
        ]
    }
};