[] Titulo:
Dispositivo IoT Integrado a Aplicação Web para Controle de Consumo e Previsão de Custos Residenciais

[] Introdução:

Com o surgimento da pandemia de COVID-19, decretada pela Organização Mundial da Saúde (OMS) em março de 2020, foi observado um aumento significativo no consumo de energia elétrica residencial no Brasil, com um crescimento de 66,9%, conforme estudo publicado no XXIX Congresso de Iniciação Científica do Linse/UFPel [1]. Esse aumento está diretamente ligado à maior permanência das pessoas em casa, impulsionada pela adoção emergencial do modelo de trabalho remoto.

Ainda hoje, mesmo com a diminuição das restrições sanitárias, o modelo de trabalho remoto ou híbrido permanece presente em muitos setores da economia, consolidando-se como uma tendência permanente no mercado de trabalho. Essa mudança estrutural aumentou a demanda por energia elétrica nas residências — especialmente durante o horário comercial —, afetando diretamente o orçamento doméstico de milhões de brasileiros [1].

Esse cenário se agrava quando somado a problemas recorrentes de inadimplência. Segundo a Pesquisa Nacional de Endividamento e Inadimplência do Consumidor (PEIC), cerca de 62,3% dos domicílios brasileiros estavam endividados em 2014 [2]., dado esse que aumentou 14 pontos percentuais em dezembro de 2024 [2]. uma situação frequentemente agravada por custos inesperados, como os relacionados ao consumo de energia elétrica [2].

Além disso, problemas de medição de consumo de energia elétrica nas residências, como falhas e leituras incorretas, têm contribuído para cobranças indevidas [3], dificultando ainda mais o controle financeiro dos consumidores e aumentando a inadimplência. Tais falhas, conforme discutido por Santos et al. (2022) [3], podem estar relacionadas a degradações no funcionamento dos medidores, erros operacionais ou limitações tecnológicas. Isso reforça a necessidade de uma solução eficaz para o monitoramento do consumo em tempo real, tanto no aspecto físico (por meio de dispositivos IoT) quanto na gestão financeira (por meio de uma aplicação web integrada).

Em resposta a essas problemáticas, este trabalho propõe o desenvolvimento de um sistema integrado, composto por um dispositivo IoT para o monitoramento em tempo real do consumo de energia elétrica e uma aplicação web que permite ao usuário visualizar e controlar seus gastos de forma simples e eficiente. O sistema visa ajudar os consumidores a antecipar custos, detectar falhas elétricas antes que se tornem um problema maior e gerenciar o consumo energético de maneira mais consciente.

Este trabalho tem como objetivo investigar o comportamento dos consumidores brasileiros em relação ao controle do consumo de energia elétrica, desenvolver um protótipo IoT para monitoramento dinâmico e implementar uma aplicação web que apresente dados em tempo real para facilitar o controle financeiro. A proposta utiliza conhecimentos de robótica, programação e desenvolvimento de sistemas web para criar uma solução prática e acessível.

Ademais, serão abordados conceitos essenciais da teoria da eletricidade, o desenvolvimento de APIs e interfaces, protocolos de comunicação em tempo real, criação de previsões de consumo por meio da análise de dados, além da aplicação de probabilidade e estatística para avaliar o impacto financeiro do consumo de energia elétrica.

