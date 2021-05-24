// Mes clés API
let key = "a7aff493ec37b8b1f59fc261d6c71bdd";
let secret = "2908c5d5fe2e5608";



// Déclencher la recherche en appuyant sur ENTREE
$("#champ_recherche").keydown(function (e) {
    console.log(e, e.originalEvent.keyCode);

    if (e.originalEvent.keyCode == 13) {
        console.log("réussi");

        // affiche dans la console le nbr de phots désirées (boutons radio)
        console.log($('input[name=nombre]:checked').val());

        //affiche dans la console le terme de la recherche
        console.log($(this).val());

        //vider le contenu de la page (supprimer les images de l'ancienne recherche)
        $(".galerie").empty();

        //let element = $(".galerie *");
       // if(element.length>0) {
       //     $(".galerie").empty();
       // }

        //Recherche la photo
        //Paramètre 1: terme de la recherche , Paramètre 2 : nbr de photos demandées
        chercherPhoto($(this).val(), $('input[name=nombre]:checked').val());
    }
})




// Aller chercher les photos (récupération du JSON)
function chercherPhoto(term, nbrImg) {

    let urlSerach = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=a7aff493ec37b8b1f59fc261d6c71bdd&text=" + term + "&per_page=" + nbrImg + "&page=1&format=json&nojsoncallback=1";

    jQuery.getJSON(urlSerach, {
            format: "json"
        })
        .done(function (data) {

            console.log(data.photos.photo);

            // Parcourir toutes les photos

            $.each(data.photos.photo, function (indice, item) {

                console.log("indice", indice, "item", item);

                //Affichage pour récupérer l'Id et le secret d'une des photos et générer le lien exemple pour la fonction getInfo via l'API flickr
                //console.log("id" , item.id , "secret" , item.secret);


                //On appel createVignette et on lui passe l'objet item comme paramètre
                createVignette(item);

                

            });
            //écouteur de click sur les images
            $('img').on('click', function() {
                console.log($(this));
                console.log($(this).attr("src"));
                grandeVignette($(this).attr("src"));
            });
            
        })
}


// Aller récupérer les infos correspondantes à la photo que l'on passe à cette fonction (via l'ID Photo)
function getInfo(photoId, p) {

    let urlInfo = "https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=a7aff493ec37b8b1f59fc261d6c71bdd&photo_id=" + photoId + "&format=json&nojsoncallback=1";
    $.getJSON(urlInfo, {
            format: "json"
        })
        .done(function (data) {
            console.log("infos", data.photo.description);
            //insertion de la description dans le paragraphe prévu, on coupe la description si elle est trop longue
            p.text(parseDescription(data.photo.description._content));
        });
}





//Intégrer les images dans la page HTML

function createVignette(item) {

    let urlPhoto = "https://farm" + item.farm + ".staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg";
    console.log(urlPhoto);

    let div = $('<div>').appendTo($("#galerie"));
    let img = $('<img>').appendTo(div).attr("src", urlPhoto);

    //insertion du titre (on le coupe si il est trop long)
    $('<h2>').appendTo(div).text( parseDescription(item.title, 5));
    let p = $('<p>').appendTo(div).text("Description");

    //Appel de la fonction getInfo, et passage de l'id de la photo
    getInfo(item.id, p);
}




//fonction pour compter les mots d'une chaine de caractères & couper une chaine.
function parseDescription(d, nbSpace = 10) {
    //si la chaine est vide, on renvoie qu'il n'y a pas de contenu
    if (d.length === 0) return "Pas de description";
    
    //compteur d'espaces
    let ind = 0;
    //parcourir la chaine de caractères
    for (let i = 0; i < d.length; i++) {
        //quand on rencontre un espace (charCode 32), on incrémente le compteur
        if (d.charCodeAt(i) === 32) {
            ind++;
            // si le compteur d'espaces dépasse le nbr d'espaces autorisés par la fonction (10 par défaut), on retourne la chaîne tronquée
            if (ind >= nbSpace) {
                console.log(d.substring(0, i) + "...");
                return d.substring(0, i) + "..."; 
            }
        }
    }
    //si la chaîne est trop petite on la renvoie en entier
    return d;
}



//Lightbox
    //Ouverture 
function grandeVignette(urlPhoto) {
    console.log(urlPhoto);
    let div2 =$("<div>").attr("id", "div2").appendTo($("#lightbox"));
    $('<img>').appendTo(div2).attr("src", urlPhoto);
    //CSS pour faire apparaître la light box
    $('.croix').css("display","block");
    $('#lightbox').css("display", "block");
    $('#lightbox').css("background-color", "rgba(0,0,0,0.8");
    $('body').css("overflow", "hidden");
}

//Fermeture 
function fermerGrandeVignette() {
    $('#lightbox').css("display","none");
    $('body').css("overflow", "visible");
    $('#div2').remove();
}

//fermer la lightbox quand on clique sur la croix
$('.croix').on('click',function() {
    fermerGrandeVignette();
});
