import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
    console.log("profile in component did mount ", this.props.profile);
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let dashboardContent;
    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      console.log(profile);
      if (Object.keys(profile).length > 0) {
        dashboardContent = <h1>TODO: DISPLAY PROFILE HERE</h1>;
      } else {
        dashboardContent = (
          <div>
            <p className="load text-muted">Welcome {user.name}</p>
            <p>You have not yet created a profile pleas add some info </p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-mid-12">
              <h1 className="display-4">Dashboared</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
