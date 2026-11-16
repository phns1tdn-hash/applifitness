/* Schémas d'exercices : bonhomme de profil (cinématique inverse) + accessoires. */
var Illus=(function(){
var G=110, L={th:21,sh:21,tr:30,ua:16,fa:15,ft:7};
function rad(a){return a*Math.PI/180}
function dir(a){return [Math.sin(rad(a)),-Math.cos(rad(a))]}
function ang(v){return Math.atan2(v[0],-v[1])*180/Math.PI}
function add(p,v,l){return [p[0]+v[0]*l,p[1]+v[1]*l]}
function f(n){return Math.round(n*10)/10}
function ik(P,T,l1,l2,s){
  var dx=T[0]-P[0],dy=T[1]-P[1],d=Math.sqrt(dx*dx+dy*dy)||0.01;
  var dd=Math.min(l1+l2-0.01,Math.max(Math.abs(l1-l2)+0.5,d));
  var base=ang([dx,dy]);
  var c=(l1*l1+dd*dd-l2*l2)/(2*l1*dd); c=Math.max(-1,Math.min(1,c));
  var a1=base+s*Math.acos(c)*180/Math.PI;
  return {mid:add(P,dir(a1),l1),end:add(P,dir(base),dd)};
}
function P(h,t,hand,foot,o){o=o||{};o.h=h;o.t=t;o.hand=hand;o.foot=foot;return o}
function fk(p){
  var hip=p.h, sh=add(hip,dir(p.t),L.tr);
  if(p.sl) sh=[sh[0],sh[1]-p.sl];
  var head=add(sh,dir(p.t+(p.hd||0)),11);
  var elb,hand;
  if(p.ua!=null){elb=add(sh,dir(p.ua),L.ua);hand=add(elb,dir(p.fa),L.fa)}
  else if(p.hand){var a=ik(sh,p.hand,L.ua,L.fa,p.eb==null?1:p.eb);elb=a.mid;hand=a.end}
  else{elb=add(sh,dir(180),L.ua);hand=add(elb,dir(180),L.fa)}
  var lg=ik(hip,p.foot,L.th,L.sh,p.kb==null?-1:p.kb);
  var toe=add(lg.end,dir(p.fo==null?90:p.fo),L.ft);
  var r={hip:hip,sh:sh,head:head,mid:add(hip,dir(p.t),L.tr/2),elb:elb,hand:hand,knee:lg.mid,ank:lg.end,toe:toe};
  if(p.foot2){var l2=ik(hip,p.foot2,L.th,L.sh,p.kb2==null?-1:p.kb2);r.knee2=l2.mid;r.ank2=l2.end;r.toe2=add(l2.end,dir(p.fo2==null?90:p.fo2),L.ft)}
  return r;
}
function ln(a,b,cls,w){return '<line class="'+cls+'" x1="'+f(a[0])+'" y1="'+f(a[1])+'" x2="'+f(b[0])+'" y2="'+f(b[1])+'"'+(w?' stroke-width="'+w+'"':'')+'/>'}
function ci(c,r,cls){return '<circle class="'+cls+'" cx="'+f(c[0])+'" cy="'+f(c[1])+'" r="'+r+'"/>'}

var SEG={pec:'tu',dos:'tu',mdos:'tu',trap:'tu',eav:'sd',elat:'sd',earr:'sd',bi:'ua',tri:'ua',avb:'fa',quad:'th',isch:'th',fess:'hp',add:'th',moll:'sh',abdo:'tl',lomb:'tl'};
function segSet(ms){var o={};(ms||[]).forEach(function(m){if(SEG[m]) o[SEG[m]]=1});return o}

function body(k,h1,h2){
  var W={th:7,sh:6,tl:10,tu:10,ua:6,fa:5.5};
  var geo={
    th:[k.hip,k.knee],sh:[k.knee,k.ank],tl:[k.hip,k.mid],tu:[k.mid,k.sh],ua:[k.sh,k.elb],fa:[k.elb,k.hand]
  };
  function draw(name,cls){
    if(name==='sd') return ci(k.sh,5.5,cls+'c');
    if(name==='hp') return ci(k.hip,6,cls+'c');
    var g=geo[name]; return ln(g[0],g[1],'bd '+cls,W[name]);
  }
  var s='';
  if(k.knee2){
    s+='<g opacity=".4">'+ln(k.hip,k.knee2,'bd',7)+ln(k.knee2,k.ank2,'bd',6)+ln(k.ank2,k.toe2,'bd',4)+'</g>';
  }
  s+=ln(k.hip,k.knee,'bd',7)+ln(k.knee,k.ank,'bd',6)+ln(k.ank,k.toe,'bd',4);
  s+=ln(k.hip,k.mid,'bd',10)+ln(k.mid,k.sh,'bd',10);
  s+=ln(k.sh,k.elb,'bd',6)+ln(k.elb,k.hand,'bd',5.5);
  s+='<circle class="hd" cx="'+f(k.head[0])+'" cy="'+f(k.head[1])+'" r="6"/>';
  ['th','sh','tl','tu','ua','fa','sd','hp'].forEach(function(n){
    if(h2[n]&&!h1[n]) s+=draw(n,'h2');
  });
  ['th','sh','tl','tu','ua','fa','sd','hp'].forEach(function(n){
    if(h1[n]) s+=draw(n,'h1');
  });
  return s;
}
function gripSvg(kind,hand,cab){
  var s='';
  if(cab){s+=ln(hand,cab,'cb',1.2)+ci(cab,3,'pr2')}
  if(kind==='plate') s+=ci(hand,7.5,'pf')+ci(hand,2.2,'hub');
  else if(kind==='db') s+=ci(hand,4.8,'pf')+ci(hand,1.5,'hub');
  else if(kind==='ez') s+=ci(hand,5,'pf')+ci(hand,1.6,'hub');
  else if(kind==='rod') s+=ci(hand,3.2,'pf');
  else if(kind==='handle') s+=ln([hand[0],hand[1]-7],[hand[0],hand[1]+7],'pr',3);
  return s;
}
function scene(list){
  var s='';
  (list||[]).forEach(function(e){
    if(e[0]==='r') s+='<rect class="pf" x="'+e[1]+'" y="'+e[2]+'" width="'+e[3]+'" height="'+e[4]+'" rx="2"/>';
    else if(e[0]==='l') s+='<line class="pr" x1="'+e[1]+'" y1="'+e[2]+'" x2="'+e[3]+'" y2="'+e[4]+'" stroke-width="'+(e[5]||2.5)+'"/>';
    else if(e[0]==='c') s+=ci([e[1],e[2]],e[3],'pf');
    else if(e[0]==='o') s+=ci([e[1],e[2]],e[3],'pr2');
  });
  return s;
}

/* ---------- Vue de face (élévations latérales) ---------- */
function frontFig(p,h1,h2,g){
  var hx=80, shy=36, s='';
  var armPts=[-1,1].map(function(sg){
    var S=[hx+sg*9,shy], E=[S[0]+sg*Math.sin(rad(p.a))*L.ua,S[1]+Math.cos(rad(p.a))*L.ua];
    var Hd=[E[0]+sg*Math.sin(rad(p.b))*L.fa,E[1]+Math.cos(rad(p.b))*L.fa];
    return {S:S,E:E,H:Hd};
  });
  s+=ln([hx-3,66],[hx-5,108],'bd',7)+ln([hx+3,66],[hx+5,108],'bd',7);
  s+=ln([hx,66],[hx,38],'bd',12);
  armPts.forEach(function(a){s+=ln(a.S,a.E,'bd',6)+ln(a.E,a.H,'bd',5.5)});
  s+=ln([hx-9,shy],[hx+9,shy],'bd',6);
  s+='<circle class="hd" cx="'+hx+'" cy="24" r="6"/>';
  function over(cls,set){
    if(set.sd) armPts.forEach(function(a){s+=ci(a.S,5.5,cls+'c')});
    if(set.ua) armPts.forEach(function(a){s+=ln(a.S,a.E,'bd '+cls,6)});
    if(set.tu) s+=ln([hx,38],[hx,50],'bd '+cls,12);
  }
  over('h2',h2); over('h1',h1);
  armPts.forEach(function(a){s+=gripSvg(g,a.H,null)});
  return s;
}

/* ---------- Vue de face, assis jambes écartées (adducteurs / abducteurs) ---------- */
function frontLegs(p,h1,h2){
  var hx=80, hy=70, s='';
  s+='<rect class="pf" x="58" y="74" width="44" height="5" rx="2"/><line class="pr" x1="80" y1="79" x2="80" y2="110" stroke-width="3"/>';
  var legs=[-1,1].map(function(sg){
    var K=[hx+sg*(4+Math.sin(rad(p.a))*L.th),hy+Math.cos(rad(p.a))*L.th];
    var A=[K[0]+sg*2,K[1]+L.sh];
    return {sg:sg,H:[hx+sg*4,hy],K:K,A:A};
  });
  s+=ln([hx,70],[hx,38],'bd',12);
  s+=ln([hx-9,36],[hx+9,36],'bd',6);
  s+=ln([hx-9,36],[hx-12,58],'bd',6)+ln([hx+9,36],[hx+12,58],'bd',6);
  s+='<circle class="hd" cx="'+hx+'" cy="24" r="6"/>';
  legs.forEach(function(l){s+=ln(l.H,l.K,'bd',8)+ln(l.K,l.A,'bd',6.5)+ln(l.A,[l.A[0]+l.sg*5,l.A[1]],'bd',4)});
  function over(cls,set){
    if(set.th) legs.forEach(function(l){s+=ln(l.H,l.K,'bd '+cls,8)});
    if(set.hp) legs.forEach(function(l){s+=ci(l.H,6,cls+'c')});
  }
  over('h2',h2); over('h1',h1);
  legs.forEach(function(l){s+='<rect class="pf" x="'+f(l.K[0]+(l.sg>0?3:-9))+'" y="'+f(l.K[1]-8)+'" width="6" height="16" rx="3"/>'});
  return s;
}

/* ---------- Gabarits de mouvements ---------- */
var BF=[['r',34,86,78,5],['l',42,91,42,110,3],['l',104,91,104,110,3]];
var BI=[['r',78,88,36,4],['l',88,86,52,50,5],['l',104,92,104,110,3],['l',60,60,60,110,3]];
var BD=[['l',112,75,50,97,5],['l',100,79,100,110,3],['l',58,94,58,110,3]];
var STAND=[84,108];
var T={};
T.press_flat={sc:BF,g:'plate',A:P([104,81],270,[74,50],[124,106]),B:P([104,81],270,[88,72],[124,106])};
T.press_incl={sc:BI,g:'plate',A:P([96,82],315,[72,32],[118,106]),B:P([96,82],315,[88,52],[118,106])};
T.press_decl={sc:BD,g:'plate',A:P([106,70],250,[78,50],[124,106]),B:P([106,70],250,[92,72],[124,106])};
T.fly_flat={sc:BF,g:'db',A:P([104,81],270,[74,50],[124,106]),B:P([104,81],270,[98,85],[124,106])};
T.pecdeck={sc:[['r',68,88,30,4],['r',62,36,5,52],['l',84,92,84,110,3]],g:'handle',A:P([84,82],0,[92,50],[108,106]),B:P([84,82],0,[114,52],[108,106])};
T.cross={sc:[['l',100,2,100,12,3]],g:'rod',cab:[100,4],A:P([74,66],5,[88,38],[74,108]),B:P([74,66],5,[100,66],[74,108])};
T.pushup={sc:[],g:null,A:P([68,90],292,[40,108],[104,106],{eb:-1}),B:P([63,103],285,[40,108],[104,106],{eb:-1})};
T.dips_pec={sc:[['l',60,70,110,70,3],['l',60,70,60,110,3],['l',110,70,110,110,3]],g:null,A:P([79,67],10,[86,68],[66,100],{fo:200}),B:P([74,82],22,[86,68],[62,102],{fo:200})};
T.dips_bench={sc:[['r',14,80,44,5],['l',20,85,20,110,3],['l',52,85,52,110,3]],g:null,A:P([57,79],355,[48,79],[94,104]),B:P([57,93],355,[48,79],[100,106])};
T.pullup={sc:[['l',44,12,116,12,3.5],['l',44,12,44,110,2],['l',116,12,116,110,2]],g:null,nf:1,A:P([80,73],0,[80,13],[76,104],{}),B:P([80,64],0,[80,13],[74,100],{})};
T.pulldown={sc:[['r',70,92,38,4],['r',92,78,22,5],['l',70,6,70,2,3]],g:'rod',cab:[66,6],A:P([86,86],355,[78,24],[112,106]),B:P([86,86],355,[92,50],[112,106])};
T.pullover={sc:[],g:'rod',cab:[104,4],A:P([76,66],12,[98,24],[76,108]),B:P([76,66],12,[82,70],[76,108])};
T.row_bent={sc:[],g:'plate',A:P([58,70],55,[84,84],[66,108]),B:P([58,70],55,[90,62],[66,108])};
T.row_1arm={sc:[['r',96,80,48,5],['l',102,85,102,110,3],['l',138,85,138,110,3],['l',85,62,102,80,5]],g:'db',A:P([56,70],75,[86,93],[60,108]),B:P([56,70],75,[78,70],[60,108])};
T.row_seated={sc:[['r',58,92,40,4],['l',150,64,150,64,1]],g:'handle',cab:[150,64],A:P([70,86],15,[108,62],[112,100]),B:P([70,86],0,[84,76],[112,100])};
T.row_mach={sc:[['r',58,92,40,4],['r',96,46,5,28],['l',84,96,84,110,3]],g:'handle',A:P([70,86],15,[108,62],[112,100]),B:P([70,86],0,[88,76],[112,100])};
T.deadlift={sc:[],g:'plate',A:P([56,80],65,[84,100],[70,108]),B:P([76,66],0,[78,68],[78,108])};
T.rdl={sc:[],g:'plate',A:P([76,66],0,[78,68],[78,108]),B:P([54,68],75,[84,86],[68,108])};
T.goodmorn={sc:[],g:'plate',A:P([76,66],0,[72,38],[78,108]),B:P([54,68],75,[80,60],[68,108])};
T.shrug={sc:[],g:'db',A:P([80,66],0,null,[80,108]),B:P([80,66],0,null,[80,108],{sl:9})};
T.ohp={sc:[],g:'plate',A:P([80,66],0,[86,32],[80,108]),B:P([80,66],0,[82,8],[80,108])};
T.ohp_seat={sc:[['r',64,90,34,4],['r',58,38,5,52],['l',80,94,80,110,3]],g:'db',A:P([80,84],0,[86,54],[104,106]),B:P([80,84],0,[84,26],[104,106])};
T.ohp_mach={sc:[['r',64,90,34,4],['r',58,38,5,52],['l',80,94,80,110,3]],g:'handle',A:P([80,84],0,[86,54],[104,106]),B:P([80,84],0,[84,26],[104,106])};
T.lat_raise={view:'f',g:'db',A:{a:8,b:4},B:{a:82,b:86}};
T.front_raise={sc:[],g:'db',A:P([80,66],0,[82,66],[80,108]),B:P([80,66],0,[112,38],[80,108])};
T.reverse_fly={sc:[],g:'db',A:P([58,70],70,[84,88],[66,108]),B:P([58,70],70,[82,58],[66,108],{eb:-1})};
T.facepull={sc:[['l',140,40,140,40,1]],g:'rod',cab:[140,40],A:P([80,66],0,[110,40],[80,108]),B:P([80,66],0,[92,36],[80,108],{eb:-1})};
T.curl={sc:[],g:'ez',A:P([80,66],0,[80,66],[80,108]),B:P([80,66],0,[92,38],[80,108])};
T.curl_db={sc:[],g:'db',A:P([80,66],0,[80,66],[80,108]),B:P([80,66],0,[92,38],[80,108])};
T.curl_preach={sc:[['l',76,62,102,92,6],['r',56,90,30,4],['l',70,94,70,110,3]],g:'ez',A:P([70,84],20,null,[100,106],{ua:140,fa:140}),B:P([70,84],20,null,[100,106],{ua:140,fa:15})};
T.curl_cable={sc:[['l',140,104,140,104,1]],g:'rod',cab:[140,104],A:P([74,66],0,[80,66],[74,108]),B:P([74,66],0,[86,38],[74,108])};
T.skull={sc:BF,g:'ez',A:P([104,81],270,null,[124,106],{ua:0,fa:0}),B:P([104,81],270,null,[124,106],{ua:0,fa:215})};
T.pushdown={sc:[['l',92,2,92,2,1]],g:'rod',cab:[92,2],A:P([76,66],5,[95,40],[76,108]),B:P([76,66],5,[84,66],[76,108])};
T.tri_over={sc:[],g:'db',A:P([80,66],0,null,[80,108],{ua:0,fa:0}),B:P([80,66],0,null,[80,108],{ua:0,fa:215})};
T.kickback={sc:[],g:'db',A:P([58,70],55,null,[66,108],{ua:265,fa:180}),B:P([58,70],55,null,[66,108],{ua:265,fa:265})};
T.wrist={sc:[['r',54,90,34,4],['l',64,94,64,110,3]],g:'db',A:P([72,84],10,null,[96,106],{ua:150,fa:122}),B:P([72,84],10,null,[96,106],{ua:150,fa:55})};
T.squat={sc:[],g:'plate',A:P([80,66],0,[76,38],[80,108]),B:P([60,86],40,[76,60],[84,108])};
T.squat_front={sc:[],g:'plate',A:P([80,66],0,[88,38],[80,108],{eb:-1}),B:P([60,86],25,[88,56],[84,108],{eb:-1})};
T.hack={sc:[['l',91,106,63,29,6],['l',104,108,120,108,3]],g:null,A:P([84,66],340,[80,66],[100,108]),B:P([92,89],340,[88,90],[110,108])};
T.legpress={sc:[['l',52,96,18,62,5],['r',40,98,30,4]],scA:[['l',52,96,18,62,5],['r',40,98,30,4],['l',86,38,105,59,5]],scB:[['l',52,96,18,62,5],['r',40,98,30,4],['l',79,48,97,69,5]],g:null,A:P([56,86],315,[44,70],[92,52]),B:P([56,86],315,[44,70],[84,62])};
T.lunge={sc:[],g:'db',A:P([80,66],0,null,[102,108],{foot2:[58,106],kb2:1}),B:P([80,86],0,null,[104,108],{foot2:[54,104],kb2:1})};
T.bulgarian={sc:[['r',22,84,32,5],['l',28,89,28,110,3],['l',48,89,48,110,3]],g:'db',A:P([82,64],0,null,[100,108],{foot2:[44,82],kb2:1}),B:P([82,86],0,null,[100,108],{foot2:[44,82],kb2:1})};
T.legext={sc:[['r',52,90,32,4],['r',46,44,5,48],['l',68,94,68,110,3]],g:null,A:P([66,86],0,[74,82],[88,106]),B:P([66,86],0,[74,82],[108,86])};
T.legcurl={sc:[['r',40,86,80,5],['l',46,91,46,110,3],['l',114,91,114,110,3]],g:null,A:P([104,81],270,[66,92],[146,81]),B:P([104,81],270,[66,92],[122,56],{kb:1})};
T.hipthrust={sc:[['r',30,80,38,5],['l',36,85,36,110,3],['l',62,85,62,110,3]],g:'plate',A:P([76,98],310,[76,92],[98,106]),B:P([80,76],270,[80,70],[98,106])};
T.calf_stand={sc:[['r',58,104,52,6]],g:'db',A:P([80,60],0,null,[80,102]),B:P([80,54],0,null,[80,96],{fo:125})};
T.calf_seat={sc:[['r',54,90,30,4],['l',64,94,64,110,3],['o',91,78,6]],g:null,A:P([70,84],0,[88,76],[92,104]),B:P([70,84],0,[88,76],[92,98],{fo:125})};
T.crunch={sc:[],g:null,A:P([104,104],270,[72,100],[124,106]),B:P([104,104],300,[72,88],[124,106])};
T.leg_raise={sc:[['l',44,12,116,12,3.5],['l',44,12,44,110,2],['l',116,12,116,110,2]],g:null,nf:1,A:P([80,71],0,[80,13],[80,113]),B:P([80,71],352,[80,13],[122,72])};
T.plank={sc:[],g:null,A:P([75,98],285,null,[117,108],{ua:180,fa:90}),B:P([76,96],285,null,[118,108],{ua:180,fa:90})};
T.crunch_cable={sc:[['l',96,2,96,2,1]],g:'rod',cab:[96,2],A:P([74,83],0,[84,50],[52,106]),B:P([74,83],55,[98,72],[52,106])};
T.ab_wheel={sc:[],g:'plate',A:P([57,97],40,[88,100],[36,106]),B:P([94,100],80,[126,102],[56,106])};
T.back_ext={sc:[['l',72,74,98,74,5],['l',85,75,85,110,3],['l',44,92,56,104,3]],g:null,A:P([86,64],120,[110,78],[48,96]),B:P([86,64],50,[104,48],[48,96])};

var SEATB=[['r',66,90,34,4],['r',68,38,5,52],['l',82,94,82,110,3]];
T.chest_mach={sc:SEATB,g:'handle',A:P([80,84],0,[93,60],[104,106]),B:P([80,84],0,[111,56],[104,106])};
T.chest_incl_mach={sc:[['r',62,90,34,4],['l',74,88,58,44,5],['l',80,94,80,110,3]],g:'handle',A:P([80,84],340,[86,50],[104,106]),B:P([80,84],340,[103,30],[104,106])};
T.rear_mach={sc:[['r',58,90,34,4],['r',84,38,5,40],['l',72,94,72,110,3]],g:'handle',A:P([72,84],8,[103,56],[96,106]),B:P([72,84],8,[84,58],[96,106],{eb:-1})};
T.assist_pull={sc:[['l',44,12,116,12,3.5],['l',44,12,44,110,2],['l',116,12,116,110,2],['r',64,98,30,5]],g:null,nf:1,A:P([80,73],0,[80,13],[64,96],{kb:1,fo:180}),B:P([80,62],0,[80,13],[64,86],{kb:1,fo:180})};
T.dips_assist={sc:[['l',60,70,110,70,3],['l',60,70,60,110,3],['l',110,70,110,110,3],['r',46,104,34,5]],g:null,A:P([79,67],10,[86,68],[66,98],{fo:200,kb:1}),B:P([74,82],22,[86,68],[62,100],{fo:200,kb:1})};
T.back_mach={sc:[['r',64,90,34,4],['l',84,94,84,110,3]],scA:[['r',64,90,34,4],['l',84,94,84,110,3],['l',76,78,92,56,7]],scB:[['r',64,90,34,4],['l',84,94,84,110,3],['l',72,76,76,50,7]],g:null,A:P([82,84],38,[104,68],[104,106]),B:P([82,84],350,[96,58],[104,106])};
T.curl_mach={sc:[['l',76,62,102,92,6],['r',56,90,30,4],['l',70,94,70,110,3]],g:'handle',A:P([70,84],20,null,[100,106],{ua:140,fa:140}),B:P([70,84],20,null,[100,106],{ua:140,fa:15})};
T.tri_mach={sc:SEATB.concat([['r',84,66,16,4]]),g:'handle',A:P([80,84],0,null,[104,106],{ua:165,fa:70}),B:P([80,84],0,null,[104,106],{ua:165,fa:165})};
T.legcurl_seat={sc:T.legext.sc,scA:T.legext.sc.concat([['r',96,81,5,11]]),scB:T.legext.sc.concat([['r',83,96,11,5]]),g:null,A:T.legext.B,B:T.legext.A};
T.crunch_mach={sc:[['r',62,90,34,4],['r',65,48,5,42],['l',78,94,78,110,3]],scA:[['r',62,90,34,4],['r',65,48,5,42],['l',78,94,78,110,3],['r',94,56,5,20]],scB:[['r',62,90,34,4],['r',65,48,5,42],['l',78,94,78,110,3],['r',103,66,5,20]],g:'handle',A:P([76,84],358,[92,52],[102,106]),B:P([76,84],32,[100,72],[102,106])};
T.adduct={view:'fl',g:null,A:{a:40},B:{a:9}};
T.abduct={view:'fl',g:null,A:{a:9},B:{a:40}};
T.row_wide={sc:[['r',58,92,40,4],['r',96,46,5,28],['l',84,96,84,110,3]],g:'handle',A:P([70,86],15,[110,54],[112,100]),B:P([70,86],0,[88,56],[112,100],{eb:-1})};
T.calf_press={sc:T.legpress.sc.concat([['l',86,38,105,59,5]]),g:null,A:P([56,86],315,[44,70],[90,54],{fo:30}),B:P([56,86],315,[44,70],[90,54],{fo:95})};
T.hip_ext={sc:[['r',102,34,12,76],['r',90,60,14,6],['l',84,108,120,108,3]],g:null,A:P([86,62],0,[104,58],[86,104],{foot2:[86,104]}),B:P([86,62],4,[104,58],[62,92],{foot2:[86,104]})};
var RAIL1=[['l',90,6,90,110,2]], RAIL2=[['l',90,6,90,72,2]];

var MAP={
 bench:'press_flat',benchdb:['press_flat',{g:'db'}],incl:'press_incl',incldb:['press_incl',{g:'db'}],decl:'press_decl',
 ecart:'fly_flat',pecdeck:'pecdeck',poulievis:'cross',pompes:'pushup',dipspec:'dips_pec',
 traction:'pullup',tractionsup:'pullup',tirvert:'pulldown',rowbar:'row_bent',rowdb:'row_1arm',tirhoriz:'row_seated',rowmach:'row_mach',tbar:'row_bent',
 pullover:'pullover',sdt:'deadlift',shrug:'shrug',
 mili:'ohp',devdb:'ohp_seat',devmach:'ohp_mach',arnold:'ohp_seat',elatdb:'lat_raise',elatpou:'lat_raise',elfront:'front_raise',oiseau:'reverse_fly',facepull:'facepull',
 curlbar:'curl',curldb:'curl_db',curlmart:'curl_db',curlpup:'curl_preach',curlpou:'curl_cable',
 barrefront:'skull',pushdown:'pushdown',extnuque:'tri_over',dipsbanc:'dips_bench',closegrip:'press_flat',kickback:'kickback',curlpoign:'wrist',
 squat:'squat',squatav:'squat_front',hack:'hack',presse:'legpress',fentes:'lunge',bulgare:'bulgarian',legext:'legext',legcurl:'legcurl',
 sdtrou:'rdl',hipthrust:'hipthrust',goodmorn:'goodmorn',molldeb:'calf_stand',mollass:'calf_seat',
 chestpress:'chest_mach',chestincl:'chest_incl_mach',elatmach:['lat_raise',{g:'handle'}],oisemach:'rear_mach',tractass:'assist_pull',dipsass:'dips_assist',tirvertneutre:['pulldown',{g:'handle'}],rowwide:'row_wide',extlombmach:'back_mach',curlmach:'curl_mach',tricepsmach:'tri_mach',legcurlass:'legcurl_seat',adduct:'adduct',abduct:'abduct',crunchmach:'crunch_mach',smithsquat:['squat',{sc:RAIL1}],smithbench:['press_flat',{sc:BF.concat(RAIL2),A:P([104,81],270,[80,50],[124,106]),B:P([104,81],270,[80,72],[124,106])}],
 chestpoign:'chest_mach',chestdecl:'chest_mach',declconv:'chest_mach',hammer:'chest_mach',
 dipspecmach:'tri_mach',dipstrimach:'tri_mach',devconv:'ohp_mach',
 tirvertserre:['pulldown',{g:'handle'}],tirconv:'pulldown',tractsup:'assist_pull',tractsupser:'assist_pull',tractsuplarge:'assist_pull',tractproser:'assist_pull',tractprolarge:'assist_pull',
 molltsmith:['calf_stand',{sc:RAIL1.concat([['r',58,104,52,6]]),g:null}],mollhack:'calf_stand',mollpresse:'calf_press',mollhoriz:'calf_press',
 pressehaut:'legpress',pressserre:'legpress',pressehoriz:'legpress',
 lcham:'legcurl',
 hipext:'hip_ext',curlham:'curl_mach',
 crunch:'crunch',relevejambes:'leg_raise',planche:'plank',crunchpou:'crunch_cable',roue:'ab_wheel',extlomb:'back_ext'
};

function tplOf(id){
  var m=MAP[id]; if(!m) return null;
  var name=typeof m==='string'?m:m[0], o=typeof m==='string'?null:m[1];
  var t=T[name]; if(!t) return null;
  if(!o) return t;
  var c={}; for(var k in t) c[k]=t[k]; for(var k2 in o) c[k2]=o[k2]; return c;
}
function panel(t,which,ex){
  var p=t[which], h1=segSet(ex.p), h2=segSet(ex.s), s='';
  s+='<rect class="bg" x="2" y="2" width="156" height="116" rx="10"/>';
  if(!t.nf) s+='<line class="fl" x1="8" y1="110" x2="152" y2="110"/>';
  if(t.view==='f') return s+frontFig(p,h1,h2,t.g);
  if(t.view==='fl') return s+frontLegs(p,h1,h2);
  s+=scene(t['sc'+which]||t.sc);
  var k=fk(p);
  s+=body(k,h1,h2);
  if(t.g||t.cab) s+=gripSvg(t.g,k.hand,t.cab);
  return s;
}
/* Retourne le SVG complet : deux panneaux (départ, arrivée) ou un seul si single='A'|'B'. */
function pref(s){return s.replace(/class="([^"]+)"/g,function(m,c){return 'class="'+c.split(' ').map(function(x){return 'f-'+x}).join(' ')+'"'})}
function svg(ex,single){
  var t=tplOf(ex.id); if(!t) return '';
  var cls='fg';
  if(single) return pref('<svg class="'+cls+'" viewBox="0 0 160 120" aria-hidden="true">'+panel(t,single,ex)+'</svg>');
  return pref('<svg class="'+cls+'" viewBox="0 0 330 132" role="img" aria-label="Schéma de l’exercice : position de départ puis position d’arrivée">'+
    '<g>'+panel(t,'A',ex)+'</g>'+
    '<g transform="translate(170,0)">'+panel(t,'B',ex)+'</g>'+
    '<text class="lb" x="80" y="128" text-anchor="middle">Départ</text><text class="lb" x="250" y="128" text-anchor="middle">Arrivée</text>'+
    '<path class="ar" d="M158 62h14m-5 -5l5 5l-5 5" />'+
  '</svg>');
}
function has(id){return !!MAP[id]}
return {svg:svg,has:has,ids:Object.keys(MAP)};
})();
