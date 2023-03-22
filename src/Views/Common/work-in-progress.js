import React from "react";
import { connect } from "react-redux";
class WorkInProgress extends React.Component {
  render() {
    return (
      <div>
        {window.location.href}
        <div style={{ whiteSpace: "pre" }}>
          {JSON.stringify(this.props.state, null, 8)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  state,
});

export default connect(mapStateToProps)(WorkInProgress);
