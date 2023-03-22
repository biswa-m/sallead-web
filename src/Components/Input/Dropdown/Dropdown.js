import React, { Component } from "react";
import PropTypes from "prop-types";
import { startCase } from "lodash";
import "./dropdown.css";

class DropDown extends Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = {
      showSuggestions: false,
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    const {
      state: { showSuggestions },
      props: { value, onChange, options },
    } = this;

    const suggestionsListComponent = (
      <ul className="dd-suggestions">
        {options.map(({ value, label }, index) => {
          return (
            <li
              key={value}
              onClick={(e) => {
                e.stopPropagation();
                this.setState({ showSuggestions: false });
                onChange(value);
              }}
            >
              {label || startCase(value)}
            </li>
          );
        })}
      </ul>
    );

    return (
      <div ref={this.setWrapperRef}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ showSuggestions: !showSuggestions });
          }}
        >
          {options.find((x) => x.value === value)?.label ||
            startCase(value || "Select")}
        </div>

        {showSuggestions ? suggestionsListComponent : null}
      </div>
    );
  }
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        showSuggestions: false,
      });
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }
}

export default DropDown;
