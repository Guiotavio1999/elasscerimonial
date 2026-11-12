document.addEventListener('DOMContentLoaded',()=>{
 const header=document.querySelector('#site-header'),toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#mobile-nav');
 const update=()=>header?.classList.toggle('scrolled',scrollY>40);addEventListener('scroll',update,{passive:true});update();
 let previous;
 function menu(open){if(!nav)return;nav.classList.toggle('open',open);toggle.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.inert=!open;document.body.style.overflow=open?'hidden':'';if(open){previous=document.activeElement;nav.querySelector('a')?.focus();}else previous?.focus();}
 toggle?.addEventListener('click',()=>menu(!nav.classList.contains('open')));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu(false)));
 document.addEventListener('keydown',ev=>{if(!nav?.classList.contains('open'))return;if(ev.key==='Escape')menu(false);if(ev.key==='Tab'){const list=[...nav.querySelectorAll('a'),toggle];const i=list.indexOf(document.activeElement);if(ev.shiftKey&&i===0){ev.preventDefault();toggle.focus();}else if(!ev.shiftKey&&i===list.length-1){ev.preventDefault();list[0].focus();}}});
 const form=document.querySelector('#contact-form');
 if(form)form.addEventListener('submit',async ev=>{ev.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('[type=submit]'),status=document.querySelector('#contact-status');button.disabled=true;button.textContent='Enviando…';status.textContent='';
 try{const data=new FormData(form);const response=await fetch('/api/app?action=contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.get('nome'),phone:data.get('whatsapp'),date:data.get('data'),email:data.get('email'),message:data.get('mensagem'),city:data.get('city'),guests:data.get('guests'),service:data.get('service'),consent:data.get('consent')==='on',website:data.get('website')})});const r=await response.json();if(!response.ok)throw Error(r.error||'Não foi possível enviar.');status.className='contact-message';status.textContent='Recebemos sua solicitação! A equipe poderá continuar o atendimento pelo WhatsApp.';const link=document.createElement('a');link.href=r.whatsapp;link.textContent=' Continuar no WhatsApp ↗';link.rel='noopener noreferrer';link.target='_blank';link.style.textDecoration='underline';status.append(link);form.reset();button.textContent='Enviar nova solicitação';}
 catch(err){status.className='contact-message error';status.textContent=err.message+' Você também pode falar diretamente pelo botão de WhatsApp.';button.textContent='Tentar novamente';}finally{button.disabled=false;}});
 const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}};
 function el(tag,text,cls){const node=document.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;}
 fetch('/api/app?action=content').then(r=>r.ok?r.json():[]).then(rows=>{
  for(const row of rows.filter(r=>r.kind==='sections')){
   const key=row.data.key,value=row.data.description;
   document.querySelectorAll('[data-cms="'+key+'"]').forEach(node=>node.textContent=value);
   if(key==='brand'){document.querySelectorAll('.brand-word').forEach(n=>n.textContent=value);}
   if(key==='instagram'&&safeUrl(value)){document.querySelectorAll('a[href*="instagram.com/elasscerimonial"]').forEach(n=>{n.href=safeUrl(value);n.textContent='Instagram da Elass';});}
   if(key==='contact_phone'&&/^\d{12,15}$/.test(value)){document.querySelectorAll('a[href*="phone=5531996472045"],a[href^="https://wa.me/5531996472045"]').forEach(n=>n.href='https://wa.me/'+value);}
  }
  for(const kind of ['portfolio','partners','testimonials','faqs','services']){const items=rows.filter(r=>r.kind===kind);if(!items.length)continue;
   document.querySelectorAll('[data-container="'+kind+'"]').forEach(n=>n.hidden=false);
   document.querySelectorAll('[data-content="'+kind+'"]').forEach(host=>{host.replaceChildren();items.forEach((r,i)=>{const d=r.data;
    if(kind==='faqs'){const details=el('details');details.append(el('summary',d.title),el('p',d.description));host.append(details);return;}
    if(kind==='testimonials'){const b=el('blockquote',d.description);b.append(el('cite',d.title));host.append(b);return;}
    const card=el('article','',kind==='portfolio'?'published-story':kind==='partners'?'published-partner':'');if(kind==='services')card.append(el('span',String(i+1).padStart(2,'0'),'service-number'));
    if(safeUrl(d.image)){const img=el('img');img.src=safeUrl(d.image);img.alt=d.title;img.loading='lazy';card.append(img);}
    const text=el('div','',kind==='portfolio'?'story-copy':'');text.append(el('h3',d.title),el('p',d.description));
    if(safeUrl(d.url)){const link=el('a','Conhecer parceiro ↗','text-link');link.href=safeUrl(d.url);link.target='_blank';link.rel='noopener noreferrer';text.append(link);}
    if(kind==='services'){const link=el('a','Converse sobre este serviço ↗','text-link');link.href='/contato';text.append(link);}
    card.append(text);host.append(card);
   });});
  }
 }).catch(()=>{});
});
