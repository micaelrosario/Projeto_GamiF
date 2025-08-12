// data.js - Módulo de Definição de Módulos e Dados de Quizzes

// modules: Array de objetos, onde cada objeto representa um módulo de quiz na aplicação.
// Contém metadados sobre cada módulo que serão exibidos na tela inicial.
export const modules = [
    { 
        id: "logica-programacao", 
        title: "Lógica de Programação",
        description: "Pense e programe! Resolva problemas com lógica e algoritmos.",
        image: "./assets/image/logica.png",
        locked: false
    },
    {
        id: "estrutura-dados", 
        title: "Estrutura de Dados",
        description: "Organize informações de forma eficiente com listas, pilhas e filas.",
        image: "./assets/image/estrutura-de-dados.png",
        locked: false
    },
    {
        id: "banco-dados",
        title: "Banco de Dados",
        description: "Aprenda conceitos de modelagem, SQL e NoSQL.",
        image: "./assets/image/banco_de_dados.png",
        locked: false
    },
    {
        id: "poo",
        title: "Programação Orientada a Objetos",
        description: "Entenda classes, objetos, herança e polimorfismo.",
        image: "./assets/image/poo1.png",
        locked: false,
    },
    {
        id: "engenharia-software",
        title: "Engenharia de Software",
        description: "Transforme ideias em software de alta qualidade!",
        image: "./assets/image/engenharia-de-software.png",
        locked: false
    },
    {
        id: "redes-computadores",
        title: "Redes de Computadores",
        description: "Entenda redes, protocolos e a segurança que move a internet.",
        image: "./assets/image/redes_de_computadores.png",
        locked: false
    }
];

