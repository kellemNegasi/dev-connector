import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmpyty from "../../validation/is-empty";

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;
    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img src={profile.user.avatar} alt="" className="rounded-circle" />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h1>{profile.user.name}</h1>
            <p className="h1">
              {profile.status}{" "}
              {isEmpyty(profile.copmany) ? null : (
                <span>at {profile.copmany}</span>
              )}
            </p>
            <p className="h1">
              {isEmpyty(profile.location) ? null : (
                <span>{profile.location}</span>
              )}
            </p>
            <Link to={`/profile/${profile.handle}`} className="btn btn-info">
              View Profile
            </Link>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <h2>Skill Set</h2>
            <ul className="h2 list-group">
              {profile.skills.slice(0, 4).map((skill, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-primary"
                >
                  <i className="fa fa-check pr-1" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};
export default ProfileItem;
