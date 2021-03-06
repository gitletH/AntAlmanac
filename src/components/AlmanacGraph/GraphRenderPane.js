import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
const styles = () => ({
  multiline: {
    whiteSpace: "pre"
  }
});

class GraphRenderPane extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, graph: null };
  }

  componentDidMount() {
    if (this.props.length < 4) {
      this.setState({ open: true }, () => {
        this.fetchGraph(
          this.props.quarter,
          this.props.year,
          this.props.section.classCode
        );
      });
    }
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (prevProps !== this.props && this.props.length < 4) {
      this.setState({ open: true }, () => {
        this.fetchGraph(
          this.props.quarter,
          this.props.year,
          this.props.section.classCode
        );
      });
    }
  }

  handleOpen = () => {
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open && this.state.graph === null)
        this.fetchGraph(
          this.props.quarter,
          this.props.year,
          this.props.section.classCode
        );
    });
  };

  fetchGraph(quarter, year, code) {
    const url = `https://l5qp88skv9.execute-api.us-west-1.amazonaws.com/dev/${quarter}/${year}/${code}`;

    fetch(url, { signal: this.signal })
      .then(resp => resp.text())
      .then(resp => {
        this.setState({ graph: { __html: resp } });
      });
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>Type</th>
              <th>Instructors</th>
              <th>Times</th>
              <th>Places</th>
              <th>Max Cap</th>
            </tr>
            <tr>
              <td className={this.props.classes.multiline}>
                {`${this.props.section.classType}
Section: ${this.props.section.sectionCode}
Units: ${this.props.section.units}`}
              </td>
              <td className={this.props.classes.multiline}>
                {this.props.section.instructors.join("\n")}
              </td>
              <td className={this.props.classes.multiline}>
                {this.props.section.meetings
                  .map(meeting => meeting[0])
                  .join("\n")}
              </td>
              <td className={this.props.classes.multiline}>
                {this.props.section.meetings
                  .map(meeting => meeting[1])
                  .join("\n")}
              </td>
              <td>{this.props.section.maxCapacity}</td>
            </tr>
          </tbody>
        </table>
        {
          <div>
            <Button variant="contained" onClick={() => this.handleOpen()}>
              OPEN/CLOSE
            </Button>
            {this.state.open ? (
              <div
                style={{ width: "85%" }}
                dangerouslySetInnerHTML={this.state.graph}
              />
            ) : null}
          </div>
        }
      </div>
    );
  }
}

GraphRenderPane.propTypes = {
  section: PropTypes.shape({
    meetings: PropTypes.array,
    classCode: PropTypes.string,
    classType: PropTypes.string,
    sectionCode: PropTypes.string,
    units: PropTypes.string,
    instructors: PropTypes.array,
    numCurrentlyEnrolled: PropTypes.string,
    maxCapacity: PropTypes.string,
    numOnWaitlist: PropTypes.string,
    numNewOnlyReserved: PropTypes.string,
    restrictions: PropTypes.string,
    status: PropTypes.string
  }),
  length: PropTypes.number,
  quarter: PropTypes.string,
  year: PropTypes.string
};

export default withStyles(styles)(GraphRenderPane);