// quizData: Objeto que armazena as perguntas e respostas de cada quiz, indexado pelo ID do módulo.
// Cada chave neste objeto corresponde ao 'id' de um módulo definido no array 'modules'.
export const quizData = {
    // Dados do quiz para o módulo 'Lógica de Programação'
    "logica-programacao": {
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
    },
    "banco-dados": {
      "description": "Aprenda conceitos de modelagem, SQL e NoSQL.",
      questions: [
        {
          correctAnswer: "Organizar, armazenar, recuperar e gerenciar dados de forma eficiente e segura.",
          explanation: "Um <strong>SGBD</strong> (Sistema Gerenciador de Banco de Dados) é um software que permite aos usuários definir, criar, manter e controlar o acesso a um banco de dados. Seu principal objetivo é garantir a integridade, segurança e eficiência no acesso aos dados.",
          options: [
            "Executar programas e jogos no computador.",
            "Gerenciar o hardware e os dispositivos periféricos.",
            "Organizar, armazenar, recuperar e gerenciar dados de forma eficiente e segura.",
            "Criar interfaces gráficas para aplicativos de software."
          ],
          question: "Qual o principal objetivo de um Sistema Gerenciador de Banco de Dados (SGBD)?"
        },
        {
          correctAnswer: "SELECT",
          explanation: "O comando <strong>SELECT</strong> em SQL é a instrução fundamental para consultar e recuperar dados de um banco de dados. Ele permite especificar colunas, tabelas, condições de filtro (WHERE) e ordenação (ORDER BY).",
          options: [
            "INSERT INTO",
            "UPDATE",
            "DELETE FROM",
            "SELECT"
          ],
          question: "Em SQL, qual comando é usado para recuperar dados de uma ou mais tabelas?"
        },
        {
          correctAnswer: "Bancos de dados relacionais usam tabelas e esquemas fixos, NoSQL tem flexibilidade de esquema e não usa tabelas tradicionais.",
          explanation: "Bancos de dados <strong>Relacionais</strong> (SQL) são baseados em tabelas com um esquema predefinido e relações bem definidas. Bancos de dados <strong>NoSQL</strong> (Not only SQL) oferecem flexibilidade de esquema, são geralmente mais escaláveis horizontalmente e são otimizados para tipos específicos de dados ou modelos de acesso (documento, chave-valor, grafo, coluna).",
          options: [
            "Bancos de dados relacionais só armazenam texto, enquanto NoSQL armazena imagens.",
            "Bancos de dados relacionais usam tabelas e esquemas fixos, NoSQL tem flexibilidade de esquema e não usa tabelas tradicionais.",
            "NoSQL é sempre mais rápido que relacional para qualquer tipo de aplicação.",
            "Bancos de dados relacionais são mais fáceis de escalar horizontalmente que NoSQL."
          ],
          "question": "Qual é a principal diferença entre um Banco de Dados Relacional e um Banco de Dados NoSQL?"
        },
        {
          correctAnswer: "Um conceito do mundo real, como uma pessoa, lugar ou coisa, sobre o qual queremos armazenar informações.",
          explanation: "No <strong>Diagrama de Entidade-Relacionamento (DER)</strong>, uma Entidade representa um objeto ou conceito do mundo real (ex: Cliente, Produto, Pedido) que possui características (atributos) e sobre o qual queremos coletar e armazenar dados no banco.",
          options: [
            "Uma ação ou processo que o sistema realiza.",
            "Um atributo que descreve uma característica dos dados.",
            "Um conceito do mundo real, como uma pessoa, lugar ou coisa, sobre o qual queremos armazenar informações.",
            "Uma regra de negócio que o banco de dados deve seguir."
          ],
          question: "No contexto de modelagem de dados, o que representa uma Entidade em um Diagrama de Entidade-Relacionamento (DER)?"
        },
        {
          correctAnswer: "Banco de Dados Orientado a Documentos",
          explanation: "Bancos de dados <strong>Orientados a Documentos</strong> (como MongoDB, Couchbase, e Firestore) armazenam dados em documentos flexíveis e semi-estruturados, geralmente em formatos como JSON ou BSON. Isso os torna muito adequados para dados que não se encaixam bem em um esquema rígido de tabela.",
          options: [
            "Banco de Dados de Chave-Valor",
            "Banco de Dados Orientado a Colunas",
            "Banco de Dados de Grafo",
            "Banco de Dados Orientado a Documentos"
          ],
          question: "Qual tipo de Banco de Dados NoSQL é ideal para armazenar documentos semi-estruturados como JSON ou XML?"
        }
      ],
      title: "Banco de Dados"
    },
    "engenharia-software": {
      questions: [
        {
          correctAnswer: "Desenvolver softwares de forma sistemática, disciplinada, quantificável e eficiente.",
          explanation: "A <strong>Engenharia de Software</strong> aplica princípios de engenharia ao desenvolvimento de software, visando à criação de produtos de alta qualidade, dentro do prazo e orçamento, utilizando abordagens sistemáticas e métodos de gerenciamento eficazes.",
          options: [
            "Apenas codificar programas rapidamente.",
            "Desenvolver softwares de forma sistemática, disciplinada, quantificável e eficiente.",
            "Gerenciar a infraestrutura de rede de uma empresa.",
            "Criar designs gráficos para interfaces de usuário."
          ],
          question: "Qual é o principal objetivo da Engenharia de Software?"
        },
        {
          correctAnswer: "Análise de Requisitos",
          explanation: "A fase de <strong>Análise de Requisitos</strong> é crucial. Nela, as necessidades e expectativas dos stakeholders são coletadas, analisadas, documentadas e validadas para definir o que o software deve fazer antes de qualquer codificação.",
          options: [
            "Implementação",
            "Testes",
            "Análise de Requisitos",
            "Manutenção"
          ],
          question: "Em um ciclo de vida de desenvolvimento de software, qual fase foca na compreensão das necessidades dos usuários e das restrições do sistema?"
        },
        {
          correctAnswer: "Documentação extensa e detalhada no início do projeto.",
          explanation: "Metodologias <strong>Ágeis</strong> (como Scrum, Kanban) priorizam 'indivíduos e interações sobre processos e ferramentas', 'software funcionando sobre documentação abrangente', e 'resposta à mudança sobre seguir um plano', preferindo a comunicação e entrega incremental à documentação excessiva inicial.",
          options: [
            "Iterações curtas e incrementais.",
            "Flexibilidade a mudanças e adaptação contínua.",
            "Documentação extensa e detalhada no início do projeto.",
            "Colaboração próxima com o cliente."
          ],
          question: "Qual das seguintes não é uma característica de uma Metodologia Ágil?"
        },
        {
          correctAnswer: "Um erro, falha ou defeito no código que faz com que o software se comporte de maneira inesperada.",
          explanation: "No jargão da programação, um <strong>bug</strong> é um erro de codificação que causa um mau funcionamento ou resultado incorreto no software. A depuração (debugging) é o processo de encontrar e corrigir esses bugs.",
          options: [
            "Um software malicioso que ataca o sistema.",
            "Uma funcionalidade extra não solicitada pelo cliente.",
            "Um erro, falha ou defeito no código que faz com que o software se comporte de maneira inesperada.",
            "Um recurso de segurança que protege o software."
          ],
          question: "O que é um 'bug' no contexto de desenvolvimento de software?"
        },
        {
          correctAnswer: "Aumenta a velocidade e a repetibilidade dos testes, permitindo feedback mais rápido.",
          explanation: "A <strong>automação de testes</strong> permite que testes sejam executados de forma rápida e consistente em cada nova versão do software. Isso acelera o ciclo de feedback, detecta regressões precocemente e libera tempo para testes exploratórios manuais mais complexos, melhorando a qualidade geral do software.",
          options: [
            "Elimina completamente a necessidade de testes manuais.",
            "Aumenta a velocidade e a repetibilidade dos testes, permitindo feedback mais rápido.",
            "Torna o software imune a todos os tipos de falhas.",
            "É aplicável apenas a projetos muito pequenos e simples."
          ],
          question: "Qual a principal vantagem da automação de testes em Engenharia de Software?"
        }
      ]
    },
    "estrutura-dados": {
      questions: [
        {
          correctAnswer: "Uma forma de organizar, gerenciar e armazenar dados eficientemente para acesso e manipulação.",
          explanation: "Uma <strong>Estrutura de Dados</strong> é uma maneira particular de organizar dados em um computador para que eles possam ser usados de forma eficiente. Ela define a relação entre os dados e as operações que podem ser realizadas sobre eles, otimizando a performance do software.",
          options: [
            "Um tipo de linguagem de programação para organizar dados em um banco.",
            "Uma forma de organizar, gerenciar e armazenar dados eficientemente para acesso e manipulação.",
            "Um algoritmo complexo para realizar cálculos matemáticos.",
            "Um hardware específico para processar informações em alta velocidade."
          ],
          question: "O que é uma Estrutura de Dados?"
        },
        {
          correctAnswer: "Pilha (Stack)",
          explanation: "Uma <strong>Pilha (Stack)</strong> opera no princípio LIFO (Last In, First Out), significando que o último elemento adicionado é o primeiro a ser removido, como uma pilha de pratos. Uma Fila opera com FIFO (First In, First Out).",
          options: [
            "Fila (Queue)",
            "Lista Encadeada",
            "Pilha (Stack)",
            "Árvore Binária"
          ],
          question: "Qual das seguintes estruturas de dados acessa elementos com base no princípio LIFO (Last In, First Out)?"
        },
        {
          correctAnswer: "O filho esquerdo é menor que o pai e o filho direito é maior.",
          explanation: "Em uma <strong>Árvore Binária de Busca (BST)</strong>, para qualquer nó, todos os valores na sua subárvore esquerda são menores que o seu próprio valor, e todos os valores na sua subárvore direita são maiores que o seu próprio valor. Isso otimiza buscas, inserções e remoções.",
          options: [
            "O filho esquerdo é maior que o pai e o filho direito é menor.",
            "Ambos os filhos devem ter o mesmo valor do pai.",
            "O filho esquerdo é menor que o pai e o filho direito é maior.",
            "A ordem dos filhos é aleatória e não segue um padrão."
          ],
          question: "Em uma Árvore Binária de Busca (BST), qual é a característica principal dos nós filhos em relação ao nó pai?"
        },
        {
          correctAnswer: "Arrays exigem o deslocamento de múltiplos elementos, o que é ineficiente.",
          explanation: "Em um <strong>Array</strong>, inserir ou remover um elemento no meio requer o deslocamento de todos os elementos subsequentes para abrir espaço ou fechar o buraco, o que pode ser uma operação custosa (O(n)). Em uma Lista Encadeada, basta ajustar alguns ponteiros (O(1)), embora o acesso por índice seja mais lento.",
          options: [
            "Arrays ocupam mais espaço em memória.",
            "Listas Encadeadas permitem acesso direto a qualquer elemento.",
            "Arrays exigem o deslocamento de múltiplos elementos, o que é ineficiente.",
            "Listas Encadeadas são mais complexas de implementar."
          ],
          question: "Qual a principal desvantagem de um Array (vetor) em relação a uma Lista Encadeada quando se trata de inserções e remoções no meio da estrutura?"
        },
        {
          correctAnswer: "Para modelar relações complexas entre objetos, como redes sociais ou rotas de cidades.",
          explanation: "Um <strong>Grafo</strong> é ideal para representar entidades e suas conexões. Cada nó (vértice) representa uma entidade e cada aresta representa uma relação. Isso é perfeito para modelar redes sociais (pessoas e suas amizades), rotas de transporte (cidades e estradas) e outras relações não-lineares/não-hierárquicas.",
          options: [
            "Para armazenar uma coleção ordenada de elementos sem repetição.",
            "Para representar hierarquias como sistemas de arquivos ou estruturas organizacionais.",
            "Para modelar relações complexas entre objetos, como redes sociais ou rotas de cidades.",
            "Para gerenciar tarefas que precisam ser executadas em uma ordem específica de chegada."
          ],
          question: "Em qual cenário um Grafo (Graph) é a estrutura de dados mais indicada?"
        }
      ]
    },
    "poo": {
      questions: [
        {
          correctAnswer: "Classe é um molde ou projeto, e Objeto é uma instância concreta desse molde.",
          explanation: "Uma <strong>Classe</strong> é como uma planta de construção, um modelo que define atributos (características) e métodos (comportamentos). Um <strong>Objeto</strong> é a casa construída a partir dessa planta, uma instância real e concreta da classe, com seus próprios valores para os atributos.",
          options: [
            "Classe é uma função e Objeto é uma variável.",
            "Classe é um molde ou projeto, e Objeto é uma instância concreta desse molde.",
            "Classe define o comportamento e Objeto define os atributos.",
            "Classe é estática e Objeto é dinâmico."
          ],
          question: "Em POO, qual a principal diferença entre uma Classe e um Objeto?"
        },
        {
          correctAnswer: "Encapsulamento",
          explanation: "O <strong>Encapsulamento</strong> é o pilar da POO que visa a proteger os dados internos de um objeto de acessos externos diretos e não controlados. Ele agrupa dados e os métodos que os manipulam dentro de uma classe, controlando o acesso através de interfaces bem definidas (getters e setters).",
          options: [
            "Herança",
            "Polimorfismo",
            "Encapsulamento",
            "Abstração"
          ],
          question: "Qual dos pilares da POO foca em agrupar dados e métodos que operam sobre esses dados em uma única unidade, escondendo os detalhes internos da implementação?"
        },
        {
          correctAnswer: "Um mecanismo onde uma classe (subclasse) adquire propriedades e comportamentos de outra classe (superclasse).",
          explanation: "A <strong>Herança</strong> permite que uma classe 'filha' (subclasse) reutilize e estenda atributos e métodos de uma classe 'pai' (superclasse). Isso promove a reutilização de código e estabelece relações 'É-UM' (ex: um 'Carro' É UM 'Veículo').",
          options: [
            "A capacidade de um objeto ter múltiplas formas.",
            "O processo de esconder os detalhes de implementação de uma classe.",
            "Um mecanismo onde uma classe (subclasse) adquire propriedades e comportamentos de outra classe (superclasse).",
            "A criação de várias instâncias de uma mesma classe."
          ],
          question: "O que é Herança em Programação Orientada a Objetos?"
        },
        {
          correctAnswer: "Polimorfismo",
          explanation: "O <strong>Polimorfismo</strong> (que significa 'muitas formas') permite que objetos de diferentes classes, que compartilham uma superclasse ou implementam uma interface comum, respondam a um mesmo método de formas diferentes, dependendo de sua própria implementação específica. Isso aumenta a flexibilidade e a extensibilidade do código.",
          options: [
            "Encapsulamento",
            "Herança",
            "Abstração",
            "Polimorfismo"
          ],
          question: "Qual pilar da POO permite que objetos de diferentes classes sejam tratados de forma uniforme através de uma interface comum, mesmo que suas implementações sejam distintas?"
        },
        {
          correctAnswer: "Focar nos aspectos essenciais de um objeto, ignorando os detalhes irrelevantes para um determinado contexto.",
          explanation: "A <strong>Abstração</strong> é o pilar da POO que consiste em expor apenas o que é essencial para o uso de um objeto, escondendo a complexidade interna. Pense em um controle remoto: você usa os botões essenciais (volume, canal) sem precisar saber como os circuitos internos funcionam.",
          options: [
            "Criar métodos sem corpo que devem ser implementados por subclasses.",
            "A capacidade de um programa lidar com erros de forma elegante.",
            "Focar nos aspectos essenciais de um objeto, ignorando os detalhes irrelevantes para um determinado contexto.",
            "Transformar um objeto em um tipo de dado primitivo."
          ],
          question: "O que significa 'Abstração' em POO?"
        }
      ]
    },
    "redes-computadores": {
      questions: [
        {
          correctAnswer: "Permitir a comunicação e o compartilhamento de recursos entre dispositivos conectados.",
          explanation: "Uma <strong>rede de computadores</strong> é um conjunto de dispositivos interconectados que podem trocar dados e compartilhar recursos (como impressoras, arquivos e acesso à internet), facilitando a comunicação e a colaboração.",
          options: [
            "Aumentar a velocidade de processamento de um único computador.",
            "Permitir a comunicação e o compartilhamento de recursos entre dispositivos conectados.",
            "Controlar a temperatura interna dos servidores.",
            "Reduzir o consumo de energia de um computador."
          ],
          question: "Qual o principal objetivo de uma rede de computadores?"
        },
        {
          correctAnswer: "HTTP (Hypertext Transfer Protocol)",
          explanation: "O <strong>HTTP</strong> (Hypertext Transfer Protocol) é o protocolo fundamental da World Wide Web. Ele define como os clientes (navegadores) e servidores web se comunicam para transferir documentos hipertexto, como páginas HTML, imagens e vídeos.",
          options: [
            "FTP (File Transfer Protocol)",
            "SMTP (Simple Mail Transfer Protocol)",
            "HTTP (Hypertext Transfer Protocol)",
            "DNS (Domain Name System)"
          ],
          question: "Qual protocolo é amplamente utilizado para navegação na web e transferência de páginas HTML?"
        },
        {
          correctAnswer: "Barramento (Bus)",
          explanation: "Na topologia de <strong>Barramento (Bus)</strong>, todos os dispositivos da rede estão conectados a um único cabo principal (o barramento). Os dados viajam ao longo deste cabo, e cada dispositivo verifica se os dados são destinados a ele.",
          options: [
            "Estrela (Star)",
            "Anel (Ring)",
            "Barramento (Bus)",
            "Malha (Mesh)"
          ],
          question: "Em topologias de rede, qual tipo conecta todos os dispositivos a um único cabo central?"
        },
        {
          correctAnswer: "Criptografar dados transmitidos e armazenados.",
          explanation: "A <strong>criptografia</strong> é uma medida de segurança essencial que transforma dados em um formato ilegível (criptotexto) para impedir o acesso não autorizado. Somente com a chave correta os dados podem ser descriptografados e lidos, protegendo a confidencialidade.",
          options: [
            "Desativar o firewall para acelerar a conexão.",
            "Usar senhas simples e previsíveis.",
            "Criptografar dados transmitidos e armazenados.",
            "Compartilhar todas as pastas da rede publicamente."
          ],
          question: "Qual das seguintes práticas é uma boa medida de segurança de rede para proteger dados confidenciais?"
        },
        {
          correctAnswer: "Um identificador numérico único atribuído a cada dispositivo conectado a uma rede de computadores.",
          explanation: "Um <strong>endereço IP (Internet Protocol)</strong> é um rótulo numérico (ou alfanumérico em IPv6) que identifica de forma única um dispositivo em uma rede de computadores que usa o Protocolo de Internet para comunicação. Ele é fundamental para rotear dados corretamente entre dispositivos.",
          options: [
            "Um nome de usuário para acessar a internet.",
            "Um número de telefone para conexões de rede.",
            "Um identificador numérico único atribuído a cada dispositivo conectado a uma rede de computadores.",
            "Um tipo de cabo de rede."
          ],
          question: "O que é um endereço IP?"
        }
      ]
    }
};