document.addEventListener('DOMContentLoaded', function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.getElementById('site-header');

  // ---------- Header scroll state ----------
  function updateHeaderState(){
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', updateHeaderState);
  updateHeaderState();

  // ---------- Mobile menu ----------
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function(){
      var isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Reveal on scroll (generic, works without GSAP too) ----------
  var revealEls = document.querySelectorAll('.reveal, .tl-item');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.style.transition = 'opacity .9s ease, transform .9s ease';
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          ro.unobserve(entry.target);
        }
      });
    }, {threshold:.2});
    revealEls.forEach(function(el){ ro.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.style.opacity = 1; el.style.transform='none'; });
  }

  // ---------- Photo zoom settle (bastidores-like photos) ----------
  document.querySelectorAll('.photo-wrap img').forEach(function(img){
    if ('IntersectionObserver' in window){
      var io2 = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            img.style.transition='transform 1.6s ease';
            img.style.transform='scale(1)';
            io2.unobserve(img);
          }
        });
      }, {threshold:.3});
      io2.observe(img);
    }
  });

  // Save the contact before offering the WhatsApp conversation.
  var form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', async function(event) {
    event.preventDefault();
    var button=form.querySelector('[type="submit"]'), status=document.getElementById('contact-status');
    button.disabled=true; status.textContent='Enviando sua solicitação…';
    try {
      var response=await fetch('/api/app?action=contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.nome.value,phone:form.whatsapp.value,date:form.data.value,email:form.email.value,message:form.mensagem.value,consent:form.consent.checked,website:form.website.value})});
      var result=await response.json(); if(!response.ok)throw Error(result.error||'Não foi possível enviar.');
      status.textContent='Solicitação recebida pela Elass. Se desejar, continue pelo WhatsApp. ';
      var link=document.createElement('a');link.href=result.whatsapp;link.target='_blank';link.rel='noopener';link.className='btn-primary';link.textContent='Continuar no WhatsApp';status.appendChild(link);form.reset();
    } catch(error) {status.textContent=error.message;} finally {button.disabled=false;}
  });
});

// Published CMS content uses text nodes; no arbitrary HTML from the database.
(async function(){
 try {
  const response=await fetch('/api/app?action=content');if(!response.ok)return;
  const records=await response.json();
  for(const row of records.filter(r=>r.kind==='sections')){
   document.querySelectorAll('[data-cms]').forEach(el=>{if(el.dataset.cms===row.data.key){el.textContent=row.data.description;el.hidden=false;}});
   if(row.data.key==='brand')document.querySelectorAll('.brand-word').forEach(el=>el.textContent=row.data.description);
   if(row.data.key==='instagram'&&/^https:\/\//.test(row.data.description))document.querySelectorAll('a[href*="instagram.com"]').forEach(a=>a.href=row.data.description);
   if(row.data.key==='contact_phone')document.querySelectorAll('a[href*="wa.me/"],a[href*="api.whatsapp.com/send"]').forEach(a=>{const n=row.data.description.replace(/\D/g,'');if(n.length>=10)a.href='https://wa.me/'+(n.length<=11?'55':'')+n;});
  }
  for(const type of ['services','portfolio','partners','testimonials','faqs']){
   const list=records.filter(r=>r.kind===type);if(!list.length)continue;document.querySelectorAll('[data-dynamic="'+type+'"]').forEach(el=>el.hidden=false);
   document.querySelectorAll('[data-content="'+type+'"]').forEach(container=>{
    container.replaceChildren();
    list.forEach(row=>{const d=row.data,card=document.createElement('article');card.className=type==='portfolio'?'story-card':type==='partners'?'partner-card':'cms-card';
     if(d.image&&/^https:\/\//.test(d.image)){const img=document.createElement('img');img.src=d.image;img.alt=d.title;img.loading='lazy';img.style.cssText='width:100%;height:240px;object-fit:cover';card.appendChild(img);}
     const body=document.createElement('div');body.className=type==='portfolio'?'sc-content':'cms-card-body';const title=document.createElement('h3');title.textContent=d.title;const text=document.createElement('p');text.textContent=d.description;body.append(title,text);
     if(d.url&&/^https:\/\//.test(d.url)){const a=document.createElement('a');a.href=d.url;a.textContent='Conhecer parceiro ↗';a.target='_blank';a.rel='noopener';body.appendChild(a);}card.appendChild(body);container.appendChild(card);});
   });
   if(type==='services')document.querySelectorAll('[data-service]').forEach((el,i)=>{if(list[i]){el.querySelector('h3').textContent=list[i].data.title;el.querySelector('p').textContent=list[i].data.description;}});
  }
 }catch(error){console.warn('Conteúdo dinâmico indisponível; conteúdo original preservado.');}
})();
