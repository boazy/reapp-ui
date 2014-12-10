var React = require('react/addons');
var Component = require('ui/component');
var DocumentTitle = require('react-document-title');
var AnimatableContainer = require('../helpers/AnimatableContainer');

require('./TitleBar.styl');

module.exports = Component({
  name: 'TitleBar',

  getDefaultProps() {
    return {
      width: window.innerWidth,
      animations: [
        { name: 'fadeLeft', source: 'viewList' }
      ]
    };
  },

  componentWillMount() {
    this.splitTitles(this.props);
    this.addIconAnimations(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.splitTitles(nextProps);
    this.addIconAnimations(nextProps);
  },

  componentDidMount() {
    this.centerMiddleTitle();
  },

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title)
      this.centerMiddleTitle();
  },

  // allow 3-length array to set title
  splitTitles(props) {
    var { left, right, children } = props;

    if (!left && !right && Array.isArray(children)) {
      props.left = children[0];
      props.right = children[2];
      props.children = children[1];
    }
  },

  centerMiddleTitle() {
    if (this.refs.mid) {
      var mid = this.refs.mid.getDOMNode();
      var winCenter = this.refs.TitleBar.getDOMNode().clientWidth / 2;
      var midCenter = mid.offsetLeft + (mid.clientWidth / 2);
      mid.style.left = (winCenter-midCenter) + 'px';
    }
  },

  addIconAnimations(props) {
    props.left = this.addIconAnimation(props.left);
    props.right = this.addIconAnimation(props.right);
  },

  addIconAnimation(component) {
    var isValid = React.isValidElement(component);

    if (!isValid)
      return component;

    var animation = { name: 'moveToRight', source: 'viewList' };
    var iconProps = component.props.iconProps;
    iconProps = iconProps || {};

    if (iconProps.animations) {
      if (!iconProps.animations.filter(a => a.name === 'moveToRight'))
        iconProps.animations.push(animation);
    }
    else {
      iconProps.animations = [animation];
    }

    iconProps.animateProps = this.context.animateProps;
    return React.addons.cloneWithProps(component, component.props);
  },

  render() {
    var { animations, left, right, children, height, transparent, ...props } = this.props;

    if (transparent)
      this.addStyles(this.styles.transparent);

    if (height)
      this.addStyles({ height });

    if (animations)
      props.style = this.getAnimationStyles();

    return (
      <div {...props} {...this.componentProps()}>
        <div {...this.componentProps('left')}>{left}</div>
        <div {...this.componentProps('mid')}>{children}</div>
        <div {...this.componentProps('right')}>{right}</div>
      </div>
    );
  }
});