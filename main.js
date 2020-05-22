

$(document).ready(function() {


    $('.btn-outline-secondary').click(function(){

        var testo_utente = $('#message').val();
        var recupero_ris;



        $.ajax({
            'url':'https://api.themoviedb.org/3/search/movie',
            'method': 'GET',
            'data' : {
                'api_key': '33f393bb2180fe0fa6a89d6419146443',
                'query': testo_utente
            },
            'success': function(dati){
                recupero_ris = dati.results;
                console.log(recupero_ris);

                for (var i = 0; i < recupero_ris.length; i++) {

                    var risultati = {};
                    risultati.titolo = recupero_ris[i].title;
                    risultati.titolo_originale = recupero_ris[i].original_title;
                    risultati.lingua = recupero_ris[i].original_language;
                    risultati.voto = recupero_ris[i].vote_average;
                    console.log(risultati);

                    if (risultati.titolo_originale == risultati.titolo) {
                        $('.ris').append('<p>'+ risultati.titolo +'</p>', '<p>'+ risultati.lingua +'</p>', '<p>'+ risultati.voto +'</p>');
                    } else {
                        $('.ris').append('<p>'+ risultati.titolo +'</p>', '<p>'+ risultati.titolo_originale +'</p>', '<p>'+ risultati.lingua +'</p>', '<p>'+ risultati.voto +'</p>');
                    }

                }

            },
            'error': function() {
                alert('Scrivi qualcosa e riprova')
            },
        });


    });






});
