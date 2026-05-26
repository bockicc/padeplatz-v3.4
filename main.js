/* ============================================================
   PADEL PLATZ KRALJEVO — JavaScript
   ============================================================ */
(function(){
'use strict';

document.addEventListener('DOMContentLoaded',function(){

// ========================= LANGUAGE DROPDOWN (UI ONLY) =========================
(function(){
  var langToggle = document.querySelector('.lang-toggle');
  var langMenu = document.querySelector('.lang-menu');
  var langOptions = document.querySelectorAll('.lang-option');

  if(!langToggle || !langMenu) return;

  // ===== OPEN / CLOSE =====
  function toggleLangMenu(e){
    e.stopPropagation();
    var isExpanded = langToggle.getAttribute('aria-expanded') === 'true';
    langToggle.setAttribute('aria-expanded', !isExpanded);
    langMenu.hidden = isExpanded;
    if(!isExpanded) langOptions[0] && langOptions[0].focus();
  }

  function selectLang(e){
    var lang = this.getAttribute('data-lang');
    if(!lang) return;
    // Update active state in dropdown
    langOptions.forEach(function(opt){
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
    // Close menu
    langToggle.setAttribute('aria-expanded', 'false');
    langMenu.hidden = true;
  }

  langToggle.addEventListener('click', toggleLangMenu);
  langOptions.forEach(function(opt){
    opt.addEventListener('click', selectLang);
  });

  // Keyboard navigation
  langToggle.addEventListener('keydown', function(e){
    if(e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' '){
      e.preventDefault(); toggleLangMenu(e);
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && langToggle.getAttribute('aria-expanded') === 'true'){
      langToggle.setAttribute('aria-expanded', 'false');
      langMenu.hidden = true;
      langToggle.focus();
    }
  });

  document.addEventListener('click', function(){
    langToggle.setAttribute('aria-expanded', 'false');
    langMenu.hidden = true;
  });

  langMenu.addEventListener('click', function(e){ e.stopPropagation(); });

})();

// ========================= MOBILE MENU =========================
var ham=document.getElementById('hamburger-btn');
var mm=document.getElementById('mobileMenu');
if(ham&&mm){
  var mc=mm.querySelector('.mobile-close');
  function openM(){mm.classList.add('open');document.body.style.overflow='hidden';}
  function closeM(){mm.classList.remove('open');document.body.style.overflow='';}
  ham.addEventListener('click',function(e){e.stopPropagation();mm.classList.contains('open')?closeM():openM();});
  if(mc)mc.addEventListener('click',closeM);
  var ml=mm.querySelectorAll('a');
  for(var i=0;i<ml.length;i++)ml[i].addEventListener('click',closeM);
  mm.addEventListener('click',function(e){if(e.target===mm)closeM();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Esc')closeM();});
}

// ========================= SMOOTH SCROLL =========================
var al=document.querySelectorAll('a[href^="#"]');
for(var a=0;a<al.length;a++){
  al[a].addEventListener('click',function(e){
    var h=this.getAttribute('href');
    if(h&&h.length>1){
      var t=document.querySelector(h);
      if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
    }
  });
}

// ========================= ACTIVE NAV =========================
var cp=location.pathname.split('/').pop()||'index.html';
var nl=document.querySelectorAll('.nav-links a');
for(var n=0;n<nl.length;n++){
  var lh=nl[n].getAttribute('href');
  if(lh&&lh.split('/').pop()===cp){
    nl[n].style.color='#E8B84B';
    nl[n].style.background='rgba(232,184,75,0.15)';
  }
}

// ========================= SCROLL ANIMATION =========================
var ae=document.querySelectorAll('.animate-on-scroll');
if('IntersectionObserver' in window){
  var obs=new IntersectionObserver(function(entries){
    for(var e=0;e<entries.length;e++){
      if(entries[e].isIntersecting){entries[e].target.classList.add('visible');obs.unobserve(entries[e].target);}
    }
  },{threshold:0.05,rootMargin:'0px 0px -30px 0px'});
  for(var i=0;i<ae.length;i++)obs.observe(ae[i]);
}else{
  for(var i2=0;i2<ae.length;i2++)ae[i2].classList.add('visible');
}

// ========================= SCROLL ANIMATION (reveal) =========================
// Handles elements with .reveal class — staggered reveal on scroll
(function(){
  var reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries,observer){
      entries.forEach(function(entry,i){
        if(entry.isIntersecting){
          // use the element's inline --s delay for staggered groups
          var s=parseInt(getComputedStyle(entry.target).getPropertyValue('--s') || '0',10);
          setTimeout(function(){
            entry.target.classList.add('is-visible');
          }, s * 100);
          observer.unobserve(entry.target);
        }
      });
    },{
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });
    for(var i=0;i<reveals.length;i++){
      obs.observe(reveals[i]);
    }
  }else{
    for(var i2=0;i2<reveals.length;i2++) reveals[i2].classList.add('is-visible');
  }
})();

// ========================= CONTACT FORM =========================
var cf=document.getElementById('contact-form');
if(cf){
  cf.addEventListener('submit',function(e){
    e.preventDefault();
    clearFM(cf);
    var nm=document.getElementById('contact-name');
    var ph=document.getElementById('contact-phone');
    var em=document.getElementById('contact-email');
    var msg=document.getElementById('contact-message');
    if(!nm.value.trim()){errF(nm,cf,'Unesite ime i prezime.');return;}
    if(!ph.value.trim()||!isValidPhone(ph.value)){errF(ph,cf,'Unesite ispravan broj telefona.');return;}
    if(!em.value.trim()||!isValidEmail(em.value)){errF(em,cf,'Unesite ispravan email.');return;}
    if(!msg.value.trim()){errF(msg,cf,'Unesite poruku.');return;}
    var btn=cf.querySelector('button');
    var oh=btn.innerHTML;
    btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Šaljem...';btn.disabled=true;
    setTimeout(function(){
      showFM(cf,'✅ Hvala! Vaša poruka je poslata. Javićemo vam se uskoro.');
      cf.reset();btn.innerHTML=oh;btn.disabled=false;
    },1200);
  });
}

// ================================================================
// ===================== RESERVATION SYSTEM ========================
// ================================================================
(function(){

// --- Date helpers ---
function todayStr(){
  var d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function parseDate(s){var p=s.split('-');return new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));}
function fmtDisplay(s){
  if(!s)return'';
  var p=s.split('-');
  var m=['januar','februar','mart','april','maj','jun','jul','avgust','septembar','oktobar','novembar','decembar'];
  return parseInt(p[2])+'. '+m[parseInt(p[1],10)-1]+' '+p[0]+'. godine';
}

// --- Working hours ---
function isWorkingDay(d){return d.getDay()>=1&&d.getDay()<=5;} // Mon-Fri
function isWeekend(d){return d.getDay()===0||d.getDay()===6;} // Sat-Sun
function getDayStartEnd(d){
  var dow=d.getDay();
  if(dow===0)return{start:10,end:20}; // nedelja
  if(dow===6)return{start:9,end:22};  // subota
  return{start:8,end:24};             // pon-pet
}

// --- Simulated bookings (deterministic based on date) ---
// About 35-40% of available slots will be booked
function generateBookedSlots(){
  var booked={};
  var baseSeed=93025;
  var sd=new Date();
  sd.setHours(0,0,0,0);
  for(var dayOffset=0;dayOffset<60;dayOffset++){
    var d=new Date(sd);
    d.setDate(d.getDate()+dayOffset);
    var dow=d.getDay();
    if(dow===0)continue; // closed on Sunday
    var limits=getDayStartEnd(d);
    var iso=dateToISO(d);
    booked[iso]=[];
    for(var h=limits.start;h<limits.end;h++){
      baseSeed=(baseSeed*1103515245+12345)&0x7fffffff;
      if(baseSeed%100<40){
        booked[iso].push(h);
      }
    }
    if(booked[iso].length===0)delete booked[iso];
  }
  return booked;
}

var BOOKED=generateBookedSlots();
var TODAY=todayStr();

function dateToISO(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

// --- Calendar state ---
var calYear,calMonth,selectedDate=null;
var now=new Date();
calYear=now.getFullYear();
calMonth=now.getMonth();

var MONTHS=['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar'];
var DAYS_SHORT=['Po','Ut','Sr','Če','Pe','Su','Ne'];

// --- DOM refs ---
var calGrid=document.getElementById('cal-grid');
var calLabel=document.getElementById('cal-label');
var calPrev=document.getElementById('cal-prev');
var calNext=document.getElementById('cal-next');
var dateInput=document.getElementById('date-input');
var dateDisplay=document.getElementById('date-display');
var timeSelect=document.getElementById('time-select');
var timesSection=document.getElementById('times-section');
var selectedInfo=document.getElementById('selected-info');
var selectedInfoText=document.getElementById('selected-info-text');

if(!calGrid)return; // not on reservation page

function formatSlot(h){
  var suffix=h<12?'h':(h===12?'h popodne':(h-12)+'h popodne');
  if(h>=20)return (h)+'h';
  return h+'h';
}

function renderCalendar(){
  calLabel.textContent=MONTHS[calMonth]+' '+calYear;
  var firstDow=new Date(calYear,calMonth,1).getDay();
  var daysInMonth=new Date(calYear,calMonth+1,0).getDate();
  var offset=firstDow===0?6:firstDow-1; // Mon=0

  var h='';
  // empty cells
  for(var s=0;s<offset;s++)h+='<div class="cal-day cd-empty"></div>';

  for(var dd=1;dd<=daysInMonth;dd++){
    var dObj=new Date(calYear,calMonth,dd);
    var iso=dateToISO(dObj);
    var cls='cal-day';

    if(iso===TODAY)cls+=' cd-today';
    if(iso===selectedDate)cls+=' cd-sel';
    if(dObj<now){var ts=new Date();ts.setHours(0,0,0,0);if(dObj<ts)cls+=' cd-past';}

    var isBookedDay=BOOKED[iso]&&BOOKED[iso].length>0;
    var isWeekendDay=isWeekend(dObj);
    var isSunday=dObj.getDay()===0;

    if(isSunday){
      cls+=' cd-booked';
    }else if(dObj<now){
      cls+=' cd-booked';
    }else if(isBookedDay){
      // partially booked — show as partially styled
      // still clickable if some slots free
      // we'll keep it normal, click handler checks availability
    }

    h+='<div class="'+cls+'" data-d="'+iso+'" role="button" tabindex="0" aria-label="'+dd+'. '+MONTHS[calMonth]+'">'+dd+'</div>';
  }

  calGrid.innerHTML=h;

  // attach events
  var cells=calGrid.querySelectorAll('.cal-day:not(.cd-empty)');
  for(var c=0;c<cells.length;c++){
    cells[c].addEventListener('click',function(){
      var iso=this.getAttribute('data-d');
      selectDate(iso);
    });
    cells[c].addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        var iso=this.getAttribute('data-d');
        selectDate(iso);
      }
    });
  }
}

function selectDate(iso){
  var d=parseDate(iso);
  if(d<now){d.setHours(0,0,0,0);if(d<now)return;} // past
  if(d.getDay()===0)return; // Sunday closed

  selectedDate=iso;
  dateInput.value=iso;
  dateDisplay.value=fmtDisplay(iso);
  selectedInfo.classList.add('visible');
  selectedInfoText.textContent=fmtDisplay(iso);

  // remove old selection
  var all=calGrid.querySelectorAll('.cal-d');
  for(var a=0;a<all.length;a++)all[a].classList.remove('cd-sel');
  var sel=calGrid.querySelector('[data-d="'+iso+'"]');
  if(sel)sel.classList.add('cd-sel');

  renderTimeSlots(iso);
  updateSubmitState();
}

function renderTimeSlots(iso){
  var d=parseDate(iso);
  var limits=getDayStartEnd(d);
  timeSelect.innerHTML='';
  timeSelect.disabled=false;

  var bookedHours=BOOKED[iso]||[];

  for(var h=limits.start;h<limits.end;h++){
    var opt=document.createElement('option');
    var label=formatSlot(h);
    if(bookedHours.indexOf(h)!==-1){
      label+=' ✗';
      opt.disabled=true;
      opt.style.opacity='0.4';
    }
    opt.value=h;
    opt.textContent=label;
    timeSelect.appendChild(opt);
  }

  // If all booked, disable
  var available=timeSelect.querySelectorAll('option:not([disabled])');
  if(available.length===0){
    timeSelect.disabled=true;
    var o=document.createElement('option');
    o.value='';
    o.textContent='Svi termini su zauzeti';
    timeSelect.insertBefore(o,timeSelect.firstChild);
  }
}

function updateSubmitState(){
  var btn=document.getElementById('submit-btn');
  if(!btn)return;
  btn.disabled=!(selectedDate&&timeSelect.value&&document.getElementById('fullname').value.trim()&&document.getElementById('phone').value.trim());
}

// Calendar navigation
if(calPrev)calPrev.addEventListener('click',function(){
  calMonth--;
  if(calMonth<0){calMonth=11;calYear--;}
  selectedDate=null;
  renderCalendar();
});
if(calNext)calNext.addEventListener('click',function(){
  calMonth++;
  if(calMonth>11){calMonth=0;calYear++;}
  selectedDate=null;
  renderCalendar();
});

// Watch date display click to open native picker (optional)
if(dateDisplay){
  dateDisplay.addEventListener('focus',function(){this.blur();});
}

// --- Reservation form ---
var rf=document.getElementById('reserve-form');
if(rf){
  rf.addEventListener('submit',function(e){
    e.preventDefault();
    clearFM(rf);
    var fn=document.getElementById('fullname');
    var fp=document.getElementById('phone');
    var dVal=dateInput.value;
    var tVal=timeSelect.value;
    if(!fn.value.trim()){errF(fn,rf,'Unesite ime i prezime.');return;}
    if(!fp.value.trim()||!isValidPhone(fp.value)){errF(fp,rf,'Unesite ispravan broj telefona.');return;}
    if(!dVal){showFM(rf,'Izaberite datum u kalendaru.');return;}
    if(!tVal||timeSelect.disabled){showFM(rf,'Izaberite slobodan termin.');return;}

    var btn=rf.querySelector('button');
    var oh=btn.innerHTML;
    btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Šaljem...';btn.disabled=true;
    setTimeout(function(){
      // Show summary
      btn.innerHTML=oh;btn.disabled=false;
      document.querySelector('.reservation-page').style.display='none';
      document.querySelector('.cta-section').style.display='none';

      document.getElementById('sum-date').textContent=fmtDisplay(dVal);
      var hVal=parseInt(tVal);
      var ampm=hVal<12?'Prepodne':'Popodne';
      document.getElementById('sum-time').textContent=formatSlot(hVal);
      document.getElementById('sum-players').textContent=document.getElementById('players').selectedOptions[0].text;
      document.getElementById('sum-name').textContent=fn.value.trim();

      document.getElementById('res-summary').classList.add('visible');
      document.getElementById('res-summary').scrollIntoView({behavior:'smooth',block:'start'});

      rf.reset();
      selectedDate=null;
      dateDisplay.value='';
      timeSelect.innerHTML='<option value="">-- Prvo izaberite datum --</option>';
      timeSelect.disabled=true;
      selectedInfo.classList.remove('visible');
      renderCalendar();
      updateSubmitState();
    },1400);
  });

  // Field watchers for submit enable
  var flds=['fullname','phone','date-input','time-select'];
  for(var f=0;f<flds.length;f++){
    var el=document.getElementById(flds[f]);
    if(el)el.addEventListener('change',updateSubmitState);
    if(el)el.addEventListener('input',updateSubmitState);
  }
}

// close summary
var csb=document.getElementById('close-summary');
if(csb)csb.addEventListener('click',function(){
  document.getElementById('res-summary').classList.remove('visible');
  document.querySelector('.reservation-page').style.display='block';
  document.querySelector('.cta-section').style.display='block';
  document.getElementById('res-summary').scrollIntoView({behavior:'smooth',block:'start'});
});

})(); // end reservation system

// ========================= FORM HELPERS =========================
window.clearFM=function(f){if(!f)return;var ms=f.querySelectorAll('.fm');for(var i=0;i<ms.length;i++)ms[i].parentNode.removeChild(ms[i]);};
window.showFM=function(f,m){clearFM(f);var d=document.createElement('div');d.className='fm suc';d.innerHTML=m;f.appendChild(d);};
window.errFM=function(f,m){clearFM(f);var d=document.createElement('div');d.className='fm err';d.innerHTML=m;f.insertBefore(d,f.firstChild);shakeEl(f);};
window.errF=function(inp,f,m){inp.style.borderColor='#D4382B';inp.style.boxShadow='0 0 0 3px rgba(212,56,43,0.15)';setTimeout(function(){inp.style.borderColor='';inp.style.boxShadow='';},2200);errFM(f,m);};

function shakeEl(el){if(!el)return;el.style.animation='shk .4s ease';setTimeout(function(){el.style.animation='';},400);}

// Add keyframes if missing
if(!document.getElementById('kf')){var s=document.createElement('style');s.id='kf';s.textContent='@keyframes shk{0%,100%{transform:translateX(0)}10%,50%,90%{transform:translateX(-4px)}30%,70%{transform:translateX(4px)}}';document.head.appendChild(s);}

// ========================= FAQ ACCORDION =========================
(function(){
  var items=document.querySelectorAll('.faq-item');
  if(items.length===0)return;
  // Open first item by default
  items[0].classList.add('active');
  for(var i=0;i<items.length;i++){
    (function(idx){
      var btn=items[idx].querySelector('.faq-question');
      if(!btn)return;
      btn.addEventListener('click',function(){
        var wasActive=items[idx].classList.contains('active');
        // close all
        for(var j=0;j<items.length;j++)items[j].classList.remove('active');
        // set aria-expanded false on all
        for(var j2=0;j2<items.length;j2++){
          var b2=items[j2].querySelector('.faq-question');
          if(b2)b2.setAttribute('aria-expanded','false');
        }
        // toggle clicked
        if(!wasActive){
          items[idx].classList.add('active');
          btn.setAttribute('aria-expanded','true');
        }
      });
    })(i);
  }
})();

// ======================== IMAGE GALLERY CAROUSEL ========================
(function(){
  var galleries=document.querySelectorAll('.gallery-wrap');
  if(galleries.length===0)return;

  galleries.forEach(function(gallery){
    var id=gallery.id;
    var track=gallery.querySelector('.gallery-track');
    var slides=track?track.querySelectorAll('img'):[];
    var total=slides.length;
    if(total===0)return;

    var prevBtn=gallery.querySelector('.gallery-prev');
    var nextBtn=gallery.querySelector('.gallery-next');
    var dotsContainer=gallery.querySelector('.gallery-dots');
    var counterEl=gallery.querySelector('.gallery-counter');
    var current=0;

    function goTo(idx){
      if(idx<0)idx=total-1;
      if(idx>=total)idx=0;
      current=idx;
      track.style.transform='translateX(-'+ (100*idx) +'%)';
      // update dots
      var dots=gallery.querySelectorAll('.gallery-dot');
      for(var d=0;d<dots.length;d++) dots[d].classList.toggle('active',d===idx);
      if(counterEl) counterEl.textContent=(idx+1)+' / '+total;
    }

    if(prevBtn) prevBtn.addEventListener('click',function(){goTo(current-1);});
    if(nextBtn) nextBtn.addEventListener('click',function(){goTo(current+1);});

    // Keyboard nav
    gallery.addEventListener('keydown',function(e){
      if(e.key==='ArrowLeft'){e.preventDefault();goTo(current-1);}
      if(e.key==='ArrowRight'){e.preventDefault();goTo(current+1);}
    });

    // Touch swipe
    var startX=0, startY=0, isSwiping=false;
    track.addEventListener('touchstart',function(e){
      startX=e.touches[0].clientX;
      startY=e.touches[0].clientY;
      isSwiping=false;
    },{passive:true});
    track.addEventListener('touchmove',function(e){
      var dx=e.touches[0].clientX-startX;
      var dy=e.touches[0].clientY-startY;
      if(!isSwiping && Math.abs(dx)>Math.abs(dy) && Math.abs(dx)>10){
        isSwiping=true;
      }
      if(isSwiping){
        e.preventDefault();
      }
    },{passive:false});
    track.addEventListener('touchend',function(e){
      if(isSwiping){
        var dx=e.changedTouches[0].clientX-startX;
        if(dx<-50) goTo(current+1);
        else if(dx>50) goTo(current-1);
        else goTo(current); // snap back
      }
    },{passive:true});

    // Keyboard shortcut: left/right arrow keys globally for this gallery
    document.addEventListener('keydown',function(e){
      // Only if gallery is visible
      if(gallery.offsetParent!==null && (e.key==='ArrowLeft'||e.key==='ArrowRight')){
        var rect=gallery.getBoundingClientRect();
        if(rect.top>=0 && rect.bottom<=window.innerHeight){
          // gallery is in view
          // handled above, prevent default
        }
      }
    });
  });
})();

// ========================= COPYRIGHT =========================
var cye=document.querySelectorAll('#cy,#copyright-year');
for(var y=0;y<cye.length;y++)cye[y].textContent=new Date().getFullYear();

// ========================= CART TOGGLE =========================
function toggleCart() {
  // Toggle cart sidebar or cart page - for now, let's just alert or navigate to cart
  // In a full implementation, this would open a cart sidebar or navigate to a cart page
  alert('Korpa je u razvojnoj fazi. Za sada možete videti stavke u localStorage.');
  // For demonstration, let's show what's in the cart
  var items = JSON.parse(localStorage.getItem('pp_cart_items') || '[]');
  if (items.length === 0) {
    alert('Korpa je prazna.');
  } else {
    var cartSummary = 'Stavke u korpi:\n';
    items.forEach(function(item, index) {
      cartSummary += (index + 1) + '. ' + item.name + ' - ' + item.price + '\n';
    });
    var total = parseFloat(localStorage.getItem('pp_cart_total') || '0');
    cartSummary += '\nUkupno: ' + total.toLocaleString('sr-RS') + ' RSD';
    alert(cartSummary);
  }
}

// ========================= GALLERY FILTERS =========================
var galFilters=document.querySelectorAll('.gal-filter');
if(galFilters.length>0){
  var pieces=document.querySelectorAll('.gallery-piece');
  for(var g=0;g<galFilters.length;g++){
    galFilters[g].addEventListener('click',function(){
      var f=this.getAttribute('data-filter');
      // update active
      for(var gf=0;gf<galFilters.length;gf++)galFilters[gf].classList.remove('active');
      this.classList.add('active');
      // filter pieces
      for(var p=0;p<pieces.length;p++){
        var cat=pieces[p].getAttribute('data-category')||'';
        if(f==='all'){
          pieces[p].classList.remove('hidden');
          pieces[p].classList.add('filtered-in');
        }else{
          if(cat.split(' ').indexOf(f)!==-1){
            pieces[p].classList.remove('hidden');
            pieces[p].classList.add('filtered-in');
          }else{
            pieces[p].classList.add('hidden');
            pieces[p].classList.remove('filtered-in');
          }
        }
      }
    });
  }
}

// ========================= GALLERY MODAL =========================
window.showImageInfo=function(title,desc){
  var ex=document.getElementById('gm-over');
  if(ex)ex.parentNode.removeChild(ex);
  var ov=document.createElement('div');
  ov.id='gm-over';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;animation:gmFi .25s ease;';
  ov.innerHTML='<div style="background:var(--surface);border-radius:20px;padding:36px 40px;max-width:420px;width:90%;text-align:center;border:2px solid var(--accent);position:relative;">'+
    '<button onclick="this.closest(\'#gm-over\').remove()" style="position:absolute;top:10px;right:14px;background:none;border:none;color:#fff;font-size:26px;cursor:pointer;">&times;</button>'+
    '<div style="font-size:2.6rem;margin-bottom:14px;color:var(--accent);"><i class="fas fa-camera"></i></div>'+
    '<h3 style="color:var(--white);font-size:1.2rem;margin-bottom:8px;">'+title+'</h3>'+
    '<p style="color:rgba(255,255,255,0.7);line-height:1.55;font-size:0.92rem;">'+desc+'</p>'+
    '<button onclick="this.closest(\'#gm-over\').remove()" style="margin-top:20px;background:var(--accent);color:var(--surface);border:none;padding:11px 32px;border-radius:50px;font-weight:700;cursor:pointer;font-size:0.95rem;">Zatvori</button>'+
  '</div>';
  document.body.appendChild(ov);
  setTimeout(function(){if(ov.parentNode)ov.parentNode.removeChild(ov);},10000);
  ov.addEventListener('click',function(e){if(e.target===ov)ov.parentNode.removeChild(ov);});
  if(!document.getElementById('gmfk')){var s2=document.createElement('style');s2.id='gmfk';s2.textContent='@keyframes gmFi{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}';document.head.appendChild(s2);}
};

});})(); // end gallery modal

