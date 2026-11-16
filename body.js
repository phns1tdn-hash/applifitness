/* Bonhomme écorché (face et dos), dessiné à la main en SVG.
   Chaque muscle porte l'identifiant de l'appli (pec, dos, mdos…). On ne dessine que le côté gauche
   de la figure, puis on le reflète : un seul tracé par muscle, donc une seule couleur par muscle. */
var Body=(function(){
  var W=200, H=440;
  var REST=[0x2A,0x33,0x30], HOT=[0xC8,0xF0,0x31];

  /* Silhouette de fond (côté gauche) : visible entre les muscles, comme les tendons et les os. */
  var BASE=[
    /* tête, cou */
    'M100 5 Q84 5 84 26 Q84 40 90 46 L90 62 L100 64 Z',
    /* tronc */
    'M100 62 L100 222 L68 222 Q64 200 68 172 Q70 148 62 124 Q56 100 56 82 Q72 72 90 62 Z',
    /* bras + main */
    'M60 80 Q40 84 35 106 Q30 130 34 154 Q30 182 28 208 Q25 226 29 242 Q38 247 45 234 Q50 192 56 158 Q63 132 63 112 Z',
    /* jambe + pied */
    'M68 222 Q57 252 61 290 Q57 322 61 352 Q59 382 66 410 Q63 426 62 434 L90 434 Q90 420 87 404 Q93 360 91 330 Q97 300 100 260 L100 222 Z'
  ];

  /* ---- FACE : muscles du côté gauche ---- */
  var FRONT=[
    {m:'trap', d:'M91 55 Q80 59 66 69 Q58 74 53 81 Q70 79 84 73 Q91 69 93 62 Z'},
    {m:'eav',  d:'M62 78 Q51 77 45 85 Q41 94 42 106 Q43 114 45 120 Q55 114 60 102 Q64 90 62 78 Z'},
    {m:'elat', d:'M46 84 Q38 88 35 100 Q34 112 38 123 Q41 121 45 120 Q42 112 42 106 Q41 94 46 84 Z'},
    {m:'pec',  d:'M98 80 Q84 76 68 80 Q63 92 62 104 Q61 115 68 123 Q82 133 98 130 Z'},
    {m:'abdo', d:'M89 137 Q94 135 98 136 L98 151 Q94 153 89 151 Z'},
    {m:'abdo', d:'M88 155 Q93 154 98 155 L98 171 Q93 172 88 170 Z'},
    {m:'abdo', d:'M88 175 Q93 174 98 175 L98 191 Q93 192 88 190 Z'},
    {m:'abdo', d:'M89 195 Q94 194 98 195 L98 210 Q94 215 90 210 Z'},
    {m:'abdo', d:'M68 136 Q64 152 66 174 Q69 196 77 210 L86 216 Q83 198 83 176 Q83 152 85 140 Q76 142 68 136 Z'},
    {m:'tri',  d:'M41 123 Q34 137 36 152 Q39 154 41 152 Q40 138 45 124 Z'},
    {m:'bi',   d:'M46 120 Q39 134 40 150 Q46 154 53 152 Q57 136 55 122 Q51 117 46 120 Z'},
    {m:'avb',  d:'M40 156 Q33 178 32 208 L40 211 Q47 185 54 158 Q47 152 40 156 Z'},
    {m:'quad', d:'M66 224 Q57 254 62 287 Q64 299 72 307 L80 306 Q76 269 82 228 Z'},
    {m:'quad', d:'M84 227 Q80 267 82 305 L90 305 Q95 276 94 243 Q93 232 91 226 Z'},
    {m:'add',  d:'M93 229 Q99 238 99 252 Q98 272 92 286 Q89 266 90 246 Q90 236 93 229 Z'},
    {m:'moll', d:'M65 316 Q58 350 64 392 L76 394 Q84 360 83 322 Q74 311 65 316 Z'}
  ];

  /* ---- DOS ---- */
  var BACK=[
    {m:'trap', d:'M99 53 Q88 59 72 69 Q62 75 56 82 Q64 94 78 100 Q90 110 94 124 Q97 134 99 144 Z'},
    {m:'earr', d:'M61 79 Q50 80 44 90 Q41 100 44 111 Q54 108 60 99 Q64 88 61 79 Z'},
    {m:'elat', d:'M45 88 Q37 93 35 105 Q35 117 40 125 Q43 119 44 111 Q41 100 45 88 Z'},
    {m:'mdos', d:'M58 94 Q70 98 80 104 Q92 118 96 132 Q90 139 74 139 Q62 137 58 125 Q54 109 58 94 Z'},
    {m:'dos',  d:'M62 142 Q60 158 68 180 Q77 197 99 207 L99 166 Q85 162 77 150 Q70 144 62 142 Z'},
    {m:'lomb', d:'M91 168 Q87 190 91 214 L99 216 L99 166 Z'},
    {m:'tri',  d:'M40 113 Q32 131 36 153 Q44 157 52 151 Q58 133 54 115 Q48 109 40 113 Z'},
    {m:'avb',  d:'M40 158 Q33 180 32 208 L40 211 Q47 187 54 160 Q47 154 40 158 Z'},
    {m:'fess', d:'M99 212 Q76 206 66 226 Q62 246 76 258 Q90 262 99 252 Z'},
    {m:'isch', d:'M65 262 Q61 288 67 314 L79 316 Q81 288 80 265 Z'},
    {m:'isch', d:'M82 265 Q81 291 81 316 L91 314 Q95 290 97 265 Q89 265 82 265 Z'},
    {m:'moll', d:'M65 324 Q59 348 67 374 L75 376 Q77 348 75 324 Q69 320 65 324 Z'},
    {m:'moll', d:'M77 324 Q79 348 77 376 L87 374 Q91 348 87 326 Q83 320 77 324 Z'}
  ];

  /* Traits de détail (fibres, séparations), uniquement décoratifs */
  var DETAIL_F=[
    'M96 86 Q80 92 68 100','M97 100 Q82 106 66 112','M97 114 Q82 120 68 120',
    'M67 142 Q76 158 80 190','M72 136 Q80 150 84 176',
    'M88 232 Q88 262 86 296','M73 232 Q70 262 76 296',
    'M71 322 Q72 356 74 388','M92 48 Q95 56 99 66'
  ];
  var DETAIL_B=[
    'M97 84 Q84 98 72 104','M90 112 Q86 124 82 134',
    'M70 154 Q80 172 94 192','M75 150 Q84 166 96 180',
    'M99 206 Q86 214 70 230','M86 262 L86 312','M71 326 Q72 350 71 372',
    'M82 326 Q82 350 82 372'
  ];

  function mixc(t){
    var c=[0,1,2].map(function(i){return Math.round(REST[i]+(HOT[i]-REST[i])*t)});
    return '#'+c.map(function(v){return (v<16?'0':'')+v.toString(16)}).join('');
  }
  function heat(score,max){
    if(!(score>0)||!(max>0)) return null;
    var t=Math.min(1,score/max);
    return mixc(0.3+0.7*t);
  }
  function shapes(list,scores,max,sel){
    var h='';
    list.forEach(function(s){
      var c=heat(scores[s.m],max);
      h+='<path class="bm'+(c?' hot':'')+(sel===s.m?' sel':'')+'" data-act="bmus" data-m="'+s.m+'" d="'+s.d+'" style="fill:'+(c||mixc(0))+'"/>';
    });
    return h;
  }
  function half(list,detail,scores,max,sel){
    return '<path class="bb" d="'+BASE.join(' ')+'"/>'+shapes(list,scores,max,sel)+
      '<path class="bd" d="'+detail.join(' ')+'"/>';
  }
  function view(side,scores,max,sel){
    var list=side==='f'?FRONT:BACK, det=side==='f'?DETAIL_F:DETAIL_B;
    var left=half(list,det,scores,max,sel);
    return '<svg class="body-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+(side==='f'?'Muscles, vue de face':'Muscles, vue de dos')+'">'+
      '<g>'+left+'</g><g transform="matrix(-1 0 0 1 '+W+' 0)">'+left+'</g>'+
      '<ellipse class="bb" cx="100" cy="26" rx="16" ry="21"/>'+
    '</svg>';
  }
  function maxOf(scores){var m=0;Object.keys(scores).forEach(function(k){if(scores[k]>m) m=scores[k]});return m}

  /* scores : { idMuscle: nombre } ; sel : muscle mis en avant */
  function html(scores,sel){
    var max=maxOf(scores);
    return '<div class="body-pair">'+
      '<figure class="body-fig">'+view('f',scores,max,sel)+'<figcaption>Face</figcaption></figure>'+
      '<figure class="body-fig">'+view('b',scores,max,sel)+'<figcaption>Dos</figcaption></figure>'+
    '</div>';
  }
  return {html:html,heat:heat,mix:mixc};
})();