(1. ABNT: DA COSTA, A. A. F.; ROSSI, F. D.; KONZEN, M. P.; LIMA, P. R. B. D. Automação residencial com foco no consumo consciente de energia elétrica. Revista de Ciência e Inovação, v. 1, n. 2, p. 37–51, 23 dez. 2016. Disponível em: https://periodicos.iffarroupilha.edu.br/index.php/cienciainovacao/article/view/67. Acesso em: 17 abr. 2025.​)

(2. CNC - Confederação Nacional do Comércio de Bens, Serviços e Turismo. Mais da metade das famílias brasileiras estão endividadas. Agência Brasil, 2014. p. 1–3.)

(3.​Melo, G. A. e, Sampaio, L. P., Alves, M. G., Oliveira, R. A. N. de, Silva, J. F. R. da, & Canesin, C. A. (2016). Erros em medidores eletrônicos de energia elétrica considerando-se geração distribuída. Revista Eletrônica de Potência, 21(3), 190–199.​)

[] Implementação
possuo um dispositivo ESP32 que irá monitorar a geral de energia da minha residencia.
a ideia é de maneira acurada medir o consumo de energia eletrica em tempo real.
a minha ideia é?
banco de dados mongodb
a cada segundo o IoT irá ler a corrente e calcular a potencia atual aproximada.
essa potencia sera enviada para a API via websocket
a aplicação frontend terá a opção de conferir relatorio dos dias do mes atual
dia 1 - 23 kW -> x Reais
dia 2 - ....
para os meses já finalizados e analisados
mes 1 - 234 kW -> x Reais
mes 2 - 251 kW -> x Reais
e relatório das ultimas 24h da mesma maneira
terá um relatorio em tempo real, continuo, mostrando as 10 ultimas leituras (10 ultimos segundos), provavelmente sera em grafico linha. Neste caso, penso em não utilizar nada do banco de dados, mas diretamente retornar dados da conexão websocket.
sobre persistencia para relatorios:
Penso nas seguintes coleções de dados:

- last24hoursReport (cada documento conterá a hora e o consumo médio da hora em kW e reais)
  a cada hora, o dado mais antigo da coleção é excluído.
- monthlyReport (cada documento conterá o mês e ano e o consumo estimado do mês em kW e reais)
- dailyReport (cada documento conterá o dia, mes e ano, e o consumo estimado no dia, em kw e reais)

Previsoes

- Previsão baseada em média móvel
  Média últimos 7 dias = 14.3 kWh
  Dias restantes: 15
  Previsão adicional = 14.3 \* 15 = 214.5 kWh
  Previsão final = 225 (já consumido) + 214.5 = 439.5 kWh
- Previsão de ultrapassagem de meta
  Ex: você define um limite mensal (ex: 300kWh) e o sistema te avisa:
  "Você está a caminho de ultrapassar sua meta em 7 dias."
- Previsão de pico de consumo diário
  🕒 Ex: "Hoje, o maior pico foi 1.8kW às 14h32"

      Modalidades tarifárias disponíveis

  A Enel oferece diferentes modalidades tarifárias para atender a perfis de consumo variados:​

Tarifa Convencional: é a modalidade padrão, com valores fixos para o kWh consumido.​

Tarifa Branca: nessa modalidade, os valores do kWh variam conforme o horário do dia. Os períodos são classificados como:​

Ponta (17h30 às 20h30): maior custo por kWh.​

Intermediário (16h30 às 17h30 e 20h30 às 21h30): custo elevado.​
Enel Brasil
+6
Enel Brasil
+6
Enel Brasil
+6

Fora de Ponta (21h30 às 16h30 do dia seguinte): menor custo por kWh. ​

Essa modalidade é vantajosa para quem consegue concentrar o consumo nos períodos fora de ponta. Para aderir, é necessário solicitar à Enel, que instalará um novo medidor na unidade consumidora.

COM UMA SIMPLES ANALISE DE DADOS, enquadrados no beneficio social existe um desconto de 65% em cima da tarifa convencional + beneficio
0.72 _ 0.35 _ FAIXA DE TARIFA

consumo TE + custo infra TUSD (faixas) (baixa renda)
Consumo mensal de até 30kWh: 65%
Consumo mensal de 31kWh até 100kWh: 40%
Consumo mensal de 101kWh até 220kWh: 10%
https://www.enel.com.br/content/dam/enel-br/megamenu/tarifas-enel/Tarifas%20Enel%20CE%202024.pdf
https://www.enel.com.br/content/dam/enel-br/megamenu/taxas,-tarifas-e-impostos/Tarifas%20ENEL-CE%20bandeira-AMARELA_%20Abril21.pdf
https://www.enel.com.br/content/dam/enel-br/megamenu/taxas,-tarifas-e-impostos/Tarifas-ENELCE_Hist_Verde_REH.3.185_22042023.pdf

3.58+14.38+36.99+11.30+5.10+20.45+52.60+16.07+49.42-38.74+26.57

consumo da conta (TE + TSDU + COFINS + ICMS) = 3.62+14.53+37.37+4.48+5.16+20.66+53.15+6.39+49.92 = 195,28
calculo com base no 0.72 (Taxa convencional (media TE + TSDU)) = 233 * (0.72 + 0.72*1.2 (20% em cima das taxas para COFINS e ICMS)) = 167,76 + 33,552 (20% COFINS + ICMS) = 201.31

em caso de baixa renda, taxa de erro de aprox 3%.

010.570.36725-22 - denuncia ANEEL
