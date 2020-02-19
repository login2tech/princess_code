import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  Modal,
  Animated,
  Dimensions,
  Platform,
  FlatList
} from 'react-native';
import {RkButton} from '../button/rkButton';
import {RkText} from '../text/rkText';
import {RkComponent} from '../rkComponent';
import {RkTheme} from '../../styles/themeManager';


export class RkModalImg extends RkComponent {

  componentName = 'RkModalImg';

  typeMapping = {
    img: {},
    header: {},
    footerContent: {},
    headerContent: {},
    footer: {},
    headerText: {},
    imgContainer: {},
    modal: {}
  };

  needUpdateScroll = false;

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(1),
      visible: false,
      width: undefined,
      height: undefined,
      index: props.index || 0,
    }
  }

  componentDidUpdate() {
    if (this.needUpdateScroll && this.refs.list) {
      this.refs.list.scrollToOffset({offset: this.state.index * this.state.width, animated: false});
      this.needUpdateScroll = false;
    }
  }

  _renderList(source, index, props) {
    return <FlatList
      ref='list'
      data={Array.from(this.props.source)}
      renderItem={({item}) => this._renderImage(item, props)}
      horizontal
      pagingEnabled
      keyExtractor={(item, index) => index}
      extraData={this.state}
      onScroll={(e) => this._onScroll(e)}
    />
  }

  _renderImage(source, props) {
    return (
      <TouchableWithoutFeedback style={{flex:1}}
                                onPress={() => this._toggleControls()}>
        <Image source={source} {...props}/>
      </TouchableWithoutFeedback>
    )
  }

  _toggleControls() {
      Animated.timing(this.state.opacity, {
        toValue: this.state.opacity._value ? 0 : 1
      }).start()
  }

  _renderFooter(options) {
    let footerStyle = this.styles ? this.styles.footerContent : {};

    return (
      <View style={footerStyle}/>
    );
  }

  _renderHeader(options) {
    let headerContent = this.styles ? this.styles.headerContent : {};
    let headerText = this.styles ? this.styles.headerText : {};
    return (
      <View style={headerContent}>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <RkButton rkType='clear' onPress={options.closeImage}>Close</RkButton>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <RkText style={headerText}>{this._renderPageNumbers()}</RkText>
        </View>
        <View style={{flex: 1}}/>
      </View>
    );
  }

  _renderPageNumbers() {
    if (Array.isArray(this.props.source)) {
      let pageText = +this.state.index + +1;
      pageText += '/';
      pageText += this.props.source.length;
      return (
        <Text style={RkTheme.styles.whiteText}>
          {pageText}
        </Text>
      )
    } else return null;
  }

  _onScroll(e) {
    let imageIndex = Math.round(e.nativeEvent.contentOffset.x / this.state.width);
    if (imageIndex >= 0 &&
      imageIndex <= this.props.source.length &&
      imageIndex != this.state.index) {
      this.setState({
        index: imageIndex
      })
    }
  }

  _closeImage() {
    this.setState({visible: false});
  }

  _onOrientationChange() {
      this.needUpdateScroll = true;
      this.forceUpdate();
  }

  _updateDimensionsState() {
    let {height, width} = Dimensions.get('window');
    this.state.height = height;
    this.state.width = width;
  }

  render() {
    let {
      imgContainerStyle,
      visible,
      animationType,
      transparent,
      modalStyle,
      modalImgStyle,
      headerStyle,
      footerStyle,
      source,
      index,
      style: imgStyle,
      ...imgProps,
    } = this.props;

    let {
      header,
      footerContent,
      headerContent,
      footer,
      headerText,
      img,
      imgContainer,
      modal,
      modalImg
    } = this.defineStyles();

    this.styles = {
      header: [header, headerStyle],
      footerContent,
      headerContent,
      footer: [footer, footerStyle],
      headerText
    };

    let renderHeader = this.props.renderHeader || this._renderHeader.bind(this);
    let renderFooter = this.props.renderFooter || this._renderFooter.bind(this);
    animationType = animationType || 'fade';
    transparent = transparent === undefined ? false : transparent;
    visible = visible === undefined ? this.state.visible : visible;

    this._updateDimensionsState();

    if (visible) {
      imgProps.style = [imgProps.style,
        {
          height: this.state.height,
          width: this.state.width
        },
        modalImg,
        modalImgStyle];
    }
    let closeImage = this._closeImage.bind(this);
    let pageNumber = +this.state.index + 1;
    let totalPages = this.props.source.length;
    let basicSource = Array.isArray(source) ? source[index] : source;
    return (
      <View>
        <TouchableWithoutFeedback style={[imgContainer, imgContainerStyle]}
                                  onPress={() => {this.needUpdateScroll = true; this.setState({visible: true});}}>
          <Image source={basicSource} style={[img, imgStyle]} {...imgProps}/>
        </TouchableWithoutFeedback>
        <Modal supportedOrientations={['portrait', 'landscape']}
          onRequestClose={closeImage}
          animationType={animationType}
          transparent={transparent}
          visible={visible}
          onOrientationChange={this._onOrientationChange.bind(this)}>
          <View style={[modal, modalStyle]} onLayout={Platform.OS === 'ios' ? null : this._onOrientationChange.bind(this)}>
            { Array.isArray(source) ? this._renderList(source, index, imgProps) : this._renderImage(basicSource, imgProps)}
            <Animated.View style={[this.styles.header, {opacity: this.state.opacity}]}>
              {renderHeader({closeImage, pageNumber, totalPages})}
            </Animated.View>
            <Animated.View style={[this.styles.footer, {opacity: this.state.opacity}]}>
              {renderFooter({closeImage, pageNumber, totalPages})}
            </Animated.View>
          </View>
        </Modal>
      </View>
    );
  }
}
