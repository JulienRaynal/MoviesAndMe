import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Search from '../Components/Search';
import FilmDetail from '../Components/FilmDetail';
import Favorites from '../Components/Favorites';
import Test from '../Components/Test';
import StackNavigator from '@react-navigation/stack/src/navigators/createStackNavigator';
import News from '../Components/News';

const Stack = createStackNavigator();

function Main() {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="FilmDetail" component={FilmDetail} />
    </Stack.Navigator>
  );
}

function FavoriteList() {
  return (
    <Stack.Navigator initialRouteName="Favorites">
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="FilmDetail" component={FilmDetail} />
    </Stack.Navigator>
  );
}

function NewFilms() {
  return (
    <Stack.Navigator initialRouteName="NewFilms">
      <Stack.Screen name="NewFilms" component={News} />
      <Stack.Screen name="FilmDetail" component={FilmDetail} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MoviesTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeBackgroundColor: '#DDDDDD',
          inactiveBackgroundColor: '#FFFFFF',
          showLabel: false, //Hide the Label
          showIcon: true, //We choose to show the icons
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen
          name="Main"
          component={Main}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: () => (
              <Image
                source={require('../Images/ic_search.png')}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoriteList}
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: () => (
              <Image
                source={require('../Images/ic_favorite.png')}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="NewFilms"
          component={NewFilms}
          options={{
            tabBarLabel: 'NewFilms',
            tabBarIcon: () => (
              <Image
                source={require('../Images/ic_fiber_new.png')}
                style={styles.icon}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
});

export default MoviesTabNavigator;

/*
NavigationContainer : Contains the main part, assembles all the pages created for him
 */
