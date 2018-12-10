//boolean showing progress of account creation
var accountCreated;

var subscriptionChosen;

var subscriptionPayed;

//saving account information
var account = {"name":"",
               "familyName":"",
               "address":"",
               "email":"",
               "telephone":"",
               "subscription":0,
               "centsAccumulated":0
                };

//fonction initialisant "accountCreated" a faux
function onLoad(){
    accountCreated = false; 
    subscriptionChosen = false;
    subscriptionPayed = false;
}

//PROFILE FUNCTIONS

//modal used for profile creation rendered visible
function showCreateAccount(){
    $("#newAccountModal").modal();
}

//shows different modals depending on state of the account
function showAccount(){
    if(accountCreated && subscriptionChosen && subscriptionPayed){
        var name = document.getElementById("currentAccountName");
        var famName = document.getElementById("currentAccountFamName");
        var address = document.getElementById("currentAccountAddress");
        var email = document.getElementById("currentAccountEmail");
        var telephone = document.getElementById("currentAccountTelephone");

        name.innerHTML = account['name'];
        famName.innerHTML = account['familyName'];
        address.innerHTML = account['address'];
        email.innerHTML = account['email'];
        telephone.innerHTML = account['telephone'];

        $("#currentAccountModal").modal();
     
    }else if(accountCreated && subscriptionChosen){
        showCookieClicker();
    }else if(accountCreated){
        $("#chooseSubscriptionModal").modal();
    }
    else {
        showCreateAccount();
    }

}

//deletes profile
function disconnectAccount(){

    account['name'] = "";
    account['familyName'] = "";
    account['address'] = "";
    account['email'] = "";
    account['telephone'] = "";
    
    accountCreated = false;
    subscriptionChosen=false;
    subscriptionPayed=false;
    
    document.getElementById('signUpTop').innerHTML = "Sign up";
    document.getElementById('pricing-container').style.display = 'block';
    document.getElementById('header-container').style.display = 'block';
    document.getElementById('features-container').style.display = 'block';
    document.getElementById('pricingMenu').style.display = 'block';
    document.getElementById('featuresMenu').style.display = 'block';
    document.getElementById('vg-container').innerHTML = "";

    
    $("#currentAccountModal").modal('hide');
    
    document.getElementById("createAccountBtn").style.visibility = 'visible';
}

//creates profile
function submitAccount(){
    
    var name = document.getElementById("name").value; 
    var famName= document.getElementById("fname").value;
    var address= document.getElementById("address").value;
    var email= document.getElementById("email").value;
    var telephone= document.getElementById("telephone").value;
    
    var nameReg = /^[a-zA-Z ]+$/;
    var addressReg = /^[0-9]+ [a-zA-Z]+[,?] ?[a-zA-Z]+$/;
    var emailReg = /\S+@\S+\.\S+/;
    var telephoneReg = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    
    
    if(nameReg.test(name)  &&
       nameReg.test(famName) &&
       addressReg.test(address) &&
       emailReg.test(email) &&
       telephoneReg.test(telephone)){
        account['name'] = name;
        account['familyName'] = famName;
        account['address'] = address;
        account['email'] = email;
        account['telephone'] = telephone;
        
        accountCreated = true;
        
        document.getElementById('signUpTop').innerHTML = "Subscribe";
        
        $("#newAccountModal").modal('hide');
        $("#chooseSubscriptionModal").modal();
        
        document.getElementById("sign-up").style.visibility = 'hidden';
        
    } else{
        alert("Values are incorrectly written. Please verify.");
    } 
}

//sets the chosen subscription
function chooseSubscription(subscription){
    account['subscription'] = parseInt(subscription);
    var divSubsChosen = document.getElementById(subscription);
    var divSubs = divSubsChosen.parentElement.children;
    for (var i = 0; i < divSubs.length; i++) {
        divSubs[i].style.backgroundColor = "white";
        divSubs[i].style.color = "darkGrey";
    }
    
    document.getElementById(subscription).style.backgroundColor = "#E60012";
    document.getElementById(subscription).style.color = "white";
    
    
    
}

//renders cookie clicker modal visible
function showCookieClicker(){
    subscriptionChosen = true;
    document.getElementById('signUpTop').innerHTML = "Pay";
    document.getElementById("centsAccumulated").innerHTML = account["centsAccumulated"];
    document.getElementById("centsRemaining").innerHTML = account["subscription"] - account["centsAccumulated"];
    $("#cookieClickerModal").modal();
}

//handles cookie clicks for payment
function cookieClicker(){
    account['centsAccumulated']++;
    document.getElementById("centsAccumulated").innerHTML = account["centsAccumulated"];
    
    var centsRemaining = account["subscription"] - account['centsAccumulated']
    document.getElementById("centsRemaining").innerHTML = centsRemaining;
    
    if(centsRemaining === 0){
        $("#cookieClickerModal").modal('hide');
        $("#chooseSubscriptionModal").modal('hide');
        subscriptionPayed = true;
        document.getElementById('signUpTop').innerHTML = "My Account";
        document.getElementById('pricing-container').style.display = 'none';
        document.getElementById('pricingMenu').style.display = 'none';
        document.getElementById('featuresMenu').style.display = 'none';
    }
    
}

