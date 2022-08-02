const app = require('express')();
var express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));

//Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/controller.html');
});


//Socket logic
let currentImage = 0;

const images = [
  {info: {UID: "623455665", author:"Nesquik", title:"Yoimiya después de una fiesta elegante te invita a pasar tiempo en la playa", platform:"pc", discordID: "n3s.k#4884", socialNetwork: "Twitter: @Iml1k"}, url: "https://media.discordapp.net/attachments/945509633609568286/1001028315404042382/14_sin_titulo_20220725022301.png?width=676&height=676", scores: {}},
  {info: {UID: "633127451", author:"Holly", title:"Hola viajero hace tiempo que no te veo te volveré a ver este agosto 2 para está junto ati disfruta una hermosa velada", platform:"Móvil", discordID: "holly sky#3647", socialNetwork: "Twitter: @Holly_sky_Uwu"}, url: "https://cdn.discordapp.com/attachments/945509633609568286/1001276006272864327/18_sin_titulo-01.jpeg?width=543&height=676", scores: {}},
  {info: {UID: "608839478", author:"Nocxaly625", title:"Hola Yoimiya, hace mucho tiempo que no te veo, te quiero mucho, pero nos veremos el 2 de agosto, nos veremos ahi ", platform:"PC y PS4", discordID: "Nocxaly625#5565", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1001299438159015956/StarlightDibujos.png?width=478&height=676", scores: {}},
  {info: {UID: "639747018", author:"_d a i k i_", title:"una Yoimiya sencilla,guiñando el ojo con un intento de fuegos artificiales de fondo,espero les guste. ^^", platform:"Móvil", discordID: "_d a i k i_#9894", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1001667139444408330/Picsart_22-07-26_18-41-18-856.jpg?width=588&height=676", scores: {}},
  {info: {UID: "736036740", author:"Linku", title:"Yoimiya ya cansada que no le tiren a su banner ,para tírale a otro xd", platform:"Móvil", discordID: "Linku#3067", socialNetwork: "@Linku901"}, url: "https://media.discordapp.net/attachments/945509633609568286/1001794090259714118/IMG_3149.png?width=522&height=676", scores: {}},
  {info: {UID: "622212410", author:"Esposo de Yoimiya Naganohara", title:"Deseado buff, lluvia de flechas que siguen para la Carpa Dorada", platform:"Movil", discordID: "esposo de Yoimiya#2106", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1001892922578452580/IMG_20220727_113527.jpg?width=904&height=676", scores: {}},
  {info: {UID: "619643462", author:"K.O D.B.S", title:"Espero que les guste es amano por que no ay para una tableta gráfica XD con mucho cariño y vamos por esa yoimiya", platform:"PS4", discordID: "K.O D.B.S#5288", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1002001161701818510/IMG-20220727-WA00012.jpeg?width=866&height=676", scores: {}},
  {info: {UID: "643537411", author:"✨🌸𝒸𝓁𝒶𝓇𝒶🌸✨", title:"Echo con acuarela hay esta con color y sin color ", platform:"ps5", discordID: "✨🌸𝒸𝓁𝒶𝓇𝒶🌸✨#3288", socialNetwork: ""}, url: "https://cdn.discordapp.com/attachments/945509633609568286/1002067869913329664/37_sin_titulo.png?width=507&height=676", scores: {}},
  {info: {UID: "63856578", author:"LabrutalXd7y7", title:"echo con mucho amol chispeante ✨, como lo vieja hermosa de atrás.", platform:"Móvil", discordID: "LabrutalXd7y7#1579", socialNetwork: ""}, url: "https://cdn.discordapp.com/attachments/945509633609568286/1002356413844177027/IMG_3754.jpg?width=507&height=676", scores: {}},
  {info: {UID: "633015094", author:"itsjustmira", title:"", platform:"PC ", discordID: "itsjustmira#6467", socialNetwork: "Instagram: 1tsjust_mira"}, url: "https://media.discordapp.net/attachments/945509633609568286/1002423843341733939/pewpewpew.jpg?width=467&height=676", scores: {}},
  {info: {UID: "611869604", author:"Tory", title:"Hecho con carisma y cariño tanto cariño le puse q hasta me puse el thema de Yoimiya de 1H, gracias a todos y también gracias por tomarse el tiempo de ver mi arte los quiero mucho", platform:"PC y Móvil", discordID: "Tory#2945", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1002423895992848414/IMG_20220728_224910.jpg?width=400&height=676", scores: {}},
  {info: {UID: "613262310", author:"KarvenSES", title:"Un dibujo de Yoimiya dándote un corazón y esperándote para que tires por ella. Me costo mucho trabajo este dibujo (9 días) espero que lo aprecien", platform:"PC", discordID: "KarvenSES#0053", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1002635874355392672/yoimiya_dibujo.png?width=422&height=675", scores: {}},
  {info: {UID: "624341514", author:"Elena.cherry", title:"Yoimiya en acuarella! :3 aqui mi preciosa yoimiya con unos jugosos labios listos para darselos a los que la obtengan! Espero que les guste ;3 💖", platform:"Movil", discordID: "Elena.cherry#2928", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1002696340976980038/Picsart_22-07-26_22-55-02-886.jpg?width=554&height=676", scores: {}},
  {info: {UID: "638168332", author:"notalizard", title:"Yoimiya mirando los fuegos artificiales", platform:"Móvil", discordID: "notalizard#2642", socialNetwork: "Instagram: not.lizard_drawx"}, url: "https://media.discordapp.net/attachments/945509633609568286/1002710307174613072/83_sin_titulo_20220729185238.png?width=386&height=676", scores: {}},
  {info: {UID: "600473523", author:"Chopis", title:"", platform:"PC", discordID: "Chopis#2306", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1002779995065831495/296306233_1273300673442150_3811798778027131864_n.jpg?width=940&height=676", scores: {}},
  {info: {UID: "643757147", author:"Raven_", title:"Yoimiya y tu teniendo un picnic mientrassucede un show de fuegos artificiales", platform:"PC", discordID: "Raven_#9381", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1002800302577172572/yoimiya_starlightG.jpg?width=607&height=676", scores: {}},
  {info: {UID: "625364736", author:"Sleepything🍁", title:"Me inspire hacer este dibujo de Yoimiya con fuegos artificiales por un remix hehe", platform:"PC", discordID: "Sleepything🍁#9994", socialNetwork: "@Sleepythingq"}, url: "https://media.discordapp.net/attachments/945509633609568286/1002836507939311697/yoimiya.png?width=879&height=676", scores: {}},
  {info: {UID: "608462586", author:"mochy", title:"Yoimiya 2da estrella caida. Ya tengo a mi segundo personaje de mi cómic siuuu espero que les guste", platform:"Pc, ps4", discordID: "mochy#5519", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1002878732282900570/IMG_20220730_011227.jpg?width=666&height=473", scores: {}},
  {info: {UID: "626483698", author:"carlos_ok", title:"Espero no haber llegado tarde y mi inspiración para el dibujo fue el goku con las gafas del maestro roshi", platform:"Móvil", discordID: "carlos_ok#4306", socialNetwork: ""}, url: "https://cdn.discordapp.com/attachments/945509633609568286/1002996072295186522/yoimiya_con_firma.png?width=352&height=473", scores: {}},
  {info: {UID: "639054636", author:"PanDeTama", title:"Otra noche tranquila con Yoimiya mientras apreciamos la intensa luz de los pequeños fuegos artificiales", platform:"PC", discordID: "PanDeTama#4179", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003046262397997228/100_sin_titulo_20220730152716.png?width=315&height=473", scores: {}},
  {info: {UID: "622098650", author:"Chelo", title:"Al principio el dibujo iba ser en una hoja a4 pero me terminé emocionando y termino siendo el doble de grande . Éxito en el concurso y suerte en las tiradas de la mejor waifu del genshin", platform:"PC", discordID: "Chelo#7696", socialNetwork: "@chelardo"}, url: "https://media.discordapp.net/attachments/945509633609568286/1003064825880006696/20220730_190445.jpg?width=607&height=473", scores: {}},
  {info: {UID: "600328400", author:"Mokeh", title:"Aquí el dibujo de Yoi, buena suerte a todos en sus tiradas de su banner.", platform:"PC", discordID: "Märio#8863", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003123654432927825/Yoi.jpg?width=498&height=473", scores: {}},
  {info: {UID: "629077390", author:"dennis002", title:"Yoimiya esta esperando tus protogemas tabibito!", platform:"PC y móvil", discordID: "dennis002#6187", socialNetwork: ""}, url: "https://cdn.discordapp.com/attachments/945509633609568286/1003167415217168456/IMG_20220730_194627.jpg?width=630&height=473", scores: {}},
  {info: {UID: "621578681", author:"Glo", title:"", platform:"PC", discordID: "Globito#5253", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003377174717411348/seiniya.jpg?width=355&height=473", scores: {}},
  {info: {UID: "625383865", author:"Darwin", title:"Solo quiero participar :v", platform:"Móvil", discordID: "J4¢K-o M1$T€#3272", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003391660606099506/IMG_20220731_155751_792.jpg?width=355&height=473", scores: {}},
  {info: {UID: "606302908", author:"Crissticks", title:"Suerte a todos en el concurso y los que tiraran por Yoimiya", platform:"Móvil", discordID: "Crissticks#8142", socialNetwork: "@Crissticks.exe"}, url: "https://media.discordapp.net/attachments/945509633609568286/1003448219851833384/image.png?width=473&height=473", scores: {}},
  {info: {UID: "634433329", author:"JuanJozDibujaPuej", title:"Yoimiya en Genshin Impact de PolyStation Pro", platform:"PolyStation", discordID: "JuanJozDibujaPuej#8610", socialNetwork: "Juanjoz dibuja puej"}, url: "https://media.discordapp.net/attachments/945509633609568286/1003463394453635102/Yoimiya-juanjoz-concurso01.png?width=945&height=473", scores: {}},
  {info: {UID: "725197503", author:"Fey", title:"Yoimiya divirtiéndose como siempre", platform:"PC", discordID: "Fey#7785", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003508636850593853/Screenshot_20220731-2211262.jpg?width=517&height=676", scores: {}},
  {info: {UID: "633667886", author:"frutsi", title:"Yoimiya mirando que la van a volver a skipear por los personajes de sumeru", platform:"Móvil", discordID: "frutsi#0884", socialNetwork: "@frutziy"}, url: "https://cdn.discordapp.com/attachments/1000946648874225766/1003375615455527029/10_sin_titulo_1_1.png?width=762&height=676", scores: {}},
  {info: {UID: "633127451", author:"holly sky(otra vez)", title:"no me gustó el fondo y pos apinta de rosa", platform:"Móvil", discordID: "holly sky#3647", socialNetwork: "@Holly_sky_Uwu"}, url: "https://media.discordapp.net/attachments/1000946648874225766/1003436307705495603/yoimiya_2.png?width=541&height=676", scores: {}},
  {info: {UID: "629009689", author:"Sebas-Tian", title:"", platform:"PC", discordID: "Sebas-Tian#5397", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/1000946648874225766/1003496143583453264/yoimiya.jpg?width=901&height=676", scores: {}},
  {info: {UID: "608462586", author:"mochy", title:"", platform:"PC, PS4", discordID: "mochy#5519", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003567247253586040/IMG_20220801_023623.jpg?width=513&height=676", scores: {}},
  {info: {UID: "619268251", author:"Shirostar", title:"", platform:"PC", discordID: "Shirostar#5679", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003602492350812171/LaJoymilla.jpg?width=605&height=676", scores: {}},
  {info: {UID: "648840300", author:"AlkatrazBein", title:"No creo terminarlo por que hay varios proyectos esta semana pero queda para la anécdota", platform:"Móvil", discordID: "AlkatrazBein#1524", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003696432559181874/1659235424293.jpg?width=443&height=675", scores: {}},
  {info: {UID: "722401999", author:"Sof", title:"Espero que os guste mi dibujo (en papel) de nuestra querida Yoimi", platform:"PC", discordID: "Sof#0223", socialNetwork: "@so.nu.ag"}, url: "https://media.discordapp.net/attachments/945509633609568286/1003737449463287868/IMG_20220801_203349_097.webp?width=380&height=676", scores: {}},
  {info: {UID: "644352882", author:"Suflitosdepapa", title:"Lo intenté xD", platform:"PC", discordID: "Suflitosdepapa#7674", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003755615857946714/20220801_023952.jpg?width=507&height=676", scores: {}},
  {info: {UID: "637750739", author:"✨Arrocito! UwU 🍙", title:"Yoimiya disfrutando la noche con comida y juegos, y atras mi gatita que en vida no se inmutaba bajo ningún cuete.", platform:"PC", discordID: "Arrsi#0225", socialNetwork: "@ArrsitoBlue"}, url: "https://media.discordapp.net/attachments/945509633609568286/1003786817943912478/20220801_171041.png?width=501&height=676", scores: {}},
  {info: {UID: "610339685", author:"Shirokori", title:"", platform:"PC, Móvil", discordID: "ShiroKori#3507", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003789651972214857/unknown.png?width=1028&height=676", scores: {}},
  {info: {UID: "644856415", author:"SilGon", title:"Gracias por la oportunidad, Grande Starlight", platform:"Móvil", discordID: "SilGon#1344", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003804234027905024/IMG_20220801_174409.jpg?width=507&height=676", scores: {}},
  {info: {UID: "626246755", author:"Forg", title:"Protejan su sonrisa el dia de mañana :')", platform:"PC", discordID: "Forg#2872", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003804425661448332/IMG_20220801_180959.jpg?width=694&height=676", scores: {}},
  {info: {UID: "645690805", author:"Charlie el Cerdo", title:"Dibujo hecho a las prisas pero con amor, No tengo esperanzas de ganar pero quién sabe 1% de probabilidad pero 99% de fé", platform:"Móvil", discordID: "Charlie el Cerdo#7906", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/945509633609568286/1003837629986525275/IMG-20220801-WA0017.jpg", scores: {}},
  {info: {UID: "615699604", author:"husty !", title:"algo rapido el fondo pero espero este bien :YoimiyaWink: suerte a todos", platform:"PC", discordID: "husty !#8656", socialNetwork: "@husty_002"}, url: "https://media.discordapp.net/attachments/945509633609568286/1003856843162001428/aaa.png?width=575&height=676", scores: {}},
  {info: {UID: "707501284", author:"布莱克说", title:"", platform:"PC", discordID: "布莱克说#6604", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/1000946648874225766/1003805965046530059/unknown.png?width=750&height=676", scores: {}},
  {info: {UID: "623924434", author:"xam", title:"", platform:"PX", discordID: "xam#3121", socialNetwork: ""}, url: "https://media.discordapp.net/attachments/1000946648874225766/1003897211928727602/586_sin_titulo_20220802002759.png?width=710&height=473", scores: {}}
];
//{info: {UID: "", author:"", title:"", platform:"", discordID: "", socialNetwork: ""}, url: "", scores: {}}

const profiles = [
  {id: "zhalar391232"},
  {id: "starlight213542"},
  {id: "guest1234"}
]

const imagesLenght = images.length;
io.on('connection', (socket) => {
  io.emit("changeImage", JSON.stringify({currentImage, ...images[currentImage]}));

  socket.on('message', msg => {
    console.log("llego un mensaje: ", msg);
  });

  socket.on('admin', msg => {
    // type, current
    const msgAction = JSON.parse(msg);
    changeImage(msgAction.type, msgAction.search);
    const selectedImage = JSON.stringify({currentImage, ...images[currentImage]});
    io.emit("changeImage", selectedImage);
  });

  socket.on('searchID', msg => {
    changeImageByID(parseInt(msg));
    const selectedImage = JSON.stringify({currentImage, ...images[currentImage]});
    io.emit("changeImage", selectedImage);
  });


  socket.on("disconnect", (reason) => {
    socket.disconnect();
  });

});
function changeImageByID(id){
  if((id) > 0 && ((id)<(imagesLenght - 1)) ){
    currentImage = id - 1;
  } else {
    currentImage = 0;
  }
}

function changeImage(type, search){
  if(type > 0){
    currentImage = currentImage < (imagesLenght - 1) ? (currentImage + 1) : 0;
  } else if( type < 0){
    currentImage = currentImage === 0 ? imagesLenght - 1 : currentImage - 1;
  } else if(type === 0){
    const index = images.findIndex( obj => obj.info.author.toLowerCase().includes(search.toLowerCase()) || obj.info.UID.toString().includes(search) );
    currentImage = index !== -1 ? index : 0;
  }
  
}

function getImageScore(index){

}

// Run
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});