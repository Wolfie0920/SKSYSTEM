/* KK-SK Portal: shared logic. Every page loads this file; the page is chosen by <body data-page="..."> */
document.body.insertAdjacentHTML('afterbegin',"<aside id=\"sb\" aria-label=\"Main menu\"><div class=\"sbt-row\"><a class=\"sblogo\" href=\"home.html\" aria-label=\"KK\u2013SK Portal home\"><span class=\"lg\">KK</span><span class=\"lt\">KK\u2013SK Portal</span></a><button class=\"sbc\" id=\"sbc\" aria-label=\"Collapse menu\" aria-expanded=\"true\"><svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button></div><nav id=\"nav\" aria-label=\"Main\"></nav><div class=\"sbb\" id=\"sbb\"></div></aside><div id=\"scrim\"></div><dialog id=\"ad\" aria-label=\"Achievement details\"><div id=\"adc\"></div><button type=\"button\" id=\"adx\" style=\"margin-top:1rem\">Close</button></dialog><header><div class=\"bar\"><button class=\"mn\" id=\"mn\" aria-label=\"Menu\" aria-expanded=\"false\" aria-controls=\"sb\">\u2630</button><span class=\"sp\"></span><a class=\"cta\" href=\"kk-profiling.html\">Fill up KK Profiling</a><a id=\"who\" href=\"profile.html\"></a></div></header>");
document.body.insertAdjacentHTML('beforeend',"<footer>KK\u2013SK Portal \u00b7 members only</footer><button class=\"cb\" id=\"cb\" aria-label=\"Open chat\" aria-expanded=\"false\">\ud83d\udcac<span id=\"cbn\" hidden></span></button>\n<section class=\"cp\" id=\"cp\" hidden aria-label=\"Chat\"><div class=\"row\"><b style=\"flex:1\">Chat</b><select id=\"pr\" aria-label=\"Room\" style=\"width:auto\"></select><button class=\"alt sm\" id=\"cx\" aria-label=\"Close chat\">\u2715</button></div><div class=\"msgs\" id=\"pmsgs\"></div><form id=\"f-pc\" class=\"row\" style=\"margin:0\"><input name=\"t\" placeholder=\"Write a message\" required autocomplete=\"off\" style=\"flex:1\"><button>Send</button></form></section>");

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Date().toISOString().slice(0,10);
const uid=()=>Math.random().toString(36).slice(2,9);
const seed=()=>({
 users:[
  {u:'chair',p:'sk123',name:'SK Chairperson',role:'sk',pos:'SK Chairperson'},
  {u:'secretary',p:'sk123',name:'SK Secretary',role:'sk',pos:'SK Secretary'},
  {u:'treasurer',p:'sk123',name:'SK Treasurer',role:'sk',pos:'SK Treasurer'},
  {u:'kagawad1',p:'sk123',name:'SK Kagawad 1',role:'sk',pos:'SK Kagawad'}],
 assembly:[
  {id:uid(),title:'1st Semester KK Assembly',date:'2026-03-14',stage:'Done',prog:100,notes:'Minutes signed and submitted to the Sangguniang Barangay.'},
  {id:uid(),title:'2nd Semester KK Assembly',date:'2026-11-21',stage:'Planning',prog:40,notes:'Venue booked. Notices are being posted.'}],
 resolutions:[
  {id:uid(),no:'SK-2026-001',title:'Approving the Annual Youth Budget',date:'2026-01-20',status:'Approved',desc:'Adopts the 2026 SK annual budget.'},
  {id:uid(),no:'SK-2026-007',title:'Barangay Clean-Up and Tree Planting',date:'2026-09-05',status:'Pending',desc:'Authorizes a youth-led clean-up drive.'}],
 kabataan:[
  {id:uid(),name:'Maria Santos',age:19,purok:'Purok 1'},
  {id:uid(),name:'Juan Dela Cruz',age:22,purok:'Purok 3'},
  {id:uid(),name:'Ana Reyes',age:16,purok:'Purok 2'}],
 projects:[
  {id:uid(),title:'Youth Basketball League',cat:'Sports',budget:35000,status:'Ongoing',prog:60},
  {id:uid(),title:'Skills Training Workshop',cat:'Education',budget:20000,status:'Planned',prog:10},
  {id:uid(),title:'Barangay Clean-Up Drive',cat:'Environment',budget:8000,status:'Completed',prog:100}],
 forum:[{id:uid(),title:'What project should we do next?',body:'Share your ideas for the next quarter.',author:'SK Chairperson',date:today(),replies:[]}],
 reports:[],
 chat:[{id:uid(),room:'General',a:'SK Secretary',t:'Welcome to the KK–SK chat!',d:Date.now()}]
});
let DB;
try{DB=JSON.parse(localStorage.getItem('kkdb'))}catch(e){}
DB={assembly:[],resolutions:[],kabataan:[],projects:[],forum:[],reports:[],chat:[],profiles:[],users:[]};
DB.profiles=DB.profiles||[];
let me=null;

const save=()=>{cloud.push()};
const isSK=()=>me&&me.role==='sk';
/* Council-only guard: blocks every add/edit/delete/upload action for non-SK members, even if the buttons were reached some other way. */
const SKFORMS=['f-as','f-re','f-kb','f-pr','f-np','f-ac'],SKSEL='[data-del],[data-appr],[data-rmimg],[data-rmimga],[data-up],[data-upa],#acin,[data-pr],[data-as],[data-asst],[data-rs]';
const deny=e=>{e.preventDefault();e.stopImmediatePropagation();alert('Only the SK council can add or change this.')};
document.addEventListener('submit',e=>{const f=e.target;if((SKFORMS.includes(f.id)||f.dataset.sp||f.dataset.sa)&&!isSK())deny(e)},true);
['click','input','change'].forEach(t=>document.addEventListener(t,e=>{if(!isSK()&&e.target.closest&&e.target.closest(SKSEL))deny(e)},true));
const guestName=()=>me?me.name:'Guest';

const FILE={"home": "home.html", "assembly": "kk-assembly.html", "resolutions": "resolutions.html", "kabataan": "kabataan.html", "projects": "projects.html", "forum": "open-forum.html", "reports": "reports.html", "chat": "chat.html", "profiling": "kk-profiling.html", "settings": "sk-settings.html", "account": "profile.html"};
const pages=[['home','Home'],['assembly','KK Assembly'],['resolutions','Resolutions'],['kabataan','Kabataan'],['projects','Projects'],['forum','Open Forum'],['reports','Reports'],['chat','Chat'],['profiling','KK Profiling'],['settings','SK Settings'],['account','Account']];
const pill=s=>{const c={Done:'ok',Approved:'ok',Completed:'ok',Ongoing:'warn',Pending:'warn',Planned:'warn',Planning:'warn',Open:'warn','In review':'warn',Resolved:'ok'}[s]||'';return `<span class="pill ${c}">${esc(s)}</span>`};
const bar=p=>`<div class="prog" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div>`;
const skOnly=h=>isSK()?h:`<p class="note">Only SK council members can add or edit here. <a href="profile.html">Log in</a></p>`;
const fd=f=>Object.fromEntries(new FormData(f));

