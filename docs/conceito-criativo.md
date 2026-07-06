# ELAS CERIMONIAL
## Apresentação de Conceito Criativo & Arquitetura de Experiência Digital
### Nível: Awwwards / CSS Design Awards / FWA / Behance Featured

---

## 0. Premissa Central

> **A Elas não vende organização. Vende o maior sonho da vida de um casal.**

Todo o projeto parte de uma mudança de eixo: o site não vai *descrever* serviços de cerimonial — ele vai **fazer a visitante viver, por alguns minutos, a sensação de estar entrando no próprio casamento dos sonhos.** Cada decisão de UX, copy, tipografia e animação a partir daqui é subordinada a essa premissa.

**Nome do conceito:** *"O Maior Sonho da Vida"*

**Tom estético:** conto clássico + realeza + editorial de moda contemporâneo. Referências como Cinderela, Bela Adormecida ou casamentos reais de realeza europeia inspiram a *sensação* (magia, transformação, elegância atemporal) — nunca a estética literal (nada de carruagem, coroa ou ilustração infantil). É a mesma lógica da Dior ou Cartier quando comunicam "conto de fadas": tipografia impecável, luz natural, silêncio visual, nunca clichê.

---

## 1. Conceito Criativo Definitivo

O site é estruturado como um **filme em 6 capítulos**, no qual a visitante é a protagonista. Não existe "página inicial" no sentido tradicional — existe uma **abertura cinematográfica** que funciona como prólogo, seguida por capítulos que se revelam através do scroll, como cenas.

### Estrutura narrativa (substitui o menu tradicional)

| Capítulo | Nome | Função narrativa | Função de negócio |
|---|---|---|---|
| Prólogo | **Abertura** | Imersão emocional, sem distração | Reter atenção nos primeiros 3s |
| Cap. 1 | **O Sonho** | Declaração de propósito da marca | Posicionamento + promessa central |
| Cap. 2 | **A Jornada** | Como é viver a experiência Elas | Processo / metodologia (funil educativo) |
| Cap. 3 | **Os Bastidores** | Quem são as pessoas por trás da magia | Sobre / equipe / prova de competência |
| Cap. 4 | **Os Momentos** | Cerimonial em ação | Serviços apresentados como "capítulos exclusivos" |
| Cap. 5 | **As Histórias** | Casais reais, casamentos reais | Portfólio como mini-documentários + depoimentos |
| Cap. 6 | **Comece a Sua** | Convite direto | Conversão (WhatsApp/formulário) |

Cada capítulo ocupa sua própria "cena" de scroll, com transição de cor de fundo, luz e ritmo distintos — como corte de cena em um filme, não como divisórias de página.

---

## 2. Jornada Completa do Usuário

```
ENTRADA
  │
  ▼
[PRÓLOGO] Tela escura → frase 1 → fade → frase 2 → fade
          → revelação lenta da cena de casamento → logo → menu
  │  (emoção: expectativa, quase reverência)
  ▼
[CAP. 1 – O SONHO] Hero imersivo + manifesto da marca em 1 frase forte
  │  (emoção: "isso é exatamente o que eu sonho")
  ▼
[CAP. 2 – A JORNADA] Linha do tempo do processo (Primeiro Contato → Pós-Evento)
  │  (emoção: alívio — "existe um caminho, não estou sozinha")
  ▼
[CAP. 3 – OS BASTIDORES] História da Elas + rosto humano das sócias
  │  (emoção: confiança, conexão pessoal)
  ▼
[CAP. 4 – OS MOMENTOS] Serviços como "capítulos" navegáveis
  │  (emoção: curiosidade — "qual capítulo é o meu?")
  ▼
[CAP. 5 – AS HISTÓRIAS] Portfólio-documentário + depoimentos
  │  (emoção: identificação — "eu quero uma história dessas")
  ▼
[CAP. 6 – COMECE A SUA] CTA emocional + WhatsApp + formulário
  │  (emoção: decisão)
  ▼
[RODAPÉ] Instagram, contato, navegação secundária, blog
```

**Regra de retenção:** ao final de cada capítulo, um elemento visual ou textual insinua o próximo ("a jornada continua" / seta sutil / mudança de luz de fundo) — nunca um fim abrupto de seção. É a técnica de "cliffhanger" aplicada a scroll.

---

## 3. Sitemap Completo

