(function(){
'use strict';

/* ---------- Données de référence ---------- */
var MUSCLES=[['pec','Pectoraux'],['dos','Grand dorsal'],['mdos','Milieu du dos'],['trap','Trapèzes'],['eav','Épaules (avant)'],['elat','Épaules (côté)'],['earr','Épaules (arrière)'],['bi','Biceps'],['tri','Triceps'],['avb','Avant-bras'],['quad','Quadriceps'],['isch','Ischio-jambiers'],['fess','Fessiers'],['add','Adducteurs'],['moll','Mollets'],['abdo','Abdominaux'],['lomb','Lombaires']];
var ORDER=MUSCLES.map(function(m){return m[0]});
var MN={};MUSCLES.forEach(function(m){MN[m[0]]=m[1]});

var BASE=[
'chestpress|Développé couché (machine)|pec|tri eav|m|1',
'chestincl|Développé incliné (machine)|pec|eav tri|m',
'pecdeck|Pec deck (papillon)|pec|eav|m',
'smithbench|Développé couché (Smith machine)|pec|tri eav|m',
'dipsass|Dips assistés (machine)|pec tri|eav|m',
'poulievis|Vis-à-vis (poulies)|pec|eav|p',
'bench|Développé couché (barre)|pec|tri eav',
'benchdb|Développé couché (haltères)|pec|tri eav',
'incl|Développé incliné (barre)|pec|eav tri',
'incldb|Développé incliné (haltères)|pec|eav tri',
'decl|Développé décliné|pec|tri',
'ecart|Écartés (haltères)|pec|eav',
'pompes|Pompes|pec|tri eav abdo',
'dipspec|Dips (pectoraux)|pec tri|eav',
'tirvert|Tirage vertical (machine)|dos|bi mdos|m|1',
'tirvertneutre|Tirage vertical prise neutre (machine)|dos|bi mdos|m',
'tractass|Tractions assistées (machine)|dos|bi mdos avb|m',
'pullover|Pull-over (poulie)|dos|tri|p',
'traction|Tractions|dos|bi mdos avb',
'tractionsup|Tractions supination|dos bi|mdos avb',
'rowmach|Tirage horizontal assis (machine)|mdos dos|bi earr|m|1',
'rowwide|Tirage horizontal prise large (machine)|mdos earr|dos bi|m',
'tirhoriz|Tirage horizontal (poulie basse)|mdos dos|bi earr|p',
'rowbar|Rowing barre|mdos dos|bi earr lomb',
'rowdb|Rowing haltère (unilatéral)|dos mdos|bi earr',
'tbar|Rowing T-bar|mdos dos|bi earr lomb',
'sdt|Soulevé de terre|fess isch lomb|quad trap dos avb',
'shrug|Shrugs (haltères)|trap|avb',
'devmach|Développé épaules (machine)|eav elat|tri|m',
'elatmach|Élévations latérales (machine)|elat|trap|m',
'oisemach|Oiseau (machine, pec deck inversé)|earr|mdos trap|m',
'elatpou|Élévations latérales (poulie)|elat|trap|p',
'facepull|Face pull|earr|mdos trap elat|p',
'mili|Développé militaire (barre)|eav elat|tri trap',
'devdb|Développé épaules (haltères)|eav elat|tri',
'arnold|Développé Arnold|eav elat|tri',
'elatdb|Élévations latérales|elat|trap',
'elfront|Élévations frontales|eav|elat',
'oiseau|Oiseau (haltères)|earr|mdos trap',
'curlmach|Curl biceps (machine)|bi|avb|m|1',
'curlpou|Curl poulie|bi|avb|p',
'curlbar|Curl barre|bi|avb eav',
'curldb|Curl haltères|bi|avb',
'curlmart|Curl marteau|bi avb|',
'curlpup|Curl pupitre|bi|avb',
'tricepsmach|Extension triceps (machine)|tri||m',
'pushdown|Extension triceps (poulie haute)|tri||p',
'barrefront|Barre au front|tri|',
'extnuque|Extension nuque (haltère)|tri|',
'dipsbanc|Dips banc (triceps)|tri|pec eav',
'closegrip|Développé couché prise serrée|tri|pec eav',
'kickback|Kickback triceps|tri|',
'curlpoign|Curl poignets|avb|',
'presse|Presse à cuisses (machine)|quad fess|isch|m|1',
'legext|Leg extension (machine)|quad||m',
'hack|Hack squat (machine)|quad|fess|m',
'smithsquat|Squat (Smith machine)|quad fess|isch lomb abdo|m',
'squat|Squat (barre)|quad fess|isch lomb abdo',
'squatav|Squat avant|quad|fess abdo lomb',
'fentes|Fentes|quad fess|isch',
'bulgare|Fentes bulgares|quad fess|isch',
'legcurl|Leg curl allongé (machine)|isch|moll|m|1',
'legcurlass|Leg curl assis (machine)|isch|moll|m',
'abduct|Abducteurs (machine)|fess|isch|m',
'adduct|Adducteurs (machine)|add||m',
'sdtrou|Soulevé de terre roumain|isch fess|lomb dos avb',
'hipthrust|Hip thrust|fess|isch',
'goodmorn|Good morning|isch lomb|fess',
'mollass|Mollets assis (machine)|moll||m',
'molldeb|Mollets debout|moll|',
'crunchmach|Crunch abdominal (machine)|abdo||m|1',
'crunchpou|Crunch à la poulie|abdo||p',
'crunch|Crunch|abdo|',
'relevejambes|Relevé de jambes (suspendu)|abdo|avb',
'planche|Planche (gainage)|abdo|lomb eav',
'roue|Roue abdominale|abdo|lomb eav',
'extlombmach|Extension lombaire (machine)|lomb|fess isch|m',
'extlomb|Extension lombaire (banc)|lomb|fess isch'
].map(function(l){
  var a=l.split('|');
  return {id:a[0],n:a[1],p:a[2].split(' ').filter(Boolean),s:(a[3]||'').split(' ').filter(Boolean),eq:a[4]||'l',bf:a[5]==='1',custom:false};
});

/* ---------- État ---------- */
var LS='carnet-muscu-v1';
var S={sessions:{},imgs:{},custom:[],libUpdated:0,prefs:{metric:'sets',currentId:null}};
var UI={tab:'session',sub:'ex',libEx:null,q:'',ef:'',sheet:null,lb:null,imgTarget:null,showImport:false,msg:'',bm:null};

function lsLoad(){
  try{
    var raw=localStorage.getItem(LS); if(!raw) return;
    var d=JSON.parse(raw);
    (d.sessions||[]).forEach(function(s){var c=normSession(s); if(c) S.sessions[c.id]=c});
    S.custom=Array.isArray(d.custom)?d.custom:[];
    S.libUpdated=d.libUpdated||0;
    if(d.prefs) Object.keys(d.prefs).forEach(function(k){S.prefs[k]=d.prefs[k]});
  }catch(e){}
}
var lsWarned=false;
function lsSave(){
  try{
    localStorage.setItem(LS,JSON.stringify({v:1,sessions:Object.keys(S.sessions).map(function(k){return S.sessions[k]}),custom:S.custom,libUpdated:S.libUpdated,prefs:S.prefs}));
  }catch(e){
    if(!lsWarned){lsWarned=true;flash('Impossible d’enregistrer : l’espace de l’appareil est plein. Exporte tes données dans Exercices › Sauvegarde.')}
  }
}

/* ---------- Utilitaires ---------- */
function $(s,el){return (el||document).querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function uid(){return Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-5)}
function fmt(n,d){
  if(n==null||isNaN(n)) return '–';
  var f=Math.pow(10,d==null?1:d);
  return (Math.round(n*f)/f).toLocaleString('fr-FR',{maximumFractionDigits:d==null?1:d});
}
function fmtIn(n){return n==null?'':String(n).replace('.',',')}
function pad(n){return String(n).padStart(2,'0')}
function todayStr(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function parseD(s){var a=String(s).split('-').map(Number);return new Date(a[0],a[1]-1,a[2])}
function fmtDate(s,o){try{return parseD(s).toLocaleDateString('fr-FR',o)}catch(e){return s}}
function norm(s){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()}
function names(ids){return ids.map(function(m){return MN[m]||m})}
function e1(w,r){return w>0&&r>0?w*(1+r/30):0}
function isBefore(a,b){return a.date<b.date||(a.date===b.date&&a.started<b.started)}

function normSession(x){
  if(!x||typeof x!=='object'||!x.id||!Array.isArray(x.ex)) return null;
  return {
    id:String(x.id),date:/^\d{4}-\d{2}-\d{2}$/.test(x.date)?x.date:todayStr(),
    started:+x.started||Date.now(),updated:+x.updated||0,name:String(x.name||''),done:!!x.done,finished:+x.finished||0,
    ex:x.ex.map(function(e){
      return {k:String(e.k||uid()),id:String(e.id||''),n:String(e.n||'Exercice'),
        p:Array.isArray(e.p)?e.p.slice():[],s:Array.isArray(e.s)?e.s.slice():[],note:String(e.note||''),
        sets:(Array.isArray(e.sets)?e.sets:[]).map(function(t){return {w:t.w==null?null:+t.w,r:t.r==null?null:+t.r,ok:!!t.ok}})};
    })
  };
}
function allEx(){
  return BASE.concat(S.custom.map(function(c){return {id:c.id,n:c.n,p:c.p||[],s:c.s||[],eq:'',bf:false,custom:true}}));
}
var BACK=['dos','mdos','trap','lomb'];
function eqRank(x){return x.eq==='m'?0:x.eq==='p'?1:2}
function eqLabel(x){return x.eq==='m'?'Machine':x.eq==='p'?'Poulie':x.eq==='l'?'Poids libres':''}
function eqOk(x,f){return !f||(f==='m'&&x.eq==='m')||(f==='bf'&&x.bf)}
function efChips(cur,act){
  return [['','Tout'],['m','Machines'],['bf','Basic-Fit']].map(function(c){
    return '<button class="chip" data-act="'+act+'" data-e="'+c[0]+'" aria-pressed="'+(cur===c[0])+'">'+c[1]+'</button>';
  }).join('');
}
function efNote(cur){
  if(cur==='bf') return '<p class="note-t">Machines citées dans les guides officiels de Basic-Fit : tirage vertical, développé couché, tirage horizontal, presse, leg curl allongé, curl biceps et crunch abdominal.</p>';
  if(cur==='m') return '<p class="note-t">Modèles de machines courants (Matrix, Technogym). Ce qu’il y a vraiment dépend de ta salle.</p>';
  return '';
}
function sessionsSorted(){
  return Object.keys(S.sessions).map(function(k){return S.sessions[k]}).sort(function(a,b){
    return a.date<b.date?1:a.date>b.date?-1:b.started-a.started;
  });
}
function curSession(){var id=S.prefs.currentId;return id&&S.sessions[id]||null}
function sessLabel(s){return s.name||('Séance du '+fmtDate(s.date,{day:'numeric',month:'long'}))}

/* ---------- Calculs ---------- */
function sessionTotals(s){
  var sets=0,vol=0,reps=0,exN=0;
  s.ex.forEach(function(e){
    var c=0;
    e.sets.forEach(function(t){if(t.ok){sets++;c++;vol+=(t.w||0)*(t.r||0);reps+=t.r||0}});
    if(c) exN++;
  });
  return {sets:sets,vol:vol,reps:reps,exN:exN,total:s.ex.length};
}
function setScore(t,metric){
  if(!t.ok) return 0;
  if(metric==='sets') return 1;
  if(metric==='reps') return t.r||0;
  return (t.w||0)*(t.r||0);
}
/* Un muscle principal compte 1 par série, un muscle secondaire compte 0,5. */
function muscleStats(s,metric){
  var out={};
  s.ex.forEach(function(e){
    var v=0; e.sets.forEach(function(t){v+=setScore(t,metric)});
    if(!v) return;
    e.p.forEach(function(m){var o=out[m]||(out[m]={p:0,s:0});o.p+=v});
    e.s.forEach(function(m){if(e.p.indexOf(m)>=0) return; var o=out[m]||(out[m]={p:0,s:0});o.s+=v*0.5});
  });
  return out;
}
function prevFor(s,exId){
  var arr=sessionsSorted();
  for(var i=0;i<arr.length;i++){
    var o=arr[i]; if(o.id===s.id||!isBefore(o,s)) continue;
    for(var j=0;j<o.ex.length;j++){
      var e=o.ex[j];
      if(e.id===exId&&e.sets.some(function(t){return t.ok})) return {s:o,e:e};
    }
  }
  return null;
}
function best1(sets){var b=0;sets.forEach(function(t){if(t.ok) b=Math.max(b,e1(t.w,t.r))});return b}
function priorBest(s,exId){
  var b=0;
  Object.keys(S.sessions).forEach(function(k){
    var o=S.sessions[k]; if(o.id===s.id||!isBefore(o,s)) return;
    o.ex.forEach(function(e){if(e.id===exId) b=Math.max(b,best1(e.sets))});
  });
  return b;
}
function isRecord(s,e){var p=priorBest(s,e.id);return p>0&&best1(e.sets)>p+1e-9}
function placeholderFor(e,i,prevSets){
  var p=prevSets[i]; if(p) return {w:p.w,r:p.r};
  for(var j=i-1;j>=0;j--){var x=e.sets[j]; if(x.w!=null||x.r!=null) return {w:x.w,r:x.r}}
  if(prevSets.length){var l=prevSets[prevSets.length-1]; return {w:l.w,r:l.r}}
  return {w:null,r:null};
}
function fmtSets(sets){
  var a=sets.slice(0,6).map(function(t){return t.w>0?fmt(t.w,2)+'×'+(t.r||0):(t.r||0)+' reps'});
  return a.join(' · ')+(sets.length>6?' …':'');
}

/* ---------- Enregistrement sur l'appareil ----------
   Séances et exercices perso : localStorage (petit, synchrone).
   Photos : IndexedDB (plus d'espace), avec repli sur localStorage si elle est indisponible. */
var IMG_LS='carnet-muscu-img-v1', MAX_IMG=4, imgSeq=0;
var Photos=(function(){
  var db=null;
  function valid(m){return m&&m.id&&m.ex&&typeof m.data==='string'&&m.data.indexOf('data:image/')===0}
  function add(m){if(valid(m)) S.imgs[m.id]={id:String(m.id),ex:String(m.ex),data:m.data,updated:+m.updated||0}}
  function legacy(){
    try{var d=JSON.parse(localStorage.getItem(IMG_LS)||'{}');return Object.keys(d).map(function(k){return d[k]}).filter(valid)}catch(e){return []}
  }
  function lsDump(){try{localStorage.setItem(IMG_LS,JSON.stringify(S.imgs))}catch(e){flash('Espace plein : la photo n’a pas pu être gardée.')}}
  function open(cb){
    if(!window.indexedDB){cb(false);return}
    var done=false, fin=function(ok){if(!done){done=true;cb(ok)}};
    try{
      var r=indexedDB.open('carnet-muscu',1);
      r.onupgradeneeded=function(){r.result.createObjectStore('imgs',{keyPath:'id'})};
      r.onsuccess=function(){db=r.result;db.onversionchange=function(){db.close();db=null};fin(true)};
      r.onerror=r.onblocked=function(){fin(false)};
      setTimeout(function(){fin(false)},4000);
    }catch(e){fin(false)}
  }
  function put(m){
    if(!m) return;
    if(!db){lsDump();return}
    try{
      var tx=db.transaction('imgs','readwrite'); tx.objectStore('imgs').put(m);
      tx.onabort=function(){flash('Espace plein : la photo n’a pas pu être gardée.')};
    }catch(e){lsDump()}
  }
  function del(id){
    if(!db){lsDump();return}
    try{db.transaction('imgs','readwrite').objectStore('imgs').delete(id)}catch(e){}
  }
  function load(cb){
    open(function(ok){
      if(!ok){legacy().forEach(add);cb();return}
      var rq;
      try{rq=db.transaction('imgs','readonly').objectStore('imgs').getAll()}catch(e){db=null;legacy().forEach(add);cb();return}
      rq.onerror=function(){cb()};
      rq.onsuccess=function(){
        (rq.result||[]).forEach(add);
        var old=legacy().filter(function(m){return !S.imgs[m.id]});
        if(old.length){
          /* migration des anciennes photos de localStorage vers IndexedDB */
          old.forEach(add);
          try{
            var tx=db.transaction('imgs','readwrite'), st=tx.objectStore('imgs');
            old.forEach(function(m){st.put(S.imgs[m.id])});
            tx.oncomplete=function(){try{localStorage.removeItem(IMG_LS)}catch(e){}};
          }catch(e){}
        }else if(localStorage.getItem(IMG_LS)){try{localStorage.removeItem(IMG_LS)}catch(e){}}
        cb();
      };
    });
  }
  return {load:load,put:put,del:del,add:add,valid:valid};
})();
function saveSession(){lsSave()}
function saveLib(){S.libUpdated=Date.now();lsSave()}
function saveImg(id){Photos.put(S.imgs[id])}
function deleteImg(id){delete S.imgs[id];Photos.del(id)}
function touch(s){s.updated=Date.now();lsSave()}

/* ---------- Installation ---------- */
var deferredInstall=null;
function isStandalone(){return !!(navigator.standalone||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches))}
function isIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredInstall=e;if(UI.tab==='session') safeRender()});
window.addEventListener('appinstalled',function(){deferredInstall=null;if(UI.tab==='session') safeRender()});
function installCard(){
  if(isStandalone()||S.prefs.hideInstall) return '';
  var ios=isIOS();
  if(!ios&&!deferredInstall) return '';
  return '<div class="card note-card"><b>Installer l’appli</b>'+
    (ios?'<p class="note-t">Touche <b>Partager</b> (le carré avec une flèche), puis <b>Sur l’écran d’accueil</b>. Installe-la avant de t’en servir : les données du navigateur et celles de l’appli installée sont séparées.</p>'
        :'<p class="note-t">Ajoute l’appli à ton écran d’accueil pour l’ouvrir en plein écran, même sans internet.</p><button class="btn" data-act="install">Installer</button>')+
    '<button class="btn ghost sm" data-act="hideinstall">Masquer</button></div>';
}
function backupDue(){
  var ids=Object.keys(S.sessions); if(ids.length<3) return false;
  var ref=S.prefs.lastBackup;
  if(!ref){ref=Infinity;ids.forEach(function(k){ref=Math.min(ref,S.sessions[k].started||Date.now())})}
  return Date.now()-ref>21*864e5;
}
function backupCard(){
  if(!backupDue()) return '';
  var last=S.prefs.lastBackup, d=last?Math.floor((Date.now()-last)/864e5):0;
  return '<div class="card note-card"><b>Pense à sauvegarder</b><p class="note-t">'+
    (last?'Dernière sauvegarde il y a '+d+' jours.':'Tu n’as encore jamais exporté tes données.')+
    ' Un fichier suffit pour tout retrouver si tu changes de téléphone.</p><button class="btn" data-act="exportfile">Exporter mes données</button></div>';
}

