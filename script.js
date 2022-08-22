let numero_cartas_viradas = 0;
//let carta_anterior;
let x_jogadas = 0;

let cartas_abertas = 0;
var tempo_jogo  = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Esta função pode ficar separada do código acima, onde você preferir
function comparador() { 
	return Math.random() - 0.5; 
}

let numero_cards;
let jogo = 0; // mede quantas vezes joguei

function before_play(){
    if(jogo >= 1){
        let resposta ="resposta";
        while(resposta == null || (resposta != "sim" && resposta != "não" )){
            resposta =  prompt("Quer jogar novamente?\nResponda 'sim' ou 'não'");
        }
        
        if(resposta == "não"){ 
            //coloca um botao com opcao para começar
            let botao = `<li><button class="comecar" onclick="start();">COMEÇAR</button></li>`;
            document.querySelector("ul").innerHTML = botao;  
            jogo = 0;
            return 0;
        }
    }

    numero_cards = prompt("digite um numero par");

    while((numero_cards%2 != 0) || (numero_cards=="")||numero_cards<4||numero_cards>14){
        numero_cards = prompt("digite um numero par de 4 a 14");
    }
    
    document.querySelector("ul").innerHTML = "";  //tira o botão
    
    return 1;//comeca o jogo

}



function start(){
    let comeca = before_play();
    if(comeca == '0'){
        return 0; //para o jogo
    }

    numero_cartas_viradas = 0;

    //cria array e embaralha
    let array_img_indices = [];
    for(let i = 0; i < numero_cards;i++){
        array_img_indices.push(i+1);
    }
    //alert(array_img_indices);

    //embaralha
    array_img_indices.sort(comparador); // Após esta linha, a minhaArray estará embaralhada
    //alert(array_img_indices);

    let img_name = "";
    let card_id = 0;
    //crio minhas cartas com duas imagens sendo que a back está escondida
    for(let i = 0; i < numero_cards;i++){
        img_name = `mem (${array_img_indices[i]}).gif`;
        card_id = array_img_indices[i];
        let card = `<li><div class="card" id="${card_id}" onclick="turn(this)"><img src="./img/front.png" alt=""><img class ="escondido" src="./img/${img_name}" alt=""></div></li>`;
        
        document.querySelector("ul").innerHTML += card;  
    }

  
    
    //resetando tempo timer
    tempo_jogo = 0;
    //reseto o timer
    sec = 0;
    min = 0;
    hrs = 0;
    //chamo o timer
    timer();
}


//compara se as cartas são iguais
function is_equal_card(id_primeira, id_segunda){
    let num_id_primeira = Number(id_primeira);
    let num_id_segunda = Number(id_segunda);
    
    //se id_primeira é ímpar a carta igual é a id_primeira + 1
    if(num_id_primeira %2 != 0){//é ímpar
        return(num_id_segunda === num_id_primeira+1);
    }else{//se id_primeira é par a carta igual é a id_primeira - 1
        return(num_id_segunda=== num_id_primeira-1);
    }
}

