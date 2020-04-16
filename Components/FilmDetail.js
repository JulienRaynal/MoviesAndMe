import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import {getFilmDetailFromApi, getImageFromApi} from '../API/TMDBApi';
import moment from 'moment';
import numeral from 'numeral';
import {connect} from 'react-redux';
import EnlargeShrink from '../Animations/EnlargeShrink';

class FilmDetail extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    //We access the function "shareFilm" and the films through the parameters that we added to the navigation of react-navigation
    if (params.film != undefined && Platform.OS === 'ios') {
      return {
        //We need to display a picture, so we use touchableOpacity

        headerRight: (
          <TouchableOpacity
            styles={styles.share_touchable_headerrightbutton}
            onPress={() => params.shareFilm()}>
            <Image
              style={styles.share_image}
              source={require('../Images/ic_share.ios.png')}
            />
          </TouchableOpacity>
        ),
      };
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      film: undefined, //We don't have any info on the movie so we initialize it as "undefined"
      isLoading: false, //When opening the page we load until we get the details of the film
    };
    //Bind the function "shareFilm" or when we will call it from "headerRight" from navigation, this.state.film  will be undefined and the app will crash [because navigationOption is static and we can't call this as the instance and can't call setState or any other instance method on it]
    this._shareFilm = this._shareFilm.bind(this);
    this._toggleFavorite = this._toggleFavorite.bind(this);
  }

  //function to pass the function "_shareFilm" and the movie to the parameters of the navigation. Thus we'll have access to those data when defining the headerRight
  _updateNavigationParams() {
    this.props.navigation.setParams({
      shareFilm: this._shareFilm(),
      film: this.state.film,
    });
  }

  //When the film is loaded we update the parameters of the navigation (with the function _updateNavigationParams) to display the share button
  componentDidMount() {
    //automatic action once the component has finished rendering
    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(
      item => item.id === this.props.route.idFilm,
    );
    if (favoriteFilmIndex !== -1) {
      //movie already in our favorites, we already have his details, no need to call the api, we add the details from the global state to the state of our component
      this.setState(
        {
          film: this.props.favoritesFilm[favoriteFilmIndex],
        },
        () => {
          this._updateNavigationParams();
        },
      );
      return;
    }

    this.setState({isLoading: true});
    //The movie isn't in our favorites, we don't have it's details
    //We call the API to get the details
    getFilmDetailFromApi(this.props.route.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false,
      });
    });
  }

  componentDidUpdate() {
    console.log('ComponentDidUpdate : ');
    console.log(this.props.favoritesFilm);
  }

  _toggleFavorite() {
    const action = {type: 'TOGGLE_FAVORITE', value: this.state.film};
    this.props.dispatch(action);
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
  }

  _displayFavoriteImage() {
    let sourceImage = require('../Images/ic_favorite_border.png');
    let shouldEnlarge = false; //Default the picture is not in the favorite and should enlarge => shouldEnlarge = true
    if (
      this.props.favoritesFilm.findIndex(
        item => item.id === this.state.film.id,
      ) !== -1
    ) {
      //Film in our favorites
      sourceImage = require('../Images/ic_favorite.png');
      shouldEnlarge = true;
    }
    return (
      <EnlargeShrink shouldEnlarge={shouldEnlarge}>
        <Image style={styles.favorite_image} source={sourceImage} />
      </EnlargeShrink>
    );
  }

  _displayFilm() {
    const {film} = this.state;
    if (film != undefined) {
      return (
        <ScrollView style={styles.scrollview_container}>
          <Image
            style={styles.image}
            source={{uri: getImageFromApi(film.backdrop_path)}}
          />
          <Text style={styles.title_text}>{film.title}</Text>
          <TouchableOpacity
            style={styles.favorite_container}
            onPress={() => this._toggleFavorite()}>
            {this._displayFavoriteImage()}
          </TouchableOpacity>
          <Text style={styles.description_text}>{film.overview}</Text>
          <Text style={styles.default_text}>
            Released the{' '}
            {moment(new Date(film.release_date)).format('DD/MM/YYYY')}
          </Text>
          <Text style={styles.default_text}>
            Score : {film.vote_average} / 10
          </Text>
          <Text style={styles.default_text}>
            Number of votes : {film.vote_count}
          </Text>
          <Text style={styles.default_text}>
            Budget : {numeral(film.budget).format('0,0[.]00 $')}
          </Text>
          <Text style={styles.default_text}>
            Genre(s) :{' '}
            {film.genres
              .map(function(genre) {
                return genre.name;
              })
              .join(' / ')}
          </Text>
          <Text style={styles.default_text}>
            Companie(s) :{' '}
            {film.production_companies
              .map(function(company) {
                return company.name;
              })
              .join(' / ')}
          </Text>
        </ScrollView>
      );
    }
  }

  _shareFilm() {
    const {film} = this.state;
    Share.share({
      title: film.title,
      message: film.title + '\n' + film.overview,
    });
  }

  _displayFloatingActionButton() {
    const {film} = this.state;
    if (film != undefined && Platform.OS === 'android') {
      //only on android and if the movie is loaded
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this._shareFilm()}>
          <Image
            style={styles.share_image}
            source={require('../Images/ic_share.android.png')}
          />
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
        {this._displayFloatingActionButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollview_container: {
    flex: 1,
  },
  image: {
    height: 169,
    margin: 5,
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 35,
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    color: '#000000',
    textAlign: 'center',
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666',
    margin: 5,
    marginBottom: 15,
  },
  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  favorite_container: {
    alignItems: 'center',
  },
  favorite_image: {
    flex: 1,
    width: null,
    height: null,
  },
  share_touchable_floatingactionbutton: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  share_image: {
    width: 30,
    height: 30,
  },
  share_touchable_headerrightbutton: {
    marginRight: 8,
  },
});

//The value returned is mapped to the props of our component
const mapStateToProps = state => {
  //is the global state
  return {
    favoritesFilm: state.toggleFavorite.favoritesFilm, //we take only the favoritesFilm from our application state and put it in the props of our FilmDetail
  };
};

export default connect(mapStateToProps)(FilmDetail); //"connect" Connects our store Redux to our component FilmDetail; mapStateToProps if specified in connect subscribes our component to the store redux (everytime store is updated mapStateToProps will be called)
