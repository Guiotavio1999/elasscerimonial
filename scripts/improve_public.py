from pathlib import Path
import re
root=Path('.')
for p in root.glob('*.html'):
 if p.name=='workspace.html': continue
 s=p.read_text().replace('https://elas-cerimonial-site.vercel.app','https://elasscerimonial.vercel.app')
 s=s.replace('target="_blank"','target="_blank" rel="noopener noreferrer"')
 s=s.replace('<body>','<body>\n<a href="#main-content" class="skip-link">Pular para o conteúdo</a>')
 s=s.replace('aria-label="Abrir menu"','aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-nav"')
 s=s.replace('<div id="mobile-nav">','<div id="mobile-nav" inert>')
 s=s.replace('  <div class="m-divider"></div>','  <a href="/portal">Portal dos noivos</a>\n  <div class="m-divider"></div>')
 s=s.replace('<a href="index.html" class="brand">','<a href="index.html" class="brand" aria-label="Elass Cerimonial — início">')
 s=s.replace('<footer>','<footer>\n<div class="footer-access"><a href="/portal">Portal dos noivos</a><a href="/admin">Acesso da equipe</a><a href="/privacidade">Privacidade</a></div>')
 s=s.replace('<section class="page-hero"','<section id="main-content" tabindex="-1" class="page-hero"',1)
 s=s.replace('src="assets/img/team.jpg"','src="assets/img/team.webp" loading="lazy" width="1000" height="1333"')
 s=s.replace("assets/img/prologue.jpg","assets/img/prologue.webp").replace("assets/img/venue.jpg","assets/img/venue.webp")
 if p.name=='contato.html':
  s=s.replace('grid-template-columns:1.1fr .9fr;gap:70px;','grid-template-columns:1.1fr .9fr;gap:70px;')
  s=s.replace('class="section-inner" style="display:grid;grid-template-columns:1.1fr .9fr;gap:70px;"','class="section-inner contact-layout"')
  s=s.replace('id="contact-form" class="contact-form"','id="contact-form" class="contact-form"')
  s=s.replace('<input type="text" id="data" name="data" placeholder="Ainda não sei / dd/mm/aaaa">','<input type="date" id="data" name="data">')
  s=s.replace('<button type="submit"', '''<div class="form-row"><label for="email">E-mail (opcional)</label><input type="email" name="email" id="email" autocomplete="email"></div>
        <div class="form-row"><label for="cidade">Cidade do evento</label><input name="city" id="cidade" maxlength="160" autocomplete="address-level2"></div>
        <div class="form-row"><label for="convidados">Estimativa de convidados</label><input type="number" min="0" max="10000" name="guests" id="convidados"></div>
        <div class="form-row"><label for="servico">Serviço desejado</label><select name="service" id="servico"><option value="">Quero orientação</option><option>Assessoria Completa</option><option>Assessoria Parcial</option><option>Cerimonial do Dia</option><option>Outro evento</option></select></div>
        <div class="hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
        <label class="consent"><input type="checkbox" name="consent" required> Autorizo a Elass a utilizar meus dados para responder à solicitação e organizar o atendimento. <a href="/privacidade">Privacidade</a></label>
        <div id="contact-status" role="status" aria-live="polite"></div>
        <button type="submit"''')
  s=s.replace('Enviar pelo WhatsApp','Enviar minha solicitação')
  s=s.replace('Preencha e a gente te chama no WhatsApp.','O primeiro passo é conhecer vocês.')
 if p.name=='historias.html':
  s=re.sub(r'<div class="stories-grid">.*?<p style="margin-top:40px;.*?</p>', '''<div class="stories-grid" data-content="portfolio"></div><div class="portfolio-note"><span class="eyebrow">Cada história merece cuidado</span><h2>O próximo capítulo pode ser o de vocês.</h2><p>Conheçam nossa forma de planejar e conversem com a equipe sobre o que imaginam para o grande dia.</p><a href="/contato" class="btn-primary">Vamos conversar</a></div>''',s,flags=re.S)
  s=s.replace('Casamentos reais assinados pela Elass Cerimonial. Cada história é um documentário de amor.','Conheça a forma de cuidar de cada celebração da Elass Cerimonial e converse sobre o seu casamento.')
 if p.name=='parceiros.html':
  s=re.sub(r'<p style="margin-top:40px;font-size:14px;opacity:.65;max-width:560px;">.*?</p>','<div class="partners-grid" data-content="partners"></div><p class="partner-note">A seleção de fornecedores considera o estilo, as prioridades e as necessidades de cada evento. Converse com a equipe para conhecer as indicações para o seu planejamento.</p>',s,flags=re.S)
 p.write_text(s)