```
/ (Home — experiência de capítulos)
├── /sobre                     (Cap. 3 expandido — história completa, equipe, valores)
├── /experiencia-elas          (Cap. 2 expandido — metodologia completa passo a passo)
├── /servicos                  (Cap. 4 expandido)
│   ├── /servicos/assessoria-completa
│   ├── /servicos/assessoria-parcial
│   ├── /servicos/cerimonial-do-dia
│   ├── /servicos/destination-wedding
│   ├── /servicos/eventos-personalizados
│   └── /servicos/gestao-de-fornecedores
├── /historias                 (Cap. 5 expandido — portfólio completo)
│   └── /historias/[slug-do-casal]   (página individual = mini documentário)
├── /depoimentos
├── /parceiros
│   └── /parceiros/[slug]      (estrutura preparada, página futura)
├── /blog                      (Guia da Noiva / Guia do Noivo / Checklist / Tendências)
│   └── /blog/[slug-do-artigo]
├── /contato                   (Cap. 6 expandido + formulário completo)
└── /politica-de-privacidade
```

**SEO:** URLs limpas em português, sem acentos (`/servicos/destination-wedding`), hierarquia de headings única por página (H1 único), schema `LocalBusiness` + `Event` + `Review` em JSON-LD, Open Graph dedicado por página de história (para compartilhamento no Instagram/WhatsApp).

---

## 4. Arquitetura de UX

### Princípios não-negociáveis
1. **Scroll como diretor de cena** — usaremos *scroll-driven animation* (não apenas fade-in ao entrar na viewport, mas transformação contínua vinculada à posição do scroll: profundidade, paralaxe, escala).
2. **Uma ação por tela.** Nunca dois CTAs concorrentes na mesma cena.
3. **Respiro extremo.** Regra prática: se parece que "falta preencher espaço", está correto — luxo é vazio controlado.
4. **CTA persistente porém discreto:** botão flutuante de WhatsApp com micro-pulsação sutil (nunca alarmante), que muda de cor de acordo com o fundo da seção ativa (inteligência de contraste).
5. **Nunca mais de 2 níveis de menu.** Navegação por capítulo (scroll spy) + menu tradicional secundário para quem já sabe o que busca (usuário recorrente, imprensa, fornecedores).

### Padrão de interação por dispositivo
- **Desktop:** scroll-driven storytelling completo, cursor customizado sutil (muda de ponto para "assista" sobre vídeos), parallax multicamada.
- **Mobile (mobile-first real, não adaptado):** a mesma narrativa, mas com gestos de swipe horizontal dentro de seções de portfólio/depoimentos, vídeos com autoplay silencioso otimizado, e redução inteligente de partículas/parallax para performance — a emoção se mantém, o peso computacional cai.

---

## 5. Arquitetura de UI

### Sistema de Grid
- Grid editorial assimétrico (inspirado em Vogue/Dior digital): módulos de 12 colunas no desktop, quebras assimétricas 7/5 e 8/4 para fotos-destaque, nunca grid perfeitamente simétrico (simetria total = "template").

### Camadas visuais (todas as seções usam as mesmas 4 camadas, em proporções diferentes)
1. **Camada de fundo:** cor sólida ou gradiente sutil (paleta da marca) + textura floral em opacidade muito baixa (3-6%).
2. **Camada de imagem:** fotografia em alta resolução, sempre com leve zoom-in ao entrar em viewport (technique "Ken Burns" cinematográfico).
3. **Camada de tipografia:** título serifado grande + texto de apoio leve, sempre alinhado à grade editorial.
4. **Camada de interação:** botões, indicadores de progresso de capítulo, cursor customizado.

### Indicador de progresso narrativo
Uma barra lateral fina e discreta (desktop) mostrando em qual "capítulo" da história o visitante está (Prólogo → Cap. 6) — reforça a sensação de filme/livro sendo lido, e reduz ansiedade de "quanto falta".

---

## 6. Wireframes Detalhados (descrição por seção)

