import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import ProfileActions from "../dashboard/ProfileActions";
class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  onDeleteClick(e) {
    this.props.deleteAccount();
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let dashboardContent;
    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <p className="load text-muted">
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>
            <ProfileActions />
            {/* add eperience and education here */}
            <div style={{ marginBottom: "60px", marginTop: "60px" }}>
              <button
                onClick={this.onDeleteClick.bind(this)}
                className="btn btn-danger"
              >
                Delete My Account
              </button>
            </div>
          </div>
        );
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
  deleteAccount: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
