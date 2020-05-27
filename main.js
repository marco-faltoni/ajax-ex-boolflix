// Milestone   1: Creare un layout base con una searchbar (una   input   e   un   button) in cui   possiamo scrivere  completamente  o  parzialmente  il   nome   di   un   film.   Possiamo,   cliccando   il bottone,   cercare   sull’API   tutti   i   film   che   contengono   ciò   che   ha   scritto   l’utente. Vogliamo   dopo   la   risposta   dell’API   visualizzare   a   schermo   i   seguenti   valori   per   ogni film   trovato: 1.Titolo 2.Titolo   Originale 3.Lingua 4.Voto

$(document).ready(function() {

    // preparo le variabili per handlebars
    var template_html = $('#card-template').html();
    var template = Handlebars.compile(template_html);

    // intercetto i tasti del campo di testo
    $('#message').keyup(function(event) {
        if(event.which == 13) {
            ricerca();
        }
    });

    // // intercetto il click sul pulsante di ricerca
    // $('.btn-outline-secondary').click(function() {
    //         ricerca();
    // });

    $(".btn-outline-secondary").click(function(){
        $(".form-control").toggleClass("active").focus;
        $(this).toggleClass("animate");
        $("#message").val("");
    });


    // funzione per effettuare una ricerca
    function ricerca() {
        // recupero il testo inserito dall'utente
        var testo_utente = $('#message').val().trim();

        // controllo che l'utente abbia digitato qualcosa
        if(testo_utente.length > 1) {

            reset_risultati();

            $.ajax({
                'url': 'https://api.themoviedb.org/3/search/movie',
                'method': 'GET',
                'data': {
                    'api_key': '33f393bb2180fe0fa6a89d6419146443',
                    'query': testo_utente,
                    'language' : 'it',
                },
                'success': function(risposta) {
                    // inserisco il testo cercato dall'utente nel titolo della pagina
                    $('#ricerca-utente').text(testo_utente);
                    // visualizzo il titolo della pagina
                    $('.titolo-ricerca').addClass('visible');

                    // recupero i risultati della ricerca
                    var risultati = risposta.results;
                    console.log(risultati);
                    // ciclo su tutti i risultati
                    for (var i = 0; i < risultati.length; i++) {
                        // recupero il risultato corrente
                        var risultato_corrente = risultati[i];

                        disegno_card(risultato_corrente, 'Film', risultato_corrente.poster_path, risultato_corrente.id);
                    }

                    sfumo_riassunto()
                },
                'error': function() {
                    console.log('errore');
                }
            });

            $.ajax({
                'url': 'https://api.themoviedb.org/3/search/tv',
                'method': 'GET',
                'data': {
                    'api_key': '33f393bb2180fe0fa6a89d6419146443',
                    'query': testo_utente,
                    'language' : 'it',
                },
                'success': function(risposta) {
                    // inserisco il testo cercato dall'utente nel titolo della pagina
                    $('#ricerca-utente').text(testo_utente);
                    // visualizzo il titolo della pagina
                    $('.titolo-ricerca').addClass('visible');

                    // recupero i risultati della ricerca
                    var risultati = risposta.results;
                    console.log(risultati);
                    // ciclo su tutti i risultati
                    for (var i = 0; i < risultati.length; i++) {
                        // recupero il risultato corrente
                        var risultato_corrente = risultati[i];

                        disegno_card(risultato_corrente, 'Serie Tv', risultato_corrente.poster_path, risultato_corrente.id);
                    }

                    sfumo_riassunto()
                },
                'error': function() {
                    console.log('errore');
                }
            });

        } else {
            // l'utente ha digitato meno di 2 caratteri
            alert('devi digitare almeno 2 caratteri');
        }
    };

    // funzione per resettare la pagina e prepararla all'inserimento di nuovi risultati
    function reset_risultati() {
        // resetto l'input testuale
        $('#message').val('');
        // nascondo il titolo della pagina
        $('.titolo-ricerca').removeClass('visible');
        // svuoto il contenitore dei risultati
        $('#results').empty();
        // $('#risultati .card').remove();
        // $('#risultati').html('');
    };

    // funzione per appendere una card ai risultati
    function disegno_card(dati, tipologia, immagine, filmid) {

        // preparo i dati per il template
        var place = {
            'titolo': verifica_titolo(dati, tipologia),
            'titolo_originale': verifica_titolo_originale(dati, tipologia),
            'tipo' : tipologia,
            'lingua': bandiere(dati.original_language),
            'voto': stelle(dati.vote_average),
            'poster': images(immagine),
            'overview': overview(dati.overview),
            'id': filmid
        };
        // riempo il template di handlebars
        var html_card = template(place);
        // appendo la card con i dati del risultato corrente
        $('#results').append(html_card);
        // richiamo funzione che mi prende id e tipologia è li smista
        takeID_takeCast(tipologia, filmid);
    };

    // funzione che mi prende id e tipologia è li smista
    function takeID_takeCast(tipo, id){
        // creo variabile url che vado a riempire a secondo che abbia film o serie tv
        var url
        // console.log(tipo, id);

        // se la tipologia è film, l'url sarà composto dall'id del film
        if (tipo == 'Film') {
            url = 'https://api.themoviedb.org/3/movie/'+ id + '/credits'
        } else {
            url = 'https://api.themoviedb.org/3/tv/'+ id + '/credits'
        }

        // chiamata ajax che sarà fatta in base all'url di prima
        $.ajax({
            'url': url,
            'method': 'GET',
            'data': {
                'api_key': '33f393bb2180fe0fa6a89d6419146443',
            },
            'success': function (nomi) {
                var cast = nomi.cast;
                // console.log(cast_array);
                // richiamo la funzione che mi recupera gli attori e li stampa
                actors(cast, id);
            },
            'error': function() {
                console.log('errore nella chiamata');
            }
        });

    }

    // funzione che mi recupera gli attori e li stampa
    function actors(cast, id) {
        // creo due variabili che mi servono nel ciclo for
        var thisfilm;
        var nameactor;
        // console.log('film ' + id);

        // creo variabile con valore 5 perchè mi servono massimo 5 attori
        var num = 5;

        // imposto la condizione di partenza del ciclo; parte solo se la lunghezza del cast è minore alla variabile scritta prima
        if (cast.length < num) {
            num = cast.length
        }
        // imposto la condizione che se il cast è vuoto, appendo in pagina la scritta "non disponibile"
        if (num == 0) {
            $('.cast[data-id='+id+']').append('non disponibile');
        }

        for (var i = 0; i < num; i++) {

            thisfilm = cast[i];
            nameactor = thisfilm.name;
            // console.log(nameactor);
            // appendo ogni volta i nomi degli attori, li associo grazie all'id
            $('.cast[data-id='+id+']').children('span').append(nameactor + ', ')
        }

    }

    // funzione che mi gestisce le immagini
    function images(poster) {
        // creo var con locandina non disponibile, la ridò indietro se non c'è valore null
        var immagine = "img/netflix_null.png";
        if (poster) {
            immagine = 'https://image.tmdb.org/t/p/w342'+ poster;
        }
        return immagine
    };

    // funzione che mi gestisce i riassunti
    function overview(testo) {
        if (testo == '') {
            return 'non disponibile'
        }
        return testo

    };

    // funzione che mi gestisce le bandiere
    function bandiere(lang){
        // creo array con dentro le bandiere che possiedo
        var bandiere = ['it', 'en', 'fr', 'de', 'es', 'br'];
        // creo condizione: nel caso le bandiere che sono incluse nei dati delle bandiere, faccio return delle mie immagini
        if (bandiere.includes(lang)) {
            return '<img src="flags/'+ lang +'.png">'
        } else {
            return lang;
        }
    };

    // funzione che mi gestisce le stelle
    function stelle(numero_data) {
        // Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, e lo arrotondo in eccesso
        var voto_semplificato = Math.ceil((numero_data / 2));
        var stella = '';
        for (var i = 1; i <= 5; i++) {
            if (i <= voto_semplificato) {
                stella += "<i class='fas fa-star'></i>";
            } else {
                stella += "<i class='far fa-star'></i>";
            }
        }
        return stella
    };

    // funzione che mi verifica se il titolo è del film o della serietv
    function verifica_titolo(data, tipo) {
        var tit_card

        if (tipo == 'Film') {
            tit_card = data.title;
            return tit_card
        } else {
            tit_card = data.name;
            return tit_card
        }
    }

    // funzione che mi verifica se il titolo originale è del film o della serietv
    function verifica_titolo_originale(data, tipo) {
        var tit_or_card

        if (tipo == 'Film') {
            tit_or_card = data.original_title;
            return tit_or_card
        } else {
            tit_or_card = data.original_name;
            return tit_or_card
        }
    }

    function sfumo_riassunto() {
        // aggiungo la classe che mi permette di sfumare il riassunto del film se questo prende l'intera altezza del contenuto
        $('.overview').each(function() {
            var modHeight = 150;
            if ($(this).outerHeight() == modHeight) {
                $(this).addClass('fade-down')
            }
        });
    };

});

// function takeIDtv_takeCast(tv) {
//
//     var id,
//     id = tv
//     console.log(id);
//
//     $.ajax({
//         'url': 'https://api.themoviedb.org/3/tv/'+ id + '/credits',
//         'method': 'GET',
//         'data': {
//             'api_key': '33f393bb2180fe0fa6a89d6419146443',
//         },
//         'success': function (nomi) {
//             var cast_array = nomi.cast;
//             console.log(cast_array);
//
//         },
//         'error': function() {
//             console.log('errore nella chiamata');
//         }
//     });
// }