### PRÓLOGO
```
┌─────────────────────────────┐
│                              │
│         (tela escura)        │
│                              │
│   "Existem dias que mudam   │
│      uma vida inteira."      │  ← fade in/out, 3.5s
│                              │
└─────────────────────────────┘
        ↓ (troca suave)
┌─────────────────────────────┐
│                              │
│  "Este será lembrado         │
│      para sempre."           │  ← fade in/out, 3.5s
│                              │
└─────────────────────────────┘
        ↓ (revelação)
┌─────────────────────────────┐
│  [vídeo/imagem de cerimônia  │
│   desfocada → foco lento]    │
│                              │
│         [logo Elas]          │  ← fade in suave, 1.5s
│                              │
│     [menu aparece]           │  ← slide down, 0.8s
└─────────────────────────────┘
```
Duração total do prólogo: 9-11 segundos, com opção de "pular introdução" discreta no canto (acessibilidade e usuários recorrentes).

### CAP. 1 — O SONHO (Hero)
```
┌─────────────────────────────┐
│  [imagem/vídeo full-bleed]   │
│                              │
│   "Porque o seu grande dia   │
│  merece ser vivido com       │
│  leveza, beleza e perfeição."│  ← surge de baixo p/ cima, letra a letra
│                              │
│  [Falar no WhatsApp]         │  ← CTA primário
│  [Conhecer nossas histórias] │  ← CTA secundário (texto, sem botão pesado)
└─────────────────────────────┘
```

### CAP. 2 — A JORNADA
Timeline vertical (desktop) / horizontal com swipe (mobile), 6 etapas (Primeiro Contato → Pós-Evento), cada etapa revelada conforme o scroll avança, com ícone de linha fina desenhando-se (line-drawing animation) e não ícone estático.

### CAP. 3 — OS BASTIDORES
Split-screen: 60% foto editorial da equipe (retrato de revista, não foto de banco de imagens) + 40% texto storytelling da origem da marca, com uma frase-âncora grande destacada no meio do texto.

### CAP. 4 — OS MOMENTOS (Serviços)
Não são cards. São **painéis full-screen que se revelam um a um conforme o scroll**, cada um com sua própria imagem de fundo, título grande, 1 frase de proposta de valor e 1 mini-case real embutido — como "capítulos de um livro de serviços".

### CAP. 5 — AS HISTÓRIAS (Portfólio)
Galeria editorial em grid assimétrico. Ao clicar em um casamento, abre a **página-documentário individual**:
```
[Vídeo de abertura do casamento — autoplay silencioso]
Nome do casal · Cidade · Data · Nº de convidados
── A História ──          (como se conheceram / o pedido)
── O Desafio ──           (o que precisava ser resolvido)
── A Solução Elas ──      (bastidores, decisões criativas)
── O Grande Dia ──        (galeria de fotos em scroll imersivo)
── Depoimento ──          (vídeo curto ou citação + foto)
```

### CAP. 6 — COMECE A SUA (CTA final)
Tela quase vazia, fundo com textura sutil, uma frase central grande:
> "Vamos começar a escrever o seu maior sonho?"
Botão único: **"Falar com a Elas no WhatsApp"**.

---

## 7. Animações — Especificação Técnica

| Elemento | Técnica | Ferramenta sugerida |
|---|---|---|
| Transições de capítulo | Scroll-linked opacity + transform (translateY/scale) | GSAP ScrollTrigger |
| Zoom cinematográfico em fotos | `scale(1) → scale(1.08)` em 8-12s, easing linear | CSS + Intersection Observer |
| Texto "surgindo" | Split por palavra/letra, fade + translateY, stagger 40-60ms | GSAP SplitText ou CSS custom |
| Partículas de luz | Canvas leve, baixa densidade, opacidade 10-20% | Canvas API / tsParticles configurado ao mínimo |
| Parallax multicamada | 3 camadas com velocidades diferentes (0.2x, 0.5x, 1x) | GSAP ScrollTrigger + transform3d |
| Microinterações de botão | Hover com expansão sutil de borda + mudança de peso de fonte | CSS transitions, 300-400ms ease-out |
| Indicador de capítulo | Progress bar vinculada ao scroll total da página | Intersection Observer |

**Regra de performance:** toda animação pesada é desativada automaticamente se `prefers-reduced-motion` estiver ativo, e reduzida (não removida) em conexões lentas detectadas — mantém elegância sem sacrificar Core Web Vitals.

---

## 8. Tipografia

### Títulos (capítulos, hero, nomes de casais)
**Serifada editorial de alto contraste** — famílias recomendadas (todas com licença adequada para web):
- **Playfair Display** (grande disponibilidade, ótimo contraste, "voz" muito parecida com capas de revista de moda) — opção segura e testada.
- **Canela** ou **Marfa** (pagas, usadas por marcas de luxo reais como Glossier/editoriais de moda) — opção premium se houver orçamento de licença.
- **Recomendação final:** Playfair Display para lançamento (custo zero, qualidade alta) com possibilidade de upgrade futuro para fonte paga exclusiva conforme a marca cresce.