const views={
home(){
 const t=(h,n,l)=>`<a class="card tile" href="#${h}"><b>${n}</b>${l}</a>`;
 return `<div class="hero"><h1>Kabataan, SK, one barangay.</h1><p>Follow assemblies, read approved resolutions, see projects, speak up in the open forum, and send reports to your SK council.</p></div>
 <div class="grid">
 ${t('assembly',DB.assembly.length,'KK assemblies')}${t('resolutions',DB.resolutions.filter(r=>r.status==='Approved').length,'approved resolutions')}
 ${t('kabataan',DB.kabataan.length,'registered kabataan')}${t('projects',DB.projects.length,'projects')}
 ${t('forum',DB.forum.length,'forum threads')}${t('reports',DB.reports.length,'reports filed')}</div>
 <h2 style="margin-top:2rem">Next assembly</h2>${(()=>{const a=DB.assembly.find(x=>x.stage!=='Done');return a?`<div class="card"><h3>${esc(a.title)}</h3><p class="muted">${esc(a.date)} · ${pill(a.stage)}</p>${bar(a.prog)}<p>${esc(a.notes)}</p></div>`:'<p class="muted">No upcoming assembly yet.</p>'})()}`},

assembly(){
 return `<h2>KK Assembly progress</h2>`+skOnly(`<form id="f-as" class="card"><h3>Add assembly</h3>
 <label>Title<input name="title" required></label><label>Date<input type="date" name="date" required></label>
 <label>Notes<textarea name="notes" rows="2"></textarea></label><button>Add assembly</button></form>`)+
 `<div class="list">${DB.assembly.map(a=>`<div class="card"><div class="row"><h3 style="margin:0;flex:1">${esc(a.title)}</h3>${pill(a.stage)}</div>
 <p class="muted">${esc(a.date)} · ${a.prog}% complete</p>${bar(a.prog)}<p>${esc(a.notes)}</p>
 ${isSK()?`<div class="row"><label>Progress<input type="range" min="0" max="100" value="${a.prog}" data-as="${a.id}"></label>
 <select data-asst="${a.id}">${['Planning','Notice posted','Ongoing','Done'].map(s=>`<option ${s===a.stage?'selected':''}>${s}</option>`).join('')}</select>
 <button class="alt sm" data-del="assembly:${a.id}">Delete</button></div>`:''}</div>`).join('')}</div>`},

resolutions(){
 return `<h2>Resolutions</h2>`+skOnly(`<form id="f-re" class="card"><h3>Add resolution</h3>
 <label>Resolution no.<input name="no" required placeholder="SK-2026-010"></label><label>Title<input name="title" required></label>
 <label>Summary<textarea name="desc" rows="2"></textarea></label><label>Status<select name="status"><option>Pending</option><option>Approved</option></select></label><button>Save resolution</button></form>`)+
 `<div class="scroll"><table><tr><th>No.</th><th>Title</th><th>Date</th><th>Status</th>${isSK()?'<th></th>':''}</tr>
 ${DB.resolutions.map(r=>`<tr><td>${esc(r.no)}</td><td><b>${esc(r.title)}</b><br><span class="muted">${esc(r.desc)}</span></td><td>${esc(r.date)}</td><td>${pill(r.status)}</td>
 ${isSK()?`<td>${r.status!=='Approved'?`<button class="sm" data-appr="${r.id}">Approve</button> `:''}<button class="alt sm" data-del="resolutions:${r.id}">Delete</button></td>`:''}</tr>`).join('')}</table></div>`},

kabataan(){
 return `<h2>Kabataan list</h2><p class="muted">Youth aged 15 to 30 in the barangay.</p>`+skOnly(`<form id="f-kb" class="card"><h3>Add kabataan</h3>
 <label>Full name<input name="name" required></label><label>Age<input type="number" name="age" min="15" max="30" required></label>
 <label>Purok<input name="purok" required></label><button>Add to list</button></form>`)+
 `<label>Search<input id="q" placeholder="Name or purok"></label><div class="scroll" style="margin-top:.8rem"><table><thead><tr><th>Name</th><th>Age</th><th>Purok</th>${isSK()?'<th></th>':''}</tr></thead><tbody id="kb">${kbRows('')}</tbody></table></div>`},

projects(){
 return `<h2>Projects</h2>`+skOnly(`<form id="f-pr" class="card"><h3>Add project</h3>
 <label>Title<input name="title" required></label><label>Category<input name="cat" required></label>
 <label>Budget (PHP)<input type="number" name="budget" min="0" required></label><button>Add project</button></form>`)+
 `<div class="grid">${DB.projects.map(p=>`<div class="card"><div class="row"><h3 style="margin:0;flex:1">${esc(p.title)}</h3>${pill(p.status)}</div>
 <p class="muted">${esc(p.cat)} · ₱${Number(p.budget).toLocaleString()}</p>${bar(p.prog)}<p class="muted">${p.prog}% done</p>
 ${isSK()?`<input type="range" min="0" max="100" value="${p.prog}" data-pr="${p.id}" aria-label="Progress"><button class="alt sm" data-del="projects:${p.id}">Delete</button>`:''}</div>`).join('')}</div>`},

forum(){
 return `<h2>Open forum</h2><form id="f-fo" class="card"><h3>Start a discussion</h3>
 <label>Topic<input name="title" required></label><label>Your message<textarea name="body" rows="3" required></textarea></label>
 <button>Post as ${esc(guestName())}</button></form>
 <div class="list">${DB.forum.map(t=>`<div class="card"><h3>${esc(t.title)}</h3><p class="muted">${esc(t.author)} · ${esc(t.date)}</p><p>${esc(t.body)}</p>
 ${t.replies.map(r=>`<p style="border-left:3px solid var(--line);padding-left:.7rem;margin:.4rem 0"><b>${esc(r.a)}</b>: ${esc(r.t)}</p>`).join('')}
 <form data-rp="${t.id}" class="row" style="margin:.5rem 0 0"><input name="t" placeholder="Write a reply" required style="flex:1"><button class="sm">Reply</button></form>
 ${isSK()?`<button class="alt sm" data-del="forum:${t.id}" style="margin-top:.5rem">Remove thread</button>`:''}</div>`).join('')}</div>`},

reports(){
 return `<h2>Report system</h2><form id="f-rp" class="card"><h3>File a report</h3>
 <label>Type<select name="type"><option>Concern</option><option>Suggestion</option><option>Complaint</option><option>Emergency</option></select></label>
 <label>Details<textarea name="desc" rows="3" required></textarea></label>
 <label class="row"><input type="checkbox" name="anon" style="width:auto"> Send anonymously</label><button>Submit report</button></form>
 ${isSK()?`<h3>All reports</h3>`:`<p class="muted">Only SK council members can see the full list. You can see reports you filed in this browser.</p>`}
 <div class="list">${DB.reports.filter(r=>isSK()||r.mine).map(r=>`<div class="card"><div class="row"><b style="flex:1">${esc(r.type)}</b>${pill(r.status)}</div>
 <p class="muted">${esc(r.anon?'Anonymous':r.author)} · ${esc(r.date)}</p><p>${esc(r.desc)}</p>
 ${isSK()?`<select data-rs="${r.id}">${['Open','In review','Resolved'].map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join('')}</select>`:''}</div>`).join('')||'<p class="muted">No reports yet.</p>'}</div>`},

chat(){
 const rooms=['General','Kabataan',...(isSK()?['SK Council']:[])];
 window.room=rooms.includes(window.room)?window.room:'General';
 return `<h2>Chat</h2><div class="chat"><div class="list" style="align-content:start">${rooms.map(r=>`<button class="${r===window.room?'':'alt'}" data-room="${r}">${r}</button>`).join('')}
 ${isSK()?'':'<p class="muted">The SK Council room is for council members.</p>'}</div>
 <div><div class="msgs" id="msgs">${msgs()}</div>
 <form id="f-ch" class="row" style="margin:.6rem 0 0"><input name="t" placeholder="Message as ${esc(guestName())}" required style="flex:1"><button>Send</button></form></div></div>
 <p class="note" style="margin-top:1rem">This demo chat is stored in this browser only. Real-time chat between devices needs a server.</p>`},

account(){
 if(me)return `<h2>Account</h2><div class="card"><h3>${esc(me.name)}</h3><p>${me.role==='sk'?'SK council · '+esc(me.pos):'Kabataan member'}</p><button id="out">Log out</button></div>`;
 return `<h2>Account</h2><p class="muted">Logging in is optional for kabataan. Everyone can read and use the forum, reports, and chat as a guest.</p>
 <div class="grid"><form id="f-li" class="card"><h3>Log in</h3><label>Username<input name="u" required autocomplete="username"></label>
 <label>Password<input type="password" name="p" required autocomplete="current-password"></label><button>Log in</button><p class="muted">Demo SK accounts: chair, secretary, treasurer, kagawad1 · password sk123</p><p id="err" class="bad"></p></form>
 <form id="f-su" class="card"><h3>Kabataan sign up (optional)</h3><label>Full name<input name="name" required></label>
 <label>Username<input name="u" required></label><label>Password<input type="password" name="p" required minlength="4" autocomplete="new-password"></label><button>Create account</button></form></div>`}
};
function kbRows(q){q=q.toLowerCase();return DB.kabataan.filter(k=>(k.name+k.purok).toLowerCase().includes(q)).map(k=>`<tr><td>${esc(k.name)}${k.prof?' <span class="pill ok">Profiled</span>':''}</td><td>${k.age}</td><td>${esc(k.purok)}</td>${isSK()?`<td><button class="alt sm" data-del="kabataan:${k.id}">Remove</button></td>`:''}</tr>`).join('')||'<tr><td colspan="4" class="muted">No match.</td></tr>'}
function msgs(){return DB.chat.filter(m=>m.room===window.room).map(m=>`<div class="m ${m.a===guestName()?'me':''}"><small>${esc(m.a)}</small><br>${esc(m.t)}</div>`).join('')||'<p class="muted">No messages yet.</p>'}

