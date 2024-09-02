import React from 'react';
import Dispatcher from './Dispatcher';
// PropTypes is a separate package now:
import PropTypes from 'prop-types';

// replace React.createClass with a class:
class FilterSetCheckbox extends React.Component {
  // Use static properties for propTypes/defaultProps
  static propTypes = {
    name: PropTypes.string,
    filters: PropTypes.array.isRequired,
    defaultAllSelected: PropTypes.bool,
    eventName: PropTypes.string,
  }

  static defaultProps = {
    name: 'filterSet',
    eventName: 'filterSet',
    defaultAllSelected: false,
  }
  
  // Initialize state right in the class body,
  // with a property initializer:
  state = {
    filters: this.initFilters(this.props.defaultAllSelected)
  }

  componentDidMount() {
    Dispatcher.register(this.props.eventName + ':reset', this.handleReset);
  }
  
  componentWillUnmount() {
    Dispatcher.unregister(this.props.eventName + ':reset', this.handleReset);
  }
  
  handleReset() {
    this.setState({
      filters: this.initFilters(false),
    });
  }

  initFilters(value) {
    return this.props.filters && this.props.filters.map(function(item) {
      item.isChecked = value;
      return item;
    });
  }

  handleChange(index) {
    var filters = this.state.filters;
    filters[index].isChecked = !filters[index].isChecked;
    this.setState({
      filters: filters
    });
    this.dispatchChange();
    
  }

  handleSelectAll(value) {
    var filters = this.initFilters(value);

    this.setState({
      filters: filters
    });

    this.dispatchChange();
  }

  dispatchChange() {
    var filters = this.state.filters && this.state.filters.filter(function(item) {
      return item.isChecked;
    });
    this.props.onChange(this.props.name, filters)
    Dispatcher.dispatch(this.props.eventName + ':change', this.props.name, filters);
  }

  render() {
    var items = [];
    var selectedItems = 0;

    this.state.filters && this.state.filters.map(function(item, index) {
      if (item.isChecked) {
        selectedItems++;
      }

      var key = this.props.name + '-' + index;
      items.push(
        <li key={key}>
          <input type="checkbox"
            id={key}
            checked={item.isChecked}
            onChange={this.handleChange.bind(this, index)} />
          <label htmlFor={key}>{ item.label}</label>
        </li>
      );
    }.bind(this));

    var currentState = 'some';
    if (selectedItems <= 0) {
      currentState = 'none';
    } else if (selectedItems >= this.props.filters.length) {
      currentState = 'all';
    }

    var label1ClassName = (currentState === 'all') ? 'active' : '';
    var label1 = <span className={'button ' + label1ClassName} onClick={this.handleSelectAll.bind(this, true)}>{this.props.label1}</span>;
    var label2ClassName = (currentState === 'none') ? 'active' : '';
    var label2 = <span className={'button ' + label2ClassName} onClick={this.handleSelectAll.bind(this, false)}>{this.props.label2}</span>;

    return (
      <ul className="filterset">
        {/* <li>
          <label className="select-all">
            <span className="state">{currentState}</span>
            {label1} {label2}
          </label>
        </li> */}
        {items}
      </ul>
    );
  }

  }

export default FilterSetCheckbox;