import { MovieRatingsArrayInterface } from './../../models/movie-ratings.model';
import { ApiPictureService } from 'src/app/services/api-picture.service';
import { ResultInterface } from './../../models/apiMovie.model';
import { MoviesApiService } from './../../services/moviesapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { VERSION } from '@angular/core';
import { MovieRatingsInterface } from 'src/app/models/movie-ratings.model';
import { MovieRatingService } from '../../services/movieRatings/movie-ratings.service';
import { NgForm } from '@angular/forms';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LoginService } from 'src/app/services/login/login.service';
import { CommentsService } from '../../services/comments.service';
import { DataService } from '../../services/data.service';
import { CommentsInterface } from '../../models/comments.model';
import { MovieData } from '../../models/data.model';



@Component({
  selector: 'app-api-movie-details',
  templateUrl: './api-movie-details.component.html',
  styleUrls: ['./api-movie-details.component.css']
})

export class ApiMovieDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private movieApiService: MoviesApiService,
    private pictureService: ApiPictureService, private movieRatingService: MovieRatingService,
    private userService: LoginService, private router: Router,
    private commentsService: CommentsService, private dataService: DataService) { }

  // RATINGS
  ratings: MovieRatingsInterface; // ottiene dati in arrivo da getMovieRatingsOnComponent
  result: MovieRatingsArrayInterface[]; // Array Modello Movie-Ratings.model
  ratingEntry: MovieRatingsArrayInterface;
  currentRating: number;
  newRating: MovieRatingsArrayInterface;
  starRating: MovieRatingsArrayInterface;
  movie_rating_id: number;
  ratingSubmit: MovieRatingsArrayInterface;
  ratedOptions = ['1', '2', '3', '4', '5'];
  name = "Angular " + VERSION.major;

  // IMMAGINI
  imagePath: string
  private mainUrl: ApiPictureService;
  movieDetailsEntry: ResultInterface;
  id: number;
  pathComplete: string;

  // ID USER
  username: string = sessionStorage.getItem('username');
  userId: number;
  user: any;

  // COMMENTI
  dataEntry: CommentsInterface;
  comments: CommentsInterface[];
  movies: MovieData[];

  //LISTA VISTO/DA VEDERE
  movieFilm = <MovieData>{};
  seenOption = ['Add to my watched movies', 'Add to my Must See movies']
  seenSubmit: MovieData
  flag;

  // LISTE
  dataEntryList: MovieData;

  // FUNZIONI
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    //const id = this.route.snapshot.params['id'];
    this.getUserIdByUsername();
    this.getMovieApiDetails();
    //this.getMovieRatingsOnComponent();
    this.getMovieRating()
    this.getEntries();
    this.getMovies();
  }

  // FUNZIONI
  onSeen(form : NgForm){
    this.movieFilm = form.form.value;
    console.log("form.form.value ",form.form.value);
    this.movieFilm.movie_id=this.id
    this.movieFilm.user_id=this.user.id
    this.movieFilm.name =this.movieDetailsEntry.title;

    if(form.form.value.seen==='Add to my watched movies'){
      this.movieFilm.seen=true;
      this.movieFilm.must_see=false
    };
    if(form.form.value.seen==='Add to my Must See movies'){
      this.movieFilm.must_see=true;
      this.movieFilm.seen=false;
    };

    for(let i=0; i<this.movies.length; i++ ){
      if(this.movies[i].movie_id ==this.id){
        console.log("INIZIA IL FOR");

        this.flag=true;
        this.movieFilm.id=this.movies[i].id
        this.movieFilm.name=this.movies[i].name;
        console.log("this.flag ciclo for ",this.flag);
        console.log("this.id ",this.id)
        console.log("this.movieFilm.id casa ",this.movieFilm.id)
        console.log("this.movieFilm.id 1 ",this.movies[i].id)
        console.log("this.movies[i].movie_id ",this.movies[i].movie_id)
        console.log("break");
        console.log("FINISCE IL FOR");

        break;

      }else{      this.flag=false;

      }
    };


    console.log("this.flag before if",this.flag);
    if(this.flag==true){
      console.log("INIZIA LA EDIT");
      console.log("this.flag after if",this.flag);
      console.log("this.movieFilm.id after if",this.movieFilm);
      console.log("this.movieFilm.id after if ",this.movieFilm.id);


      this.dataService.editEntry(this.movieFilm).subscribe(response => {
      },
         (err) => {
        console.log("mah");
      }
      )
         console.log("FINISCE LA EDIT");

    }
    else
     {
      console.log("INIZIA LA ADD");

         this.dataService.addEntry(this.movieFilm).subscribe(response => {
        },

           (err) => {
          console.log("mah2");
        }
        )
        console.log("this.movieFilm.id addEntry",this.movieFilm)
        console.log("this.movieFilm.id addEntry ",this.movieFilm.id);
        this.flag==true;
        console.log("FINISCE LA ADD");

   }

  }




  getUserIdByUsername() {
    this.userService.getUserByUsername(this.username, "admin", "admin").subscribe(
      (response: any) => {
        this.user = response;
        this.userId = this.user.id;
      });
  }

  getMovieApiDetails() {
    this.movieApiService.getMovieById(this.id).subscribe((res: any) => {
      this.movieDetailsEntry = res;
      this.imagePath = "https://image.tmdb.org/t/p/w780" + this.movieDetailsEntry.backdrop_path //Da rimettere original size
    })
  }


  getMoviePosters() { //Questa andra messa nella dashboard
    this.pictureService.getMoviePics(this.movieDetailsEntry.backdrop_path).subscribe((res: any) => {
      this.movieDetailsEntry = res;
      this.pathComplete = this.combinePath(this.mainUrl, this.movieDetailsEntry.backdrop_path)
      console.log(this.pathComplete)
    }
    )
  }


  combinePath(mainUrl: ApiPictureService, backdrop_path: string) {
    return this.mainUrl + this.movieDetailsEntry.backdrop_path;
  }

  //da sostituire con 2waybinding, in modo che dopo aver dato il rating ricompaia tornando alla pagina e sia modificabile
  /*onSubmit(form: NgForm) {
    form.form.value.movie_id = this.movieDetailsEntry.id,
    form.form.value.user_id = this.user.id
    //form.form.value.currentRating = parseInt(form.form.value.currentRating);
    form.form.value.movie_rating = parseInt(form.form.value.movie_rating);
    this.ratingSubmit = form.form.value;
    console.log("RISULTATI RATING", this.ratingSubmit);
    this.movieRatingService.addMovieRating(this.ratingSubmit).subscribe(response => {

    },
      (err) => {
        //fai qualcosa
        console.log(err)
      }
    )
  }*/

  /* SERVE SOLO IL RATING DEL FILM DELLA PAGINA, NON TUTTI, MEGLIO USARE LA GETRATINGBYMOVIEID
  getMovieRatingsOnComponent() {
    this.movieRatingService.getratings().subscribe(
      response => {
        console.log("Ho Ottenuto i ratings");
        this.ratings = response;
        //console.log("I ratings ottenuti sono:", response);
        //console.log("I dati Stringyfied: " + JSON.stringify(this.ratings));
        this.result = this.ratings.data;
        console.log("rating di questo film:", this.ratings.data[32].movie_rating);
      },
      error => console.log(error)
    )
  }*/

  /*nella consolelog della pagina ci sono tutti i rating, devo solo caricarli come fa il fetch di edit e
  modificarli con submitrating come in edit, se non c'e` gia` un rating, con un if impostarlo a 0 */

  getMovieRating() {
    this.movieRatingService.getratingsByMovieId(this.id).subscribe(
      response => {
        this.ratings = response;
        this.ratingEntry = this.ratings.data[0];
      },
      error => console.log(error)
    )
  }

  /*
  submitRating() {
    console.log("id user:", this.userId);
    console.log("id movie:", this.id);
    console.log("rating di questo film:", this.ratingEntry.movie_rating);

    this.movieRatingService.editRating(this.userId, this.id, this.ratingEntry)
      .subscribe(response => {
        console.log(response);
        //this.router.navigate(['/details', this.dataEntry.id])
      }), err => {
        console.log(err);
      }
    //this.router.navigate(['/details', this.dataEntry.id])
  }
*/

  onSubmitRating(form: NgForm) {
    form.form.value.movie_id = this.movieDetailsEntry.id,
      form.form.value.user_id = this.user.id
    //form.form.value.currentRating = parseInt(form.form.value.currentRating);
    form.form.value.movie_rating = parseInt(form.form.value.movie_rating);
    this.ratingSubmit = form.form.value;
    console.log("RISULTATI RATING", this.ratingSubmit);
    this.movieRatingService.addMovieRating(this.ratingSubmit).subscribe(response => {

    },
      (err) => {
        //fai qualcosa
        console.log(err)
      }
    )
  }
  //-----------------------COMMENTS--------------------------//
  getEntries() {
    this.commentsService.getComments().subscribe(
      response => {
        //se è andato tutto bene, allora:
        //console.log("ho ottenuto i dati!");
        this.comments = response;
        //console.log(this.comments);
      },
      error => console.log(error)
    )
  }

  getMovies() {
    this.dataService.getData().subscribe((response: any) => {
      this.movies = response;
      //console.log(this.movies);
    })
  }

  onSubmit(form: NgForm) {

    this.dataEntry = form.form.value;
    console.log(form);
    console.log(this.dataEntry);
    console.log(this.userId);
    console.log(this.id);

    this.commentsService.addComment(this.userId, this.id, this.dataEntry).subscribe(
      response => {
        console.log(response);
        this.router.navigate(["/movieApiDetails/791373"]);
      },
      error =>
        alert(error.error.message)
    )
  }


  goToAddComment() {
    this.router.navigate(['/addComment'], { state: { data: this.id } });
  }

  exit() {
    window.location.reload();
  }


}