function render(){
 const p=document.body.dataset.page||'home';const pg=!me?'gate':(!(me.contact&&me.purok)?'account':(views[p]?p:'home'));
 $('#nav').innerHTML=!me?'':pages.filter(p=>p[0]!=='account'&&(p[0]!=='settings'||isSK())).map(([k,l])=>`<a href="${FILE[k]}" class="${k===pg?'on':''}" data-t="${l}">${IC[k]}<span class="lbl">${l}</span></a>`).join('');$('#sbb').innerHTML=!me?'':`<a href="profile.html" class="${pg==='account'?'on':''}" data-t="Profile">${IC.account}<span class="lbl">Profile</span></a><button class="lo" id="out" data-t="Logout">${IC.out}<span class="lbl">Logout</span></button>`;
 $('#who').innerHTML=me?(me.avatar?`<img class="av" src="${esc(me.avatar)}" alt=""> `:'')+esc(me.name):'';
 $('#app').innerHTML=views[pg]();
 const m=$('#msgs');if(m)m.scrollTop=m.scrollHeight;
 scrollTo(0,0);enhance();
}
window.addEventListener('hashchange',render);

document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,v=fd(f),id=f.id;
 if(id==='f-as')DB.assembly.push({id:uid(),title:v.title,date:v.date,stage:'Planning',prog:0,notes:v.notes});
 else if(id==='f-re')DB.resolutions.push({id:uid(),no:v.no,title:v.title,date:today(),status:v.status,desc:v.desc});
 else if(id==='f-kb')DB.kabataan.push({id:uid(),name:v.name,age:+v.age,purok:v.purok});
 else if(id==='f-pr')DB.projects.push({id:uid(),title:v.title,cat:v.cat,budget:+v.budget,status:'Planned',prog:0});
 else if(id==='f-fo')DB.forum.unshift({id:uid(),title:v.title,body:v.body,author:guestName(),date:today(),replies:[]});
 else if(f.dataset.rp){DB.forum.find(t=>t.id===f.dataset.rp).replies.push({a:guestName(),t:v.t,d:today()})}
 else if(id==='f-rp')DB.reports.unshift({id:uid(),type:v.type,desc:v.desc,anon:!!v.anon,author:guestName(),date:today(),status:'Open',mine:true});
 else if(id==='f-ch'){DB.chat.push({id:uid(),room:window.room,a:guestName(),t:v.t,d:Date.now()});save();$('#msgs').innerHTML=msgs();f.reset();const m=$('#msgs');m.scrollTop=m.scrollHeight;return}
 else if(id==='f-li'){const u=DB.users.find(x=>x.u===v.u&&x.p===v.p);if(!u){$('#err').textContent='Wrong username or password.';return}me=u;persistMe();location.href='home.html';return render()}
 else if(id==='f-su'){if(DB.users.some(x=>x.u===v.u)){alert('That username is taken.');return}
  me={u:v.u,p:v.p,name:v.name,role:'kab'};DB.users.push(me);persistMe();save();location.href='home.html';return render()}
 save();render();
});
function persistMe(){try{localStorage.setItem('kkme',JSON.stringify(me))}catch(e){}}

