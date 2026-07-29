const enterBtn=document.getElementById('enterBtn');const intro=document.getElementById('intro');const site=document.getElementById('site');const lights=document.querySelector('.start-lights');enterBtn.addEventListener('click',()=>{enterBtn.disabled=true;lights.classList.add('go');setTimeout(()=>{intro.classList.add('hide');site.classList.add('show');site.setAttribute('aria-hidden','false');document.body.classList.remove('locked');setTimeout(()=>intro.style.display='none',850)},900)});const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));const EVENT_DATE=new Date('2026-08-08T15:30:00').getTime();function updateCountdown(){let diff=EVENT_DATE-Date.now();if(diff<=0){['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=i===0?'000':'00');document.getElementById('countdownNote').textContent="🏁 It's race day! Happy 1st birthday!";return}const d=Math.floor(diff/86400000);diff%=86400000;const h=Math.floor(diff/3600000);diff%=3600000;const m=Math.floor(diff/60000);const s=Math.floor(diff%60000/1000);document.getElementById('days').textContent=String(d).padStart(3,'0');document.getElementById('hours').textContent=String(h).padStart(2,'0');document.getElementById('minutes').textContent=String(m).padStart(2,'0');document.getElementById('seconds').textContent=String(s).padStart(2,'0')}updateCountdown();setInterval(updateCountdown,1000);const GOOGLE_SCRIPT_URL='https://script.google.com/macros/s/AKfycbyUd4D2U0xykXnAuGtsfpBzL6esZGPhm_FDxkGSRWrZvZe1tg32daPdrwOrPR5CCtJN/exec';
const form=document.getElementById('rsvpForm');
const message=document.getElementById('rsvpMessage');
const submitBtn=document.getElementById('rsvpSubmitBtn');

form.addEventListener('submit',async e=>{
  e.preventDefault();

  const name=document.getElementById('guestName').value.trim();
  const response=document.getElementById('guestResponse').value;
  if(!name||!response)return;

  // "message" is also sent for compatibility with the currently deployed Apps Script.
  const payload={name,response,message:response};

  submitBtn.disabled=true;
  submitBtn.textContent='SENDING...';
  message.textContent='Sending your RSVP...';

  try{
    await fetch(GOOGLE_SCRIPT_URL,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(payload)
    });

    const existing=JSON.parse(localStorage.getItem('firstLapRSVPs')||'[]');
    existing.push({...payload,submittedAt:new Date().toISOString(),synced:true});
    localStorage.setItem('firstLapRSVPs',JSON.stringify(existing));

    message.textContent=response.startsWith('Yes')
      ? `🏁 Thank you, ${name}! We can't wait to celebrate with you!`
      : `Thank you for letting us know, ${name}. We'll miss you!`;
    form.reset();
  }catch(error){
    const pending=JSON.parse(localStorage.getItem('firstLapPendingRSVPs')||'[]');
    pending.push({...payload,submittedAt:new Date().toISOString()});
    localStorage.setItem('firstLapPendingRSVPs',JSON.stringify(pending));

    message.textContent='Your RSVP could not be sent. Please check your internet connection and try again.';
    console.error('Google Sheets submission failed:',error);
  }finally{
    submitBtn.disabled=false;
    submitBtn.textContent='SUBMIT RSVP';
  }
});


// View-only milestone photo lightbox with desktop and mobile zoom.
const lightbox=document.getElementById('photoLightbox');
const lightboxImage=document.getElementById('lightboxImage');
const lightboxClose=document.getElementById('lightboxClose');
const zoomIn=document.getElementById('zoomIn');
const zoomOut=document.getElementById('zoomOut');
const zoomReset=document.getElementById('zoomReset');
let scale=1,translateX=0,translateY=0,startX=0,startY=0,dragging=false,startDistance=0,startScale=1;
function applyTransform(){lightboxImage.style.transform=`translate(${translateX}px, ${translateY}px) scale(${scale})`;}
function resetZoom(){scale=1;translateX=0;translateY=0;applyTransform();}
function setScale(next){scale=Math.min(5,Math.max(1,next));if(scale===1){translateX=0;translateY=0;}applyTransform();}
function openLightbox(img){lightboxImage.src=img.currentSrc||img.src;lightboxImage.alt=img.alt||'Expanded milestone photo';resetZoom();lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('lightbox-open');lightboxClose.focus();}
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-open');lightboxImage.src='';resetZoom();}
document.querySelectorAll('.milestone-photo.lightbox-trigger').forEach(btn=>btn.addEventListener('click',()=>openLightbox(btn.querySelector('img'))));
lightboxClose.addEventListener('click',closeLightbox);
zoomIn.addEventListener('click',()=>setScale(scale+.35));
zoomOut.addEventListener('click',()=>setScale(scale-.35));
zoomReset.addEventListener('click',resetZoom);
lightbox.addEventListener('click',e=>{if(e.target===lightbox||e.target.classList.contains('lightbox-stage'))closeLightbox();});
document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='+')setScale(scale+.35);if(e.key==='-')setScale(scale-.35);});
lightbox.addEventListener('wheel',e=>{if(!lightbox.classList.contains('open'))return;e.preventDefault();setScale(scale+(e.deltaY<0?.2:-.2));},{passive:false});
lightboxImage.addEventListener('mousedown',e=>{if(scale<=1)return;dragging=true;startX=e.clientX-translateX;startY=e.clientY-translateY;lightboxImage.classList.add('dragging');});
window.addEventListener('mousemove',e=>{if(!dragging)return;translateX=e.clientX-startX;translateY=e.clientY-startY;applyTransform();});
window.addEventListener('mouseup',()=>{dragging=false;lightboxImage.classList.remove('dragging');});
lightboxImage.addEventListener('dblclick',()=>setScale(scale>1?1:2));
lightbox.addEventListener('touchstart',e=>{if(e.touches.length===2){startDistance=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);startScale=scale;}else if(e.touches.length===1&&scale>1){startX=e.touches[0].clientX-translateX;startY=e.touches[0].clientY-translateY;}},{passive:false});
lightbox.addEventListener('touchmove',e=>{e.preventDefault();if(e.touches.length===2&&startDistance){const distance=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);setScale(startScale*(distance/startDistance));}else if(e.touches.length===1&&scale>1){translateX=e.touches[0].clientX-startX;translateY=e.touches[0].clientY-startY;applyTransform();}},{passive:false});
