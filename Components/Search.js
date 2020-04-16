import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import FilmItem from './FilmItem';
import FilmList from './FilmList';
import {getFilmsFromApiWithSearchedText} from '../API/TMDBApi';

class Search extends React.Component {
  //component custom Search

  constructor(props) {
    super(props); //going to allow us to store the properties of our custom component search
    this.searchedText = ''; //Putting it out of the state because we don't need it to always render
    this.page = 0; //Actual page count
    this.totalPages = 0; //total of pages available
    this.state = {
      //allows us to change data inside a component : here we can change film and is loading is Search.js
      films: [], //initializing our state which allows to change the component and the data displayed TODO: ONLY USE INFOS FROM THE STATE AND PROPS TO RE-RENDER THE APPLICATION
      isLoading: false,
    };
    this._loadFilms = this._loadFilms.bind(this); //data binding "this", the context of the component search to loadFilms so we do not use the context of FilmList but Search === _loadFilms () => {}    [both bind to the "Search" context and not FilmList where it's executed; _loadFilms keeps the props of Search and can work with those of FilmList]
  }

  _loadFilms() {
    //use of "this" because the return of our function is an object
    if (this.searchedText.length > 0) {
      this.setState({isLoading: true});
      getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1) //when loading the API when reaching the end we add +1 to the page to have the next one
        .then(data => {
          this.page = data.page;
          this.totalPages = data.total_pages;
          this.setState({
            //setState catches the modification of our data and tells react to reload the component with the new datas //our API stores the data in a table called results
            films: [...this.state.films, ...data.results], //we have two tables one is this.state.films and the other is the result from the function; we concatenate the results into our this.state.films table ==== films: this.state.films.concat(data.results)
            isLoading: false,
          });
        });
    }
  }

  _searchTextInputChanged(text) {
    this.searchedText = text; //Modifying the searchedText at each input
  }

  _searchFilms() {
    //put back to zero our movies in our list
    this.page = 0;
    this.totalPages = 0;
    this.setState(
      {
        films: [],
      },
      () => {
        this._loadFilms(); //waits that the set state updates before executing "this._loadFilms()"
      },
    );
  }

  _displayDetailsForFilm = idFilm => {
    console.log('Display film with id : ' + idFilm);
    this.props.navigation.navigate('FilmDetail', {idFilm: idFilm});
  };

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }

  render() {
    // == render = function ()  -----  defines that will show something on screen
    console.log('Test firefox developper tools');
    return (
      // the graphical elements to render will be put in the return so that we can show them in App.js
      <SafeAreaView style={styles.main_container}>
        <View style={styles.main_container}>
          <TextInput
            style={styles.textInput}
            placeholder="Titre du film"
            onChangeText={text => this._searchTextInputChanged(text)} //on each input changes updates the text variable
            onSubmitEditing={() => this._searchFilms()}
          />
          <Button title="Rechercher" onPress={() => this._searchFilms()} />

          <FilmList
            films={this.state.films} //Search get the movies and gives it to the component FilmList to show them //this.state.films uses the state to show the movies //contains the results from getFilmsFromApiWithSearchedText
            navigation={this.props.navigation} //We give the informations of navigation to allow our FilmList to navigate to the details
            loadFilms={this._loadFilms} //loads the next movie, FilmList will just call this method and Search will give him the next films
            page={this.page}
            totalPages={this.totalPages} //pages and totalPages will allow us to not load more movies when we arrive at the end of the list
            favoriteLise={false} //Using a boolean to show more movies when the user is scrolling
          />
          {this._displayLoading()}
        </View>
      </SafeAreaView> //onPress == onPress= {function () {} }
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  textInput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5,
  },
  loading_container: {
    position: 'absolute', //vodka
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Search;
