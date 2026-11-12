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

  // ---------- Contact form (mailto/whatsapp fallback, sem backend) ----------
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var nome = form.nome.value.trim();
      var data = form.data ? form.data.value.trim() : '';
      var whats = form.whatsapp.value.trim();
      var msg = form.mensagem ? form.mensagem.value.trim() : '';
      var texto = 'Olá, Elass! Meu nome é ' + nome +
        (data ? '. Nossa data prevista é ' + data : '') +
        '. Meu WhatsApp: ' + whats +
        (msg ? '. ' + msg : '');
      var url = 'https://api.whatsapp.com/send?phone=5531996472045&text=' + encodeURIComponent(texto);
      window.open(url, '_blank');
    });
  }
});