//async pra rodar await sleep(xseg)
async function turn(carta){

    if(cartas_abertas == 2){
        //await sleep(1000);
        return 0;
    }
        
    //front da carta clicada
    const carta_front = carta.children[0];   
    //back da carta clicada
    const carta_back = carta.children[1];   

    let id_primeira;
    let card_antigo = document.querySelector(".ativo");
    let card_antigo_front, card_antigo_back;

    if(card_antigo != null){
        id_primeira = card_antigo.id ;
       // console.log("card_antigo existe com id: "+id_primeira);

        //front and back do card_antigo    
        card_antigo_front = card_antigo.children[0];
        card_antigo_back =  card_antigo.children[1];

    }else{
        //console.log("card_antigo não existe!");
    }
    //console.log(card_antigo);


    //é a 1º carta?
    if(card_antigo == null){
        //carta_anterior = carta;
        //console.log("É a primeira carta!");
         //coloca ativo
        carta.classList.add("ativo");

        //mostra back = esconder o front -  (posso por fora do if-else)
        carta_front.classList.add("escondido");
        carta_back.classList.remove("escondido");

    }else{//2º carta
        //console.log("É a segunda carta!");
        cartas_abertas = 2;//pra n dar bug com await

        let id_segunda = carta.id;
        //console.log("id_segunda: "+ id_segunda);

        //busca ativo >> car_ativo
        //mostra back da 2º carta = esconde front  -  (posso por fora do if-else)
        carta_front.classList.add("escondido");
        carta_back.classList.remove("escondido");
        

        console.log("Esse é o id da segunda "+id_segunda);
        console.log("Esse é o id da primeira"+id_primeira);
        console.log("___________________");


        //compara id da segunda carta com a primeira(ativo)
        let igual = is_equal_card(id_primeira, id_segunda);

        
        


        if(!igual){//cartas diferentes
            //wait 1s só se for diferente
            await sleep(1000);

            carta_front.classList.remove("escondido");
            carta_back.classList.add("escondido");
            //  card_antigo.classList.remove("escondido");
            //virar primeira carta pra baixo
            card_antigo_front.classList.remove("escondido");
            card_antigo_back.classList.add("escondido");
            x_jogadas +=2;

            cartas_abertas = 0;
        }else{//cartas iguais
            //soma 2 no numero de cartas viradas
            await sleep(500);
            x_jogadas +=2;

            //coloco classe "acertadas" nas cartas viradas
            card_antigo.classList.add("acertada");
            carta.classList.add("acertada");

            cartas_abertas = 0;
            
            //numero_cartas_viradas += 2;
        }
        
        numero_cartas_viradas = document.querySelectorAll(".acertada").length;
        console.log("numero cartas viradas: " + numero_cartas_viradas);
        console.log("___________________");

        if(numero_cartas_viradas == numero_cards){
            alert(`parabéns,Você ganhou em ${x_jogadas} jogadas!\n Tempo: ${tempo_jogo}`);
            //pega todas imagens
            let lista_imgs = document.querySelectorAll(".card img");
            //pega todosos cards
            let lista_cards = document.querySelectorAll(".card");
            //console.log(lista_cards);
            for(let i = 0; i< lista_imgs.length;i++){
                //dê um toggle em escondido
                //colocando escondido na imagem que tão amostra(os backs - gifs)
                //tirando escondido dos front's 
                lista_imgs[i].classList.toggle("escondido");
        
                //caso seja a segunda rodada
                numero_cartas_viradas = 0; //reinicia novamente
                x_jogadas = 0;//reinicia o numero de jogadas      

                reset_timer();//reset html timer
                clear_time();//reset timer on function? 
            }

            for(let i = 0; i < lista_cards.length;i++){
                lista_cards[i].classList.remove("acertada");//reseto com tudo sem acerto
            }

            //remove all cards
            document.querySelector("ul").innerHTML = "";
            
            jogo++; //soma 1 no número de jogos
            //start
            start();
            
        }
        //remove ativo do card_antigo, aquele que eu virei primeiro
        card_antigo.classList.remove("ativo");

    }
   
    //posso por id na img front 
    

}

/*********************************************/
/* timer*/

let h1 = document.querySelector('.timer h1');
/*var start = document.getElementById('strt');
var stop = document.getElementById('stp');
var reset = document.getElementById('rst');*/
let sec = 0;
let min = 0;
let hrs = 0;
let t;


function tick(){
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
            min = 0;
            hrs++;
        }
    }
}
function add() {
    tick();
    h1.textContent =  (min > 9 ? min : "0" + min)
       		 + ":" + (sec > 9 ? sec : "0" + sec);

    tempo_jogo = h1.innerHTML;
    
    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}

function clear_time() {
    clearTimeout(t);
}


//timer();
/*
start.onclick = timer;
stop.onclick = function() {
    clearTimeout(t);
}*/
function reset_timer() {
    //h1.textContent = "00:00";
    h1.innerHTML = "<time><h1>00:00</h1></time>";
    //alert("entra");
    seconds = 0; minutes = 0; hours = 0;
}


/********************************************** */

function darkMode(){
    if(document.querySelector(".black") == null){
        document.querySelector("body").classList.toggle("black");
        document.querySelector(".interruptor").innerHTML = "Light";
    }else{
        document.querySelector("body").classList.toggle("black");
        document.querySelector(".interruptor").innerHTML = "Dark";
    }
}   

start();

//final

