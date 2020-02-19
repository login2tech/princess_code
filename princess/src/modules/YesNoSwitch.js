import React from 'react';
import {View, StyleSheet} from 'react-native';
import {globalStyles, Colors, Paddings} from '../utils/Theme';
import {Button} from 'react-native-elements';

export default class YesNoSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  changeTo(c) {
    this.props.update(c);
  }

  render() {
    const val_1 = this.props.val1 ? this.props.val1 : 1;
    const val_2 = this.props.val2 ? this.props.val2 : 0;
    const label_1 = this.props.label1 ? this.props.label1 : 'Yes';
    const label_2 = this.props.label2 ? this.props.label2 : 'No';

    const yes_btn = {
      bg:
        this.props.val == val_1
          ? this.props.primaryColor
          : this.props.secondaryColor,
      color:
        this.props.val == val_1
          ? this.props.secondaryColor
          : this.props.primaryColor
    };
    const no_btn = {
      bg:
        this.props.val == val_2
          ? this.props.primaryColor
          : this.props.secondaryColor,
      color:
        this.props.val == val_2
          ? this.props.secondaryColor
          : this.props.primaryColor
    };
    // console.log(yes_btn, no_btn)
    return (
      <View style={{width: '100%'}}>
        <View style={globalStyles.inputWrapNoBorder}>
          <Button
            rounded
            color={yes_btn.color}
            backgroundColor={yes_btn.bg}
            buttonStyle={globalStyles.ButtonTab}
            containerViewStyle={styles.cvs}
            title={label_1}
            onPress={() => {
              this.changeTo(val_1);
            }}
          />
          <Button
            rounded
            color={no_btn.color}
            backgroundColor={no_btn.bg}
            buttonStyle={globalStyles.ButtonTab}
            containerViewStyle={styles.cvs}
            title={label_2}
            onPress={() => {
              this.changeTo(val_2);
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textBox1: {
    flex: 0.2,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 10
  },
  cvs: {
    width: '100%',
    flex: 1
  }
});
