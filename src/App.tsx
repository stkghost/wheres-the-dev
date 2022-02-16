import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import { Alert, Linking, Text, View } from "react-native";
import { RectButton, TextInput } from "react-native-gesture-handler";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region
} from 'react-native-maps';
import { fetchLocalMapBox, fetchUserGithub } from './api';
import styles from './styles';


 interface Dev {
  id: number;
  avatar_url: string;
  name: string;
  bio: string;
  login: string;
  location: string;
  latitude?: number;
  longitude?: number;
  html_url: string;
}

const initialRegion = {
  latitude: 49.2576508,
  longitude: -123.2639868,
  latitudeDelta: 100,
  longitudeDelta: 100,
};

export function App() {

  const [ devs, setDevs ] = useState<Dev[]>([])
  const [ username, setUsername ] = useState("")
  const [ region, setRegion ] = useState<Region>()

  const getCurrentPosition = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync()

    if (status !== "granted") {
      Alert.alert('Permissão de acesso a localização negada!', ":(")
    }
    //destructuring lat and lnt from current Location
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync()

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 100,
      longitudeDelta: 100
    })
  }

  useEffect(() => {
    getCurrentPosition()
  }, [])

  //fn to navigate to github dev page
  const handleOpenGithub = (url: string) => {
    Linking.openURL(url)
  }

  const handleSearchUser = async () => {
    let dev: Dev

    if(!username) return

    const githubUser = await fetchUserGithub(username)


    if (!githubUser || !githubUser.location) {
      Alert.alert(
        "Damn!",
        "Usuário não encontrado ou não tem localização definida no GitHub"
      )
      return
    }

    const localMapBox = await fetchLocalMapBox(githubUser.location)

    console.log(githubUser)


    if (!localMapBox || !localMapBox.features[0].center){
      Alert.alert(
        "Damn!",
        "Erro ao converter a localização do user em coordenádas geográficas"
      )
      return 
    }

    const [longitude, latitude] = localMapBox.features[0].center

    dev = {
      ...githubUser,
      latitude,
      longitude
    }

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 3,
      longitudeDelta: 3
    })

    const devAlreadyExists = dev && devs.find((user) => user.id === dev.id)

    if (devAlreadyExists) return 

    setDevs([...devs, dev])
    setUsername("")
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        initialRegion={initialRegion}
      >
        {devs.map((dev: Dev) => (
          <Marker
            key={dev.id}
            image={{uri: `${dev.avatar_url}&s=120`}}
            calloutAnchor={{
              x: 2.9,
              y: 0.8
            }}
            coordinate={{
              latitude: Number(dev.latitude),
              longitude: Number(dev.longitude)
            }}
          >
            <Callout tooltip onPress={() => handleOpenGithub(dev.html_url)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{dev.name}</Text>
                <Text style={styles.calloutSmallText}>{dev.bio}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.footer}>
          <TextInput
            style={styles.footerText}
            placeholder={`${devs.length} Devs encontrados`}
            onChangeText={setUsername}
            value={username}
          />

          <RectButton style={styles.searchUserButton} onPress={handleSearchUser}>
            <FontAwesome name="github" size={24} color="white"/>
          </RectButton>
      </View>
    </View>
  )
}