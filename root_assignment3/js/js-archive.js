//FUNCTIONS RELATED TO VIDEOGAME DISPLAY

//Ajax call to xml data file
function listAllGames(){
    $.ajax({
        url:'data/gamecollection.xml',
        type:'GET',
        dataType:'xml',
        success : function(games){
            listAllGamesHTML(games);
        },
        fail : function(err){
            alert("Oups!!! Problem");
        }
    });
}

//lists all games on webpage
function listAllGamesHTML(gameList){
    var html = "";
    var tabGames = gameList.getElementsByTagName('game');
    var section = document.getElementById('vg-container');
    section.innerHTML = html;
    for (var i = 0; i < tabGames.length; i++){
        var aGame = tabGames[i];
        section.appendChild(listGames(aGame));
    } 
}

//displays one card of one game
function listGames(aGame){
    var year = aGame.getElementsByTagName('year')[0].firstChild.nodeValue;
    var title=aGame.getElementsByTagName('title')[0].firstChild.nodeValue;
    var tabGenre=aGame.getElementsByTagName('genre');
    var listGenre= tabGenre[0].firstChild.nodeValue;
    if(tabGenre.length > 1){
        for(var j=1; j<tabGenre.length; j++){
            listGenre += ", " + tabGenre[j].firstChild.nodeValue;
        }
    }
    var develloper = aGame.getElementsByTagName('develloper')[0].firstChild.nodeValue;
    var description = aGame.getElementsByTagName('description')[0].firstChild.nodeValue;
    var picture = aGame.getElementsByTagName('picture')[0].firstChild.nodeValue;
    
    var gameBox = document.createElement('div');
    gameBox.className = "row col-9 mx-auto m-4";
    
    var gameImgCont = document.createElement('div');
    gameImgCont.className = "col-4";
    
    var gameImg = document.createElement('img');
    gameImg.className = "img-fluid ";
    gameImg.setAttribute("src", "assets/"+picture);
    gameImg.setAttribute("alt", title + " game cover");
    
    gameImgCont.appendChild(gameImg);
    
    var cardBody = document.createElement('div');
    cardBody.className = "col-8";
    
    var gameTitle = document.createElement('h3');
//    gameTitle.className = "card-title";
    gameTitle.appendChild(document.createTextNode(title));
    
    var gameYear = document.createElement('h4');
//    gameGenre.className = "text-muted";
    gameYear.appendChild(document.createTextNode(year));
    
    var gameGenre = document.createElement('h6');
    gameGenre.className = "text-muted";
    gameGenre.appendChild(document.createTextNode(listGenre));
    
    var gameDevelloper = document.createElement('h6');
    var spanDevelloper = document.createElement('span');
    var spanSymbol = document.createElement('span');
    spanSymbol.appendChild(document.createTextNode("By "));
    spanDevelloper.appendChild(spanSymbol);
    spanDevelloper.appendChild(document.createTextNode(develloper));
    gameDevelloper.className = "text-muted";
    gameDevelloper.appendChild(spanDevelloper);
    
    
    var gameDescription = document.createElement('p');
//    gameDescription.className = "card-text";
    gameDescription.appendChild(document.createTextNode(description));
    
    var playBtn = document.createElement('button');
    playBtn.className = "btn btn-primary";
    //TODO: create function for this button
    //addCartBtn.addEventListener('click', something);
    playBtn.appendChild(document.createTextNode("Play!"));
    
    
    cardBody.appendChild(gameTitle); 
    cardBody.appendChild(gameYear);
    cardBody.appendChild(gameGenre);
    cardBody.appendChild(gameDevelloper);
    cardBody.appendChild(gameDescription);
    cardBody.appendChild(playBtn);
    
    gameBox.appendChild(gameImgCont);
    gameBox.appendChild(cardBody);
    
    gameBox.appendChild(document.createElement('hr'));
    
    return gameBox;
    
}

//SEARCH
function searchGames(queryId){
    var query = document.getElementById(queryId).value;
    $.ajax({
    url:'data/gamecollection.xml',
    type:'GET',
    dataType:'xml',
    success : function(games){
        document.getElementById('master-container').style.display = 'none';
        if(query.length > 2){
            createGameList(games,query);
        } else{
            listAllGamesHTML(games);
        }
    },
    fail : function(err){
        alert("Oups!!! Problem");
    }
   });  
}

function createGameList(gameList,query){
    var html = "";
    var tabGames = gameList.getElementsByTagName('game');
    var section = document.getElementById('vg-container');
    section.innerHTML = html;
    
    var resultTitle = document.createElement('h3');
    resultTitle.className="col-4 mx-auto";
    resultTitle.appendChild(document.createTextNode("Here are the results for \"" + query + "\"."));
    section.appendChild(resultTitle);
    
    for (var i = 0; i < tabGames.length; i++){
        var aGame = tabGames[i];
        var category = aGame.getAttribute('category');
        var gameInfo = category + ' ';
        gameInfo+=aGame.getElementsByTagName('title')[0].firstChild.nodeValue + " ";
        var tabGenre = aGame.getElementsByTagName('genre');
        gameInfo += tabGenre[0].firstChild.nodeValue;
        if(tabGenre.length > 1){
            for(var j=1; j<tabGenre.length; j++){
                gameInfo += " " + tabGenre[j].firstChild.nodeValue;
            }
        }
        gameInfo += " " + aGame.getElementsByTagName('develloper')[0].firstChild.nodeValue;
        if((gameInfo.toLowerCase().search(query.toLowerCase()))>=0){
            //alert(gameInfo);
            section.appendChild(listGames(aGame));
            
        }
    }
    
    if(section.innerHTML == 0){
        var notFound = document.createElement('h2');
        notFound.className = "section-heading";
        notFound.appendChild(document.createTextNode(
        "No games found"));
        section.appendChild(notFound);
    }
}