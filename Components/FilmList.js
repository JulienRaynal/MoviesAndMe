import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import FilmItem from './FilmItem';
import {connect} from 'react-redux';

class FilmList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
    };
  }

  _displayDetailForFilm = idFilm => {
    console.log('Display film with id ' + idFilm);
    this.props.navigation.navigate('FilmDetail', {idFilm: idFilm}); //react navigation adds an object in our props and we use it to navigate to the view "FilmDetail"
  };

  render() {
    console.log(
      'Page actuel : ' +
        this.props.page +
        '\nNbr de page total : ' +
        this.props.totalPages,
    );
    return (
      <FlatList
        style={styles.list}
        data={this.props.films}
        //We use extraData to say to the flatlist to keep other datas in check for re-render
        extraData={this.props.favoritesFilm}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <FilmItem
            film={item}
            //Adding a props isFilmFavorite to display a heart or not
            isFilmFavorite={
              this.props.favoritesFilm.findIndex(
                film => film.id === item.id,
              ) !== -1
            }
            displayDetailForFilm={this._displayDetailForFilm}
          />
        )} // == renderItem={function ({item}) { return <Text>{item.title}</Text> }} + adding a custom function [props] : film={item} --> send the info of our item (film) to FilmItem.js    We had a the function _DisplayDetailForFIlms in our props
        onEndReachedTreshold={0.5}
        onEndReached={() => {
          if (
            !this.props.favoriteLise &&
            this.props.page < this.props.totalPages
          ) {
            this.props.loadFilms();
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  return {
    favoritesFilm: state.toggleFavorite.favoritesFilm,
  };
};

export default connect(mapStateToProps)(FilmList);
