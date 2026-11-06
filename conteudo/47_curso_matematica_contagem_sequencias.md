# Curso, módulo 47. Matemática 7: contagem, sequências, logaritmo e trigonometria

## Abertura do módulo

Este é o último módulo do curso. Ele reúne assuntos que aparecem menos vezes, mas que costumam decidir as notas mais altas: contar possibilidades, reconhecer padrões em sequências, e entender fenômenos que se repetem, como as ondas e as marés.

São sete aulas.

## Aula 1. O princípio fundamental da contagem

Quando uma escolha é feita em várias etapas, o total de possibilidades é a **multiplicação** das possibilidades de cada etapa. Esse é o **princípio fundamental da contagem**, ou princípio multiplicativo.

Exemplo: você tem 3 camisas e 2 calças. Quantas roupas diferentes consegue montar? Para cada camisa, há 2 calças: 3 vezes 2, que dá 6 combinações.

Exemplo: um restaurante oferece 4 entradas, 5 pratos principais e 3 sobremesas. Quantos cardápios completos? 4 vezes 5 vezes 3, que dá 60.

Exemplo: placas de carro, senhas e números de telefone usam essa ideia. Uma senha de 4 dígitos, de 0 a 9, podendo repetir, tem 10 vezes 10 vezes 10 vezes 10, ou seja, 10 000 possibilidades.

Se os elementos **não puderem se repetir**, a quantidade de opções vai diminuindo a cada etapa. Uma senha de 3 dígitos diferentes: 10 opções para o primeiro, 9 para o segundo, 8 para o terceiro. 10 vezes 9 vezes 8, que dá 720.

**Exercício rápido.** Um sorvete pode ter 1 de 6 sabores e 1 de 3 coberturas. Quantas combinações? Pause.

Resposta: 6 vezes 3 dá 18 combinações.

## Aula 2. Permutação, arranjo e combinação

Três casos especiais da contagem.

**Permutação**: de quantos jeitos dá para **organizar** todos os elementos em fila. Com 3 pessoas, A, B e C: 3 opções para o primeiro lugar, 2 para o segundo, 1 para o terceiro. 3 vezes 2 vezes 1, que dá 6. Essa multiplicação descendo até 1 se chama **fatorial** e é escrita com um ponto de exclamação: 3 fatorial é 6, 4 fatorial é 24, 5 fatorial é 120.

Os **anagramas** são permutações das letras de uma palavra. A palavra AMOR tem 4 letras diferentes: 4 fatorial, ou seja, 24 anagramas.

**Arranjo**: escolher alguns elementos onde a **ordem importa**. Um pódio com primeiro, segundo e terceiro lugares entre 10 corredores: 10 vezes 9 vezes 8, que dá 720. Ser primeiro é diferente de ser segundo.

**Combinação**: escolher alguns elementos onde a **ordem não importa**. Escolher 3 pessoas de 10 para formar uma comissão: tanto faz a ordem. A conta é o arranjo dividido pelo fatorial do número escolhido: 720 dividido por 3 fatorial, que é 6. Dá 120 comissões.

Para decidir entre arranjo e combinação, pergunte: **se eu trocar a ordem, muda alguma coisa?** Se muda, é arranjo. Se não muda, é combinação.

**Exercício rápido.** Escolher 2 sabores de sorvete de uma lista de 5, para uma casquinha com duas bolas, onde a ordem não importa. Quantas escolhas? Pause.

Resposta: o arranjo seria 5 vezes 4, que dá 20. Como a ordem não importa, divida por 2 fatorial, que é 2. Dá 10 escolhas.

## Aula 3. Sequências e padrões

Uma **sequência** é uma lista de números em uma ordem, que segue um padrão. O Enem gosta de pedir o próximo termo ou um termo distante.

A estratégia principal: **olhe a diferença entre um termo e o seguinte**. Se ela for sempre a mesma, a sequência cresce somando. Se não for, veja se há um padrão nas diferenças, ou se a sequência multiplica.

Na prova de 2023, os números pentagonais eram 1, 5, 12, 22, 35, 51. As diferenças eram 4, 7, 10, 13, 16, crescendo de 3 em 3. Assim, foi possível achar o oitavo termo, 92.

Também caem sequências de **figuras**, como bolinhas formando triângulos, quadrados ou pentágonos. Conte as bolinhas de cada figura e procure o padrão nos números.

**Exercício rápido.** Qual o próximo número da sequência 2, 6, 12, 20, 30? Pause.

Resposta: as diferenças são 4, 6, 8, 10. A próxima é 12. 30 mais 12 dá 42.

## Aula 4. Progressão aritmética

A **progressão aritmética**, ou PA, é uma sequência em que se **soma sempre o mesmo número**, chamado **razão**. Exemplo: 3, 7, 11, 15, 19, com razão 4.

Para achar um termo distante, sem escrever todos: o termo de posição n é o primeiro termo mais n menos 1 vezes a razão. O décimo termo da sequência acima: 3 mais 9 vezes 4, que dá 39.

Pense numa escada: cada degrau sobe a mesma altura. Para chegar ao décimo degrau, você sobe 9 vezes a partir do primeiro.

A **soma** dos termos de uma PA tem um truque famoso, atribuído ao matemático Gauss quando ainda era criança. Para somar de 1 a 100, junte o primeiro com o último, 1 mais 100, que dá 101; o segundo com o penúltimo, 2 mais 99, também 101; e assim por diante. São 50 pares de 101: a soma é 5 050.