### Corpo de texto
**Sans-serif leve e humanista** — recomendada: **Nunito Sans** ou **Jost** (geométrica, leve, ótima legibilidade em telas, contrasta bem com a serifada sem competir).

### Hierarquia
```
H1 (capítulo/hero) — Playfair Display, 56-88px, peso 500-600, letter-spacing leve negativo
H2 (subtítulo de seção) — Playfair Display, 32-40px, peso 500
H3 (nome de serviço/casal) — Playfair Display, 24-28px, peso 600
Corpo — Jost/Nunito Sans, 16-18px, peso 300-400, line-height 1.7
Legendas/labels — Jost, 12-13px, letter-spacing +1.5px, uppercase, peso 500
```

---

## 9. Paleta Definitiva

| Cor | Hex aproximado | Uso |
|---|---|---|
| Off-White (base) | `#FBF6F2` | Fundo principal |
| Champagne | `#EFE0D2` | Fundos de seção alternados |
| Rosé Nude | `#E3C1B4` | Destaques, hover states |
| Bronze/Cobre (identidade) | `#B47B57` | Títulos de destaque, ícones, linha fina decorativa |
| Marrom Suave (texto) | `#4A3B34` | Corpo de texto sobre fundo claro |
| Branco puro | `#FFFFFF` | Espaços de respiro, cards |
| Verde Oliva discreto | `#8A8E6C` | Detalhes florais únicos, nunca dominante (≤5% da composição) |

**Regra de uso:** nenhuma seção usa mais de 3 cores simultâneas. O bronze/cobre é sempre o elemento de "assinatura" — nunca decorativo em excesso, sempre pontual (uma linha, um ícone, uma palavra-chave destacada).

---

## 10. Componentes

- **Botão primário:** contorno fino + preenchimento sólido no hover, arredondamento sutil (não pill total — 6-8px), tipografia uppercase espaçada.
- **Botão WhatsApp flutuante:** ícone minimalista customizado (não o ícone padrão verde do WhatsApp — recriado na paleta da marca), com tooltip discreto "Fale com a Elas".
- **Card de serviço (versão condensada para /servicos):** imagem full-bleed + overlay gradiente + título + linha decorativa bronze + link "Conhecer este capítulo".
- **Card de depoimento:** foto do casal + nome + cidade + nº de convidados + citação em tipografia serifada itálica grande.
- **Divider decorativo:** linha fina com elemento floral vetorial minimalista (extraído da identidade da logo), usado como separador entre capítulos.
- **Progress indicator de capítulo:** barra lateral vertical fixa (desktop) / barra superior horizontal (mobile).

---

## 11. Microinterações

- Links de texto: sublinhado que se desenha da esquerda para a direita no hover (não aparece instantaneamente).
- Imagens de portfólio: leve rotação 3D sutil (`perspective` + `rotateY` de 2-3°) ao passar o mouse — sensação de "objeto físico", não elemento plano.
- Botões: mudança de peso tipográfico no hover (de 400 para 500) simulando "atenção crescente".
- Scroll entre capítulos: leve "settle" com easing elástico muito sutil no final de cada transição (nunca bounce exagerado).
- Formulário de contato: campos que "acendem" a borda em bronze suave ao receber foco, com microtexto de incentivo ("Estamos ansiosas para conhecer sua história").

---

## 12. Identidade Visual — Aplicação

A logo já existente (monograma EC + "Elass Assessoria & Cerimonial" com grinaldas e coração) será tratada como elemento "vivo": no prólogo, ela se monta suavemente (traço se desenhando) em vez de simplesmente aparecer. Os elementos florais da logo são extraídos em vetor e reutilizados como dividers e texturas de fundo de baixa opacidade ao longo de todo o site — criando consistência entre marca e interface sem repetir a logo inteira a cada seção.

---

## 13. Estratégia de Conversão

