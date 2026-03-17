Watch this video to understand it further

[![VIDEO](https://img.youtube.com/vi/nbbdoiMezgQ/0.jpg)](https://www.youtube.com/watch?v=nbbdoiMezgQ)

Small demonstration on how it works in general terms:

<img width="2126" height="1162" alt="image" src="https://github.com/user-attachments/assets/4b91dff3-449c-46ea-aa82-651bb1d3029a" />

# WattsUp

Sistema ciberfísico de baixo custo para monitoramento em tempo real e estimativa de consumo de energia elétrica residencial.

## Visao Geral

O WattsUp e um sistema IoT que monitora o consumo de energia eletrica de uma residencia em tempo real, utilizando um sensor de corrente nao invasivo (SCT-013) conectado a um microcontrolador ESP32. Os dados sao transmitidos via WebSocket para uma API backend, armazenados em MongoDB e visualizados em um dashboard web responsivo.

## Arquitetura

```
ESP32 + SCT-013  --(WebSocket/TLS)-->  API (Node.js/Express)  --(MongoDB)-->  Dashboard (Next.js)
   (Coleta)                              (Processamento)                       (Visualizacao)
```

O ESP32 coleta leituras de corrente a cada segundo e transmite via WebSocket. A API agrega os dados em janelas de 1 minuto, 1 hora, 1 dia e 1 mes. O dashboard exibe graficos em tempo real e historicos, com estimativa de custo da fatura mensal.

### Tecnologias

| Componente      | Tecnologia                                    |
| --------------- | --------------------------------------------- |
| Dispositivo IoT | ESP32, EmonLib, Arduino IDE                   |
| API             | Node.js 23, Express 5, TypeScript, Prisma ORM |
| Banco de dados  | MongoDB                                       |
| Dashboard       | Next.js 15, React 19, TailwindCSS, Recharts   |
| Comunicacao     | WebSocket (ws)                                |
| Infraestrutura  | Docker, Nginx, Let's Encrypt                  |

### Decisoes de Projeto

- **WebSocket (em vez de MQTT):** Escolhido para manter um unico servidor WebSocket que alimenta simultaneamente a API e o dashboard web, simplificando a arquitetura. A familiaridade do autor com WebSocket tambem pesou na decisao.
- **MongoDB (em vez de time-series DB):** Escolhido por familiaridade, simplicidade de deploy e uso de banco remoto sem necessidade de configurar containers adicionais para desenvolvimento.
- **Next.js:** Escolhido por familiaridade com o ecossistema React e por oferecer bibliotecas nativas para construcao de graficos com suporte a temas (dark/light).

## Hardware

### Componentes

| Componente | Especificacao                        | Custo (R$) | Justificativa                                                                          |
| ---------- | ------------------------------------ | ---------- | -------------------------------------------------------------------------------------- |
| ESP32      | Microcontrolador com Wi-Fi integrado | ~30,00     | Wi-Fi integrado elimina modulo externo, ADC suficiente para o SCT-013, preco acessivel |
| SCT-013    | Sensor de corrente 100A:50mA         | ~15,00     | Nao invasivo (sem risco de choque), faixa de 100A adequada para residencias            |
| Resistores | 3x 220Ohm                            | ~2,00      | Divisor de tensao para offset do sinal AC                                              |
| Capacitor  | 1x 10uF                              | ~1,00      | Filtro de ruido                                                                        |
| Protoboard | 830 pontos                           | ~3,00      | Montagem do circuito                                                                   |
| **Total**  |                                      | **~50,98** |                                                                                        |

### Diagrama do Circuito

O sensor SCT-013 e do tipo alicate (clamp-on): acopla-se magneticamente ao redor de um unico condutor, sem contato eletrico direto. O sinal de saida do sensor e condicionado pelo circuito de divisor de tensao (resistores de 220Ohm) que fornece um offset DC de ~1,65V, e pelo capacitor de 10uF que filtra ruido de alta frequencia. O sinal condicionado e lido pelo ADC do ESP32 (pino 34, resolucao de 10 bits).

### Seguranca na Instalacao

- **Sensor nao invasivo:** O SCT-013 nao requer contato eletrico direto com o condutor. A instalacao consiste em abrir o alicate do sensor e envolve-lo ao redor de um unico fio no quadro de distribuicao.
- **Circuito de baixa tensao:** O ESP32 e os componentes auxiliares operam em 3,3V/5V.
- **Recomendacoes de seguranca:**
  - Desligue o disjuntor geral antes de acessar o quadro de distribuicao, especialmente em instalacoes desconhecidas.
  - Identifique corretamente o condutor fase a ser monitorado.
  - Envolva o sensor ao redor de **um unico condutor** (nao de cabos com multiplos fios).
  - Evite contato com barramentos ou fios energizados expostos.
  - Se nao tiver familiaridade com instalacoes eletricas, solicite auxilio de um eletricista.

## Protocolo Experimental

Esta secao descreve o protocolo utilizado para validar o sistema, permitindo a replicacao por outros pesquisadores.

### Periodo de Avaliacao

- **Inicio:** 20 de maio de 2025
- **Fim:** 17 de junho de 2025
- **Duracao:** 1 ciclo mensal completo (28 dias)
- **Justificativa do periodo:** O periodo foi limitado pelo prazo do TCC e pelo tempo de chegada dos componentes. Um ciclo mensal foi utilizado para validar os resultados comparando a leitura do sistema com a fatura real da concessionaria.

### Local

- Residencia em Fortaleza, Ceara, Brasil
- Tensao nominal da rede: 220V
- Instalacao eletrica residencial padrao

### Procedimento de Calibracao

O fator de calibracao do sensor SCT-013 foi ajustado empiricamente:

1. **Valor inicial:** 9,09 (valor teorico calculado a partir da relacao de espiras do transformador de corrente).
2. **Metodo:** Tentativa e erro — comparacao da leitura em tempo real do dispositivo com a potencia nominal esperada de aparelhos eletricos conhecidos, aceitando uma margem de erro.
3. **Valor final:** 7,99 (configurado no codigo como `SCT013.current(ADC_INPUT, 7.99)`).
4. **Periodo de ajuste:** 10 dias de comparacao.
5. **Observacao:** A interferencia eletromagnetica de fios proximos no painel eletrico causou erro inicial de ~12%, corrigido com reposicionamento do sensor e ajuste do fator de calibracao.

### Procedimento de Validacao

Comparacao entre o consumo registrado pelo WattsUp e o medidor oficial da concessionaria ao final do ciclo de faturamento:

| Medicao                          | Valor      |
| -------------------------------- | ---------- |
| Medidor oficial (concessionaria) | 228 kWh    |
| WattsUp                          | 230,34 kWh |
| **Erro**                         | **~1,03%** |

### Parametros Tarifarios

Valores utilizados no calculo de custo, baseados na tarifa vigente no Ceara:

| Parametro                                       | Valor          |
| ----------------------------------------------- | -------------- |
| TUSD (Tarifa de Uso do Sistema de Distribuicao) | R$ 0,388/kWh   |
| TE (Tarifa de Energia)                          | R$ 0,2598/kWh  |
| Preco total por kWh (TE + TUSD)                 | R$ 0,722/kWh   |
| Preco com impostos                              | R$ 0,85/kWh    |
| Encargos extras mensais (CIP, taxas)            | ~R$ 50,38/mes  |
| Dia de leitura efetiva                          | 20 de cada mes |
| Estado                                          | Ceara          |

### Modelo de Previsao

A previsao de fatura mensal utiliza **media movel simples de 15 dias**:

- A janela de 15 dias foi escolhida para equilibrar sensibilidade e estabilidade: nao e tao sensivel a variacoes diarias aleatorias, mas reflete mudancas bruscas na rotina de consumo de energia.
- O consumo medio dos ultimos 15 dias e extrapolado para o mes completo e multiplicado pelo preco por kWh.

### Limitacoes Conhecidas

1. **Tensao estatica (220V):** O sistema assume tensao fixa de 220V. Nao foi utilizado sensor de tensao — decisao para reduzir custo e complexidade, considerando que Fortaleza-CE tem tensao nominal de 220V. Variacoes reais da rede (tipicamente ±5% a ±10% conforme ANEEL) nao sao capturadas, podendo causar erro proporcional no calculo de potencia (P = I x V).

2. **Calibracao empirica:** O fator de calibracao (7,99) foi ajustado para uma residencia especifica. Pode necessitar recalibracao em outros ambientes com caracteristicas eletricas diferentes.

3. **Periodo de validacao:** Apenas 1 ciclo mensal em uma unica residencia. Multiplos ciclos e residencias seriam necessarios para maior confiabilidade estatistica.

4. **Modelo tarifario simplificado:** Nao contempla bandeiras tarifarias, taxas regionais ou encargos variaveis por distribuidora.

5. **Interferencia eletromagnetica:** Fios proximos no painel eletrico causaram erro de 12% antes do ajuste. Ambientes com paineis mais congestionados podem apresentar interferencias diferentes.

6. **Previsao por media movel:** Pressupoe padroes de consumo relativamente constantes. Menos precisa em cenarios com variacoes graduais ao longo do mes.

7. **Monitoramento informativo:** O sistema foi desenvolvido para conscientizacao do consumidor, nao para fins de faturamento. Nao atende normas metrologicas formais (IEC 62053, NBR 14519, INMETRO) exigidas para medidores homologados.

## Analise Comparativa de Custo-Beneficio

Comparacao com solucoes comerciais disponiveis no mercado brasileiro:

| Criterio                | WattsUp                   | Sonoff POW Elite 20A | Shelly EM                  |
| ----------------------- | ------------------------- | -------------------- | -------------------------- |
| Custo                   | R$ 50,98                  | R$ 185,00            | R$ 272,00                  |
| Tipo de sensor          | Nao invasivo (clamp)      | Invasivo (em serie)  | Nao invasivo (clamp)       |
| Interface               | Dashboard web proprio     | App proprietario     | App + assistentes virtuais |
| Backend                 | Dedicado (auto-hospedado) | Nuvem do fabricante  | Nuvem do fabricante        |
| Previsao de custos      | Sim (media movel 15 dias) | Nao                  | Nao                        |
| Dependencia de internet | Funciona em rede local    | Requer internet      | Requer internet            |
| Personalizacao          | Codigo aberto             | Fechado              | Parcialmente aberto        |

## Estrutura do Repositorio

```
WattsUp/
├── EnergyMonitorSytemModule/   # Firmware do ESP32 (Arduino/C++)
│   ├── EnergyMonitorSytemModule.ino  # Codigo principal
│   ├── WiFiManagerHelper.cpp         # Gerenciamento de Wi-Fi
│   └── WiFiManagerHelper.h
├── api/                        # Backend (Node.js/Express/TypeScript)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── telemetry/      # Ingestao de dados via WebSocket
│   │   │   └── dashboard/      # Agregacao e calculo de custos
│   │   ├── infra/
│   │   │   ├── prisma/         # Schema do banco e seed
│   │   │   └── crons/          # Jobs de agregacao (horario/mensal)
│   │   └── IO/                 # Handler WebSocket
│   ├── docker-compose.yaml
│   └── nginx/                  # Configuracao do proxy reverso
├── dashboard/                  # Frontend (Next.js/React)
│   └── src/
│       ├── app/                # Paginas e rotas API
│       ├── components/         # Componentes UI (graficos, cards)
│       ├── views/              # Views de visualizacao
│       └── services/           # Cliente API e WebSocket
└── README.md
```

## Como Executar

### Dispositivo IoT (ESP32)

1. Abra `EnergyMonitorSytemModule/EnergyMonitorSytemModule.ino` na Arduino IDE.
2. Instale as bibliotecas: `EmonLib`, `WebSocketsClient`, `WiFiManager`.
3. Configure a URL do servidor WebSocket no codigo (linha `webSocket.beginSslWithBundle(...)`).
4. Faca upload para o ESP32.
5. Na primeira execucao, conecte-se a rede Wi-Fi "Energy Monitor - Setup" (senha: `setup123`) para configurar a rede Wi-Fi da residencia.

### API

```bash
cd api
cp .env.example .env
# Configure DATABASE_URL no .env com sua string de conexao MongoDB
npm install
npx prisma generate
npx prisma db seed
npm start
```

### Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Acesse `http://localhost:3000`.

### Deploy com Docker

```bash
cd api
docker-compose up -d
```

A API sera servida na porta 3000, com Nginx como proxy reverso nas portas 80 (HTTP) e 443 (HTTPS).

## Fluxo de Dados

1. **ESP32** coleta corrente (Irms) a cada segundo via SCT-013 e calcula potencia (P = Irms x 220V).
2. **WebSocket** transmite JSON `{current, power, voltage, timestamp}` para a API.
3. **API** acumula 60 leituras/minuto e agrega em media de kW → salva `PerMinuteReport`.
4. **Cron horario** soma 60 registros por minuto → kWh/hora → incrementa `DailyReport` e `MonthlyReport`.
5. **Dashboard** consome dados via REST (historicos) e WebSocket (tempo real).
6. **Previsao** calcula media movel de 15 dias e extrapola para o mes.