document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='out'){if(sb)sb.auth.signOut();else try{localStorage.removeItem('kkdemo_me')}catch(x){}cloud.snap={};me=null;try{localStorage.removeItem('kkme')}catch(x){}return render()}
 if(b.dataset.del){const[k,i]=b.dataset.del.split(':');if(confirm('Delete this item?')){DB[k]=DB[k].filter(x=>x.id!==i);save();render()}}
 if(b.dataset.appr){DB.resolutions.find(r=>r.id===b.dataset.appr).status='Approved';save();render()}
 if(b.dataset.room){window.room=b.dataset.room;render()}
});
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.id==='q'){$('#kb').innerHTML=kbRows(t.value)}
 if(t.dataset.as){const a=DB.assembly.find(x=>x.id===t.dataset.as);a.prog=+t.value;if(a.prog===100)a.stage='Done';save()}
 if(t.dataset.pr){const p=DB.projects.find(x=>x.id===t.dataset.pr);p.prog=+t.value;p.status=p.prog>=100?'Completed':p.prog>0?'Ongoing':'Planned';save()}
});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.dataset.asst){DB.assembly.find(x=>x.id===t.dataset.asst).stage=t.value;save();render()}
 if(t.dataset.rs){DB.reports.find(x=>x.id===t.dataset.rs).status=t.value;save();render()}
 if(t.dataset.as||t.dataset.pr)render();
});
/* ---- Projects settings, KK Profiling ---- */
const note=m=>$('#app').insertAdjacentHTML('afterbegin',`<p class="note" role="status">${m}</p>`);
const saveOk=()=>{save();return true};
const gal=p=>(p.imgs||[]).map((s,i)=>`<figure><img src="${esc(s)}" alt="Project picture ${i+1}"><button type="button" class="alt sm" data-rmimg="${p.id}:${i}">Remove</button></figure>`).join('')||'<span class="muted">No pictures yet.</span>';
const opts=(a,v)=>a.map(x=>`<option ${x===v?'selected':''}>${x}</option>`).join('');
const sel=(n,l,a)=>`<label>${l}<select name="${n}" required><option value="">Choose</option>${a.map(x=>`<option>${x}</option>`).join('')}</select></label>`;
function shrink(file,max=900){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.72))};im.src=r.result};r.readAsDataURL(file)})}

const _home=views.home;
views.home=()=>(DB.profiles.some(p=>p.mine)?'':`<div class="card prof"><div><b>Haven’t filled up your KK Profiling yet?</b><br><span class="muted">It takes about 3 minutes and helps the SK plan programs for you.</span></div><a class="btn" href="kk-profiling.html">Fill up now</a></div>`)+_home();

views.projects=()=>`<h2>Projects</h2>${isSK()?'<p><a class="btn" href="sk-settings.html">Edit project info and pictures</a></p>':''}
<div class="grid wide">${DB.projects.map(p=>{const im=p.imgs||[];return `<article class="card">${im.length?`<img class="cover" src="${esc(im[0])}" alt="${esc(p.title)}">`:''}${im.length>1?`<div class="thumbs">${im.map((s,i)=>`<img class="th" src="${esc(s)}" alt="Picture ${i+1} of ${esc(p.title)}">`).join('')}</div>`:''}
<div class="row"><h3 style="margin:.6rem 0 0;flex:1">${esc(p.title)}</h3>${pill(p.status)}</div><p class="muted">${esc(p.cat)} · ₱${Number(p.budget).toLocaleString()}</p>${bar(p.prog)}<p class="muted">${p.prog}% done</p>${p.info?`<p class="info">${esc(p.info)}</p>`:''}
${isSK()?`<input type="range" min="0" max="100" value="${p.prog}" data-pr="${p.id}" aria-label="Progress"> <button class="alt sm" data-del="projects:${p.id}">Delete</button>`:''}</article>`}).join('')}</div>`;

views.settings=()=>{if(!isSK())return `<h2>SK Settings</h2><p class="note">Only SK council members can open settings. <a href="profile.html">Log in</a></p>`;
return `<h2>SK Settings</h2><p class="muted">Edit what the Projects page shows: details and pictures.</p>
<form id="f-np" class="card"><h3>Add a project</h3><label>Title<input name="title" required></label><label>Category<input name="cat" required></label><label>Budget (PHP)<input type="number" name="budget" min="0" required></label><label>About this project<textarea name="info" rows="3"></textarea></label><button>Add project</button></form>
<div class="list">${DB.projects.map(p=>`<form class="card" data-sp="${p.id}"><h3>${esc(p.title)}</h3>
<div class="grid"><label>Title<input name="title" value="${esc(p.title)}" required></label><label>Category<input name="cat" value="${esc(p.cat)}" required></label><label>Budget (PHP)<input type="number" name="budget" min="0" value="${+p.budget}" required></label><label>Status<select name="status">${opts(['Planned','Ongoing','Completed'],p.status)}</select></label></div>
<label>About this project<textarea name="info" rows="4">${esc(p.info||'')}</textarea></label>
<b>Pictures</b><div class="gal" id="g-${p.id}">${gal(p)}</div>
<label class="up">Add pictures<input class="vh" type="file" accept="image/*" multiple data-up="${p.id}"></label>
<button>Save project</button></form>`).join('')}</div>`};

