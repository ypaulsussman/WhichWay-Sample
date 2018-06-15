// This code is the property of ECMC Group and is provided with permission as a work sample. 
// No further use or dissemination is authorized without express written permission of ECMC Group.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import NextArrow from '../SVGs/NextArrow/NextArrow';
import UhOhModal from '../UhOhModal/UhOhModal';
import SkillLegend from '../SkillLegend/SkillLegend';
import InstructionalText from '../InstructionalText/InstructionalText';
import Hex from '../Hex/Hex';
import * as hexAPI from '../../actions/skillProfilerActions';
import { postProfileStateAction } from '../../actions/userActions';

import './SkillProfilerPage.css';

export class SkillProfilerPage extends Component {
  constructor(props) {
    super(props);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
    this.confirmInterestsCompleted = this.confirmInterestsCompleted.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.resetHexes = this.resetHexes.bind(this);
    this.state = {
      showModal: false,
    };
  }

  handleNextButtonClick() {
    if (this.confirmInterestsCompleted()) {
      this.props.actions.updateHexValue(this.props.skills[0].id, this.props.skills[0].value, true);
    } else {
      this.setState({ showModal: true });
    }
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  confirmInterestsCompleted() {
    return this.props.skills.every(skill => skill.value !== null);
  }

  resetHexes() {
    scroll.scrollToTop({ smooth: true });
    this.props.actions.resetAllHexValues();
    this.props.actions.postProfileStateAction();
  }

  render() {
    const interestsComplete = this.confirmInterestsCompleted();
    const ConditionalLink = interestsComplete ? Link : 'div';

    return (
      <div className="skill-profiler-page">
        <Header title="SKILLS" >
          <div className="legend-wrapper">
            <SkillLegend />
          </div >
        </Header>
        <UhOhModal showModal={this.state.showModal} onClose={this.handleCloseModal} />
        <div className="instructions-offset-skill">
          <InstructionalText>
            <span className="bold-text">Tap the shape </span>
            <span>to show your skill level.</span>
          </InstructionalText>
        </div>
        <div className="hex-container"> {
          this.props.skills.map(e => (
            <Hex
              key={e.id}
              id={e.id}
              value={e.value}
            >{e.text}</Hex>),
          )
        } </div>
        <Footer
          leftButton={(
            <div
              onClick={this.resetHexes}
              role="button"
              tabIndex={0}
              className="reset-button"
            >Reset</div>
          )}
          rightButton={(
            <ConditionalLink to="/results" onClick={this.handleNextButtonClick}>
              <span className="text-container">
                Finish
              </span>
              <span className="arrow-container">
                <NextArrow />
              </span>
            </ConditionalLink>
          )
          }
        />
      </div >
    );
  }
}

SkillProfilerPage.defaultProps = {
  skills: [],
};

function mapStateToProps(state) {
  return {
    skills: Object.keys(state.skillProfiler.skillsState || {}).map(id => ({
      value: state.skillProfiler.skillsState[id].value,
      id,
      text: state.skillProfiler.skillsState[id].display_name,
    })),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...hexAPI, postProfileStateAction }, dispatch),
  };
}

SkillProfilerPage.propTypes = {
  actions: PropTypes.shape({
    resetAllHexValues: PropTypes.func,
    postProfileStateAction: PropTypes.func,
    updateHexValue: PropTypes.func,
  }).isRequired,
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.string,
      text: PropTypes.string,
      id: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillProfilerPage);