//FUNCTIONS RELATED TO VIDEOGAME DISPLAY

//Ajax call to xml data file
function listAllGames(){
    if(accountCreated && subscriptionChosen && subscriptionPayed){
        $.ajax({
            url:'data/gamecollection.xml',
            type:'GET',
            dataType:'xml',
            success : function(games){
                //document.getElementById("categoryHeader").innerHTML = "All";
                listAllGamesHTML(games);
                //listCategoryBooksHTML(livres, "art");
            },
            fail : function(err){
                alert("Oups!!! Problem");
            }
        });
    
    }else if(accountCreated && subscriptionChosen){
        showCookieClicker();
    }else if(accountCreated){
        $("#chooseSubscriptionModal").modal();
    }
    else {
        showCreateAccount();
    }
}

//lists all games on webpage
function listAllGamesHTML(gameList){
    var html = "";
    var tabGames = gameList.getElementsByTagName('game');
    var section = document.getElementById('vg-container');
    section.innerHTML = html;
    for (var i = 0; i < tabGames.length; i++){
        var category = tabGames[i].getAttribute('category');
        if (category == 'snes'||
           category == 'nes' ||
           category == 'gameboy-color'){
            var aGame = tabGames[i];
            section.appendChild(listGames(aGame));
        }
    } 
}

//displays one card of one game
function listGames(aGame){
    document.getElementById('header-container').style.display = 'none';
    document.getElementById('features-container').style.display = 'none';
    
    
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
    gameBox.className = "col-lg-3 col-md-6 mb-4";
    
    var gameCard = document.createElement('div');
    gameCard.className = "card";
    
    var gameImg = document.createElement('img');
    gameImg.className = "card-img-top";
    gameImg.setAttribute("src", "assets/"+picture);
    gameImg.setAttribute("alt", title + " game cover");
    
    var cardBody = document.createElement('div');
    cardBody.className = "card-body";
    
    var gameTitle = document.createElement('h5');
    gameTitle.className = "card-title";
    gameTitle.appendChild(document.createTextNode(title));
    
    var gameGenre = document.createElement('h6');
    gameGenre.className = "text-muted";
    gameGenre.appendChild(document.createTextNode(listGenre));
    
    var gameDevelloper = document.createElement('h5');
    var spanDevelloper = document.createElement('span');
    var spanSymbol = document.createElement('span');
    spanSymbol.appendChild(document.createTextNode("By "));
    spanDevelloper.appendChild(spanSymbol);
    spanDevelloper.appendChild(document.createTextNode(develloper));
    gameDevelloper.appendChild(spanDevelloper);
    
//    var bookDescription = document.createElement('p');
//    bookDescription.className = "card-text";
//    bookDescription.appendChild(document.createTextNode(description));
    
    
    cardBody.appendChild(gameTitle);
    
//    if(parseInt(year) == 2018){
//        var newSpan = document.createElement('span');
//        newSpan.className = "badge badge-success";
//        newSpan.appendChild(document.createTextNode('New'));
//        cardBody.appendChild(newSpan);
//    }
    
    cardBody.appendChild(gameGenre);
    cardBody.appendChild(gameDevelloper);
//    cardBody.appendChild(bookDescription);
    
    var cardFoot = document.createElement('div');
    cardFoot.className = "card-footer";
    
    var addCartBtn = document.createElement('button');
    addCartBtn.className = "btn btn-danger";
    //TODO: create function for this button
    //addCartBtn.addEventListener('click', addBookToCart);
    addCartBtn.appendChild(document.createTextNode("Play!"));
    
    cardFoot.appendChild(addCartBtn);
    
    gameCard.appendChild(gameImg);
    gameCard.appendChild(cardBody);
    gameCard.appendChild(cardFoot);
    
    gameBox.appendChild(gameCard);
    
    return gameBox;
    
}

//SEARCH
function searchGames(){
    var query = document.getElementById('query').value;
    //alert(query + " " + query.length);
    if(accountCreated && subscriptionChosen && subscriptionPayed){
        $.ajax({
        url:'data/gamecollection.xml',
        type:'GET',
        dataType:'xml',
        success : function(games){
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
    }else if(accountCreated && subscriptionChosen){
        showCookieClicker();
    }else if(accountCreated){
        $("#chooseSubscriptionModal").modal();
    }
    else {
        showCreateAccount();
    }
}

function createGameList(gameList,query){
    var html = "";
    var tabGames = gameList.getElementsByTagName('game');
    var section = document.getElementById('vg-container');
    section.innerHTML = html;
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
        if (category == 'snes'||
           category == 'nes' ||
           category == 'gameboy-color'){
            if((gameInfo.toLowerCase().search(query.toLowerCase()))>=0){
                //alert(gameInfo);
                section.appendChild(listGames(aGame));
            }
            
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

function goHome(){
    document.getElementById('header-container').style.display = 'block';
    document.getElementById('features-container').style.display = 'block';
    document.getElementById('vg-container').innerHTML = "";
}

