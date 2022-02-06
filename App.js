import React, { Component } from 'react'
import Tflite from 'tflite-react-native';
import { View, Text, Image, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'

let tflite = new Tflite();
var modelFile = 'models/model.tflite'
var labelsFile = 'models/labels.txt'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      recognitions: null,
      source: null
    }
    tflite.loadModel({ model: modelFile, labels: labelsFile }, (err, res) => {
      if (err) console.log(err)
      else console.log(res)
    })
  }

  selectGalleryImage() {
    let options = {

      // storageOptions: {

      //   skipBackup: true,

      //   path: 'images',

      // },

    }
    launchImageLibrary(options, (response) => {
      console.log(response)
      if (response.didCancel) {
        console.log("user canceled image")
      }
      else if (response.error) {
        console.log('image picker error' + response.error)
      }
      else if (response.customButton) {
        console.log('user pressed custom button')
      } else {
        console.log("inside else")
        this.setState({ source: { uri: response.assets[0].uri } })


        tflite.runModelOnImage(
          {
            path: response.assets[0].uri,
            imageMean: 128,
            imageStd: 128,
            numResults: 2,
            threshold: 0.05,
          },
          (err, res) => {
            if (err) console.log(err)
            else {
              this.setState({ recognitions: res[res.length - 1] })
            }
          })
      }
    })
  }

  takeImage() {
    let options = {

      // storageOptions: {

      //   skipBackup: true,

      //   path: 'images',

      // },

    }
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("user canceled image")
      }
      else if (response.error) {
        console.log('image picker error' + response.error)
      }
      else if (response.customButton) {
        console.log('user pressed custom button')
      } else {
        console.log("inside else")
        this.setState({ source: { uri: response.assets[0].uri } })

        tflite.runModelOnImage(
          {
            path: response.assets[0].uri,
            imageMean: 128,
            imageStd: 128,
            numResults: 2,
            threshold: 0.05,
          },
          (err, res) => {
            if (err) console.log(err)
            else {
              this.setState({ recognitions: res[res.length - 1] })
            }
          })

      }
    })
  }

  render() {
    const { recognitions, source } = this.state

    return (
      <LinearGradient colors={["#dd3e54", '#dd3e09']} style={styles.linearGradient}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Not Hotdog</Text>
          <Text style={styles.subtitle}>Seafood Startup</Text>
        </View>
        <View style={styles.outputContainer}>

          {
            recognitions ?
              <View>

                <Image source={source} style={styles.hotdogImage}></Image>
                <Text style={{ color: 'white', textAlign: 'center', paddingTop: 10, fontSize: 25 }}>
                  {
                    recognitions['label'] + ' - ' + (recognitions['confidence'] * 100).toFixed(0) + '%'
                  }
                </Text>
              </View>
              : <Image source={require('./assets/hotdog.png')} style={styles.hotdogImage}  ></Image>
          }
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={this.selectGalleryImage.bind(this)} buttonStyle={styles.button} title="Camera Roll" titleStyle={{ fontSize: 20 }} containerStyle={{ margin: 5 }}></Button>
          <Button onPress={this.takeImage.bind(this)} buttonStyle={styles.button} title="Take a photo" titleStyle={{ fontSize: 20 }} containerStyle={{ margin: 5 }}></Button>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1
  },
  titleContainer: {
    marginTop: 70,
    marginLeft: 40
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16
  },
  outputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    paddingBottom: 40,
    alignItems: 'center'
  },
  button: {
    width: 200,
    height: 57
  },
  button: {
    width: 200,
    height: 57,
    backgroundColor: 'black',
    borderRadius: 8
  },
  hotdogImage: {
    height: 250,
    width: 250
  }
})