import React from 'react';
import {StyleSheet, View} from 'react-native';
import FilmList from './FilmList';
import {connect} from 'react-redux';
import Avatar from './Avatar';

class Favorites extends React.Component {
  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.avatar_container}>
          <Avatar />
        </View>
        <FilmList
          films={this.props.favoritesFilm}
          navigation={this.props.navigation}
          favoriteList={true} // Will block the search for more movies once we're at the end of the favorite list
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  avatar_container: {
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    favoritesFilm: state.toggleFavorite.favoritesFilm,
  };
};

export default connect(mapStateToProps)(Favorites);
