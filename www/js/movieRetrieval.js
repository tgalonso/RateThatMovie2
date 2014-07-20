
$(document).ready(function() {
//declaring necessary global variables
$.support.cors = true; //setting jquery variable to allow cross-domain calls
var director;
var movieTitle; //just added this shit
var checkPoint = 0;
var actors = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; //2D array holds 5 w/ 4 actors
var genre = [];
var movie_ids = [];
var choice = 0;
var title = [];
var totalMovies;
var RT;
var radio_group1, radio_group2, radio_group3;
                  
    //here we get the movie title.
    $('#search-mini').keyup(function(event) {
        movieTitle = $(this).val(); //getting movie title, one letter at a time.
    });
    //clearing the results page.
    function clearVars() {
            for(var index=0; index<5; index++) {
                  $('#pic'+index).attr("src", "");
                  $('#title'+index).html("");
                  $('#year'+index).html("");
                  //actors = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; //clearing out results for actors
                  choice = 0;                
            }
    }
    //performs ajax call and displays info on results page.
    $('#go').click(function() {
            clearVars();
            if($('#search-mini').val() == "") {
                   $(this).attr("href", "#wrong-way");
            }
            else {
                   $(this).attr("href", "#results");
            }
            movieTitle = encodeURI(movieTitle);
            //console.log("Click was registered");
            //figure out a way to check the size of the movies array an populate list accordingly.
            $.ajax({
                   url:'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=cq8unxj24dtamwv2fwjwqdmq&q='+movieTitle+'&page_limit=5',
                   dataType: 'jsonp',
                   async: 'false',
                   success: function(JSONObject) {
                   //populating results list & storing actors in a 2D array.
                   console.log("total number of movies is " +JSONObject.total);
                   
                   if(JSONObject.total > 5) {
                        totalMovies = 5;
                   }
                   else {
                        totalMovies = Number(JSONObject.total);
                        console.log(totalMovies);
                   }
                   for(var i=0; i < totalMovies; i++) {
                        movie_ids[i]=JSONObject.movies[i].id;
                        console.log(movie_ids[i]);
                        title[i] = JSONObject.movies[i].title;
                        $('#pic'+i).attr("src", JSONObject.movies[i].posters.profile);
                        $('#title'+i).html(JSONObject.movies[i].title);
                        $('#year'+i).html(JSONObject.movies[i].year);
                        for(var j=0; j<4; j++) {
                            //populate actors array[0-5] with movie[0-5].abridged_cast[0-4] names
                            actors[i][j] = JSONObject.movies[i].abridged_cast[j].name;
                        }
                   }
                   
                }
            });
                
    });
    
    //handles the different potential choices
    $('.result').click(function() {
        var $id = $(this).prop("id");
        switch($id) {
            case 'movie0Link':
                choice = 0;
                break;
            case 'movie1Link':
                choice = 1;
                break;
            case 'movie2Link':
                choice = 2;
                break;
            case 'movie3Link':
                choice = 3;
                break;
            case 'movie4Link':
                choice = 4;
                break;
        }
    });
    /** I need to be able to disabe the links for the movies that aren't populated by the list!
     preferrably
     1) get total as a global variable (the one in the ajax call)
     2) disable the links (using that one jquery call..) total -> 5
     3) no need to clear those values (total -> 5) since they will be replaced with a new search
     **/
     
    /**
     So this function below is gonna be an important one. I need it to perform
     another ajax call to get the director and genres.
     */
    $('#hacktor').click(function() {
        //do ajax call to the specific movie json file.
        //retrieve the director names and the genres.
        //display those to the screen in
        $.ajax({
            url:'http://api.rottentomatoes.com/api/public/v1.0/movies/'+movie_ids[choice]+'.json?apikey=cq8unxj24dtamwv2fwjwqdmq',
            dataType: 'jsonp',
            async: 'false',
            success: function(JSONObject2) {
               //this should be a lot of shit, all you need is the genre's and director
               RT = Number(JSONObject2.ratings.critics_score);
               genre[0] = JSONObject2.genres[0];
               console.log("Do you watch "+ genre[0]);
               genre[1] = JSONObject2.genres[1];
               console.log("Do you watch "+ genre[1]);
               director = JSONObject2.abridged_directors[0].name;
            }
        });
        //here you should append shit to the container
        /*var actor_sliders = '<div class="ui-field-contain"> <p id="label0"></p><input type="range" id="slider-mini1" value="0" min="-10" max="10" data-highlight="true" /> </a> </div> <div class="ui-field-contain"> <p id="label1"></p> <input type="range" name="slider-mini" id="slider-mini2" value="0" min="-10" max="10" data-highlight="true" /> </div> <div class="ui-field-contain"> <p id="label2"></p> <input type="range" name="slider-mini" id="slider-mini3" value="0" min="-10" max="10" data-highlight="true" /> </div> <div class="ui-field-contain"> <p id="label3"></p> <input type="range"  name="slider-mini" id="slider-mini4" value="0" min="-10" max="10" data-highlight="true" /> </div></div><!-- end of container -->';
        $('#slider_stuff1').html(actor_sliders);*/
        
        //print actors' names.
        for(var k=0; k<4;k++) {
            $('#label'+k).html(actors[choice][k]);
        }
        
    });
    $('#to_genre_director').click(function() {
        $('#genre_title0').html(genre[0]);
        $('#genre_title1').html(genre[1]);
        $('#director').html(director);
            
    });
    $('#score_page').click(function() {
        calculate();
    });
    //represent column and name
    var col, button;
    //this does the mutual excusivity for buttons
    $("input[type=radio]").click(function() {
        button = $(this);
        col = button.data("col");
        //here we check to see if a button at that column is already checked. If so, make it unchecked.
        $("input[data-col=\"" + col + "\"]").prop("checked", false);
        
        button.prop("checked", true);
        //jQuery Mobile radiobuttons need this line to reflect changes done after clicks.
        $("input[type='radio']").checkboxradio("refresh");
        setRatings();
                                 
    });
    
    function setRatings( ) {
        //here, you keep track of the values that are inputted.
        radio_group1 = $("input[name=radio-group]:checked"); //actors row
        radio_group2 = $("input[name=radio-group2]:checked");//director row
        radio_group3 = $("input[name=radio-group3]:checked");//genre row
                  
        var actor_check = false;
        var director_check = false;
        var genre_check = false;
        //if the row for actors is checked at all
        if(radio_group1.prop("checked")) {
            actor_check = true;
        }
        else {
            actor_check = false;
        }
                
        if(radio_group2.prop("checked")) {
            director_check = true;
        }
        else {
            director_check = false;
        }
                  
        if(radio_group3.prop("checked")) {
            genre_check = true;
        }
        else {
            genre_check = false;
        }
                               
        if(actor_check && director_check && genre_check) {
            $('#hacktor').prop("href", "#actor0");
            console.log("actors are "+radio_group1.val());
            console.log("director is " +radio_group2.val());
            console.log("genres are "+ radio_group3.val());
            console.log("all the shits true, y0");
        }
        else {
            $('#hacktor').prop("href", "#important");
            console.log("something's wrong...");
        }
    }
                  
    function calculate() {
           //this should calculate the scores
           //you already have access to the choices because globals
           /*
            actor score is average of the actors scores. divided by 10
            genres is genre average divided by 10
            director is the directors rating
            [ ((x1 * 2x2)+x3) / 10] + RT = your score.
            try adding the radio_group's score into an array of 3, and then sorting it
            **check .sort** and then pulling out 1 2 or 3. Add priorities. 
            */
        var act_score1 = Number($('#actor_slider1').val());
        var act_score2 = Number($('#actor_slider2').val())
        var act_score3 = Number($('#actor_slider3').val())
        var act_score4 = Number($('#actor_slider4').val())
        var act_average = (act_score1/10 + act_score2/10 + act_score3/10 + act_score4/10)/(4);
        console.log("actor average is " + act_average);
        var genre1 = Number($('#genre1').val());
        var genre2 = Number($('#genre2').val());
        var genre_average = (genre1/10 + genre2/10)/2;
        console.log("genre average is " + genre_average);
        console.log("critics score is " + RT);
        var director = Number($('#director_slider1').val())/10
        console.log("director is "+ director);
        var x1;
        var x2;
        var x3;
        var result;
        //1,2,3 or 1,3,2     
        if(radio_group1.val() === "1") {
            //you know that actors are first choice, so assign the x1
            x1 = act_average;
            //director is second choice        
            if(radio_group2.val() === "2") {
                //then you know radio_group is 3
                x2 = director;
                x3 = genre_average;    //so genre is third
            }//genre is second choice, so director is third
            if (radio_group3.val() === "2") {
                x2 = genre_average;
                x3 = director;
            }
        }
        //2,1,3 or 2,3,1
        else if(radio_group1.val() === "2"){
            //you know that actors are second choice
            x2 = act_average;
            //check 
            if (radio_group2.val() === "1") {
                x1=director;
                x3=genre_average;
            }
            if (radio_group2.val()==="3") {
                x1=genre_average;
                x3=director;
            }
        }
        //3,1,2 or 3,2,1
        else //if (radio_group1.val() ==="3") {
        {
            x3 = act_average;
            if (radio_group2.val() ==="2") {
                x2=director;
                x1=genre_average;
            }
            if (radio_group2.val() === "1") {
                x1 = director;
                x2 = genre_avereage;
            }
        }
        //here, you got all yo variables asssigned.
        result = ((x1 * (2*x2) + x3)/10) + RT;
        console.log("your score is... " + result);
        if (result < 60) {
            $("#see_movie").html("<style>#color_text{color:red;}</style><p id=\"color_text\">NOT see this movie</p>");
        }
        else {
            $("#see_movie").html("<style>#color_text{color:green;}</style><p id=\"color_text\">see this movie</p>");
        }
        $('#critics_score').html("<div>Critics score: " + RT+"</div");
        $('#your_score').html("<div>Your score: "+result+"</div>");
    }
}); //end of jquery doc