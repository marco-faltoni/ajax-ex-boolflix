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

    // intercetto il click sul pulsante di ricerca
    $('.btn-outline-secondary').click(function() {
            ricerca();
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

                        disegno_card(risultato_corrente, 'Film', risultato_corrente.poster_path);

                        takeIDfilm_takeCast(risultato_corrente.id);
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

                        disegno_card(risultato_corrente, 'Serie Tv', risultato_corrente.poster_path);

                        takeIDtv_takeCast(risultato_corrente.id);
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

    function takeIDfilm_takeCast(film){
        var id,
        id = film
        console.log(id);

        $.ajax({
            'url': 'https://api.themoviedb.org/3/movie/'+ id + '/credits',
            'method': 'GET',
            'data': {
                'api_key': '33f393bb2180fe0fa6a89d6419146443',
            },
            'success': function (nomi) {
                var cast_array = nomi.cast;
                console.log(risultati);
                // ciclo su tutti i risultati
                actor(cast_array);

            },
            'error': function() {
                console.log('errore nella chiamata');
            }
        });

    }

    function actor(cast) {

        var actors =[]
        var thisfilm;
        var nameactor;

        for (var i = 0; i < cast.length; i++) {
            // recupero il risultato corrente
            thisfilm = cast[i];
            nameactor = thisfilm.name;
            actors.push(nameactor);
        }

        return actors
    }

    function takeIDtv_takeCast(tv) {

        var id,
        id = tv
        console.log(id);

        $.ajax({
            'url': 'https://api.themoviedb.org/3/tv/'+ id + '/credits',
            'method': 'GET',
            'data': {
                'api_key': '33f393bb2180fe0fa6a89d6419146443',
            },
            'success': function (nomi) {
                var cast_array = nomi.cast;
                console.log(risultati);

            },
            'error': function() {
                console.log('errore nella chiamata');
            }
        });
    }

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
    function disegno_card(dati, tipologia, immagine) {

        // preparo i dati per il template
        var place = {
            'titolo': verifica_film(dati, tipologia),
            'titolo_originale': verifica_serie(dati, tipologia),
            'tipo' : tipologia,
            'lingua': bandiere(dati.original_language),
            'voto': stelle(dati.vote_average),
            'poster': images(immagine),
            'overview': overview(dati.overview),
            // 'cast':
        };
        // riempo il template di handlebars
        var html_card = template(place);

        // appendo la card con i dati del risultato corrente
        $('#results').append(html_card);
    };

    function sfumo_riassunto() {
        // aggiungo la classe che mi permette di sfumare il riassunto del film se questo prende l'intera altezza del contenuto
        $('.overview').each(function() {
            var modHeight = 180;
            if ($(this).outerHeight() == modHeight) {
                $(this).addClass('fade-down')
            }
        });
    };

    function images(poster) {
        var immagine = "img/netflix_null.png";
        if (poster) {
            immagine = 'https://image.tmdb.org/t/p/w342'+ poster;
        }
        return immagine
    };

    function overview(testo) {
        if (testo == '') {
            return 'Non disponibile'
        }
        return testo

    };

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

    function verifica_film(data, tipo) {
        var tit_card

        if (tipo == 'Film') {
            tit_card = data.title;
            return tit_card
        } else {
            tit_card = data.name;
            return tit_card
        }
    }

    function verifica_serie(data, tipo) {
        var tit_or_card

        if (tipo == 'Film') {
            tit_or_card = data.original_title;
            return tit_or_card
        } else {
            tit_or_card = data.original_name;
            return tit_or_card
        }
    }

});
