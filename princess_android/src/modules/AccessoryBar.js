// import { MaterialIcons } from '@expo/vector-icons'

import { Icon} from 'react-native-elements';
import PhotoUpload from 'react-native-photo-upload';

import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import {
  getLocationAsync,
  // pickImageAsync,
  takePictureAsync,
} from './mediaUtils'

export default class AccessoryBar extends React.Component {
  render() {
    const { onSend } = this.props
    return (
      <View style={styles.container}>
        <Button2 onPress={(result) => {
          onSend([{ image: result  }])

        }} name='photo' />
        <Button onPress={() => getLocationAsync(onSend)} name='my-location' />
      </View>
    )
  }
}


const Button2 = ({
  onPress,
  size = 30,
  color = 'rgba(0,0,0,0.5)',
  ...props
}) => (
<View stle={{flex:1}}>

  <PhotoUpload
  quality={50}
  format='PNG'
      onPhotoSelect={avatar => {
        if (avatar) {
          onPress('data:image/png;base64,' + avatar)
        }
      }}
    >
      <Icon
        name={props.name}
        size={size}
        iconStyle={{color: color}}

    />
  </PhotoUpload>
  </View>
)


const Button = ({
  onPress,
  size = 30,
  color = 'rgba(0,0,0,0.5)',
  ...props
}) => (
<View stle={{flex:1}}>
  <TouchableOpacity onPress={onPress}>
      <Icon
            name={props.name}
      size={size}
      iconStyle={{color: color}}

    />
  </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.3)',
  },
})
