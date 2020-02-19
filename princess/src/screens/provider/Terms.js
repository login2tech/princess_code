import React from 'react';
import {connect} from 'react-redux';
import {ScrollView, Text, View} from 'react-native';
import {globalStyles} from '../../utils/Theme';

class Terms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    //// TODO: in multilanguge
    return (
      <View style={globalStyles.containerSplash}>
        <ScrollView>
          <View style={globalStyles.innerContainer}>
            <Text style={{fontSize: 30, textAlign: 'center'}}>Terms</Text>
            <Text style={{fontSize: 20}}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              luctus odio at bibendum feugiat. Aliquam id odio odio. Suspendisse
              consequat sapien purus, quis eleifend felis ultrices sed. Nunc
              odio ligula, tincidunt id vulputate vel, vestibulum vel quam. Cras
              in feugiat sapien, quis volutpat odio. Ut malesuada orci vitae
              tempor condimentum. Donec orci justo, sagittis non faucibus ut,
              eleifend a ante. Praesent feugiat enim ac dui luctus sodales.
              Donec bibendum odio non diam euismod feugiat. Sed pellentesque,
              sapien in tincidunt ultricies, dui lacus rutrum eros, in facilisis
              sem lectus et sapien.
              {'\n\n'}
              Aliquam erat volutpat. Ut lacinia ligula vel ex malesuada, vel
              maximus nulla euismod. Mauris eu mattis mi. Fusce imperdiet ex
              quis nisl laoreet auctor. Donec imperdiet ultricies blandit.
              Quisque luctus est id bibendum lobortis. Cras nec massa augue.
              Nulla at dapibus sem. Sed ac dapibus orci. Fusce eu ornare neque.
              Morbi tellus sapien, tempus a orci feugiat, tristique tincidunt
              nisi.
              {'\n\n'}
              In vel nisi quis felis posuere volutpat. Aliquam nec velit nunc.
              Cras in tortor eget tortor dapibus mattis. Praesent pulvinar
              mauris ut dolor porta cursus. Nullam at nisi quis dui convallis
              ornare. Sed bibendum nisi sed pulvinar congue. Pellentesque ac
              urna eros. Phasellus augue nisl, malesuada at finibus nec,
              faucibus id libero. Quisque sollicitudin urna eget justo lobortis
              mollis. Suspendisse varius interdum tellus, sit amet tristique
              diam sagittis id. Etiam lectus sem, dictum at purus ac, vehicula
              semper elit. Nam posuere arcu nec est interdum varius. Etiam id
              ullamcorper nulla. Donec molestie felis sit amet efficitur
              porttitor. Vestibulum suscipit congue nisi. Nam non varius lacus.
              {'\n\n'}
              Sed at purus velit. Sed sem eros, iaculis quis rutrum sit amet,
              dignissim eu purus. Sed elementum nibh in dolor aliquet tincidunt.
              Vestibulum eleifend arcu in enim lobortis tincidunt. Maecenas et
              ligula quis libero tempor dictum. Sed malesuada non quam vel
              dignissim. Integer semper cursus elementum. Duis ornare, felis sit
              amet hendrerit pretium, massa elit ornare ex, sed ultrices nisl
              urna vitae odio. Nunc scelerisque posuere turpis quis accumsan.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia Curae;
              {'\n\n'}
              Cras metus augue, accumsan a ex in, ullamcorper efficitur nibh.
              Donec erat velit, tempor quis sapien at, porttitor pretium ligula.
              Integer diam neque, blandit ac nisl a, feugiat fermentum leo.
              Mauris diam leo, bibendum ut magna mollis, commodo ornare nisl.
              Praesent iaculis orci purus, nec eleifend sapien condimentum vel.
              Nulla pharetra, leo eu congue fermentum, odio enim fermentum
              velit, ac finibus ligula mauris eget justo. Vivamus ut mi sed
              turpis vehicula cursus. Ut pellentesque tellus ac metus
              scelerisque venenatis nec at enim. Maecenas metus tellus, finibus
              eget elementum ut, iaculis id ante. Vivamus quis urna sit amet
              neque mollis malesuada.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages, // use store's data
    language: state.language,
    auth: state.auth, // use store's data
  };
};

export default connect(mapStateToProps)(Terms);