1. **CTA único e consistente:** "Falar com a Elas no WhatsApp" se repete em todos os capítulos com a mesma frase — familiaridade gera confiança e reduz fricção de decisão.
2. **Escassez real:** declarar um número de eventos aceitos por temporada (ex. "Aceitamos um número limitado de casamentos por ano para garantir dedicação total a cada história") — técnica validada nas referências #26/#28 do relatório.
3. **Prova social com fórmula vencedora:** Nome + Cidade + Data + Nº de convidados + frase-âncora emocional em cada depoimento (técnica #17).
4. **Números de autoridade em destaque:** quantidade de eventos realizados e anos de experiência, exibidos como "selo" sutil no Cap. 1 ou Cap. 3 (técnica #27).
5. **Formulário de baixa fricção:** poucos campos obrigatórios na primeira etapa (nome, data prevista, WhatsApp) — qualificação detalhada acontece na conversa humana, não no site.
6. **Blog como porta de entrada de SEO:** conteúdo educativo ("Guia da Noiva", "5 coisas que você não pode esquecer no dia do Sim") atrai tráfego orgânico de long-tail e nutre a visitante antes da decisão de contato.

---

## 14. Técnicas Psicológicas Utilizadas

| Técnica | Onde é aplicada | Efeito psicológico |
|---|---|---|
| **Efeito Zeigarnik** (tensão de tarefa incompleta) | Estrutura em capítulos com "gancho" ao final de cada seção | Motiva a continuar rolando/lendo |
| **Prova social específica** | Depoimentos com dados concretos (nome, cidade, nº convidados) | Reduz percepção de risco |
| **Escassez** | Limite de eventos por temporada | Aumenta valor percebido e urgência de decisão |
| **Efeito de identificação/espelho** | Storytelling em 2ª pessoa ("você vai viver...") | Visitante se imagina vivendo a cena |
| **Consistência estética = heurística de confiança** | Paleta e tipografia jamais variam entre seções | Sinaliza profissionalismo antes mesmo da leitura do texto |
| **Efeito de ancoragem emocional** | Frases de abertura no prólogo antes de qualquer venda | Estado emocional é definido antes da mensagem comercial — ela chega mais receptiva |
| **Redução de carga cognitiva** | 1 CTA por tela, menu curto, respiro visual | Facilita decisão, evita abandono por sobrecarga |

---

## 15. Como Vamos Superar as 34 Referências Pesquisadas

| Bloco de referência | Limite identificado | Como a Elas supera |
|---|---|---|
| Ícones EUA (Colin Cowie, Preston Bailey, Mindy Weiss etc.) | Elegantes, porém estáticos — galerias e texto, sem narrativa de scroll | Estrutura de "filme em capítulos" com scroll-driven storytelling, algo que nenhuma dessas marcas usa hoje |
| Destination Europa/Mônaco | Boa prova social, mas UI ainda convencional (menu tradicional, sem imersão) | Prólogo cinematográfico + página-documentário por casal, elevando o portfólio a outro nível |
| Bali/Ásia | Ótima técnica de escassez e números, mas design visualmente genérico (templates Wix/Squarespace padrão) | Identidade 100% autoral, tipografia e paleta exclusivas, zero "cara de template" |
| Mercado brasileiro (Constance Zahn, Allianz, etc.) | Bom copywriting emocional, mas nenhuma usa animação/motion de nível internacional | Combinação inédita no Brasil: copywriting emocional nacional + motion design em nível Awwwards/FWA |

**Síntese:** nenhuma das 34 referências combina simultaneamente (1) narrativa cinematográfica por scroll, (2) portfólio em formato documentário, (3) identidade 100% autoral e (4) copywriting emocional de conto de fadas sofisticado. Essa combinação é o espaço em branco que posiciona a Elas Cerimonial como uma experiência inédita no mercado nacional — e competitiva internacionalmente.

---

## 16. Próximo Passo

Este documento cobre os 15 pontos solicitados: conceito, jornada, sitemap, arquitetura UX/UI, wireframes, animações, tipografia, paleta, componentes, microinterações, identidade visual, estratégia de conversão, técnicas psicológicas e comparação com as 34 referências.

**Aguardo sua aprovação para iniciar o desenvolvimento.** Antes disso, é útil combinarmos:
- Stack técnica (recomendo Next.js + GSAP + Tailwind para atingir o nível de performance e animação descrito, mas posso adaptar a qualquer stack que você já tenha em mente);
- Se o desenvolvimento será feito aqui como protótipo navegável (HTML/CSS/JS num artifact) ou se o destino final é outra ferramenta (ex. Lovable, Webflow, WordPress) — isso muda a forma como devo entregar o código.

Como você quer proceder?
