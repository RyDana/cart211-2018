//displays one card of one game
function listGames(aGame){
    var year = aGame.getElementsByTagName('year')[0].firstChild.nodeValue;
    var title=aGame.getElementsByTagName('title')[0].firstChild.nodeValue;
    var develloper = aGame.getElementsByTagName('develloper')[0].firstChild.nodeValue;
    
    var line = document.createElement('tr');
    
    var typeCell = document.createElement('td');
    typeCell.appendChild(document.createTextNode('Game'));
    
    var nameCell = document.createElement('td');
    var nameLink = document.createElement('a');
    nameLink.setAttribute('href', '#');
    var nameCellValue = title+"_"+year+"_"+develloper;
    nameLink.appendChild(document.createTextNode(nameCellValue));
    nameCell.appendChild(nameLink);
    
    var seCell = document.createElement('td');
    seCell.appendChild(document.createTextNode(Math.floor(Math.random() * Math.floor(30))));
    
    var leCell = document.createElement('td');
    leCell.appendChild(document.createTextNode(Math.floor(Math.random() * Math.floor(50))));
    
    line.appendChild(typeCell);
    line.appendChild(nameCell);
    line.appendChild(seCell);
    line.appendChild(leCell);
    
    return line;
    
}

//SEARCH
function searchGames(queryId){
    var query = document.getElementById(queryId).value;
    $.ajax({
    url:'data/gamecollection.xml',
    type:'GET',
    dataType:'xml',
    success : function(games){
        document.getElementById('homepageSection').style.display = 'none';
        document.getElementById('resultpage').style.display = 'block';
        createGameList(games,query);
    },
    fail : function(err){
        alert("Oups!!! Problem");
    }
   });  
}

function createGameList(gameList,query){
    var html = "";
    var tabGames = gameList.getElementsByTagName('game');
    var section = document.getElementById('resultsTable');;
    section.innerHTML = html;
    
    var tableHead = document.createElement('tr');
    var typeCol = document.createElement('th');
    typeCol.appendChild(document.createTextNode('Type'));
    
    var nameCol = document.createElement('th');
    nameCol.appendChild(document.createTextNode('Name'));
    
    var seCol = document.createElement('th');
    seCol.appendChild(document.createTextNode('SE'));
    
    var leCol = document.createElement('th');
    leCol.appendChild(document.createTextNode('LE'));
    
    tableHead.appendChild(typeCol);
    tableHead.appendChild(nameCol);
    tableHead.appendChild(seCol);
    tableHead.appendChild(leCol);

    section.appendChild(tableHead);
    
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
    
//    if(section.innerHTML == 0){
//        var notFound = document.createElement('h2');
//        notFound.className = "section-heading";
//        notFound.appendChild(document.createTextNode(
//        "No games found"));
//        section.appendChild(notFound);
//    }
}