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
                },
                'success': function(risposta) {
                    // inserisco il testo cercato dall'utente nel titolo della pagina
                    $('#ricerca-utente').text(testo_utente);
                    // visualizzo il titolo della pagina
                    $('.titolo-ricerca').addClass('visible');

                    // recupero i risultati della ricerca
                    var risultati = risposta.results;
                    // ciclo su tutti i risultati
                    for (var i = 0; i < risultati.length; i++) {
                        // recupero il risultato corrente
                        var risultato_corrente = risultati[i];
                        disegno_card(risultato_corrente);
                    }
                },
                'error': function() {
                    console.log('errore');
                }
            });
        } else {
            // l'utente ha digitato meno di 2 caratteri
            alert('devi digitare almeno 2 caratteri');
        }
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
    }

    // funzione per appendere una card ai risultati
    function disegno_card(dati) {
        var voto_arrotondato = Math.ceil((dati.vote_average / 2));
        for (var i = 0; i < 5; i++) {

        }

        // preparo i dati per il template
        var placeholder = {
            'titolo': dati.title,
            'titolo_originale': dati.original_title,
            'lingua': dati.original_language,
            'voto': dati.vote_average,
        };
        var html_card = template(placeholder);
        // appendo la card con i dati del risultato corrente
        $('#results').append(html_card);
    }


});

// Milestone 2
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
// permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
// lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze
// piene (o mezze vuote :P)