// ========================= SHOP PRODUCT RENDERER =========================
(function(){
  var PRODUCTS = [
    { name:'Prime Pro Edition',       price:'39.900 RSD', img:'images/rackets/racket-prime-pro-1.webp',   badge:'pro',    link:'product-prime-pro.html',   alt:'Prime Pro Edition' },
    { name:'Rialto Pro 2.0',          price:'39.900 RSD', img:'images/rackets/rialto-pro-1.webp',          badge:'pro',    link:'product-rialto-pro.html',  alt:'Rialto Pro 2.0' },
    { name:'Rialto Pro Light 2.0',    price:'34.900 RSD', img:'images/rackets/rialto-pro-light-1.webp',    badge:'light',  link:'product-rialto-light.html',alt:'Rialto Pro Light 2.0' },
     { name:'Prime Team Women\'s',     price:'23.900 RSD', img:'images/rackets/prime-team-women-1.webp',    badge:'womens', link:'product-prime-womens.html',alt:'Prime Team Women\'s' },
     { name:'Cobra Women\'s',          price:'13.900 RSD', img:'images/rackets/cobra-women-1.webp',         badge:'womens', link:'product-cobra-womens.html',alt:'Cobra Women\'s' },
     { name:'Nova Pro Edition',        price:'14.500 RSD', img:'images/rackets/nova-pro-side-1.webp',       badge:'value',  link:'product-nova-pro.html',    alt:'Nova Pro Edition' },
     { name:'Cobra Apex Women\'s',     price:'15.000 RSD', img:'images/rackets/cobra-apex-1.webp',          badge:'womens', link:'product-cobra-apex.html',   alt:'Cobra Apex Women\'s' },
  ];
  function makeCard(p){
    if(p._phantom){                       // grid spacer – invisible but takes a slot
      var ph = document.createElement('span');
      ph.setAttribute('aria-hidden','true');
      ph.style.cssText = 'display:block;visibility:hidden;';
      return ph;
    }
    var a = document.createElement('a');
    a.href = p.link;
    a.className = 'product-card';
    a.style.position = 'relative';
    a.setAttribute('data-price', p.price);
    a.innerHTML =
      '<div class="product-img-box">' +
        '<img src="' + p.img + '" alt="' + p.alt + '" loading="lazy" width="400" height="600">' +
      '</div>' +
      '<div class="product-name">' + p.name + '</div>' +
      '<div class="product-price">' + p.price + '</div>' +
      '<span class="product-detail-btn">Detaljnije&ensp;<i class="fas fa-arrow-right"></i></span>' +
      '<button class="product-buy-btn" data-name="' + p.name + '" data-price="' + p.price + '"><i class="fas fa-cart-plus"></i> Kupi</button>';
    var toast = document.createElement('span');
    toast.className = 'cart-toast';
    toast.textContent = 'Dodato u korpu ✓';
    a.appendChild(toast);

    // buy button click → update cart
    a.querySelector('.product-buy-btn').addEventListener('click', function(e){
      e.stopPropagation();
      e.preventDefault();
      addToCart(p.price, p.name);
      toast.classList.add('show');
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.top = '-40px';
      setTimeout(function(){ toast.classList.remove('show'); }, 2200);
    });
    return a;
  }

  // ───────────────────────────────────────────────
  // CART  (localStorage-backed)
  // ───────────────────────────────────────────────
  function cartKey(){   return 'pp_cart_total'; }
  function itemsKey(){  return 'pp_cart_items'; }
  function addToCart(price, name){
    var cur  = parseFloat(localStorage.getItem(cartKey()) || '0');
    var num  = parseFloat(price.replace(/[^\d]/g, ''));
    localStorage.setItem(cartKey(), (cur + num).toFixed(0));
    var items = JSON.parse(localStorage.getItem(itemsKey()) || '[]');
    items.push({ name: name, price: price });
    localStorage.setItem(itemsKey(), JSON.stringify(items));
    updateCartUI();
  }

function updateCartUI(){
     var total = parseFloat(localStorage.getItem(cartKey()) || '0');
     var items = JSON.parse(localStorage.getItem(itemsKey()) || '[]');
     var count = items.length;
     var labelBtn  = document.getElementById('cart-btn');
     if(labelBtn){
       labelBtn.querySelector('.cart-total').textContent =
         count > 0 ? total.toLocaleString('sr-RS') + ' RSD' : 'Korpa';
       var badge = labelBtn.querySelector('.cart-count');
       if(count > 0){
         badge.textContent = count > 99 ? '99+' : count;
         badge.style.display = 'inline-flex';
       } else {
         badge.style.display = 'none';
       }
     }
     // also update summary on cart page (shop.html) if open
     var cartTotalEl = document.getElementById('cart-summary-total');
     var cartCountEl = document.getElementById('cart-summary-count');
     if(cartTotalEl) cartTotalEl.textContent = total.toLocaleString('sr-RS') + ' RSD';
     if(cartCountEl) cartCountEl.textContent = count;
     // update nav cart count
     var navCartCount = document.getElementById('cart-count');
     if (navCartCount) {
         navCartCount.textContent = count;
     }
   }

  function renderProducts(){
    var container = document.getElementById('product-container');
    if(!container) return;
    container.innerHTML = '';   // clear any previously injected cards

    // Grid is 3 columns. 7 items puts Nova Pro (item#7) in col #1 of the
    // last row, glued to the left.  Insert 1 invisible phantom card so Nova
    // Pro bumps to col #2 — centred, right below Cobra Women's.
    var displayList = PRODUCTS.slice(0, 6);        // items 1-6  (rows 1 & 2)
    displayList.push({ _phantom: true });          // col-1 invisible filler
    displayList.push(PRODUCTS[6]);                 // item#7   → lands in col-2 ✓

    for(var i = 0; i < displayList.length; i++){
      var card = makeCard(displayList[i]);
      if(displayList[i]._phantom) card.style.visibility = 'hidden';
      container.appendChild(card);
    }
  }

  window.renderProducts = renderProducts;

  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    renderProducts();
  } else {
    document.addEventListener('DOMContentLoaded', renderProducts);
  }

  // ── PRODUCT GALLERY ────────────────────────────────────────────────────────
  // Auto-wires every .gallery-wrap on the page (shop + all product detail pages).
  // Each wrap must have: gallery-viewport > gallery-track, gallery-prev, gallery-next,
  // gallery-counter, and optional gallery-thumbs inside the wrap.
  function initGalleries(){
    var wraps = document.querySelectorAll('.gallery-wrap[data-init="false"], .gallery-wrap:not([data-init])');
    wraps.forEach(function(wrap){
      wrap.setAttribute('data-init','true');
      var viewport   = wrap.querySelector('.gallery-viewport');
      var track      = wrap.querySelector('.gallery-track');
      var prevBtn    = wrap.querySelector('.gallery-prev');
      var nextBtn    = wrap.querySelector('.gallery-next');
      var counterEl  = wrap.querySelector('.gallery-counter');
      var thumbsWrap = wrap.querySelector('.gallery-thumbs');
      if(!track) return;
      var slides = track.querySelectorAll('.gallery-track > span');
      if(slides.length === 0) slides = track.querySelectorAll('.gallery-track img');

      function go(idx){
        var n = slides.length;
        if(idx < 0) idx = n - 1;
        if(idx >= n) idx = 0;
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        if(counterEl) counterEl.textContent = (idx + 1) + ' / ' + n;
        // active thumb
        if(thumbsWrap){
          thumbsWrap.querySelectorAll('.gallery-thumb').forEach(function(t,i){
            t.classList.toggle('active', i === idx);
          });
        }
        // when init-thumbs are auto-generated and this is the bootstrap call,
        // make sure thumb[0] is active even if go was invoked as go(0)
        if(thumbsWrap && idx === 0 && wrap.__gi === null){
          var thumbs0 = thumbsWrap.querySelector('.gallery-thumb');
          if(thumbs0) thumbs0.classList.add('active');
        }
        wrap.__gi = idx;
      }

      go(null); // bootstrap — hits auto-thumb fix path, otherwise lands on slide 0

      if(prevBtn) prevBtn.addEventListener('click', function(){ go(wrap.__gi - 1); });
      if(nextBtn) nextBtn.addEventListener('click', function(){ go(wrap.__gi + 1); });

      if(thumbsWrap){
        thumbsWrap.querySelectorAll('.gallery-thumb').forEach(function(thumb, i){
          thumb.addEventListener('click', function(){ go(i); });
        });
      } else {
        // generate default thumbnail strip from existing slide images
        var thumbList = track.querySelectorAll('img');
        if(thumbList.length > 1 && !thumbsWrap){
          // clean any previously generated thumbs on this wrap (idempotent safeguard)
          var existingWalrus = wrap.querySelector('.gallery-thumbs');
          if(existingWalrus) existingWalrus.parentNode.removeChild(existingWalrus);
          thumbsWrap = document.createElement('div');
          thumbsWrap.className = 'gallery-thumbs';
          thumbList.forEach(function(img, i){
            var div = document.createElement('div');
            div.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
            div.setAttribute('data-gallery', wrap.id || '');
            div.setAttribute('data-slide', i);
            var thumbImg = document.createElement('img');
            thumbImg.src     = img.src;
            thumbImg.alt     = (img.alt || '') + ' thumb';
            div.appendChild(thumbImg);
            thumbsWrap.appendChild(div);
          });
          wrap.appendChild(thumbsWrap);
          thumbsWrap.querySelectorAll('.gallery-thumb').forEach(function(t, i){
            t.addEventListener('click', function(){ go(i); });
          });
        }
      }
    });
  }

  // run once on load and again whenever DOM changes
   if(document.readyState === 'complete' || document.readyState === 'interactive'){
     initGalleries();
   } else {
     document.addEventListener('DOMContentLoaded', initGalleries);
   }

    // Hide the footer link that corresponds to the current page (core pages only)
    // For product detail pages, hide the shop link instead
    document.addEventListener('DOMContentLoaded', function () {
      // Get just the filename (e.g., "index.html", "galerija.html")
      const currentPage = window.location.pathname.split('/').pop();

      // List of pages where the logic should run (core pages)
      const corePages = [
        'index.html',
        'galerija.html',
        'cenovnik.html',
        'pravila.html',
        'rezervacija.html',
        'shop.html',
        'kontakt.html'
      ];

      // Exit early for turniri.html and rang-lista.html (or any other page not in corePages)
      if (!corePages.includes(currentPage) && !currentPage.startsWith('product-')) {
        return;
      }

      // Determine which link to hide:
      // If we are on a product detail page, hide the shop link
      // Otherwise, hide the link matching the current page
      let targetHref = currentPage;
      if (currentPage.startsWith('product-')) {
        targetHref = 'shop.html';
      }

      // Find the <a> inside the footer's "Prečice" list that matches the targetHref
      const linkToHide = document.querySelector(
        '.footer .footer-links a[href="' + targetHref + '"]'
      );

      // If found, hide it
      if (linkToHide) {
        linkToHide.style.display = 'none';
      }
    });

 })(); // end shop renderer