# A clear first impression, with the real source photography and no blocking introduction.
p=Path('index.html');s=p.read_text();s=re.sub(r'<script src="https://cdnjs.*?</script>\n?','',s)
s=re.sub(r'<!-- ================= PROLOGUE.*?<!-- ================= HEADER ================= -->','<!-- Header -->',s,flags=re.S)
s=s.replace(' style="opacity:0;transform:translateY(-16px);"',' class="light-context"')
a=s.index('<!-- ================= CHAPTER RAIL');b=s.index('<!-- ================= FOOTER')
s=s[:a]+'''<main id="main-content" tabindex="-1">
<section class="editorial-hero">
 <div class="hero-copy"><span class="eyebrow">Assessoria & Cerimonial</span><div class="hero-rule"></div><h1 data-cms="hero_title">Vivam o sonho.<br>A gente cuida<br>de cada detalhe.</h1><p data-cms="hero_subtitle">Do primeiro encontro ao último abraço, organização e carinho para vocês viverem o grande dia com leveza.</p><div class="hero-actions"><a href="/contato" class="btn-primary">Vamos planejar o seu dia <span aria-hidden="true">↗</span></a><a href="/servicos" class="text-link">Conheça a nossa assessoria</a></div><div class="hero-signature"><span></span>Planejamos. Cuidamos. Realizamos.</div></div>
 <div class="hero-photo"><img src="assets/img/prologue.webp" width="1440" height="1800" fetchpriority="high" alt="Celebração de casamento presente no acervo da Elass"><div class="photo-caption"><span>O grande dia passa.</span><em>O que se sente, fica.</em></div></div>
</section>
<div class="promise-strip"><span>Planejamento com propósito</span><span>Presença em cada etapa</span><span>Cuidado que se sente</span></div>
<section class="section public-services"><div class="section-inner"><div class="editorial-heading"><div><span class="eyebrow">Para cada momento, um cuidado</span><h2>A assessoria certa<br>para a história de vocês.</h2></div><p>Seja qual for o ponto de partida, caminhamos ao lado de vocês para transformar decisões em tranquilidade.</p></div><div class="service-cards" data-content="services"><article><span class="service-number">01</span><h3>Assessoria Completa</h3><p>Planejamento desde o início: prioridades, fornecedores, cronograma e acompanhamento até a realização.</p><a href="/servicos" class="text-link">Conhecer o serviço ↗</a></article><article><span class="service-number">02</span><h3>Assessoria Parcial</h3><p>Vocês já começaram. Entramos para organizar os próximos passos e cuidar dos detalhes que ainda faltam.</p><a href="/servicos" class="text-link">Conhecer o serviço ↗</a></article><article><span class="service-number">03</span><h3>Cerimonial do Dia</h3><p>Coordenação dos bastidores, dos profissionais e dos momentos para que vocês vivam a celebração.</p><a href="/servicos" class="text-link">Conhecer o serviço ↗</a></article></div></div></section>
<section class="section team-section"><div class="section-inner team-layout"><div class="team-photo"><img src="assets/img/team.webp" width="1000" height="1333" loading="lazy" alt="Equipe Elass Cerimonial"><span>Organização e emoção, juntas.</span></div><div class="team-copy"><span class="eyebrow">Quem cuida do seu dia</span><h2 data-cms="about_title">O olhar atento.<br>O cuidado de perto.</h2><p data-cms="about_text">A Elass acredita que organização e emoção caminham juntas. Ouvimos a história de vocês, entendemos suas prioridades e cuidamos dos bastidores para que o essencial tenha espaço: viver cada momento.</p><a href="/sobre" class="text-link">Conheça a Elass ↗</a></div></div></section>
<section class="section"><div class="section-inner"><div class="editorial-heading"><div><span class="eyebrow">Do primeiro sim ao último brinde</span><h2 data-cms="process_title">Um caminho mais leve,<br>um passo de cada vez.</h2></div><a href="/contato" class="text-link">Comece por uma conversa ↗</a></div><div class="process-grid"><article><span>01 / ESCUTAR</span><h3>A história de vocês</h3><p>Uma conversa para conhecer o sonho, o estilo e as prioridades do casal.</p></article><article><span>02 / PLANEJAR</span><h3>Cada escolha, com sentido</h3><p>Organizamos os passos, os fornecedores e o cronograma da celebração.</p></article><article><span>03 / ACOMPANHAR</span><h3>Presença e atenção</h3><p>Alinhamos os detalhes e acompanhamos o que precisa acontecer.</p></article><article><span>04 / REALIZAR</span><h3>O dia de vocês</h3><p>Cuidamos dos bastidores para vocês estarem presentes em cada momento.</p></article></div></div></section>
<section class="section real-stories" hidden data-container="portfolio"><div class="section-inner"><span class="eyebrow">Histórias que ficam</span><h2>Celebrações com a Elass.</h2><div class="stories-grid" data-content="portfolio"></div></div></section>
<section class="section" hidden data-container="testimonials"><div class="section-inner"><span class="eyebrow">Quem viveu conta</span><h2>Palavras que guardamos com carinho.</h2><div class="testimonial-grid" data-content="testimonials"></div></div></section>
<section class="section faq-section"><div class="section-inner"><div class="editorial-heading"><div><span class="eyebrow">Antes de começar</span><h2>Para conversar com calma.</h2></div></div><div data-content="faqs"><details><summary>Como escolher a assessoria para o nosso casamento?</summary><p>Comecem contando o que já está definido e onde precisam de apoio. A equipe apresenta o serviço adequado ao planejamento de vocês.</p></details><details><summary>Já contratamos fornecedores. Ainda podemos ter assessoria?</summary><p>Sim. A assessoria parcial permite alinhar o que já foi contratado e organizar as etapas que ainda precisam de acompanhamento.</p></details><details><summary>Como acompanhamos o planejamento?</summary><p>Após a liberação do acesso pela equipe, vocês podem consultar informações compartilhadas, responder ao briefing e acompanhar o planejamento no portal dos noivos.</p></details></div></div></section>
<section class="closing-section"><div class="section-inner"><span class="eyebrow">O seu próximo capítulo</span><h2 data-cms="contact_title">Tudo começa<br>com uma boa conversa.</h2><p>Contem o que imaginam. Vamos encontrar, juntos, o caminho até o grande dia.</p><a href="/contato" class="btn-primary">Quero conversar com a Elass ↗</a><a href="/portal" class="text-link">Já são nossos clientes? Acessem o portal</a></div></section>
</main>

'''+s[b:]
s=s.replace('<script src="assets/js/home.js"></script>','')
p.write_text(s)
