// This code is the property of ECMC Group and is provided with permission as a work sample. 
// No further use or dissemination is authorized without express written permission of ECMC Group.

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as hexAPI from '../../actions/skillProfilerActions';
import './Hex.css';

const defaultValue = -1;

function isNullOrUndefined(value) {
  return !value && value !== 0;
}

export class Hex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: isNullOrUndefined(this.props.value) ? 'inactive' : 'active',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ active: isNullOrUndefined(nextProps.value) ? 'inactive' : 'active' });
  }

  handleClick() {
    this.props.actions.updateHexValue(
      this.props.id,
      isNullOrUndefined(this.props.value) ? defaultValue : this.props.value);
  }

  render() {
    const value = isNullOrUndefined(this.props.value) ? defaultValue : this.props.value;
    return (
      <div className={`hex ${this.state.active}`}>
        <div
          className={`hex inner ${this.state.active}_${value}`}
          role="presentation"
          onClick={this.handleClick}
        >
          <p className={`hex-text ${this.state.active}_${value}`}>
            {this.props.children}</p>
        </div>
      </div>
    );
  }
}

Hex.defaultProps = {
  value: null,
};

Hex.propTypes = {
  actions: PropTypes.shape({
    updateHexValue: PropTypes.func,
  }).isRequired,
  children: PropTypes.node.isRequired,
  value: PropTypes.number,
  id: PropTypes.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(hexAPI, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
  null,
)(Hex);
