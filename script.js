const enterBtn=document.getElementById('enterBtn');const intro=document.getElementById('intro');const site=document.getElementById('site');const lights=document.querySelector('.start-lights');enterBtn.addEventListener('click',()=>{enterBtn.disabled=true;lights.classList.add('go');setTimeout(()=>{intro.classList.add('hide');site.classList.add('show');site.setAttribute('aria-hidden','false');document.body.classList.remove('locked');setTimeout(()=>intro.style.display='none',850)},900)});const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));const EVENT_DATE=new Date('2026-10-24T15:00:00+08:00').getTime();function updateCountdown(){let diff=EVENT_DATE-Date.now();if(diff<=0){['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=i===0?'000':'00');document.getElementById('countdownNote').textContent="🏁 It's race day! Happy 1st birthday!";return}const d=Math.floor(diff/86400000);diff%=86400000;const h=Math.floor(diff/3600000);diff%=3600000;const m=Math.floor(diff/60000);const s=Math.floor(diff%60000/1000);document.getElementById('days').textContent=String(d).padStart(3,'0');document.getElementById('hours').textContent=String(h).padStart(2,'0');document.getElementById('minutes').textContent=String(m).padStart(2,'0');document.getElementById('seconds').textContent=String(s).padStart(2,'0')}updateCountdown();setInterval(updateCountdown,1000);const form=document.getElementById('rsvpForm');const message=document.getElementById('rsvpMessage');form.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('guestName').value.trim();const attendance=document.getElementById('attendance').value;const existing=JSON.parse(localStorage.getItem('firstLapRSVPs')||'[]');existing.push({name,attendance,submittedAt:new Date().toISOString()});localStorage.setItem('firstLapRSVPs',JSON.stringify(existing));message.textContent=attendance==='yes'?`🏁 Yay, ${name}! Your spot on the starting grid is confirmed!`:`💛 Thank you, ${name}. We'll miss you on race day!`;form.reset()});


// Milestone photo uploader. Images are saved in this browser for easy preview.
const milestoneCards=document.querySelectorAll('.milestone-card');
milestoneCards.forEach(card=>{
  const key=`firstLapMilestone_${card.dataset.milestone}`;
  const input=card.querySelector('input[type="file"]');
  const photo=card.querySelector('.milestone-photo');
  const img=card.querySelector('img');
  const saved=localStorage.getItem(key);
  if(saved){img.src=saved;photo.classList.add('has-image')}
  input.addEventListener('change',()=>{
    const file=input.files&&input.files[0];
    if(!file)return;
    if(!file.type.startsWith('image/'))return;
    const reader=new FileReader();
    reader.onload=()=>{
      img.src=reader.result;
      photo.classList.add('has-image');
      try{localStorage.setItem(key,reader.result)}catch(error){console.warn('Photo preview loaded, but browser storage is full.',error)}
    };
    reader.readAsDataURL(file);
  });
});
