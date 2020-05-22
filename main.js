

$(document).ready(function() {


    $().click(function(){

        $.ajax({
            'url':'https://api.themoviedb.org/3/search/movie',
            'method': 'GET',
            'data' : {
                'api_key': '33f393bb2180fe0fa6a89d6419146443';
                // 'query': ' ci sarà il valore input dell'utente '
            }
            'success': function(dati){
                
            },
            'error': function() {
                alert('si è verificato un errore');
            },
        });


    });



});
