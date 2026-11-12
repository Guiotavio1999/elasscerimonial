# Elass Cerimonial — Site Institucional

Experiência digital cinematográfica para a Elass Cerimonial (Assessoria e Cerimonial).

## Estrutura do projeto (v2 — multi-página)

- `/index.html` — Home (prólogo cinematográfico + 6 capítulos), com resumos de cada seção e links para as páginas dedicadas.
- `/sobre.html` — História completa da marca, valores e equipe.
- `/servicos.html` — Os 6 serviços detalhados.
- `/historias.html` — Portfólio de casamentos (documentário de casos).
- `/parceiros.html` — Rede de parceiros por categoria, estrutura pronta para páginas individuais futuras.
- `/contato.html` — Formulário de contato + informações diretas.
- `/assets/css/style.css` — Estilos compartilhados por todas as páginas (header, footer, menu mobile, componentes).
- `/assets/css/home.css` — Estilos exclusivos da Home (prólogo, capítulos).
- `/assets/js/main.js` — Comportamento compartilhado (header no scroll, menu mobile, animações de entrada, formulário).
- `/assets/js/home.js` — Comportamento exclusivo da Home (prólogo, indicador de capítulos).
- `/assets/img/` — Imagens do site.
- `/docs/relatorio-pesquisa.md` — Pesquisa com 34 referências internacionais de wedding/luxury/destination wedding planners.
- `/docs/conceito-criativo.md` — Conceito criativo definitivo, arquitetura de UX/UI, wireframes, tipografia, paleta, estratégia de conversão.

## Status atual

✅ Home + 5 páginas internas (Sobre, Serviços, Histórias, Parceiros, Contato)
✅ Menu mobile redesenhado (overlay em tela cheia)
✅ Identidade corrigida (nome "Elass Cerimonial" + logo oficial no cabeçalho)
🔜 Páginas individuais por casamento (documentário completo), páginas individuais por parceiro, Blog

## Stack

HTML + CSS + JavaScript (GSAP / ScrollTrigger para animações na Home), sem dependência de build — pode ser publicado direto como site estático em Vercel, Netlify ou GitHub Pages.
