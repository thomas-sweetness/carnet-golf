// Parcours intégrés : pars, index, distances, fiches et coordonnées.
window.BUILTIN_COURSES = {
    barbaroux: {
      name: "Golf de Barbaroux",
      short: "Barbaroux",
      tees: [{ id: "j", label: "Jaunes", hcp: 16 }, { id: "b", label: "Blancs", hcp: 20 }],
      hcpNote: "16 jaunes / 20 blancs (index 13.6)",
      holes: [
        {p:4,i:7,j:315,b:358,danger:"Long bunker en bordure droite du fairway, plan d'eau à droite.",plan:"Bois 3 centre-gauche, reste ~120 m.",club:"Bois 3 → fer 9"},
        {p:4,i:9,j:308,b:326,danger:"Montée vers le green, arbres des deux côtés, bunker à gauche du green.",plan:"Bois 3 au centre, reste ~110 m en montée : un club de plus.",club:"Bois 3 → fer 9"},
        {p:5,i:11,j:407,b:463,danger:"Départ dégagé, fairway qui monte puis redescend vers le green, chemin à droite. Green en haricot, bunker profond à droite, talus derrière.",plan:"En trois coups, ne jamais rater à droite.",club:"Driver → fer 7 → 60°"},
        {p:3,i:17,j:134,b:139,danger:"Green perché sur une crête, ça tombe de tous les côtés.",plan:"Centre du green, pas le drapeau.",club:"Fer 8 (fer 7 vent de face)"},
        {p:5,i:1,j:468,b:499,danger:"Drive en montée, sortie en partie aveugle, creux à gauche du fairway. Muret de pierres et chute à gauche du green.",plan:"Trou le plus dur. Trois coups, approche à droite du drapeau.",club:"Driver → fer 5 → 56° (~70 m)"},
        {p:4,i:3,j:343,b:403,danger:"Long, pins à droite.",plan:"Driver centre-gauche. Le bogey est un bon score.",club:"Driver → fer 9 (~120 m)"},
        {p:4,i:13,j:249,b:267,danger:"Départ surélevé sur une crête : à droite ça tombe dans un ravin boisé. Bunker sur la gauche du fairway, buttes à droite du green.",plan:"Pas de driver, centre-gauche, jamais à droite. Occasion de birdie.",club:"Fer 5 → 56° plein (~75 m)"},
        {p:3,i:15,j:148,b:158,danger:"Par 3 en montée dans un couloir de pins. Bunker devant à gauche, bunker derrière à droite.",plan:"Un club de plus, ça monte. Centre du green.",club:"Fer 6"},
        {p:4,i:5,j:363,b:386,danger:"Départ dans un couloir d'arbres, fairway qui descend puis remonte, talus à droite le long du chemin. Gros bunker profond devant à gauche du green surélevé.",plan:"Approche en montée vers la moitié droite du green : un club de plus.",club:"Driver → fer 6 (~145 m en montée)"},
        {p:4,i:12,j:293,b:319,danger:"Eau le long du fairway à gauche, bois à droite.",plan:"Droite du fairway, loin de l'eau.",club:"Fer 5 → PW / fer 9 (~115 m)"},
        {p:4,i:16,j:259,b:285,danger:"Départ surélevé, le lac longe tout le côté droit du fairway jusqu'au green. Pas de carry forcé.",plan:"Côté gauche du fairway, approche loin de l'eau.",club:"Fer 6 → PW (~100 m)"},
        {p:5,i:4,j:467,b:497,danger:"Bois à gauche, fossé sec sur la gauche du fairway en approchant du green.",plan:"Lay-up centre-droit, approche loin du fossé.",club:"Driver → fer 7 → wedge"},
        {p:4,i:8,j:381,b:399,danger:"Pins et chemin à gauche, green surélevé.",plan:"Fairway large. Bogey acceptable.",club:"Driver → fer 6 (fer 5 si ça monte)"},
        {p:4,i:14,j:255,b:290,danger:"Bunkers en série sur la droite, bunker à gauche du green.",plan:"Centre-gauche du fairway.",club:"Fer 6 → PW (~95 m)"},
        {p:3,i:18,j:131,b:167,danger:"Grand bunker sur toute la largeur devant le green, bunker profond à droite, bunker à gauche. Court = sable.",plan:"Plutôt long que court. Centre du green.",club:"Fer 8 plein"},
        {p:4,i:6,j:348,b:383,danger:"Eau tout le long à gauche jusqu'au green, murets de pierre.",plan:"Tout à droite : départ et approche.",club:"Driver → fer 9 (~130 m)"},
        {p:5,i:2,j:484,b:521,danger:"Petit plan d'eau à passer devant le départ, fossé d'eau à droite au début, plan d'eau à gauche dans la zone du 2e coup. Eau à droite et derrière le green, bunker devant à gauche.",plan:"Toujours à gauche du drapeau, jamais long.",club:"Driver → fer 5 → wedge (~90 m)"},
        {p:3,i:10,j:173,b:193,danger:"Départ dégagé en légère descente, arbres à gauche. Bunkers à gauche et à droite du green.",plan:"Court au centre vaut mieux qu'un bunker.",club:"Fer 5"}
      ]
    },
    merignies: {
      name: "Golf de Mérignies",
      short: "Mérignies",
      tees: [{ id: "std", label: "Habituels", hcp: 14 }],
      hcpNote: "≈ 14 en 18 trous avec l'index 13.6 (blancs Valutte + Rupilly) · ≈ 7 en 9 trous",
      defaultLoops: ["valutte", "rupilly"],
      // Index de trou par association de boucles (cartes de score du club)
      pairIndex: {
        "rupilly|valutte": { valutte: [17,7,13,11,5,1,15,9,3], rupilly: [2,4,18,14,12,6,8,10,16] },
        "rupilly|vdm": { vdm: [15,9,13,11,7,5,3,17,1], rupilly: [2,4,18,14,12,6,8,10,16] },
        "valutte|vdm": { valutte: [12,10,8,14,6,2,16,18,4], vdm: [15,9,13,11,7,5,3,17,1] }
      },
      loops: {
        valutte: { name: "La Valutte", holes: [
            {p:4,r:9,g:{tee:[50.511687,3.141576],c:[50.513923,3.143415],f:[50.513818,3.143371],b:[50.514028,3.143459],est:1}},
            {p:3,r:4,g:{tee:[50.514290,3.144271],c:[50.515431,3.145263],f:[50.515336,3.145180],b:[50.515525,3.145345],est:1}},
            {p:5,r:7,g:{tee:[50.515320,3.147044],c:[50.516563,3.141862],f:[50.516543,3.142028],b:[50.516583,3.141695],est:1}},
            {p:3,r:6,g:{tee:[50.516658,3.143471],c:[50.517121,3.141848],f:[50.517077,3.142003],b:[50.517165,3.141693],est:1}},
            {p:4,r:3,g:{tee:[50.517569,3.141739],c:[50.516200,3.146202],f:[50.516242,3.146045],b:[50.516158,3.146358],est:1}},
            {p:4,r:1,g:{tee:[50.515449,3.147132],c:[50.513399,3.152304],f:[50.513466,3.152170],b:[50.513332,3.152437],est:1}},
            {p:4,r:8,g:{tee:[50.513050,3.152435],c:[50.514602,3.148696],f:[50.514524,3.148815],b:[50.514679,3.148577],est:1}},
            {p:3,r:5,g:{tee:[50.513851,3.148782],c:[50.514900,3.147639],f:[50.514811,3.147736],b:[50.514989,3.147542],est:1}},
            {p:4,r:2,g:{tee:[50.515279,3.145807],c:[50.512507,3.143479],f:[50.512588,3.143592],b:[50.512426,3.143366],est:1}}
          ] },
        rupilly: { name: "Rupilly", holes: [
            {p:4,r:1,g:{tee:[50.508854,3.142232],c:[50.505171,3.142232],f:[50.505276,3.142192],b:[50.505065,3.142272],est:1}},
            {p:3,r:2,g:{tee:[50.504311,3.142334],c:[50.504875,3.144528],f:[50.504835,3.144371],b:[50.504916,3.144685],est:1}},
            {p:5,r:9,g:{tee:[50.505091,3.144963],c:[50.506934,3.150850],f:[50.506878,3.150705],b:[50.506991,3.150995],est:1}},
            {p:3,r:7,g:{tee:[50.506696,3.151502],c:[50.505845,3.149377],f:[50.505902,3.149521],b:[50.505787,3.149234],est:1}},
            {p:5,r:6,g:{tee:[50.505560,3.149058],c:[50.503857,3.142600],f:[50.503905,3.142752],b:[50.503809,3.142447],est:1}},
            {p:4,r:3,g:{tee:[50.503579,3.142221],c:[50.505652,3.138222],f:[50.505605,3.138375],b:[50.505699,3.138069],est:1}},
            {p:4,r:4,g:{tee:[50.505655,3.137157],c:[50.507634,3.140261],f:[50.507535,3.140192],b:[50.507733,3.140329],est:1}},
            {p:4,r:5,g:{tee:[50.507723,3.141060],c:[50.504686,3.141757],f:[50.504777,3.141666],b:[50.504595,3.141849],est:1}},
            {p:5,r:8,g:{tee:[50.505111,3.142986],c:[50.509278,3.143350],f:[50.509171,3.143323],b:[50.509385,3.143378],est:1}}
          ] },
        vdm: { name: "Val de Marque", holes: [
            {p:4,r:8,g:{tee:[50.511753,3.139330],c:[50.513788,3.136232],f:[50.513703,3.136337],b:[50.513873,3.136127],est:1}},
            {p:5,r:5,g:{tee:[50.513667,3.137334],c:[50.517445,3.133893],f:[50.517342,3.133948],b:[50.517548,3.133838],est:1}},
            {p:4,r:7,g:{tee:[50.517842,3.130809],c:[50.515327,3.129296],f:[50.515372,3.129450],b:[50.515281,3.129142],est:1}},
            {p:5,r:6,g:{tee:[50.515755,3.128813],c:[50.514368,3.122998],f:[50.514385,3.123165],b:[50.514351,3.122830],est:1}},
            {p:3,r:4,g:{tee:[50.514387,3.122394],c:[50.512946,3.122995],f:[50.513050,3.122951],b:[50.512841,3.123039],est:1}},
            {p:5,r:3,g:{tee:[50.512709,3.125221],c:[50.513720,3.132134],f:[50.513713,3.131964],b:[50.513727,3.132303],est:1}},
            {p:3,r:2,g:{tee:[50.513427,3.132984],c:[50.512744,3.130792],f:[50.512792,3.130945],b:[50.512697,3.130640],est:1}},
            {p:4,r:9,g:{tee:[50.512048,3.131594],c:[50.509911,3.134923],f:[50.509988,3.134803],b:[50.509834,3.135043],est:1}},
            {p:4,r:1,g:{tee:[50.511122,3.136398],c:[50.509623,3.141505],f:[50.509633,3.141336],b:[50.509612,3.141674],est:1}}
          ] }
      }
    },
    vertparc: {
      name: "Golf du Vert Parc",
      short: "Vert Parc",
      tees: [{ id: "j", label: "Jaunes", hcp: 15 }],
      hcpNote: "≈ 15 avec l'index 13.6 (jaunes, slope 132, SSS 70.2)",
      center: [50.57015, 2.83700],
      holes: [
        {p:5,i:8,j:483},
        {p:3,i:18,j:124},
        {p:5,i:5,j:389},
        {p:4,i:11,j:306},
        {p:3,i:7,j:192},
        {p:5,i:14,j:398},
        {p:3,i:17,j:153},
        {p:4,i:6,j:348},
        {p:5,i:16,j:443},
        {p:3,i:10,j:182},
        {p:4,i:2,j:339},
        {p:5,i:15,j:411},
        {p:4,i:3,j:344},
        {p:4,i:12,j:304},
        {p:3,i:13,j:160},
        {p:4,i:1,j:383},
        {p:3,i:4,j:168},
        {p:4,i:9,j:296}
      ]
    }
  };