var pending=false;
function safeRender(){
  var a=document.activeElement;
  if(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA')&&$('#app').contains(a)){pending=true;return}
  render();
}
document.addEventListener('focusout',function(){
  if(!pending) return;
  setTimeout(function(){
    var a=document.activeElement;
    if(!(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'))){pending=false;render()}
  },60);
});

/* ---------- Vues ---------- */
var ICON_CHECK='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
var ICON_X='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
var ICON_CAM='<svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/></svg>';

function render(){
  var html;
  if(UI.tab==='session') html=curSession()?sessionHTML(curSession()):startHTML();
  else if(UI.tab==='history') html=historyHTML();
  else html=UI.libEx?exDetailHTML(UI.libEx):libHTML();
  $('#app').innerHTML=html;
  var td=$('#topdate'); if(td) td.textContent=fmtDate(todayStr(),{weekday:'short',day:'numeric',month:'short'}).replace(/\./g,'');
  document.querySelectorAll('nav.tabs button').forEach(function(b){
    b.setAttribute('aria-current',b.dataset.t===UI.tab?'page':'false');
  });
}

function startHTML(){
  var all=sessionsSorted();
  var open=all.filter(function(s){return !s.done})[0];
  var last=all.filter(function(s){return s.ex.length})[0];
  var quick=['Pectoraux / Triceps','Dos / Biceps','Jambes','Épaules / Bras','Push','Pull','Legs','Full body'];
  var h='<h2 class="hero">Quelle séance <em>aujourd’hui</em> ?</h2>'+installCard()+backupCard();
  if(open){
    var t=sessionTotals(open);
    h+='<button class="resume" data-act="open" data-id="'+open.id+'" aria-label="Reprendre la séance '+esc(sessLabel(open))+'"><span><span class="rl">En cours</span><b>'+esc(sessLabel(open))+'</b><small>'+t.sets+' série'+(t.sets>1?'s':'')+' validée'+(t.sets>1?'s':'')+'</small></span><span class="go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>';
  }
  h+='<div class="card"><label class="lbl" for="new-name">Nom de la séance (facultatif)</label>'+
    '<input id="new-name" class="txt" maxlength="60" autocomplete="off" placeholder="Ex. Pectoraux / Triceps">'+
    '<div class="chips">'+quick.map(function(n){return '<button class="chip" data-act="pickname" data-n="'+esc(n)+'">'+esc(n)+'</button>'}).join('')+'</div>'+
    '<button class="btn" data-act="start">Démarrer la séance</button>'+
    (last?'<button class="btn ghost" data-act="startcopy" data-id="'+last.id+'">Repartir de « '+esc(sessLabel(last))+' »</button>':'')+
    '</div>';
  return h;
}

function tilesHTML(t){
  return '<div class="tile"><div class="v">'+t.exN+'<small>/'+t.total+'</small></div><div class="l">Exercices faits</div></div>'+
    '<div class="tile"><div class="v">'+t.sets+'</div><div class="l">Séries validées</div></div>'+
    '<div class="tile"><div class="v">'+fmt(t.vol,0)+'<small>kg</small></div><div class="l">Volume soulevé</div></div>';
}

function sessionHTML(s){
  var t=sessionTotals(s);
  return '<section>'+
    '<div class="s-top"><button class="backc" data-act="close" aria-label="Retour aux séances"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><span class="badge '+(s.done?'done':'live')+'">'+(s.done?'Terminée':'En cours')+'</span></div>'+
    '<label class="sr" for="s-name">Nom de la séance</label>'+
    '<input id="s-name" class="title-in" data-f="sname" maxlength="60" autocomplete="off" placeholder="Nom de la séance" value="'+esc(s.name)+'">'+
    '<label class="sr" for="s-date">Date de la séance</label>'+
    '<input id="s-date" type="date" class="date-in" data-f="sdate" value="'+esc(s.date)+'">'+
    '<div class="tiles" id="tiles">'+tilesHTML(t)+'</div>'+
    '<div class="seg" role="group" aria-label="Affichage de la séance">'+
      '<button data-act="sub" data-v="ex" aria-pressed="'+(UI.sub==='ex')+'">Exercices</button>'+
      '<button data-act="sub" data-v="mus" aria-pressed="'+(UI.sub==='mus')+'">Muscles</button>'+
    '</div>'+
    '<div class="sub">'+(UI.sub==='ex'?exercisesHTML(s):recapHTML(s)+actionsHTML(s,false))+'</div>'+
  '</section>';
}

function exercisesHTML(s){
  var h=s.ex.length?s.ex.map(function(e){return cardHTML(s,e)}).join(''):
    '<p class="empty">Aucun exercice pour l’instant. Ajoute le premier pour noter tes séries.</p>';
  return h+actionsHTML(s,true);
}
function actionsHTML(s,withAdd){
  var h='<div class="stack">';
  if(withAdd) h+='<button class="btn'+(s.ex.length?' ghost':'')+'" data-act="addex">+ Ajouter un exercice</button>';
  if(s.done) h+='<button class="btn" data-act="newsess">Nouvelle séance</button><button class="btn ghost" data-act="reopen">Reprendre cette séance</button>';
  else if(s.ex.length) h+='<button class="btn good" data-act="finish">Terminer la séance</button>';
  return h+'<button class="btn ghost danger" data-act="delsess">Supprimer la séance</button></div>';
}

function muscTags(e){
  var sec=e.s.filter(function(m){return e.p.indexOf(m)<0});
  return esc(names(e.p).join(' · '))+(sec.length?' <span>+ '+esc(names(sec).join(', '))+'</span>':'');
}

function cardHTML(s,e){
  var prev=prevFor(s,e.id);
  var prevSets=prev?prev.e.sets.filter(function(t){return t.ok}):[];
  return '<article class="ex" data-k="'+e.k+'">'+
    '<header class="ex-h"><div class="ex-l">'+thumbHTML(e.id,e.n)+'<div><span class="pr"'+(isRecord(s,e)?'':' hidden')+'>Record</span><h3>'+esc(e.n)+'</h3><p class="mtags">'+muscTags(e)+'</p></div></div>'+
    '<div class="ex-r"><button class="icon sm" data-act="addimg" data-ex="'+esc(e.id)+'" aria-label="Ajouter une photo à '+esc(e.n)+'">'+ICON_CAM+'</button></div></header>'+
    '<p class="last">'+(prev?'Dernière fois ('+esc(fmtDate(prev.s.date,{day:'numeric',month:'short'}))+') : <span class="mono">'+esc(fmtSets(prevSets))+'</span>':'Première fois sur cet exercice')+'</p>'+
    '<div class="sets-h" aria-hidden="true"><span>Série</span><span>kg</span><span>Reps</span><span></span><span></span></div>'+
    e.sets.map(function(t,i){return setHTML(e,t,i,prevSets)}).join('')+
    '<label class="sr" for="n-'+e.k+'">Note pour '+esc(e.n)+'</label>'+
    '<input id="n-'+e.k+'" class="note-in" data-f="note" maxlength="140" autocomplete="off" placeholder="Note (réglage, ressenti…)" value="'+esc(e.note)+'">'+
    '<div class="ex-f"><button class="btn ghost sm" data-act="addset">+ Série</button><button class="link danger" data-act="rmex">Retirer l’exercice</button></div>'+
  '</article>';
}

function setHTML(e,t,i,prevSets){
  var ph=placeholderFor(e,i,prevSets);
  var hasW=t.w!=null, hasR=t.r!=null;
  var wTxt=hasW?fmtIn(t.w):(ph.w!=null?fmtIn(ph.w):'–'), rTxt=hasR?String(t.r):(ph.r!=null?String(ph.r):'–');
  return '<div class="set'+(t.ok?' ok':'')+'" data-i="'+i+'">'+
    '<span class="idx">'+(i+1)+'</span>'+
    '<button class="in pick'+(hasW?'':' ph')+'" data-act="wheel" data-f="w" aria-label="Poids de la série '+(i+1)+' : '+(hasW?fmtIn(t.w)+' kilos':'non renseigné')+'. Choisir">'+wTxt+'</button>'+
    '<button class="in pick'+(hasR?'':' ph')+'" data-act="wheel" data-f="r" aria-label="Répétitions de la série '+(i+1)+' : '+(hasR?t.r:'non renseignées')+'. Choisir">'+rTxt+'</button>'+
    '<button class="chk" data-act="tick" aria-pressed="'+t.ok+'" aria-label="Valider la série '+(i+1)+'">'+ICON_CHECK+'</button>'+
    '<button class="x" data-act="rmset" aria-label="Supprimer la série '+(i+1)+'">'+ICON_X+'</button>'+
  '</div>';
}

var METRICS=[['sets','Séries'],['vol','Tonnage'],['reps','Reps']];
var METRIC_CAP={sets:'Séries équivalentes',vol:'Tonnage (kg × reps)',reps:'Répétitions'};
var METRIC_UNIT={sets:'séries éq.',vol:'kg',reps:'reps'};
function blocksHTML(v,n){
  var full=Math.floor(v+1e-9), half=(v-full>=0.25)?1:0, h='';
  for(var i=0;i<full;i++) h+='<i></i>';
  if(half) h+='<i class="h"></i>';
  return '<div class="blocks" style="--n:'+n+'" aria-hidden="true">'+h+'</div>';
}
function barHTML(r,max){
  var w=Math.max(2,r.t/max*100), pp=r.t?r.p/r.t*100:0;
  return '<div class="track" aria-hidden="true"><div class="bar" style="width:'+w.toFixed(1)+'%"><span class="p" style="width:'+pp.toFixed(1)+'%"></span><span class="s" style="flex:1"></span></div></div>';
}
function bodyCapHTML(m,st,metric){
  var v=st[m]?st[m].p+st[m].s:0;
  return '<b>'+esc(MN[m])+'</b>'+(v>0?'<span class="v">'+fmt(v,metric==='sets'?1:0)+' '+METRIC_UNIT[metric]+'</span>':'<span>pas travaillé dans cette séance</span>');
}
function recapHTML(s){
  var metric=S.prefs.metric||'sets';
  var seg='<div class="seg alt" role="group" aria-label="Mesure du travail">'+METRICS.map(function(m){
    return '<button data-act="metric" data-v="'+m[0]+'" aria-pressed="'+(metric===m[0])+'">'+m[1]+'</button>';
  }).join('')+'</div>';
  var st=muscleStats(s,metric);
  var rows=ORDER.filter(function(m){return st[m]}).map(function(m){return {m:m,p:st[m].p,s:st[m].s,t:st[m].p+st[m].s}}).sort(function(a,b){return b.t-a.t});
  var scores={}; rows.forEach(function(r){scores[r.m]=r.t});
  if(UI.bm&&!ORDER.some(function(m){return m===UI.bm})) UI.bm=null;
  var sel=UI.bm||(rows.length?rows[0].m:null);
  var body='<div class="body-card">'+Body.html(scores,sel)+
    '<div class="bm-cap" id="bm-cap" aria-live="polite">'+(sel?(rows.length?bodyCapHTML(sel,st,metric):'Valide une série pour colorer les muscles'):'Valide une série pour colorer les muscles')+'</div>'+
    '<div class="heat"><span class="none"><i></i>Rien</span><span>Peu</span><span class="ramp"></span><span>Beaucoup</span></div></div>';
  if(!rows.length) return seg+body+'<p class="empty">Valide au moins une série pour voir quels muscles tu as sollicités dans cette séance.</p>';
  var dec=metric==='sets'?1:0, max=rows[0].t, top=rows[0];
  var n=Math.max(6,Math.ceil(max-1e-9));
  var h=seg+body;
  h+='<div class="topm"><div class="topm-h"><div><p class="cap">En tête · '+METRIC_CAP[metric].toLowerCase()+'</p><div class="topn">'+esc(MN[top.m])+'</div></div><div class="topv">'+fmt(top.t,dec)+'</div></div>'+
    (metric==='sets'?blocksHTML(top.t,n):barHTML(top,max));
  if(rows.length>1){
    h+='<div class="mrows">'+rows.slice(1).map(function(r){
      return '<div class="mrow'+(r.t<=max/2?' low':'')+'"><div class="mh"><span class="mname">'+esc(MN[r.m])+'</span><span class="mval">'+fmt(r.t,dec)+'</span></div>'+
        (metric==='sets'?blocksHTML(r.t,n):barHTML(r,max))+'</div>';
    }).join('')+'</div>';
  }
  h+='</div>';
  h+=metric==='sets'
    ?'<div class="legend"><span class="p"><i></i>1 bloc = 1 série directe</span><span class="h"><i></i>½ bloc = indirect (compte ½)</span></div>'
    :'<div class="legend"><span class="p"><i></i>Travail direct</span><span class="s"><i></i>Travail indirect (compte ½)</span></div>';
  var none=ORDER.filter(function(m){return !st[m]});
  if(none.length) h+='<p class="cap">Non sollicités dans cette séance</p><div class="chips">'+none.map(function(m){return '<span class="chip ro">'+esc(MN[m])+'</span>'}).join('')+'</div>';
  return h;
}

function historyHTML(){
  var all=sessionsSorted();
  var h='<h2 class="h2">Historique</h2>';
  if(!all.length) return h+'<p class="empty">Tes séances apparaîtront ici dès que tu en auras démarré une.</p>';
  h+='<p class="note-t">'+all.length+' séance'+(all.length>1?'s':'')+' enregistrée'+(all.length>1?'s':'')+'. Touche une séance pour revoir ses exercices et son récap muscles.</p>';
  all.forEach(function(s){
    var t=sessionTotals(s), st=muscleStats(s,'sets');
    var top=Object.keys(st).sort(function(a,b){return (st[b].p+st[b].s)-(st[a].p+st[a].s)}).slice(0,3);
    h+='<button class="h-item" data-act="open" data-id="'+s.id+'">'+
      '<span class="h-date"><span class="d">'+parseD(s.date).getDate()+'</span><span class="m">'+esc(fmtDate(s.date,{month:'short'}).replace('.',''))+'</span></span>'+
      '<span><span class="h-t">'+esc(sessLabel(s))+(s.done?'':' <span class="badge live">En cours</span>')+'</span>'+
      '<span class="h-m">'+esc(fmtDate(s.date,{weekday:'long'}))+' · '+t.exN+' exercice'+(t.exN>1?'s':'')+' · '+t.sets+' série'+(t.sets>1?'s':'')+' · '+fmt(t.vol,0)+' kg</span>'+
      (top.length?'<span class="chips">'+top.map(function(m){return '<span class="chip lead">'+esc(MN[m])+'</span>'}).join('')+'</span>':'')+
      '</span></button>';
  });
  return h;
}

function exCounts(){
  var c={};
  Object.keys(S.sessions).forEach(function(k){
    S.sessions[k].ex.forEach(function(e){if(e.sets.some(function(t){return t.ok})) c[e.id]=(c[e.id]||0)+1});
  });
  return c;
}
function libListHTML(){
  var q=norm(UI.q.trim()), counts=exCounts();
  var list=allEx().filter(function(x){
    if(!eqOk(x,UI.ef)) return false;
    if(!q) return true;
    return norm(x.n).indexOf(q)>=0||x.p.some(function(m){return norm(MN[m]).indexOf(q)>=0});
  });
  if(!list.length) return '<p class="empty">Aucun exercice ne correspond. Tu peux le créer avec le bouton ci-dessus.</p>';
  var h='';
  ORDER.forEach(function(m){
    var g=list.filter(function(x){return x.p[0]===m}).sort(function(a,b){return eqRank(a)-eqRank(b)});
    if(!g.length) return;
    h+='<h3 class="grp">'+esc(MN[m])+'</h3>';
    g.forEach(function(x){
      var c=counts[x.id]||0;
      h+='<button class="l-item" data-act="exopen" data-id="'+esc(x.id)+'"><span class="rowl">'+leadImg(x.id)+'<span><b>'+esc(x.n)+(x.custom?' <span class="tag">perso</span>':'')+'</b><small>'+(eqLabel(x)?eqLabel(x)+' · ':'')+(x.bf?'<span class="tag">Basic-Fit</span> · ':'')+(c?c+' séance'+(c>1?'s':''):'Jamais fait')+'</small></span></span><span class="go">›</span></button>';
    });
  });
  var rest=list.filter(function(x){return !x.p.length});
  if(rest.length){
    h+='<h3 class="grp">Autres</h3>';
    rest.forEach(function(x){h+='<button class="l-item" data-act="exopen" data-id="'+esc(x.id)+'"><span><b>'+esc(x.n)+'</b></span><span class="go">›</span></button>'});
  }
  return h;
}
function libHTML(){
  var h='<h2 class="h2">Exercices</h2><p class="note-t">Touche un exercice pour voir tes records et ta progression.</p>'+
    '<div class="stack" style="margin-top:0">'+
    '<label class="sr" for="lib-q">Rechercher un exercice</label>'+
    '<input id="lib-q" class="txt" type="search" autocomplete="off" placeholder="Rechercher un exercice ou un muscle" value="'+esc(UI.q)+'">'+
    '<div class="chips" role="group" aria-label="Filtrer par type">'+efChips(UI.ef,'ef')+'</div>'+efNote(UI.ef)+
    '<button class="btn ghost" data-act="newex-lib">+ Créer un exercice</button></div>'+
    '<div id="lib-list">'+libListHTML()+'</div>'+
    '<h3 class="grp">Sauvegarde</h3><div class="card">'+
    '<p class="note-t" style="margin:0">Tout est enregistré sur ce téléphone, rien n’est envoyé en ligne. Exporte de temps en temps un fichier (séances, exercices perso et photos) et garde-le dans Fichiers, iCloud ou un e-mail.</p>'+
    (S.prefs.lastBackup?'<p class="note-t" style="margin:0">Dernière sauvegarde : '+esc(new Date(S.prefs.lastBackup).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}))+'.</p>':'')+
    '<button class="btn" data-act="exportfile">Exporter mes données</button>'+
    '<button class="btn ghost" data-act="importfile">Importer un fichier</button>'+
    '<button class="btn ghost" data-act="importtoggle">Importer depuis du texte copié</button>'+
    (UI.showImport?'<label class="lbl" for="imp">Colle ici les données copiées</label><textarea id="imp" class="txt" spellcheck="false"></textarea><button class="btn" data-act="importgo">Importer</button>':'')+
    (UI.msg?'<p class="lbl" role="status">'+esc(UI.msg)+'</p>':'')+
    '</div>';
  return h;
}

function exHistory(exId){
  var out=[];
  sessionsSorted().forEach(function(s){
    s.ex.forEach(function(e){
      if(e.id===exId){var d=e.sets.filter(function(t){return t.ok});if(d.length) out.push({s:s,e:e,done:d})}
    });
  });
  return out;
}
function spark(vals,dates,unit){
  var W=320,H=124,pl=12,pr=12,pt=26,pb=24,n=vals.length;
  var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals), span=mx-mn||1;
  var lo=Math.max(0,mn-span*0.2), hi=mx+span*0.2;
  if(mn===mx){lo=Math.max(0,mn-1);hi=mx+1}
  function X(i){return n===1?W/2:pl+i*(W-pl-pr)/(n-1)}
  function Y(v){return pt+(hi-v)/(hi-lo)*(H-pt-pb)}
  var path=vals.map(function(v,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)}).join('');
  var area=path+'L'+X(n-1).toFixed(1)+' '+(H-pb)+'L'+X(0).toFixed(1)+' '+(H-pb)+'Z';
  var last=n-1;
  var s='<svg class="spark" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Progression sur '+n+' séances : de '+fmt(vals[0],1)+' à '+fmt(vals[last],1)+' '+unit+'">'+
    '<path class="ar" d="'+area+'"/><line class="ax" x1="'+pl+'" y1="'+(H-pb)+'" x2="'+(W-pr)+'" y2="'+(H-pb)+'"/><path class="ln" d="'+path+'"/>';
  vals.forEach(function(v,i){s+='<circle cx="'+X(i).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="'+(i===last?4.5:3)+'"/>'});
  s+='<text class="v" x="'+X(0).toFixed(1)+'" y="'+(Y(vals[0])-9).toFixed(1)+'" text-anchor="'+(n===1?'middle':'start')+'">'+fmt(vals[0],1)+'</text>';
  if(n>1) s+='<text class="v" x="'+X(last).toFixed(1)+'" y="'+(Y(vals[last])-9).toFixed(1)+'" text-anchor="end">'+fmt(vals[last],1)+'</text>';
  s+='<text x="'+X(0).toFixed(1)+'" y="'+(H-7)+'" text-anchor="'+(n===1?'middle':'start')+'">'+esc(dates[0])+'</text>';
  if(n>1) s+='<text x="'+X(last).toFixed(1)+'" y="'+(H-7)+'" text-anchor="end">'+esc(dates[last])+'</text>';
  return s+'</svg>';
}
function exDetailHTML(id){
  var ex=allEx().filter(function(x){return x.id===id})[0];
  var h=exHistory(id);
  if(!ex&&h.length) ex={id:id,n:h[0].e.n,p:h[0].e.p,s:h[0].e.s,custom:false};
  if(!ex) return '<button class="back" data-act="exback">‹ Exercices</button><p class="empty">Exercice introuvable.</p>';
  var hasW=h.some(function(r){return r.done.some(function(t){return t.w>0})});
  var asc=h.slice().reverse();
  var vals=asc.map(function(r){return hasW?Math.max.apply(null,r.done.map(function(t){return e1(t.w,t.r)})):Math.max.apply(null,r.done.map(function(t){return t.r||0}))});
  var dates=asc.map(function(r){return fmtDate(r.s.date,{day:'numeric',month:'short'})});
  var heavy=null,bestE=0;
  h.forEach(function(r){r.done.forEach(function(t){
    if(t.w>0&&(!heavy||t.w>heavy.w||(t.w===heavy.w&&(t.r||0)>(heavy.r||0)))) heavy=t;
    bestE=Math.max(bestE,e1(t.w,t.r));
  })});
  var sec=ex.s.filter(function(m){return ex.p.indexOf(m)<0});
  var out='<button class="back" data-act="exback">‹ Exercices</button><h2 class="h2">'+esc(ex.n)+'</h2>'+
    '<p class="mtags">'+(eqLabel(ex)?esc(eqLabel(ex))+(ex.bf?' · Basic-Fit':'')+' — ':'')+esc(names(ex.p).join(' · '))+(sec.length?' <span>+ '+esc(names(sec).join(', '))+'</span>':'')+'</p>';
  if(Illus.has(ex.id)) out+='<p class="cap">Mouvement</p><div class="ill-box">'+Illus.svg(ex)+'</div><p class="note-t" style="margin-top:6px">Schéma indicatif. Muscles principaux en vert vif, secondaires en vert atténué.</p>';
  var ph=imgsFor(ex.id);
  out+='<p class="cap">Photos</p><div class="photos">'+ph.map(function(m,i){
    return '<button class="thumb" data-act="lb" data-ex="'+esc(ex.id)+'" data-p="'+i+'" aria-label="Agrandir la photo '+(i+1)+'"><img src="'+m.data+'" alt=""></button>';
  }).join('')+(ph.length<MAX_IMG?'<button class="addph" data-act="addimg" data-ex="'+esc(ex.id)+'">'+ICON_CAM+'Ajouter</button>':'')+'</div>'+
  (ph.length?'':'<p class="note-t" style="margin-top:8px">Ajoute une photo de la machine, du réglage ou de la position pour la retrouver vite.</p>');
  if(!h.length) out+='<p class="empty">Tu n’as pas encore validé de série sur cet exercice.</p>';
  else{
    out+='<div class="stats"><div class="tile"><div class="v">'+(heavy?fmt(heavy.w,2)+'<small>kg × '+(heavy.r||0)+'</small>':fmt(Math.max.apply(null,vals),0)+'<small>reps</small>')+'</div><div class="l">'+(heavy?'Charge la plus lourde':'Meilleure série en reps')+'</div></div>'+
      '<div class="tile"><div class="v">'+h.length+'</div><div class="l">Séance'+(h.length>1?'s':'')+' avec cet exercice</div></div></div>';
    if(hasW) out+='<div class="tile" style="margin-bottom:12px"><div class="v">'+fmt(bestE,1)+'<small>kg</small></div><div class="l">Meilleure force estimée (1 RM, formule d’Epley)</div></div>';
    out+='<p class="cap">'+(hasW?'Force estimée par séance (kg)':'Meilleure série par séance (reps)')+'</p>';
    out+=n1(vals.length)?'<p class="note-t">La courbe apparaît à partir de deux séances.</p>':spark(vals,dates,hasW?'kg':'reps');
    out+='<p class="cap">Séances</p><div class="card" style="gap:0;padding:4px 14px">';
    h.forEach(function(r){
      out+='<div class="hist-row"><b>'+esc(fmtDate(r.s.date,{weekday:'short',day:'numeric',month:'short'}))+'</b>'+(r.s.name?' · '+esc(r.s.name):'')+'<small class="mono">'+esc(fmtSets(r.done))+'</small>'+(r.e.note?'<small>'+esc(r.e.note)+'</small>':'')+'</div>';
    });
    out+='</div>';
  }
  if(ex.custom) out+='<div class="stack"><button class="btn ghost danger" data-act="delcustom" data-id="'+esc(ex.id)+'">Supprimer cet exercice perso</button></div>';
  return out;
}
function n1(n){return n<2}

/* ---------- Feuille (ajout / création d'exercice) ---------- */
function openPicker(){UI.sheet={type:'pick',q:'',mf:'',ef:'',sel:[]};renderSheet()}
function pickListHTML(){
  var sh=UI.sheet, q=norm(sh.q.trim());
  var list=allEx().filter(function(x){
    if(sh.mf==='back'){if(!x.p.some(function(m){return BACK.indexOf(m)>=0})) return false}
    else if(sh.mf&&x.p.indexOf(sh.mf)<0&&x.s.indexOf(sh.mf)<0) return false;
    if(!eqOk(x,sh.ef)) return false;
    if(!q) return true;
    return norm(x.n).indexOf(q)>=0||x.p.some(function(m){return norm(MN[m]).indexOf(q)>=0});
  }).sort(function(a,b){return eqRank(a)-eqRank(b)});
  if(!list.length) return '<p class="empty">Aucun résultat. Crée cet exercice avec le bouton ci-dessous.</p>';
  return list.map(function(x){
    var on=sh.sel.indexOf(x.id)>=0;
    return '<button class="l-item" data-act="picktoggle" data-id="'+esc(x.id)+'" aria-pressed="'+on+'"><span class="rowl">'+leadImg(x.id)+'<span><b>'+esc(x.n)+(x.custom?' <span class="tag">perso</span>':'')+'</b><small>'+esc(eqLabel(x)?eqLabel(x)+' · ':'')+(x.bf?'<span class="tag">Basic-Fit</span> · ':'')+esc(names(x.p).join(' · '))+'</small></span></span><span class="sel">'+ICON_CHECK.replace('<svg','<svg').replace('viewBox','viewBox')+'</span></button>';
  }).join('');
}
function renderSheet(){
  var el=$('#sheet'), sh=UI.sheet, first=!el.firstChild;
  if(!sh){el.innerHTML='';return}
  var h;
  if(sh.type==='pick'){
    h='<div class="overlay'+(first?' first':'')+'"><div class="sheet" role="dialog" aria-modal="true" aria-label="Ajouter un exercice">'+
      '<div class="sheet-h"><div class="row"><h2>Ajouter un exercice</h2><button class="icon" data-act="sheetclose" aria-label="Fermer">'+ICON_X+'</button></div>'+
      '<label class="sr" for="pick-q">Rechercher</label><input id="pick-q" class="txt" type="search" autocomplete="off" placeholder="Rechercher un exercice ou un muscle" value="'+esc(sh.q)+'">'+
      '<div class="chips scroll" role="group" aria-label="Filtrer par type">'+efChips(sh.ef,'pef')+'</div>'+
      '<div class="chips scroll" role="group" aria-label="Filtrer par muscle"><button class="chip" data-act="mf" data-m="" aria-pressed="'+(!sh.mf)+'">Tous</button><button class="chip" data-act="mf" data-m="back" aria-pressed="'+(sh.mf==='back')+'">Tout le dos</button>'+
      ORDER.map(function(m){return '<button class="chip" data-act="mf" data-m="'+m+'" aria-pressed="'+(sh.mf===m)+'">'+esc(MN[m])+'</button>'}).join('')+'</div></div>'+
      '<div class="sheet-b" id="pick-list">'+pickListHTML()+'</div>'+
      '<div class="sheet-f"><button class="btn" data-act="pickgo" id="pick-go"'+(sh.sel.length?'':' disabled')+'>'+(sh.sel.length?'Ajouter '+sh.sel.length+' exercice'+(sh.sel.length>1?'s':''):'Choisis un exercice')+'</button>'+
      '<button class="btn ghost" data-act="newex">Créer un exercice</button></div></div></div>';
  }else if(sh.type==='wheel'){
    var ws=curSession(), we=ws&&ws.ex.filter(function(x){return x.k===sh.k})[0];
    var kgs=[], i;
    for(i=0;i<=KG_MAX;i++) kgs.push(String(i));
    var frs=FR.map(function(f){return ','+String(Math.round(f*100)).padStart(2,'0')});
    var rps=[]; for(i=1;i<=REPS_MAX;i++) rps.push(String(i));
    h='<div class="overlay'+(first?' first':'')+'"><div class="sheet" role="dialog" aria-modal="true" aria-label="Choisir le poids et les répétitions">'+
      '<div class="sheet-h"><div class="row"><h2>Série '+(sh.i+1)+'</h2><button class="icon" data-act="sheetclose" aria-label="Fermer">'+ICON_X+'</button></div>'+
      '<p class="wsub">'+esc(we?we.n:'')+'</p><div class="wprev" id="wprev" aria-live="polite"></div></div>'+
      '<div class="sheet-b"><div class="wlbls"><span>Poids</span><span>Répétitions</span></div>'+
      '<div class="wheels">'+wheelCol('kg','kg',kgs,sh.kg,'Poids, kilos')+wheelCol('fr','fr',frs,sh.fr,'Poids, décimales')+wheelCol('rp','rp',rps,sh.r-1,'Répétitions')+'</div></div>'+
      '<div class="sheet-f"><button class="btn good" data-act="wheelok">Valider la série</button><button class="btn ghost" data-act="sheetclose">Annuler</button></div></div></div>';
  }else{
    var chips=function(key){return ORDER.map(function(m){return '<button class="chip" data-act="nx'+key+'" data-m="'+m+'" aria-pressed="'+(sh[key].indexOf(m)>=0)+'">'+esc(MN[m])+'</button>'}).join('')};
    h='<div class="overlay'+(first?' first':'')+'"><div class="sheet" role="dialog" aria-modal="true" aria-label="Créer un exercice">'+
      '<div class="sheet-h"><div class="row"><h2>Nouvel exercice</h2><button class="icon" data-act="sheetclose" aria-label="Fermer">'+ICON_X+'</button></div></div>'+
      '<div class="sheet-b"><div class="card"><label class="lbl" for="nx-name">Nom</label>'+
      '<input id="nx-name" class="txt" maxlength="60" autocomplete="off" placeholder="Ex. Développé couché à la Smith" value="'+esc(sh.name||'')+'">'+
      '<p class="lbl">Muscles principaux (travail direct)</p><div class="chips">'+chips('p')+'</div>'+
      '<p class="lbl">Muscles secondaires (travail indirect, facultatif)</p><div class="chips">'+chips('s')+'</div>'+
      (sh.err?'<p class="err" role="alert">'+esc(sh.err)+'</p>':'')+'</div></div>'+
      '<div class="sheet-f"><button class="btn" data-act="nxsave">Créer l’exercice</button><button class="btn ghost" data-act="nxback">'+(sh.from==='pick'?'Retour':'Annuler')+'</button></div></div></div>';
  }
  el.innerHTML=h;
  if(sh.type==='wheel'){initWheels();return}
  var inp=$(sh.type==='pick'?'#pick-q':'#nx-name'); if(inp&&sh.focus){inp.focus();sh.focus=false}
}

/* ---------- Roues poids / répétitions ---------- */
var ITEM_H=44, FR=[0,0.25,0.5,0.75], KG_MAX=400, REPS_MAX=100;
function openWheel(s,e,i){
  var st=e.sets[i], prev=prevFor(s,e.id), ps=prev?prev.e.sets.filter(function(x){return x.ok}):[];
  var ph=placeholderFor(e,i,ps);
  var w=st.w!=null?st.w:(ph.w!=null?ph.w:20);
  var r=st.r>0?st.r:(ph.r>0?ph.r:10);
  var q=Math.round(w*4)/4, kg=Math.floor(q+1e-9), fr=Math.round((q-kg)*4);
  if(fr>3){fr=0;kg++}
  kg=Math.max(0,Math.min(KG_MAX,kg)); r=Math.max(1,Math.min(REPS_MAX,r));
  UI.sheet={type:'wheel',k:e.k,i:i,kg:kg,fr:fr,r:r,kg0:kg,fr0:fr,w0:st.w};
  renderSheet();
}
function wheelCol(cls,key,items,sel,label){
  return '<div class="wheel '+cls+'" role="spinbutton" tabindex="0" data-wh="'+key+'" aria-label="'+label+'" aria-valuemin="0" aria-valuemax="'+(items.length-1)+'" aria-valuenow="'+sel+'" aria-valuetext="'+esc(items[sel])+'"><div class="pad"></div>'+
    items.map(function(t,i){return '<div class="wi'+(i===sel?' sel':'')+'" data-act="wsel" data-i="'+i+'">'+t+'</div>'}).join('')+'<div class="pad"></div></div>';
}
function wheelWeight(sh){return sh.kg+FR[sh.fr]}
function wheelPreview(){
  var sh=UI.sheet, el=$('#wprev'); if(!sh||!el) return;
  el.innerHTML=esc(fmtIn(wheelWeight(sh)))+'<small>kg ×</small>'+sh.r;
}
function wheelIdx(w){
  var n=w.querySelectorAll('.wi').length;
  return Math.max(0,Math.min(n-1,Math.round(w.scrollTop/ITEM_H)));
}
function wheelSync(w){
  var sh=UI.sheet; if(!sh||sh.type!=='wheel') return;
  var k=w.dataset.wh, i=wheelIdx(w);
  if(k==='kg') sh.kg=i; else if(k==='fr') sh.fr=i; else sh.r=i+1;
  var items=w.querySelectorAll('.wi'), cur=w.querySelector('.wi.sel'), nx=items[i];
  if(nx&&cur!==nx){
    if(cur) cur.classList.remove('sel');
    nx.classList.add('sel');
    w.setAttribute('aria-valuenow',i); w.setAttribute('aria-valuetext',nx.textContent);
  }
  wheelPreview();
}
function initWheels(){
  document.querySelectorAll('#sheet .wheel').forEach(function(w){
    var sh=UI.sheet, k=w.dataset.wh;
    var idx=k==='kg'?sh.kg:k==='fr'?sh.fr:sh.r-1;
    var place=function(){w.scrollTop=idx*ITEM_H};
    place(); requestAnimationFrame(place);
    var tick=false;
    w.addEventListener('scroll',function(){
      if(tick) return; tick=true;
      requestAnimationFrame(function(){tick=false;wheelSync(w)});
    },{passive:true});
    w.addEventListener('keydown',function(ev){
      var d={ArrowUp:-1,ArrowDown:1,PageUp:-5,PageDown:5}[ev.key];
      if(ev.key==='Home') d=-1e6; if(ev.key==='End') d=1e6;
      if(d==null) return;
      ev.preventDefault();
      var n=w.querySelectorAll('.wi').length, to=Math.max(0,Math.min(n-1,wheelIdx(w)+d));
      w.scrollTo({top:to*ITEM_H,behavior:'smooth'});
    });
  });
  wheelPreview();
}
function wheelDone(){
  var sh=UI.sheet, s=curSession(); if(!sh||!s) return;
  var e=s.ex.filter(function(x){return x.k===sh.k})[0], st=e&&e.sets[sh.i];
  UI.sheet=null; renderSheet();
  if(!st) return;
  var same=(sh.kg===sh.kg0&&sh.fr===sh.fr0&&sh.w0!=null);
  st.w=same?sh.w0:wheelWeight(sh); st.r=sh.r; st.ok=true;
  touch(s); refreshCard(s,e);
}

/* ---------- Actions ---------- */
function newSession(name,copyFrom){
  var now=Date.now();
  var s={id:uid(),date:todayStr(),started:now,updated:now,name:name||'',done:false,finished:0,ex:[]};
  if(copyFrom) s.ex=copyFrom.ex.map(function(e){
    return {k:uid(),id:e.id,n:e.n,p:e.p.slice(),s:e.s.slice(),note:'',sets:e.sets.map(function(){return {w:null,r:null,ok:false}})};
  });
  S.sessions[s.id]=s; S.prefs.currentId=s.id; UI.sub='ex';
  touch(s); return s;
}
function addExercises(s,ids){
  ids.forEach(function(id){
    var x=allEx().filter(function(y){return y.id===id})[0]; if(!x) return;
    var e={k:uid(),id:x.id,n:x.n,p:x.p.slice(),s:x.s.slice(),note:'',sets:[]};
    var pv=prevFor(s,x.id), n=pv?Math.min(8,Math.max(1,pv.e.sets.filter(function(t){return t.ok}).length)):3;
    for(var i=0;i<n;i++) e.sets.push({w:null,r:null,ok:false});
    s.ex.push(e);
  });
  touch(s);
}
function arm(btn,label){
  if(btn.dataset.armed) return true;
  btn.dataset.armed='1'; btn.dataset.orig=btn.textContent; btn.textContent=label;
  setTimeout(function(){if(btn.isConnected&&btn.dataset.armed){delete btn.dataset.armed;btn.textContent=btn.dataset.orig}},3500);
  return false;
}
function refreshCard(s,e,focusSel){
  var card=$('.ex[data-k="'+e.k+'"]'); if(!card) return render();
  var tmp=document.createElement('div'); tmp.innerHTML=cardHTML(s,e);
  card.replaceWith(tmp.firstChild);
  if(focusSel){var f=$(focusSel); if(f) f.focus()}
  updateTiles(s);
}
function updateTiles(s){var t=$('#tiles'); if(t) t.innerHTML=tilesHTML(sessionTotals(s))}
function exOf(btn){
  var s=curSession(), card=btn.closest('.ex'); if(!s||!card) return null;
  var e=s.ex.filter(function(x){return x.k===card.dataset.k})[0];
  return e?{s:s,e:e,card:card}:null;
}
function goTab(t){UI.tab=t;UI.libEx=null;render();window.scrollTo(0,0)}

document.addEventListener('click',function(ev){
  var t=ev.target;
  if(t.classList&&t.classList.contains('overlay')){
    if(t.closest('#lightbox')){UI.lb=null;renderLB()}else{UI.sheet=null;renderSheet()}
    return;
  }
  var b=t.closest('[data-act]'); if(!b) return;
  var act=b.dataset.act, s=curSession(), ctx;
  switch(act){
    case 'tab': goTab(b.dataset.t); break;
    case 'pickname': var ni=$('#new-name'); if(ni){ni.value=b.dataset.n;ni.focus()} break;
    case 'start':
      newSession(($('#new-name').value||'').trim()); UI.tab='session'; render(); openPicker(); window.scrollTo(0,0); break;
    case 'startcopy':
      var src=S.sessions[b.dataset.id];
      newSession(($('#new-name').value||'').trim()||(src&&src.name)||'',src); render(); window.scrollTo(0,0); break;
    case 'open':
      var o=S.sessions[b.dataset.id]; if(!o) break;
      S.prefs.currentId=o.id; lsSave(); UI.tab='session'; UI.sub=o.done?'mus':'ex'; render(); window.scrollTo(0,0); break;
    case 'close': S.prefs.currentId=null; lsSave(); render(); window.scrollTo(0,0); break;
    case 'sub': UI.sub=b.dataset.v; render(); break;
    case 'metric': S.prefs.metric=b.dataset.v; lsSave(); render(); break;
    case 'addex': openPicker(); break;
    case 'addset':
      ctx=exOf(b); if(!ctx) break;
      ctx.e.sets.push({w:null,r:null,ok:false}); touch(ctx.s);
      refreshCard(ctx.s,ctx.e,'#w-'+ctx.e.k+'-'+(ctx.e.sets.length-1)); break;
    case 'rmset':
      ctx=exOf(b); if(!ctx) break;
      ctx.e.sets.splice(+b.closest('.set').dataset.i,1); touch(ctx.s); refreshCard(ctx.s,ctx.e); break;
    case 'tick':
      ctx=exOf(b); if(!ctx) break;
      var row=b.closest('.set'), i=+row.dataset.i, st=ctx.e.sets[i];
      if(!st.ok){
        var pv=prevFor(ctx.s,ctx.e.id), ps=pv?pv.e.sets.filter(function(x){return x.ok}):[];
        var ph=placeholderFor(ctx.e,i,ps);
        if(st.w==null&&ph.w!=null) st.w=ph.w;
        if(!(st.r>0)&&ph.r>0) st.r=ph.r;
        if(!(st.r>0)){openWheel(ctx.s,ctx.e,i); break}
        st.ok=true;
      }else st.ok=false;
      touch(ctx.s); refreshCard(ctx.s,ctx.e); break;
    case 'wheel':
      ctx=exOf(b); if(!ctx) break;
      openWheel(ctx.s,ctx.e,+b.closest('.set').dataset.i); break;
    case 'wsel':
      var wh=b.closest('.wheel'); if(wh) wh.scrollTo({top:(+b.dataset.i)*ITEM_H,behavior:'smooth'}); break;
    case 'wheelok': wheelDone(); break;
    case 'bmus':
      if(!s) break;
      UI.bm=b.dataset.m;
      var met=S.prefs.metric||'sets', cp=$('#bm-cap');
      if(cp) cp.innerHTML=bodyCapHTML(UI.bm,muscleStats(s,met),met);
      document.querySelectorAll('.bm.sel').forEach(function(x){x.classList.remove('sel')});
      document.querySelectorAll('.bm[data-m="'+UI.bm+'"]').forEach(function(x){x.classList.add('sel')});
      break;
    case 'rmex':
      if(!arm(b,'Confirmer le retrait')) break;
      ctx=exOf(b); if(!ctx) break;
      ctx.s.ex=ctx.s.ex.filter(function(x){return x!==ctx.e}); touch(ctx.s); render(); break;
    case 'finish':
      if(!s) break;
      s.done=true; s.finished=Date.now(); touch(s); UI.sub='mus'; render(); window.scrollTo(0,0); break;
    case 'reopen': if(!s) break; s.done=false; touch(s); UI.sub='ex'; render(); break;
    case 'newsess': S.prefs.currentId=null; lsSave(); render(); window.scrollTo(0,0); break;
    case 'delsess':
      if(!s||!arm(b,'Confirmer la suppression')) break;
      delete S.sessions[s.id]; S.prefs.currentId=null; lsSave();
      render(); window.scrollTo(0,0); break;

    case 'sheetclose': UI.sheet=null; renderSheet(); break;
    case 'mf': UI.sheet.mf=b.dataset.m; renderSheet(); break;
    case 'pef': UI.sheet.ef=b.dataset.e; renderSheet(); break;
    case 'ef': UI.ef=b.dataset.e; render(); break;
    case 'picktoggle':
      var sel=UI.sheet.sel, k=sel.indexOf(b.dataset.id);
      if(k>=0) sel.splice(k,1); else sel.push(b.dataset.id);
      b.setAttribute('aria-pressed',k<0);
      var go=$('#pick-go'); if(go){go.disabled=!sel.length;go.textContent=sel.length?'Ajouter '+sel.length+' exercice'+(sel.length>1?'s':''):'Choisis un exercice'}
      break;
    case 'pickgo':
      if(!s||!UI.sheet.sel.length) break;
      addExercises(s,UI.sheet.sel); UI.sheet=null; renderSheet(); UI.sub='ex'; render(); break;
    case 'newex': UI.sheet={type:'new',from:'pick',name:'',p:[],s:[],err:'',focus:true,sel:UI.sheet.sel||[]}; renderSheet(); break;
    case 'newex-lib': UI.sheet={type:'new',from:'lib',name:'',p:[],s:[],err:'',focus:true,sel:[]}; renderSheet(); break;
    case 'nxp': case 'nxs':
      var key=act==='nxp'?'p':'s', arr=UI.sheet[key], m=b.dataset.m, ix=arr.indexOf(m);
      if(ix>=0) arr.splice(ix,1); else arr.push(m);
      UI.sheet.name=($('#nx-name')||{}).value||UI.sheet.name; renderSheet(); break;
    case 'nxback':
      if(UI.sheet.from==='pick'){var keep=UI.sheet.sel;UI.sheet={type:'pick',q:'',mf:'',sel:keep};renderSheet()}
      else{UI.sheet=null;renderSheet()}
      break;
    case 'nxsave':
      var sh=UI.sheet; sh.name=($('#nx-name').value||'').trim();
      if(!sh.name){sh.err='Donne un nom à l’exercice.';renderSheet();break}
      if(!sh.p.length){sh.err='Choisis au moins un muscle principal.';renderSheet();break}
      var cid='c'+uid();
      S.custom.push({id:cid,n:sh.name,p:sh.p.slice(),s:sh.s.filter(function(m){return sh.p.indexOf(m)<0})});
      saveLib();
      if(sh.from==='pick'){sh.sel.push(cid);UI.sheet={type:'pick',q:'',mf:'',sel:sh.sel};renderSheet()}
      else{UI.sheet=null;renderSheet();render()}
      break;

    case 'addimg': UI.imgTarget=b.dataset.ex; $('#file').click(); break;
    case 'lb': UI.lb={ex:b.dataset.ex,i:Math.max(0,(+b.dataset.p||0)+(Illus.has(b.dataset.ex)?1:0))}; renderLB(); break;
    case 'lbclose': UI.lb=null; renderLB(); break;
    case 'lbprev': case 'lbnext':
      var ll=lbItems(UI.lb.ex).length;
      UI.lb.i=(UI.lb.i+(act==='lbnext'?1:-1)+ll)%ll; renderLB(); break;
    case 'lbdel':
      if(!arm(b,'Confirmer')) break;
      var li=lbItems(UI.lb.ex)[UI.lb.i];
      if(li&&li.id) deleteImg(li.id);
      UI.lb.i=Math.max(0,UI.lb.i-1); renderLB(); render(); break;
    case 'exopen': UI.libEx=b.dataset.id; render(); window.scrollTo(0,0); break;
    case 'exback': UI.libEx=null; render(); break;
    case 'delcustom':
      if(!arm(b,'Confirmer la suppression')) break;
      imgsFor(b.dataset.id).forEach(function(m){deleteImg(m.id)});
      S.custom=S.custom.filter(function(c){return c.id!==b.dataset.id}); saveLib(); UI.libEx=null; render(); break;
    case 'exportfile': exportFile(); break;
    case 'importfile': var inp=$('#impfile'); if(inp){inp.value='';inp.click()} break;
    case 'hideinstall': S.prefs.hideInstall=true; lsSave(); render(); break;
    case 'install': if(deferredInstall){var dp=deferredInstall; deferredInstall=null; dp.prompt(); render()} break;
    case 'importtoggle': UI.showImport=!UI.showImport; UI.msg=''; render(); break;
    case 'importgo': importData(($('#imp')||{}).value||''); break;
  }
});

document.addEventListener('input',function(ev){
  var t=ev.target, f=t.dataset&&t.dataset.f, s=curSession();
  if(t.id==='pick-q'&&UI.sheet){UI.sheet.q=t.value;$('#pick-list').innerHTML=pickListHTML();return}
  if(t.id==='lib-q'){UI.q=t.value;$('#lib-list').innerHTML=libListHTML();return}
  if(t.id==='nx-name'&&UI.sheet){UI.sheet.name=t.value;return}
  if(!f||!s) return;
  if(f==='sname'){s.name=t.value;touch(s);return}
  var card=t.closest('.ex'); if(!card) return;
  var e=s.ex.filter(function(x){return x.k===card.dataset.k})[0]; if(!e) return;
  if(f==='note'){e.note=t.value;touch(s);return}
});
document.addEventListener('change',function(ev){
  var t=ev.target, s=curSession();
  if(t.id==='file'){var fl=t.files; addImages(UI.imgTarget,fl); return}
  if(t.id==='impfile'){readBackup(t.files&&t.files[0]); return}
  if(t.dataset&&t.dataset.f==='sdate'&&s&&/^\d{4}-\d{2}-\d{2}$/.test(t.value)){s.date=t.value;touch(s);render()}
});
document.addEventListener('keydown',function(ev){
  if(ev.key==='Escape'){
    if(UI.lb){UI.lb=null;renderLB()}else if(UI.sheet){UI.sheet=null;renderSheet()}
  }
});

/* ---------- Photos d'exercices ---------- */
function imgsFor(exId){
  return Object.keys(S.imgs).map(function(k){return S.imgs[k]}).filter(function(m){return m.ex===exId}).sort(function(a,b){return a.updated-b.updated});
}
function exName(exId){
  var x=allEx().filter(function(y){return y.id===exId})[0]; if(x) return x.n;
  var all=sessionsSorted();
  for(var i=0;i<all.length;i++) for(var j=0;j<all[i].ex.length;j++) if(all[i].ex[j].id===exId) return all[i].ex[j].n;
  return 'Exercice';
}
function exObj(exId){return allEx().filter(function(y){return y.id===exId})[0]||null}
function thumbHTML(exId,name){
  var l=imgsFor(exId);
  if(l.length) return '<button class="thumb" data-act="lb" data-ex="'+esc(exId)+'" data-p="0" aria-label="Voir les photos de '+esc(name)+'"><img src="'+l[0].data+'" alt="">'+(l.length>1?'<span class="n">'+l.length+'</span>':'')+'</button>';
  var x=exObj(exId);
  if(x&&Illus.has(exId)) return '<button class="thumb ill" data-act="lb" data-ex="'+esc(exId)+'" data-p="-1" aria-label="Voir le schéma de '+esc(name)+'">'+Illus.svg(x,'A')+'</button>';
  return '';
}
function leadImg(exId){
  var l=imgsFor(exId); if(l.length) return '<img class="lead" src="'+l[0].data+'" alt="">';
  var x=exObj(exId); return x&&Illus.has(exId)?'<span class="lead ill">'+Illus.svg(x,'A')+'</span>':'';
}
function lbItems(exId){
  var a=[]; if(Illus.has(exId)) a.push({kind:'ill'});
  return a.concat(imgsFor(exId).map(function(m){return {kind:'img',id:m.id,data:m.data}}));
}
function flash(msg){
  var t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=msg;
  document.body.appendChild(t); setTimeout(function(){t.remove()},3500);
}
/* Réduit la photo (côté max 1000 px, JPEG) pour économiser l'espace de l'appareil. */
function shrink(file){
  return new Promise(function(res,rej){
    var fr=new FileReader();
    fr.onerror=function(){rej(new Error('lecture'))};
    fr.onload=function(){
      var im=new Image();
      im.onerror=function(){rej(new Error('image'))};
      im.onload=function(){
        var tries=[[1000,.8],[800,.7],[600,.6],[420,.5]];
        for(var i=0;i<tries.length;i++){
          var sc=Math.min(1,tries[i][0]/Math.max(im.width,im.height));
          var cv=document.createElement('canvas');
          cv.width=Math.max(1,Math.round(im.width*sc)); cv.height=Math.max(1,Math.round(im.height*sc));
          var cx=cv.getContext('2d'); cx.fillStyle='#fff'; cx.fillRect(0,0,cv.width,cv.height);
          cx.drawImage(im,0,0,cv.width,cv.height);
          var u=cv.toDataURL('image/jpeg',tries[i][1]);
          if(u.length<280000||i===tries.length-1){res(u);return}
        }
      };
      im.src=fr.result;
    };
    fr.readAsDataURL(file);
  });
}
function addImages(exId,files){
  if(!exId) return;
  var list=Array.prototype.slice.call(files||[]).filter(function(f){return !f.type||/^image\//.test(f.type)});
  var room=MAX_IMG-imgsFor(exId).length;
  if(room<=0){flash('Maximum '+MAX_IMG+' photos par exercice.');return}
  if(list.length>room) flash((room>1?'Seules '+room+' photos ont été ajoutées':'Seule 1 photo a été ajoutée')+' (maximum '+MAX_IMG+' par exercice).');
  var chain=Promise.resolve();
  list.slice(0,room).forEach(function(f){
    chain=chain.then(function(){return shrink(f)}).then(function(u){
      var id=uid(); S.imgs[id]={id:id,ex:exId,data:u,updated:Date.now()+(imgSeq++)};
      saveImg(id);
    });
  });
  chain.then(function(){render();if(UI.lb) renderLB()}).catch(function(){flash('Cette photo n’a pas pu être ajoutée.')});
}
function renderLB(){
  var el=$('#lightbox'), lb=UI.lb;
  if(!lb){el.innerHTML='';return}
  var l=lbItems(lb.ex);
  if(!l.length){UI.lb=null;el.innerHTML='';return}
  if(lb.i>=l.length) lb.i=l.length-1;
  if(lb.i<0) lb.i=0;
  var name=exName(lb.ex), it=l[lb.i], x=exObj(lb.ex);
  var media=it.kind==='ill'&&x?'<div class="lb-ill">'+Illus.svg(x)+'</div>':
    '<img class="lb-img" src="'+it.data+'" alt="Photo '+(lb.i+(l[0].kind==='ill'?0:1))+' de '+esc(name)+'">';
  el.innerHTML='<div class="overlay lb"><div class="lb-in" role="dialog" aria-modal="true" aria-label="Photos de '+esc(name)+'">'+
    '<div class="lb-h"><b>'+esc(name)+'</b><button class="icon" data-act="lbclose" aria-label="Fermer">'+ICON_X+'</button></div>'+
    media+
    '<div class="lb-f">'+(l.length>1?'<button class="btn ghost sm" data-act="lbprev" aria-label="Précédent">‹</button><span class="mono">'+(lb.i+1)+' / '+l.length+'</span><button class="btn ghost sm" data-act="lbnext" aria-label="Suivant">›</button>':'<span></span>')+
    (it.kind==='img'?'<button class="btn ghost danger sm" data-act="lbdel">Supprimer</button>':'<span class="lbl">Schéma</span>')+'</div></div></div>';
}

/* ---------- Sauvegarde par fichier ---------- */
function exportObject(){
  return {v:2,app:'carnet-muscu',exported:new Date().toISOString(),
    sessions:Object.keys(S.sessions).map(function(k){return S.sessions[k]}),
    custom:S.custom,
    imgs:Object.keys(S.imgs).map(function(k){var m=S.imgs[k];return {id:m.id,ex:m.ex,data:m.data,updated:m.updated}})};
}
function saveDone(){S.prefs.lastBackup=Date.now();lsSave();flash('Sauvegarde créée.');render()}
function downloadFile(txt,name){
  try{
    var u=URL.createObjectURL(new Blob([txt],{type:'application/json'}));
    var a=document.createElement('a'); a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){URL.revokeObjectURL(u)},5000);
    saveDone();
  }catch(e){flash('Impossible de créer le fichier sur cet appareil.')}
}
function exportFile(){
  var txt=JSON.stringify(exportObject()), name='carnet-muscu-'+todayStr()+'.json', file=null;
  try{file=new File([txt],name,{type:'application/json'})}catch(e){}
  if(file&&navigator.canShare&&navigator.canShare({files:[file]})){
    navigator.share({files:[file],title:'Sauvegarde Carnet de muscu'}).then(saveDone,function(err){
      if(!err||err.name!=='AbortError') downloadFile(txt,name);
    });
  }else downloadFile(txt,name);
}
function readBackup(file){
  if(!file) return;
  var fr=new FileReader();
  fr.onerror=function(){UI.msg='Ce fichier n’a pas pu être lu.';render()};
  fr.onload=function(){importData(String(fr.result||''))};
  fr.readAsText(file);
}
function importData(txt){
  var d;
  try{d=JSON.parse(txt)}catch(e){UI.msg='Ces données ne sont pas lisibles. Utilise un fichier de sauvegarde ou colle exactement le texte copié.';render();return}
  if(!d||!Array.isArray(d.sessions)){UI.msg='Aucune séance trouvée dans ces données.';render();return}
  var n=0, np=0;
  d.sessions.forEach(function(x){
    var c=normSession(x); if(!c) return;
    var loc=S.sessions[c.id];
    if(!loc||c.updated>=loc.updated){c.updated=Math.max(c.updated,Date.now());S.sessions[c.id]=c;n++}
  });
  if(Array.isArray(d.custom)){
    d.custom.forEach(function(c){
      if(c&&c.id&&c.n&&!S.custom.some(function(y){return y.id===c.id})) S.custom.push({id:String(c.id),n:String(c.n),p:c.p||[],s:c.s||[]});
    });
    saveLib();
  }
  if(Array.isArray(d.imgs)){
    d.imgs.forEach(function(m){
      if(!Photos.valid(m)||S.imgs[m.id]) return;
      var left=MAX_IMG-imgsFor(String(m.ex)).length; if(left<=0) return;
      Photos.add(m); saveImg(m.id); np++;
    });
  }
  lsSave(); UI.showImport=false;
  UI.msg=n+' séance'+(n>1?'s':'')+' importée'+(n>1?'s':'')+(np?' et '+np+' photo'+(np>1?'s':''):'')+'.';
  render();
}

/* ---------- Démarrage ---------- */
lsLoad();
Photos.load(function(){
  if(S.prefs.currentId&&!S.sessions[S.prefs.currentId]) S.prefs.currentId=null;
  var cs=curSession(); if(cs) UI.sub=cs.done?'mus':'ex';
  render();
});
try{if(navigator.storage&&navigator.storage.persist) navigator.storage.persist()}catch(e){}
})();