A fórmula da soma é: o primeiro mais o último, vezes a quantidade de termos, dividido por 2.

Exemplos de PA no Enem: vendas que aumentam sempre a mesma quantidade por mês, como os produtos que caíram em 2023; juros simples; economias que crescem sempre o mesmo valor.

**Exercício rápido.** Uma pessoa guarda 10 reais na primeira semana, 15 na segunda, 20 na terceira, sempre 5 a mais. Quanto ela guarda na décima semana? Pause.

Resposta: 10 mais 9 vezes 5, que dá 55 reais.

## Aula 5. Progressão geométrica

A **progressão geométrica**, ou PG, é uma sequência em que se **multiplica sempre pelo mesmo número**, também chamado razão. Exemplo: 2, 6, 18, 54, com razão 3.

Para achar um termo: o termo de posição n é o primeiro termo vezes a razão elevada a n menos 1. O sexto termo da sequência acima: 2 vezes 3 elevado a 5. 3 elevado a 5 é 243. Vezes 2, dá 486.

A PG cresce muito rápido quando a razão é maior que 1: é o crescimento exponencial, como as larvas de 2023 e os juros compostos. E diminui quando a razão está entre 0 e 1, como a luz no fundo do rio, multiplicada por dois terços a cada metro, também em 2023.

Diferença principal: na **PA** se **soma**, e o crescimento é em linha reta. Na **PG** se **multiplica**, e o crescimento vai acelerando.

**Exercício rápido.** Uma mensagem é repassada: 1 pessoa conta para 3, cada uma conta para mais 3, e assim por diante. Na quarta rodada, quantas pessoas recebem a mensagem? Pause.

Resposta: 3, 9, 27, 81. Na quarta rodada, 81 pessoas.

## Aula 6. Logaritmo na prática

Você já conheceu o logaritmo no módulo de funções. Aqui, uma revisão focada nas questões.

O logaritmo responde: **a que expoente devo elevar a base para obter o número?** Na base 10: o logaritmo de 100 é 2, o de 1 000 é 3, o de 1 milhão é 6.

As propriedades que mais caem. O logaritmo de uma **multiplicação** é a **soma** dos logaritmos. O logaritmo de uma **divisão** é a **subtração**. O logaritmo de uma **potência** é o **expoente vezes** o logaritmo.

O Enem quase sempre dá os valores que você precisa, como o logaritmo de 2, mais ou menos 0 vírgula 3, e o de 3, mais ou menos 0 vírgula 48. Com eles, dá para achar outros: o logaritmo de 4, que é 2 vezes 2, é 0 vírgula 6. O de 8 é 0 vírgula 9. O de 5, que é 10 dividido por 2, é 1 menos 0 vírgula 3, que dá 0 vírgula 7.

O logaritmo também serve para descobrir **quanto tempo** leva um crescimento exponencial: quantos meses para uma aplicação dobrar, quantos dias para uma população atingir certo número.

**Exercício rápido.** Sabendo que o logaritmo de 2 é 0 vírgula 3, quanto é o logaritmo de 20? Pause.

Resposta: 20 é 2 vezes 10. Logaritmo de 2 mais logaritmo de 10: 0 vírgula 3 mais 1, que dá 1 vírgula 3.

## Aula 7. Trigonometria no ciclo e fenômenos periódicos

Você já viu seno e cosseno no triângulo. Agora, a ideia se amplia para o **ciclo trigonométrico**: um círculo de raio 1, onde um ponto vai girando. O seno mede a altura desse ponto, e o cosseno, a distância para o lado.

Quando o ponto dá voltas, a altura sobe e desce, sobe e desce, sempre do mesmo jeito. Por isso, as funções seno e cosseno descrevem **fenômenos periódicos**, que se repetem em intervalos regulares.

Exemplos: a **roda-gigante**, como caiu em 2023, em que a altura da cadeira sobe e desce de forma suave, como uma onda. As **marés**, que sobem e descem duas vezes por dia. A **pressão do sangue**, que varia a cada batida do coração. A **temperatura** ao longo do ano. As **ondas** do som e da luz.

O gráfico dessas funções é uma **onda suave**, sem bicos nem trechos retos, chamada **senoide**. O **período** é o tempo de uma volta completa, de um pico até o próximo pico. A **amplitude** é a altura da onda, do meio até o pico.

Nas questões, procure três coisas: o valor máximo, o valor mínimo e o tempo para repetir. Com isso, quase sempre dá para escolher o gráfico ou a fórmula certa.

**Exercício rápido.** Uma roda-gigante leva 10 minutos para dar uma volta completa. Qual é o período da altura de uma cadeira? Pause.

Resposta: 10 minutos, porque a cada volta a altura se repete.

## Encerramento do curso

Parabéns. Você chegou ao fim do curso completo: Linguagens, Ciências Humanas, Ciências da Natureza, Matemática e Redação.

Agora, o melhor jeito de fixar é voltar às provas resolvidas e ouvir as questões de novo. Você vai perceber que agora reconhece a ideia por trás de cada uma. Repita os módulos em que sentiu mais dificuldade, faça os exercícios rápidos em voz alta e, se puder, explique para outra pessoa o que aprendeu: ensinar é uma das melhores formas de aprender.

Lembre as regras de ouro do dia da prova: questão fácil vale ouro, nenhuma questão em branco, leia a pergunta antes do texto, e a resposta está no texto.

Boa prova. Você está preparado.
