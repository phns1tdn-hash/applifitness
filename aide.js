/* Aide à l'exécution : texte « départ / mouvement / conseils » pour chaque exercice de la bibliothèque.
   Les exercices proches partagent un même texte (groupe) ; une ligne « variante » ajoute ou remplace un champ.
   Une valeur qui commence par « + » est ajoutée à la fin du texte du groupe. */
var Aide=(function(){
'use strict';
var H={};

/* G(ids, départ, mouvement, conseils) */
function G(ids,d,m,c){ids.split(' ').forEach(function(id){H[id]={d:d,m:m,c:c}})}
/* V(id, départ|null, mouvement|null, conseils|null) : variante d'un exercice déjà défini */
function V(id,d,m,c){
  var b=H[id]; if(!b) throw new Error('Aide : exercice inconnu '+id);
  function f(old,nv){return nv==null?old:(nv.charAt(0)==='+'?old+' '+nv.slice(1).trim():nv)}
  H[id]={d:f(b.d,d),m:f(b.m,m),c:f(b.c,c)};
}

/* ----- Pectoraux ----- */
G('bench smithbench closegrip benchdb',
 'Allongé sur le banc, pieds à plat au sol, omoplates serrées et poitrine sortie. Barre au-dessus de la poitrine, bras tendus, mains un peu plus larges que les épaules.',
 'Descends la barre de façon contrôlée jusqu’au bas de la poitrine, coudes à environ 45° du corps. Pousse jusqu’à tendre les bras.',
 'Fessiers et épaules restent collés au banc, poignets droits. Demande un pareur pour les charges lourdes.');
V('benchdb','Allongé, un haltère dans chaque main à hauteur de poitrine, paumes vers les pieds, omoplates serrées.','Pousse en rapprochant légèrement les haltères au-dessus de la poitrine, puis redescends lentement jusqu’à sentir l’étirement des pectoraux.','Avant-bras verticaux, poignets alignés. Pose les haltères sur les cuisses avant de t’allonger.');
V('smithbench','Banc placé sous la barre guidée, de façon qu’elle descende sur le bas de la poitrine. Décroche en tournant les poignets.',null,'La trajectoire est fixe : place bien le banc. Pense à reverrouiller la barre en fin de série.');
V('closegrip','Mains écartées d’environ la largeur des épaules (pas plus serré), coudes près du corps.','Descends vers le bas de la poitrine sans rebond, puis repousse jusqu’à tendre les bras.','Travaille surtout les triceps : garde les coudes le long du corps.');

G('incl incldb',
 'Banc incliné à 30° environ, omoplates serrées, pieds au sol. Barre au-dessus du haut de la poitrine, bras tendus.',
 'Descends vers le haut des pectoraux, coudes à environ 45°, puis pousse jusqu’à tendre les bras.',
 'Au-delà de 45° d’inclinaison, ce sont surtout les épaules qui travaillent.');
V('incldb','Banc incliné à 30° environ, un haltère dans chaque main à hauteur du haut de la poitrine, paumes vers les pieds.','Pousse en rapprochant légèrement les haltères au-dessus de la poitrine, puis redescends lentement.',null);

G('decl',
 'Allongé sur un banc décliné, jambes calées sous les appuis. Barre au-dessus du bas de la poitrine, bras tendus.',
 'Descends vers le bas des pectoraux, puis pousse jusqu’à tendre les bras.',
 'Fais-toi aider pour décrocher la barre. L’amplitude est plus courte que sur le banc plat.');

G('ecart',
 'Allongé sur le banc, haltères au-dessus de la poitrine, bras presque tendus (coudes légèrement fléchis), paumes face à face.',
 'Ouvre les bras en arc de cercle jusqu’à sentir l’étirement des pectoraux, puis ramène les haltères au-dessus de la poitrine.',
 'Coudes légèrement fléchis et fixes : c’est une ouverture, pas un développé. Charge modérée.');

G('pecdeck',
 'Assis, dos bien appuyé, bras ouverts, mains (ou avant-bras) sur les poignées à hauteur de poitrine. Règle le siège pour que les coudes soient à hauteur des épaules.',
 'Rapproche les bras devant toi en serrant les pectoraux, puis reviens lentement jusqu’à l’étirement.',
 'Épaules basses, dos plaqué. Ne laisse pas la charge retomber entre les répétitions.');

G('poulievis',
 'Debout entre deux poulies hautes, une poignée dans chaque main, buste légèrement penché, bras ouverts et coudes légèrement fléchis.',
 'Ramène les mains l’une vers l’autre devant le bas de la poitrine en arc de cercle, serre les pectoraux, puis reviens lentement.',
 'Buste stable, un pied en avant pour l’équilibre.');

G('pompes',
 'Mains au sol un peu plus larges que les épaules, bras tendus, corps gainé en ligne droite des talons à la tête.',
 'Fléchis les coudes (environ 45° du corps) jusqu’à ce que la poitrine frôle le sol, puis repousse jusqu’à tendre les bras.',
 'Ventre et fessiers serrés, bassin aligné. Trop dur : mains sur un banc. Trop facile : pieds surélevés.');

G('dipspec',
 'Suspendu aux barres parallèles, bras tendus, buste penché vers l’avant, jambes légèrement fléchies.',
 'Descends en fléchissant les coudes jusqu’à sentir l’étirement des pectoraux, puis repousse jusqu’à tendre les bras.',
 'Plus tu te penches en avant, plus les pectoraux travaillent. Pas d’à-coups.');
G('dipsbanc',
 'Mains sur un banc derrière toi, bras tendus, jambes tendues devant, fesses décollées du banc.',
 'Fléchis les coudes à environ 90° en descendant le bassin le long du banc, puis repousse jusqu’à tendre les bras.',
 'Reste proche du banc, épaules basses, coudes vers l’arrière (pas vers l’extérieur).');
G('dipsass',
 'Genoux (ou pieds) sur le support de la machine, réglé pour t’assister. Mains sur les poignées, bras tendus.',
 'Descends en fléchissant les coudes, puis repousse jusqu’à tendre les bras.',
 'Plus tu mets de poids sur la machine, plus c’est facile : baisse-le peu à peu pour progresser.');

G('chestpress chestpoign chestdecl declconv hammer',
 'Assis, dos plaqué contre le dossier, poignées à hauteur de poitrine, coudes un peu en arrière. Règle le siège pour que les poignées soient au milieu des pectoraux.',
 'Pousse les poignées vers l’avant jusqu’à tendre les bras sans verrouiller les coudes, puis reviens lentement.',
 'Épaules basses, dos collé au dossier.');
V('chestdecl','Assis, dos plaqué, poignées vers le bas de la poitrine.','Pousse vers l’avant et légèrement vers le bas jusqu’à tendre les bras, puis reviens lentement.','Cible le bas des pectoraux.');
V('declconv',null,'Pousse vers l’avant et légèrement vers le bas en rapprochant les mains en fin de mouvement, puis reviens lentement.','Cible le bas des pectoraux ; les poignées convergent.');
V('hammer',null,'Pousse chaque bras de façon régulière jusqu’à tendre les bras, les mains se rapprochent en fin de mouvement, puis reviens lentement.','Les bras travaillent indépendamment : garde les deux côtés synchronisés.');
G('chestincl',
 'Assis, dos plaqué, poignées à hauteur du haut de la poitrine.',
 'Pousse vers l’avant et légèrement vers le haut jusqu’à tendre les bras, puis reviens lentement.',
 'Cible le haut des pectoraux : n’avance pas les épaules.');

/* ----- Triceps / pousser en machine ----- */
G('tricepsmach dipspecmach dipstrimach',
 'Assis, dos plaqué, coudes près du corps, mains sur les poignées (ou le support), coudes fléchis.',
 'Tends les bras en poussant vers le bas (ou l’avant, selon la machine) sans décoller les coudes, puis reviens lentement.',
 'Seuls les avant-bras bougent. Tends complètement sans claquer les coudes.');
V('dipspecmach','Assis, buste légèrement penché vers l’avant, mains sur les poignées, coudes fléchis.',null,'Penché en avant, les pectoraux participent davantage.');
V('dipstrimach','Assis, buste droit, coudes serrés contre le corps, mains sur les poignées.',null,'Buste droit et coudes serrés : le travail se concentre sur les triceps.');

/* ----- Dos ----- */
G('traction tractionsup',
 'Suspendu à la barre, bras tendus, mains en pronation un peu plus larges que les épaules, épaules actives (omoplates vers le bas).',
 'Tire les coudes vers le bas et les côtés pour amener le menton au-dessus de la barre, puis redescends lentement bras tendus.',
 'Pas d’élan, ventre gainé. Trop dur : tractions assistées en machine.');
V('tractionsup','Suspendu à la barre, bras tendus, mains en supination (paumes vers toi), largeur d’épaules.',null,'Cette prise sollicite davantage les biceps.');

G('tractass tractsup tractsupser tractsuplarge tractproser tractprolarge',
 'Genoux (ou pieds) sur le support de la machine, réglé pour t’assister. Mains sur les poignées, bras tendus.',
 'Tire les coudes vers le bas pour amener le menton au niveau des mains, puis redescends lentement.',
 'Réduis peu à peu l’assistance pour progresser.');
V('tractass','+ Prise en pronation, un peu plus large que les épaules.',null,null);
V('tractsup','+ Prise en supination (paumes vers toi), largeur d’épaules.',null,null);
V('tractsupser','+ Prise en supination, mains rapprochées.',null,null);
V('tractsuplarge','+ Prise en supination, mains écartées au-delà des épaules.',null,null);
V('tractproser','+ Prise en pronation, mains rapprochées.',null,null);
V('tractprolarge','+ Prise en pronation, mains très écartées.',null,null);

G('tirvert tirvertneutre tirvertserre tirconv',
 'Assis, cuisses calées sous les appuis, barre (ou poignées) en main un peu plus large que les épaules, bras tendus, buste légèrement incliné en arrière.',
 'Tire la barre vers le haut de la poitrine en menant les coudes vers le bas et l’arrière, serre les omoplates, puis remonte lentement.',
 'Ne balance pas le buste. Évite de tirer derrière la nuque.');
V('tirvertneutre','+ Prise neutre (paumes face à face).',null,null);
V('tirvertserre','+ Prise serrée.',null,null);
V('tirconv','+ Poignées convergentes : les mains se rapprochent en fin de tirage.',null,null);

G('rowbar tbar',
 'Pieds largeur du bassin, genoux fléchis, buste penché à environ 45° et dos plat, barre tenue bras tendus.',
 'Tire la barre vers le bas du ventre en menant les coudes vers l’arrière, serre les omoplates, puis redescends en contrôlant.',
 'Dos plat et gainé du début à la fin, pas d’élan du buste.');
V('tbar','Pieds de part et d’autre de la barre en T, genoux fléchis, buste penché, dos plat, poignée en main bras tendus.','Tire la poignée vers le haut du ventre, serre les omoplates, puis redescends en contrôlant.',null);
G('rowdb',
 'Un genou et une main sur le banc, dos à plat, haltère tenu bras tendu sous l’épaule.',
 'Tire l’haltère vers la hanche en menant le coude vers l’arrière, puis redescends lentement. Fais toutes les répétitions d’un côté, puis de l’autre.',
 'Ne tourne pas le buste.');
G('tirhoriz',
 'Assis face à la poulie basse, pieds calés, genoux légèrement fléchis, dos droit, poignée en main bras tendus.',
 'Tire la poignée vers le bas du ventre en serrant les omoplates, puis reviens lentement bras tendus.',
 'Buste fixe, pas de balancement. Ventre gainé.');
G('rowmach rowwide',
 'Assis, poitrine contre l’appui, poignées en main, bras tendus.',
 'Tire les poignées vers toi en menant les coudes vers l’arrière, serre les omoplates, puis reviens lentement.',
 'Règle le siège pour tirer à hauteur du bas de la poitrine. Épaules basses.');
V('rowwide','+ Prise large : coudes écartés.',null,'La prise large sollicite davantage le haut du dos et l’arrière des épaules.');
G('pullover',
 'Debout face à la poulie haute, buste légèrement penché, bras presque tendus devant la tête, barre ou corde en main.',
 'Tire en arc de cercle vers les cuisses en gardant les bras presque tendus, serre les dorsaux, puis remonte lentement.',
 'Seules les épaules bougent ; coudes à peine fléchis.');

G('sdt',
 'Pieds largeur du bassin, barre au-dessus du milieu des pieds. Penche-toi, dos plat, poitrine sortie, mains à l’extérieur des jambes, bras tendus.',
 'Pousse le sol avec les jambes et redresse-toi en gardant la barre contre les jambes, jusqu’à être debout, hanches verrouillées. Redescends en contrôlant.',
 'Dos jamais arrondi. Commence léger.');
G('sdtrou',
 'Debout, barre devant les cuisses, jambes presque tendues (genoux légèrement fléchis), dos droit.',
 'Recule les hanches et fais descendre la barre le long des cuisses jusqu’à sentir l’étirement des ischios, puis reviens en poussant les hanches vers l’avant.',
 'Dos plat, barre collée aux jambes.');
G('goodmorn',
 'Debout, barre posée sur le haut du dos, pieds largeur du bassin, genoux légèrement fléchis.',
 'Penche le buste vers l’avant en reculant les hanches, dos plat, jusqu’à être presque parallèle au sol, puis redresse-toi.',
 'Charge légère, dos plat, regard vers le sol devant toi.');
G('extlomb',
 'Face au banc à 45°, hanches calées sur l’appui, chevilles bloquées, buste penché vers le bas, bras croisés sur la poitrine.',
 'Remonte le buste jusqu’à l’alignement jambes-dos en serrant les fessiers, puis redescends lentement.',
 'Ne cambre pas en haut. Mouvement fluide.');
G('extlombmach',
 'Assis, dos contre le support, bassin calé, buste légèrement penché en avant.',
 'Pousse le dossier en arrière en redressant le buste jusqu’à l’alignement, puis reviens lentement.',
 'Charge modérée, amplitude contrôlée.');
G('shrug',
 'Debout, un haltère dans chaque main, bras tendus le long du corps, épaules relâchées.',
 'Hausse les épaules vers les oreilles sans fléchir les bras, marque une pause, puis redescends lentement.',
 'Pas de rotation des épaules. Nuque neutre.');

/* ----- Épaules ----- */
G('mili',
 'Debout, pieds largeur du bassin, barre à hauteur des clavicules, coudes devant la barre, ventre et fessiers gainés.',
 'Pousse la barre verticalement au-dessus de la tête jusqu’à tendre les bras, puis redescends en contrôlant.',
 'Ne cambre pas le dos. Serre les abdominaux.');
G('devdb arnold',
 'Assis, dossier droit ou légèrement incliné, un haltère dans chaque main à hauteur des épaules.',
 'Pousse les haltères au-dessus de la tête jusqu’à tendre les bras, puis redescends lentement.',
 'Dos plaqué, ne cambre pas.');
V('arnold','Assis, haltères devant la poitrine, paumes vers le visage, coudes fléchis.','Monte en tournant les poignets (paumes vers l’avant en haut) jusqu’à tendre les bras, puis redescends en tournant dans l’autre sens.','Rotation fluide, charge modérée.');
G('devmach devconv',
 'Assis, dos plaqué, poignées à hauteur des épaules.',
 'Pousse vers le haut jusqu’à tendre les bras sans verrouiller, puis redescends lentement.',
 'Règle le siège : poignées au niveau des épaules ou un peu au-dessus.');
V('devconv',null,'Pousse vers le haut en rapprochant légèrement les mains, jusqu’à tendre les bras, puis redescends lentement.',null);

G('elatmach elatpou elatdb',
 'Debout, un haltère dans chaque main, bras le long du corps, coudes très légèrement fléchis.',
 'Lève les bras sur les côtés jusqu’à hauteur d’épaules (coude plus haut que la main), puis redescends lentement.',
 'Ne balance pas le corps. Charge légère.');
V('elatmach','Assis, coudes (ou avant-bras) contre les coussins, bras le long du corps.','Lève les coudes sur les côtés jusqu’à hauteur d’épaules, puis redescends lentement.',null);
V('elatpou','Debout de côté face à la poulie basse, poignée dans la main éloignée, bras devant la cuisse.',null,'La poulie garde la tension tout au long du mouvement.');
G('elfront',
 'Debout, haltères devant les cuisses, bras presque tendus.',
 'Lève les bras devant toi jusqu’à hauteur d’épaules, puis redescends lentement.',
 'Pas d’élan, dos droit.');
G('oisemach',
 'Assis face au dossier, poitrine contre l’appui, bras tendus devant toi, mains sur les poignées.',
 'Ouvre les bras vers l’arrière jusqu’à l’alignement des épaules, serre les omoplates, puis reviens lentement.',
 'Épaules basses, ne tire pas avec les bras.');
G('oiseau',
 'Debout, buste penché (presque parallèle au sol), dos plat, un haltère dans chaque main, bras pendants.',
 'Lève les bras sur les côtés, coudes légèrement fléchis, jusqu’à hauteur des épaules, serre les omoplates, puis redescends.',
 'Charge légère, buste fixe.');
G('facepull',
 'Poulie à hauteur du visage avec la corde, debout, bras tendus devant toi, mains sur la corde.',
 'Tire la corde vers le visage en écartant les mains de chaque côté, coudes hauts, serre les omoplates, puis reviens.',
 'Pense à « ouvrir » les bras. Garde une bonne posture.');

/* ----- Bras ----- */
G('curlbar',
 'Debout, barre en supination (mains largeur d’épaules), bras tendus le long du corps, coudes près du buste.',
 'Fléchis les coudes pour monter la barre vers les épaules sans les bouger, puis redescends lentement.',
 'Pas d’élan avec le dos.');
G('curldb curlmart',
 'Debout, un haltère dans chaque main, bras tendus le long du corps.',
 'Monte les haltères vers les épaules en gardant les coudes fixes, puis redescends lentement.',
 'Pas d’élan, poignets droits.');
V('curlmart','+ Paumes face à face (prise marteau).',null,'Cette prise sollicite aussi le brachial et l’avant-bras.');
G('curlpup',
 'Assis, bras posés sur le pupitre, barre en supination, bras presque tendus.',
 'Monte la barre vers les épaules en gardant les bras sur le pupitre, puis redescends lentement.',
 'Ne verrouille pas brutalement les coudes en bas.');
G('curlpou',
 'Debout face à la poulie basse, barre ou poignée en supination, bras tendus.',
 'Monte vers les épaules en gardant les coudes près du corps, puis redescends lentement.',
 'La poulie garde la tension constante sur le biceps.');
G('curlmach curlham',
 'Assis, bras posés sur le coussin, coudes alignés avec l’axe de la machine, poignées en main, bras presque tendus.',
 'Fléchis les coudes pour ramener les poignées vers les épaules, puis redescends lentement.',
 'Règle le siège pour que les coudes soient à hauteur de l’axe.');
V('curlham',null,null,'Les bras travaillent de façon indépendante : garde les deux côtés synchronisés.');
G('curlpoign',
 'Assis, avant-bras posés sur un banc ou les cuisses, paumes vers le haut, poignets dans le vide, haltère en main.',
 'Fléchis les poignets pour monter la main vers toi, puis redescends lentement.',
 'Charge légère, grande amplitude, avant-bras immobiles.');

G('pushdown',
 'Debout face à la poulie haute, barre ou corde en main, coudes collés au corps, avant-bras vers le haut.',
 'Tends les bras vers le bas jusqu’à ce qu’ils soient droits, serre les triceps, puis remonte lentement.',
 'Seuls les avant-bras bougent.');
G('barrefront',
 'Allongé sur un banc, barre EZ au-dessus de la poitrine, bras tendus.',
 'Fléchis les coudes pour descendre la barre vers le front, puis tends les bras pour remonter.',
 'Coudes fixes et rapprochés. Descends sans choc.');
G('extnuque',
 'Debout ou assis, un haltère tenu à deux mains au-dessus de la tête, bras tendus.',
 'Fléchis les coudes pour descendre l’haltère derrière la nuque, puis tends les bras pour remonter.',
 'Coudes rapprochés, dirigés vers le plafond.');
G('kickback',
 'Buste penché, dos plat, coude plié à 90° collé au corps, haltère en main.',
 'Tends l’avant-bras vers l’arrière jusqu’à ce que le bras soit droit, serre le triceps, puis reviens.',
 'Seul l’avant-bras bouge, coude fixe.');

/* ----- Jambes ----- */
G('squat smithsquat',
 'Barre posée sur le haut du dos, pieds largeur d’épaules, pointes légèrement vers l’extérieur, regard devant, ventre gainé.',
 'Fléchis genoux et hanches pour descendre au moins jusqu’aux cuisses parallèles au sol, puis pousse dans le sol pour remonter.',
 'Genoux dans l’axe des pieds, dos droit, talons au sol.');
V('smithsquat','+ Pieds légèrement devant la barre.',null,'La trajectoire est guidée : pense à reverrouiller la barre en fin de série.');
G('squatav',
 'Barre posée sur l’avant des épaules, coudes hauts, buste droit.',
 'Descends en gardant le buste vertical, puis remonte.',
 'Coudes hauts pour que la barre ne roule pas.');
G('hack',
 'Dos contre le dossier, épaules sous les coussins, pieds largeur d’épaules sur la plateforme, jambes presque tendues.',
 'Fléchis les genoux pour descendre jusqu’à 90° ou plus, puis pousse pour remonter sans verrouiller les genoux.',
 'Talons bien appuyés, genoux dans l’axe des pieds.');
G('presse pressehaut pressserre pressehoriz',
 'Assis, dos bien appuyé, pieds largeur d’épaules sur la plateforme, jambes presque tendues.',
 'Fléchis les genoux pour amener la plateforme vers toi jusqu’à environ 90°, puis pousse jusqu’à presque tendre les jambes.',
 'Ne décolle pas le bas du dos. Ne verrouille pas les genoux.');
V('pressehaut','+ Pieds placés haut et écartés.',null,'Cette position sollicite davantage les fessiers et les ischios.');
V('pressserre','+ Pieds placés serrés.',null,'Cette position sollicite davantage les quadriceps.');
V('pressehoriz','Assis sur la machine horizontale, dos plaqué, pieds sur la plateforme, jambes presque tendues.',null,null);
G('fentes',
 'Debout, haltères en main (facultatif), un grand pas en avant.',
 'Fléchis les deux genoux pour descendre le genou arrière près du sol, puis pousse sur le pied avant pour remonter.',
 'Genou avant au-dessus de la cheville, buste droit.');
G('bulgare',
 'Pied arrière posé sur un banc, pied avant à environ un grand pas devant, buste droit.',
 'Fléchis le genou avant jusqu’à ce que la cuisse soit parallèle au sol, puis pousse pour remonter.',
 'Poids sur le talon avant.');
G('legext',
 'Assis, dos plaqué, rouleau sur le bas des tibias, genoux à 90°.',
 'Tends les jambes jusqu’à les aligner, serre les cuisses, puis redescends lentement.',
 'Règle le dossier : les genoux sont alignés avec l’axe de la machine.');
G('legcurl lcham',
 'Allongé sur le ventre, rouleau sous les mollets, jambes tendues.',
 'Fléchis les genoux pour ramener les talons vers les fessiers, puis redescends lentement.',
 'Hanches collées au banc.');
G('legcurlass',
 'Assis, rouleau derrière les chevilles, jambes tendues, cuisses calées.',
 'Fléchis les genoux pour ramener le rouleau vers l’arrière, puis reviens lentement.',
 'Dos plaqué, pas d’élan.');
G('lcgenou',
 'À genoux sur la machine, un genou sur le coussin, l’autre jambe tendue vers l’arrière avec le coussin au-dessus du talon.',
 'Fléchis le genou pour ramener le talon vers la fesse, puis redescends lentement. Fais ensuite l’autre jambe.',
 'Hanches et buste stables.');
G('abduct',
 'Assis, dos plaqué, coussins contre l’extérieur des genoux, jambes serrées.',
 'Écarte les cuisses vers l’extérieur, marque une pause, puis reviens lentement.',
 'Pas d’élan, bassin collé au siège.');
G('adduct',
 'Assis, dos plaqué, coussins contre l’intérieur des genoux, jambes écartées.',
 'Rapproche les cuisses, marque une pause, puis reviens lentement.',
 'Pas d’élan, bassin collé au siège.');
G('abductdebout',
 'Debout face à la machine, appuyé sur les poignées, coussin contre l’extérieur de la cuisse de la jambe de travail.',
 'Écarte la jambe vers l’extérieur sans pencher le buste, marque une pause, puis reviens lentement. Fais ensuite l’autre jambe.',
 'Buste droit, jambe d’appui stable.');
G('adductdebout',
 'Debout face à la machine, appuyé sur les poignées, coussin contre l’intérieur de la cuisse de la jambe de travail.',
 'Ramène la jambe vers l’intérieur (devant l’autre jambe), marque une pause, puis reviens lentement. Fais ensuite l’autre jambe.',
 'Buste droit, jambe d’appui stable.');
G('hipthrust',
 'Haut du dos appuyé contre un banc, pieds au sol largeur du bassin, genoux fléchis, barre posée sur le bassin.',
 'Pousse sur les talons pour monter le bassin jusqu’à l’alignement épaules-genoux, serre les fessiers, puis redescends.',
 'Menton rentré, ne cambre pas en haut.');
G('hipext',
 'Debout face à la machine, appuyé sur les poignées, jambe de travail contre le coussin.',
 'Pousse la jambe vers l’arrière en serrant le fessier, puis reviens lentement. Fais ensuite l’autre jambe.',
 'Buste droit, ne cambre pas.');
G('molldeb molltsmith mollhack',
 'Debout, pointes de pied sur une cale ou une marche, talons dans le vide, jambes tendues.',
 'Monte sur la pointe des pieds le plus haut possible, marque une pause, puis redescends talons sous le niveau de la cale.',
 'Amplitude complète, jambes presque tendues.');
V('molltsmith','+ Barre de la Smith sur les épaules.',null,null);
V('mollhack','+ Épaules sous les coussins du hack squat.',null,null);
G('mollass',
 'Assis, cuisses sous les coussins, pointes de pied sur la plateforme, talons dans le vide.',
 'Monte les talons, marque une pause, puis redescends lentement jusqu’à l’étirement.',
 'Genoux fléchis : tu cibles surtout le soléaire.');
G('mollpresse mollhoriz',
 'Assis à la presse, jambes presque tendues, pointes de pied au bas de la plateforme, talons dans le vide.',
 'Pousse sur les pointes de pied pour étendre les chevilles, puis reviens lentement jusqu’à l’étirement.',
 'Ne plie pas les genoux : seules les chevilles bougent.');

/* ----- Abdominaux ----- */
G('crunch',
 'Allongé sur le dos, genoux fléchis, pieds au sol, mains près des tempes ou croisées sur la poitrine.',
 'Enroule le haut du dos pour décoller les épaules du sol, serre les abdominaux, puis redescends lentement.',
 'Ne tire pas sur la nuque. Bas du dos au sol.');
G('crunchpou',
 'À genoux face à la poulie haute, corde tenue près du visage.',
 'Enroule le buste vers le bas en rapprochant les coudes des genoux, puis reviens lentement.',
 'C’est le dos qui s’enroule, pas les bras ni les hanches.');
G('crunchmach',
 'Assis, poignées ou coussin contre la poitrine, pieds calés, dos plaqué.',
 'Enroule le buste vers l’avant en serrant les abdominaux, puis reviens lentement.',
 'Mouvement contrôlé, ne tire pas avec les bras.');
G('relevejambes',
 'Suspendu à une barre, bras tendus, jambes tendues le long du corps.',
 'Monte les jambes (ou les genoux) devant toi jusqu’à l’horizontale en basculant le bassin, puis redescends sans balancer.',
 'Contrôle la descente. Version facile : genoux fléchis.');
G('planche',
 'Avant-bras au sol, coudes sous les épaules, jambes tendues sur la pointe des pieds.',
 'Tiens la position sans bouger, corps en ligne droite de la tête aux talons, ventre et fessiers gainés.',
 'Respire normalement. Pas de creux dans le bas du dos.');
G('roue',
 'À genoux, mains sur la roue sous les épaules, dos légèrement arrondi, ventre gainé.',
 'Fais rouler la roue vers l’avant en t’allongeant le plus loin possible sans creuser le dos, puis reviens en contractant les abdominaux.',
 'Commence par une courte distance.');

function get(id){return H[id]||null}
return {get:get,has:function(id){return !!H[id]},ids:Object.keys(H)};
})();