views.profiling=()=>{const done=DB.profiles.some(p=>p.mine);
const form=`<form id="f-pf" class="card"><div class="grid"><label>Full name<input name="name" required autocomplete="name"></label><label>Birthday<input type="date" name="bday" required></label>${sel('sex','Sex',['Female','Male'])}${sel('civil','Civil status',['Single','Married','Live-in','Widowed','Separated'])}<label>Purok / address<input name="purok" required></label><label>Contact number<input name="contact" type="tel" required></label><label>Email (optional)<input name="email" type="email"></label>${sel('educ','Educational attainment',['Elementary level','Elementary graduate','High school level','High school graduate','Senior high school','College level','College graduate','Vocational / TESDA','Post-graduate'])}${sel('cls','Youth classification',['In-school youth','Out-of-school youth','Working youth','Youth with specific needs'])}${sel('work','Work status',['Student','Employed','Self-employed','Unemployed'])}${sel('skv','Registered SK voter?',['Yes','No'])}${sel('att','Attended a KK assembly before?',['Yes','No'])}</div>
<label>Skills and interests<textarea name="skills" rows="3" placeholder="Sports, music, computer, farming, etc."></textarea></label>
<label class="row"><input type="checkbox" name="ok" required style="width:auto"> I agree that the SK may keep this information for youth programs.</label><button>Submit KK Profile</button></form>`;
return `<h2>KK Profiling</h2><p class="muted">For youth aged 15 to 30. Your answers help the SK plan programs.</p>${done?`<p class="note">Thank you! Your KK profile is submitted.</p><details><summary>Submit another profile</summary>${form}</details>`:form}
${isSK()?`<h3 style="margin-top:1.5rem">Submitted profiles (${DB.profiles.length})</h3><div class="scroll"><table><tr><th>Name</th><th>Age</th><th>Purok</th><th>Contact</th><th>Classification</th><th>Date</th><th></th></tr>${DB.profiles.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.age}</td><td>${esc(p.purok)}</td><td>${esc(p.contact)}</td><td>${esc(p.cls)}</td><td>${esc(p.date)}</td><td><button class="alt sm" data-del="profiles:${p.id}">Remove</button></td></tr>`).join('')||'<tr><td colspan="7" class="muted">No profiles yet.</td></tr>'}</table></div>`:''}`};

document.addEventListener('submit',e=>{
 const f=e.target;if(!(f.id==='f-np'||f.id==='f-pf'||f.dataset.sp))return;
 e.preventDefault();e.stopImmediatePropagation();const v=fd(f);
 if(f.id==='f-np'){DB.projects.push({id:uid(),title:v.title,cat:v.cat,budget:+v.budget,status:'Planned',prog:0,info:v.info,imgs:[]});save();render();note('Project added. You can add pictures below.')}
 else if(f.dataset.sp){Object.assign(DB.projects.find(x=>x.id===f.dataset.sp),{title:v.title,cat:v.cat,budget:+v.budget,status:v.status,info:v.info});save();render();note('Project saved.')}
 else{const b=new Date(v.bday),n=new Date();let age=n.getFullYear()-b.getFullYear();if(n<new Date(n.getFullYear(),b.getMonth(),b.getDate()))age--;
  if(!(age>=15&&age<=30)){alert('KK members are 15 to 30 years old. Please check the birthday.');return}
  const {ok,...d}=v;DB.profiles.push({id:uid(),...d,name:v.name.trim(),age,date:today(),mine:true});
  const k=DB.kabataan.find(x=>x.name.toLowerCase()===v.name.trim().toLowerCase());
  if(k){k.prof=true;k.age=age;k.purok=v.purok}else DB.kabataan.push({id:uid(),name:v.name.trim(),age,purok:v.purok,prof:true});
  save();render()}
},true);
document.addEventListener('click',e=>{
 const th=e.target.closest('.th');if(th){th.closest('article').querySelector('.cover').src=th.src;return}
 const rb=e.target.closest('[data-rmimg]');if(rb){const[i,n]=rb.dataset.rmimg.split(':'),p=DB.projects.find(x=>x.id===i);p.imgs.splice(+n,1);save();$('#g-'+i).innerHTML=gal(p)}
});
document.addEventListener('change',async e=>{
 const t=e.target;if(!t.dataset.up)return;const p=DB.projects.find(x=>x.id===t.dataset.up);p.imgs=p.imgs||[];
 for(const f of t.files){try{p.imgs.push(await shrink(f));if(!saveOk()){p.imgs.pop();alert('Browser storage is full. Remove some pictures first.');break}}catch(x){alert('Could not read '+f.name)}}
 t.value='';$('#g-'+p.id).innerHTML=gal(p);
});
/* ---- Open / close tabs ---- */
const banner=()=>DB.profiles.some(p=>p.mine)?'':`<div class="card prof"><div><b>Haven’t filled up your KK Profiling yet?</b><br><span class="muted">It takes about 3 minutes and helps the SK plan programs for you.</span></div><a class="btn" href="kk-profiling.html">Fill up now</a></div>`;
views.home=()=>{
 const t=(h,n,l)=>`<a class="card tile" href="#${h}"><b>${n}</b>${l}</a>`;
 const sec=(title,body,open)=>`<details class="acc"${open?' open':''}><summary>${title}</summary><div class="in">${body}</div></details>`;
 const a=DB.assembly.find(x=>x.stage!=='Done');
 const ong=DB.projects.filter(p=>p.status==='Ongoing');
 return banner()+`<div class="hero"><h1>Kabataan, SK, one barangay.</h1><p>Follow assemblies, read approved resolutions, see projects, speak up in the open forum, and send reports to your SK council.</p></div>`+
 sec('At a glance',`<div class="grid">${t('assembly',DB.assembly.length,'KK assemblies')}${t('resolutions',DB.resolutions.filter(r=>r.status==='Approved').length,'approved resolutions')}${t('kabataan',DB.kabataan.length,'registered kabataan')}${t('projects',DB.projects.length,'projects')}${t('forum',DB.forum.length,'forum threads')}${t('reports',DB.reports.length,'reports filed')}</div>`,1)+
 sec('Next KK assembly',a?`<h3>${esc(a.title)}</h3><p class="muted">${esc(a.date)} · ${pill(a.stage)}</p>${bar(a.prog)}<p>${esc(a.notes)}</p>`:'<p class="muted">No upcoming assembly yet.</p>',1)+
 sec('Ongoing projects',ong.map(p=>`<p><b>${esc(p.title)}</b> <span class="muted">${p.prog}%</span></p>${bar(p.prog)}`).join('')||'<p class="muted">No ongoing projects.</p>')+
 sec('Latest resolutions',DB.resolutions.slice(-3).reverse().map(r=>`<p><b>${esc(r.no)}</b> ${esc(r.title)} ${pill(r.status)}</p>`).join('')||'<p class="muted">None yet.</p>')+
 sec('From the open forum',DB.forum.slice(0,3).map(f=>`<p><b>${esc(f.title)}</b><br><span class="muted">${esc(f.author)} · ${f.replies.length} replies</span></p>`).join('')||'<p class="muted">No threads yet.</p>');
};
function enhance(){
 document.body.classList.toggle('in',!!me);drawPop();
 const app=$('#app');
 [...app.querySelectorAll('form.card')].filter(n=>n.firstElementChild&&n.firstElementChild.tagName==='H3'&&!n.closest('.grid')&&!n.closest('details')).forEach(n=>{
  const h=n.firstElementChild,d=document.createElement('details'),s=document.createElement('summary');
  d.className='acc';s.textContent=h.textContent;h.remove();n.replaceWith(d);d.append(s,n)});
 const ds=app.querySelectorAll('details.acc');
 if(ds.length>1)ds[0].insertAdjacentHTML('beforebegin','<div class="row accbar"><button class="alt sm" data-acc="open">Expand all</button><button class="alt sm" data-acc="close">Collapse all</button></div>');
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-acc]');if(b)document.querySelectorAll('#app details.acc').forEach(d=>d.open=b.dataset.acc==='open')});
const hd=$('header'),mn=$('#mn');
const setMenu=o=>{document.body.classList.toggle('mo',o);hd.classList.toggle('open',o);mn.setAttribute('aria-expanded',o);mn.textContent=o?'✕':'☰'};
mn.addEventListener('click',()=>setMenu(!hd.classList.contains('open')));
$('#nav').addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
addEventListener('hashchange',()=>setMenu(false));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
document.addEventListener('click',e=>{if(!e.target.closest('header,#sb'))setMenu(false)});
/* ---- Supabase ---- */
const SB_URL='PASTE_YOUR_SUPABASE_URL',SB_KEY='PASTE_YOUR_SUPABASE_ANON_KEY';
let sb=null;try{if(!SB_URL.startsWith('PASTE'))sb=supabase.createClient(SB_URL,SB_KEY)}catch(e){}
/* Demo mode: used automatically until Supabase keys are added. Data stays in this browser. */
let DU=[];try{DU=JSON.parse(localStorage.getItem('kkdemo_u'))||[]}catch(e){}
if(!DU.length)DU=[{id:'sk-demo',email:'chair@demo.ph',password:'sk123456',name:'SK Chairperson',role:'sk',pos:'SK Chairperson',contact:'09170000000',purok:'Purok 1'}];
if(!sb){try{const d=JSON.parse(localStorage.getItem('kkdemo'));if(d&&d.assembly)DB=d}catch(e){}if(!DB.assembly.length&&!DB.projects.length){DB=seed();DB.users=[];DB.profiles=[]}}
DB.achievements=DB.achievements||[];
if(!sb){try{if(!DB.achievements.length&&!localStorage.getItem('kkach')){DB.achievements=[
{id:uid(),title:'Best Performing SK Council 2025',cat:'Award',date:'2025-12-10',details:'Recognized by the municipality for completing 95% of the Annual Youth Investment Program on time and within budget.',imgs:[]},
{id:uid(),title:'Youth Leadership Training Certificate',cat:'Certificate',date:'2026-02-18',details:'All SK council members completed the 3-day youth governance and leadership training.',imgs:[]},
{id:uid(),title:'Barangay Clean-Up Drive: 200 volunteers',cat:'Project accomplishment',date:'2026-06-05',details:'Collected over 120 sacks of waste and planted 80 saplings along the barangay road.',imgs:[]}];localStorage.setItem('kkach','1')}}catch(e){}}
const dsave=()=>{try{localStorage.setItem('kkdemo_u',JSON.stringify(DU))}catch(e){}};
const dses=u=>{try{localStorage.setItem('kkdemo_me',u.id)}catch(e){}return{data:{user:{id:u.id,email:u.email,user_metadata:{name:u.name}},session:{}},error:null}};
const AUTH={
 in:v=>sb?sb.auth.signInWithPassword({email:v.email,password:v.password}):Promise.resolve((()=>{const u=DU.find(x=>x.email===v.email.trim().toLowerCase()&&x.password===v.password.trim());return u?dses(u):{data:{},error:{message:'Wrong email or password.'}}})()),
 up:v=>sb?sb.auth.signUp({email:v.email,password:v.password,options:{data:{name:v.name.trim()}}}):Promise.resolve((()=>{const e=v.email.trim().toLowerCase();if(DU.some(x=>x.email===e))return{data:{},error:{message:'That email already has an account.'}};const u={id:uid(),email:e,password:v.password,name:v.name.trim(),role:'kab'};DU.push(u);dsave();return dses(u)})()),
 upd:p=>sb?sb.from('members').update(p).eq('id',me.id):Promise.resolve((()=>{Object.assign(DU.find(x=>x.id===me.id),p);dsave();return{error:null}})())
};
const COLS=['assembly','resolutions','kabataan','projects','forum','reports','chat','profiles','achievements'],OWN=['profiles','reports','kabataan'];
const canon=o=>JSON.stringify(o,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(x=>[x,v[x]])):v);
let MEM=[],busy=false,tick=0,seen=Date.now(),proom='General',pav=null;
const cloud={snap:{},
 async pull(only){
  if(!sb||!me)return false;
  const q=sb.from('items').select('id,coll,data').order('created_at');
  const{data,error}=await(only?q.eq('coll',only):q);
  if(error){console.error(error);return false}
  const cs=only?[only]:COLS,before=canon(cs.map(c=>DB[c]));
  for(const k in this.snap)if(cs.includes(k.split(':')[0]))delete this.snap[k];
  cs.forEach(c=>DB[c]=[]);
  data.forEach(r=>{if(!DB[r.coll])return;const it={...r.data,id:r.id};if(OWN.includes(r.coll))it.mine=it.uid===me.id;DB[r.coll].push(it);this.snap[r.coll+':'+r.id]=canon(r.data)});
  ['forum','reports'].forEach(c=>{if(cs.includes(c))DB[c].reverse()});
  return before!==canon(cs.map(c=>DB[c]));
 },
 async push(){
  if(!sb){if(me)OWN.forEach(c=>DB[c].forEach(it=>{if(!it.uid)it.uid=me.id}));try{localStorage.setItem('kkdemo',JSON.stringify(DB))}catch(e){alert('Browser storage is full. Remove some pictures.')}return}
  if(!me)return;const up=[],cur={};
  for(const c of COLS)for(const it of DB[c]){
   if(OWN.includes(c)&&!it.uid)it.uid=me.id;
   const{mine,id,...d}=it,j=canon(d);cur[c+':'+id]=1;
   if(this.snap[c+':'+id]!==j){up.push({id,coll:c,data:d});this.snap[c+':'+id]=j}}
  const del=Object.keys(this.snap).filter(k=>!cur[k]);
  busy=true;
  try{
   if(up.length){const{error}=await sb.from('items').upsert(up);if(error)throw error}
   for(const k of del){const{error}=await sb.from('items').delete().eq('id',k.split(':')[1]);if(error)throw error;delete this.snap[k]}
  }catch(e){alert('Could not save: '+(e.message||e)+'\nThis may need SK permission. Reloading the latest data.');await this.pull();render()}
  busy=false;
 }};
const av=m=>m.avatar?`<img class="avl" src="${esc(m.avatar)}" alt="">`:`<span class="avl">${esc((m.name||'?')[0])}</span>`;
const msg=t=>{const e=$('#err');if(e)e.textContent=t};
async function loadMem(){if(!sb){MEM=DU;OWN.forEach(c=>DB[c].forEach(it=>it.mine=it.uid===me.id));return}const{data}=await sb.from('members').select('id,name,role,pos,avatar,purok,bio');MEM=data||[]}
async function boot(u){
 let m=sb?(await sb.from('members').select('*').eq('id',u.id).maybeSingle()).data:DU.find(x=>x.id===u.id);
 if(!m&&sb){const r={id:u.id,email:u.email,name:(u.user_metadata&&u.user_metadata.name)||u.email};const x=await sb.from('members').insert(r).select().single();m=x.data||r}
 me={id:u.id,u:u.email,name:m.name,role:m.role||'kab',pos:m.pos,avatar:m.avatar,contact:m.contact,purok:m.purok,bio:m.bio};
 await cloud.pull();await loadMem();seen=Date.now();render();
}
views.gate=()=>false?`<h2>Connect Supabase</h2><p class="note">Open this file in a text editor and paste your Supabase project URL and anon key at the top of the script (SB_URL and SB_KEY). Then run supabase-setup.sql in the Supabase SQL editor.</p>`:
`<div class="hero"><h1>Sign in to the KK–SK Portal</h1><p>Every member uses a real account. There are no anonymous users.</p>${sb?'':'<p class="note">Demo mode: data stays in this browser. Test SK login: chair@demo.ph / sk123456. Add your Supabase keys later to go live.</p><button type="button" id="demo-sk">Log in as demo SK</button>'}</div>
<div class="grid"><form id="f-li2" class="card"><h3>Log in</h3><label>Email<input type="email" name="email" required autocomplete="email"></label><label>Password<input type="password" name="password" required autocomplete="current-password"></label><button>Log in</button></form>
<form id="f-su2" class="card"><h3>Create account</h3><label>Full name<input name="name" required autocomplete="name"></label><label>Email<input type="email" name="email" required></label><label>Password (6+ characters)<input type="password" name="password" minlength="6" required autocomplete="new-password"></label><button>Create account</button></form></div><p id="err" class="bad" role="alert"></p>`;
views.account=()=>`<h2>My profile</h2>${me.contact&&me.purok?'':'<p class="note">Please complete your information to continue. Fields marked * are required.</p>'}
<form id="f-me" class="card"><div class="row"><span id="avp">${av({name:me.name,avatar:pav||me.avatar})}</span><label class="up">${me.avatar||pav?'Change photo':'Add photo'}<input class="vh" type="file" accept="image/*" id="avin"></label></div>
<label>Full name *<input name="name" required value="${esc(me.name)}"></label><label>Purok / address *<input name="purok" required value="${esc(me.purok||'')}"></label><label>Contact number *<input name="contact" type="tel" required value="${esc(me.contact||'')}"></label>
<label>Role<input value="${me.role==='sk'?'SK council':'Kabataan'}" disabled></label>${me.role==='sk'?`<label>Council position<input name="pos" value="${esc(me.pos||'')}" placeholder="e.g. SK Kagawad"></label>`:''}
<label>About me<textarea name="bio" rows="3">${esc(me.bio||'')}</textarea></label><button>Save profile</button><p id="err" class="bad" role="alert"></p></form>
<p class="muted">Signed in as ${esc(me.u)}</p>`;
const _h3=views.home;
views.home=()=>_h3()+`<details class="acc"><summary>SK Council</summary><div class="in"><div class="grid">${MEM.filter(m=>m.role==='sk').map(m=>`<div class="card tile">${av(m)}<b style="font-size:1.1rem">${esc(m.name)}</b>${esc(m.pos||'SK member')}</div>`).join('')||'<p class="muted">No council profiles yet.</p>'}</div></div></details>`;

/* ---- Chat popup ---- */
const rooms=()=>['General','Kabataan',...(isSK()?['SK Council']:[])];
function drawPop(){
 if(!me)return;const open=!$('#cp').hidden;
 if(open){const b=$('#pmsgs'),end=b.scrollTop+b.clientHeight>=b.scrollHeight-30;
  b.innerHTML=DB.chat.filter(m=>m.room===proom).map(m=>`<div class="m ${m.a===me.name?'me':''}"><small>${esc(m.a)}</small><br>${esc(m.t)}</div>`).join('')||'<p class="muted">No messages yet.</p>';
  if(end)b.scrollTop=b.scrollHeight;seen=Date.now()}
 const n=open?0:DB.chat.filter(m=>m.d>seen&&m.a!==me.name&&(m.room!=='SK Council'||isSK())).length;
 $('#cbn').hidden=!n;$('#cbn').textContent=n>9?'9+':n;
}
function togglePop(o){const p=$('#cp');p.hidden=!o;$('#cb').setAttribute('aria-expanded',o);
 if(o){if(!rooms().includes(proom))proom='General';$('#pr').innerHTML=rooms().map(r=>`<option ${r===proom?'selected':''}>${r}</option>`).join('');drawPop();$('#pmsgs').scrollTop=1e9;$('#f-pc input').focus()}else drawPop()}
$('#cb').onclick=()=>togglePop($('#cp').hidden);$('#cx').onclick=()=>togglePop(false);
$('#pr').onchange=e=>{proom=e.target.value;drawPop();$('#pmsgs').scrollTop=1e9};
addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#cp').hidden)togglePop(false)});

/* ---- Handlers ---- */
document.addEventListener('click',async e=>{if(!e.target.closest('#demo-sk'))return;const{data,error}=await AUTH.in({email:'chair@demo.ph',password:'sk123456'});if(error)return msg(error.message);boot(data.user).catch(x=>msg('Login error: '+x.message))});
document.addEventListener('submit',async e=>{
 const f=e.target;if(!['f-li2','f-su2','f-me','f-pc'].includes(f.id))return;
 e.preventDefault();e.stopImmediatePropagation();const v=fd(f);
 if(f.id==='f-pc'){DB.chat.push({id:uid(),room:proom,a:me.name,t:v.t,d:Date.now()});save();f.reset();drawPop();$('#pmsgs').scrollTop=1e9}
 else if(f.id==='f-li2'){const{data,error}=await AUTH.in(v);if(error)return msg(error.message);boot(data.user).catch(x=>msg('Login error: '+x.message))}
 else if(f.id==='f-su2'){const{data,error}=await AUTH.up(v);if(error)return msg(error.message);if(!data.session)return msg('Check your email to confirm your account, then log in.');boot(data.user)}
 else{const p={name:v.name.trim(),purok:v.purok.trim(),contact:v.contact.trim(),bio:v.bio||'',avatar:pav||me.avatar||null};if(me.role==='sk')p.pos=(v.pos||'').trim();
  const{error}=await AUTH.upd(p);if(error)return msg(error.message);
  Object.assign(me,p);pav=null;await loadMem();location.href='home.html';render()}
},true);
document.addEventListener('change',async e=>{if(e.target.id!=='avin'||!e.target.files[0])return;
 try{pav=await shrink(e.target.files[0],256);$('#avp').innerHTML=av({name:me.name,avatar:pav})}catch(x){msg('Could not read that picture.')}});
setInterval(async()=>{
 if(!me||busy||document.hidden)return;tick++;const full=tick%10===0,ch=await cloud.pull(full?undefined:'chat');
 if(!ch)return;const m=$('#msgs');if(m){m.innerHTML=msgs();m.scrollTop=m.scrollHeight}drawPop();
 if(full&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){const y=scrollY;render();scrollTo(0,y)}
},3000);

const ic=d=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const IC={home:ic('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
assembly:ic('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
resolutions:ic('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>'),
kabataan:ic('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'),
projects:ic('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
forum:ic('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
reports:ic('<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>'),
chat:ic('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l2-5.2A8.4 8.4 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>'),
profiling:ic('<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 14l2 2 4-4"/>'),
settings:ic('<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>'),
account:ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
out:ic('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>')};
const sbc=$('#sbc');
const setCl=c=>{document.body.classList.toggle('cl',c);sbc.setAttribute('aria-expanded',!c);sbc.setAttribute('aria-label',c?'Expand menu':'Collapse menu');try{localStorage.setItem('kkcl',c?'1':'')}catch(e){}};
sbc.addEventListener('click',()=>setCl(!document.body.classList.contains('cl')));
try{if(localStorage.getItem('kkcl'))setCl(true)}catch(e){}
/* ---- Home = Achievements ---- */
const dash=()=>{
 const A=DB.achievements,cnt=c=>A.filter(a=>a.cat===c).length,photos=A.reduce((n,a)=>n+(a.imgs||[]).length,0);
 const tiles=[[A.length,'Achievements'],[cnt('Award'),'Awards'],[cnt('Certificate'),'Certificates'],[photos,'Photos and scans'],[DB.projects.filter(p=>p.status==='Completed').length,'Projects completed'],[DB.resolutions.filter(r=>r.status==='Approved').length,'Resolutions approved'],[DB.kabataan.length,'Kabataan registered']];
 const cats=ACAT.map(c=>[c,cnt(c)]).filter(x=>x[1]),max=Math.max(1,...cats.map(x=>x[1]));
 const yrs={};A.forEach(a=>{const y=(a.date||'').slice(0,4)||'Undated';yrs[y]=(yrs[y]||0)+1});const ys=Object.keys(yrs).sort(),ym=Math.max(1,...Object.values(yrs));
 const last=[...A].sort((a,b)=>(b.date||'').localeCompare(a.date||''))[0];
 const row=(l,n,m)=>`<div class="brow"><span>${esc(l)}</span><div class="prog"><i style="width:${n/m*100}%"></i></div><b>${n}</b></div>`;
 return `<section aria-label="Dashboard" style="margin-bottom:1.5rem"><div class="grid dash">${tiles.map(t=>`<div class="card tile"><b>${t[0]}</b>${t[1]}</div>`).join('')}</div>
 <div class="grid wide" style="margin-top:1rem"><div class="card"><h3>Achievements by category</h3>${cats.map(c=>row(c[0],c[1],max)).join('')||'<p class="muted">No data yet.</p>'}</div>
 <div class="card"><h3>Achievements per year</h3>${ys.map(y=>row(y,yrs[y],ym)).join('')||'<p class="muted">No data yet.</p>'}${last?`<p class="muted" style="margin-top:.8rem">Latest: <b>${esc(last.title)}</b> (${esc(last.date||'')})</p>`:''}</div></div></section>`};
const ACAT=['Award','Certificate','Recognition','Project accomplishment','Training','Sports and culture'];
let achCat='All',pendA=[];
const galA=a=>(a.imgs||[]).map((s,i)=>`<figure><img src="${esc(s)}" alt="Picture ${i+1}"><button type="button" class="alt sm" data-rmimga="${a.id}:${i}">Remove</button></figure>`).join('')||'<span class="muted">No pictures yet.</span>';
const achCard=a=>{const im=a.imgs||[];return `<article class="card"><button class="achimg" data-open="${a.id}" aria-label="View ${esc(a.title)}">${im.length?`<img class="cover" src="${esc(im[0])}" alt="">`:'<span class="cover ph">🏆</span>'}${im.length>1?`<span class="cnt">${im.length} photos</span>`:''}</button>
<h3 style="margin:.6rem 0 0">${esc(a.title)}</h3><p class="muted">${esc(a.cat)} · ${esc(a.date||'')}</p><p class="info clamp">${esc(a.details||'')}</p><button class="alt sm" data-open="${a.id}">View details</button>
${isSK()?`<details class="ed"><summary>Edit</summary><form data-sa="${a.id}"><label>Title<input name="title" value="${esc(a.title)}" required></label><label>Date<input type="date" name="date" value="${esc(a.date||'')}"></label><label>Category<select name="cat">${opts(ACAT,a.cat)}</select></label><label>Details<textarea name="details" rows="4">${esc(a.details||'')}</textarea></label><b>Pictures</b><div class="gal" id="ga-${a.id}">${galA(a)}</div><label class="up">Add pictures<input class="vh" type="file" accept="image/*" multiple data-upa="${a.id}"></label><div class="row"><button>Save</button><button type="button" class="alt" data-del="achievements:${a.id}">Delete</button></div></form></details>`:''}</article>`};
views.home=()=>{
 const cats=['All',...new Set(DB.achievements.map(a=>a.cat))],list=DB.achievements.filter(a=>achCat==='All'||a.cat===achCat).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 return banner()+`<div class="hero"><h1>Our achievements</h1><p>Awards, certificates and milestones of the KK and SK council, with the story behind each one.</p></div>${dash()}`+
 (isSK()?`<details class="acc"><summary>Add an achievement</summary><form id="f-ac" class="card"><label>Title<input name="title" required></label><label>Date<input type="date" name="date" value="${today()}" required></label><label>Category<select name="cat">${opts(ACAT)}</select></label><label>Details<textarea name="details" rows="4" placeholder="What was achieved, who was involved, and why it matters"></textarea></label><label class="up">Add pictures or certificates<input class="vh" type="file" accept="image/*" multiple id="acin"></label><span id="acn" class="muted" role="status"></span><button>Save achievement</button></form></details>`:'')+
 `<div class="row" role="group" aria-label="Filter by category">${cats.map(c=>`<button class="sm ${c===achCat?'':'alt'}" data-ac="${esc(c)}">${esc(c)}</button>`).join('')}</div>
 <div class="grid wide" style="margin:1rem 0 1.5rem">${list.map(achCard).join('')||'<p class="muted">No achievements yet.</p>'}</div>`+
 `<details class="acc"><summary>SK Council</summary><div class="in"><div class="grid">${MEM.filter(m=>m.role==='sk').map(m=>`<div class="card tile">${av(m)}<b style="font-size:1.1rem">${esc(m.name)}</b>${esc(m.pos||'SK member')}</div>`).join('')||'<p class="muted">No council profiles yet.</p>'}</div></div></details>`};
function showAch(id){const a=DB.achievements.find(x=>x.id===id);if(!a)return;const im=a.imgs||[];
 $('#adc').innerHTML=`<article>${im.length?`<img class="cover" src="${esc(im[0])}" alt="${esc(a.title)}">`:''}${im.length>1?`<div class="thumbs">${im.map((s,i)=>`<img class="th" src="${esc(s)}" alt="Photo ${i+1}">`).join('')}</div>`:''}<h2 style="margin-top:.8rem">${esc(a.title)}</h2><p class="muted">${esc(a.cat)} · ${esc(a.date||'')}</p><p class="info">${esc(a.details||'')}</p></article>`;
 try{$('#ad').showModal()}catch(e){$('#ad').setAttribute('open','')}}
$('#adx').onclick=()=>$('#ad').close();
$('#ad').addEventListener('click',e=>{if(e.target===$('#ad'))$('#ad').close()});
document.addEventListener('submit',e=>{const f=e.target;if(f.id!=='f-ac'&&!f.dataset.sa)return;e.preventDefault();e.stopImmediatePropagation();const v=fd(f);
 if(f.id==='f-ac'){DB.achievements.push({id:uid(),title:v.title.trim(),date:v.date,cat:v.cat,details:v.details,imgs:pendA});pendA=[];save();render();note('Achievement added.')}
 else{Object.assign(DB.achievements.find(x=>x.id===f.dataset.sa),{title:v.title.trim(),date:v.date,cat:v.cat,details:v.details});save();render();note('Achievement saved.')}
},true);
document.addEventListener('click',e=>{
 const o=e.target.closest('[data-open]');if(o)return showAch(o.dataset.open);
 const c=e.target.closest('[data-ac]');if(c){achCat=c.dataset.ac;return render()}
 const r=e.target.closest('[data-rmimga]');if(r){const[i,n]=r.dataset.rmimga.split(':'),a=DB.achievements.find(x=>x.id===i);a.imgs.splice(+n,1);save();$('#ga-'+i).innerHTML=galA(a)}
});
document.addEventListener('change',async e=>{const t=e.target;
 if(t.id==='acin'){for(const f of t.files)try{pendA.push(await shrink(f))}catch(x){}t.value='';$('#acn').textContent=pendA.length+' picture(s) ready';return}
 if(!t.dataset.upa)return;const a=DB.achievements.find(x=>x.id===t.dataset.upa);a.imgs=a.imgs||[];
 for(const f of t.files)try{a.imgs.push(await shrink(f))}catch(x){alert('Could not read '+f.name)}
 t.value='';save();$('#ga-'+a.id).innerHTML=galA(a)});
/* Start: restore the session first so the login screen never flashes between pages */
(async()=>{try{if(sb){const{data}=await sb.auth.getSession();if(data.session)return await boot(data.session.user)}else{const u=DU.find(x=>x.id===localStorage.getItem('kkdemo_me'));if(u)return await boot({id:u.id,email:u.email})}}catch(e){console.error(e)}render()})();

