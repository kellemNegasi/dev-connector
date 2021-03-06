import React, { Component } from "react";
import PropTypes from "prop-types";
class ProfileGihub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "587d025c5765eb3eb22c",
      clientSecret: "aa02ed91ad2f76f95bb784fff033f725b40ba9c9",
      count: 5,
      sort: "created:asc",
      repos: [],
    };
  }
  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (this.refs.myRef) {
          this.setState({
            repos: data,
          });
        }
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { repos } = this.state;
    const repoItems =
      repos.length === undefined
        ? null
        : repos.map((repo) => (
            <div key={repo.id} className="card card-body mb-2">
              <div className="row">
                <div className="col-md-6">
                  <h4>
                    <a
                      href={repo.html_url}
                      className="text-info"
                      target="_blank"
                    >
                      {repo.name}
                    </a>
                  </h4>
                  <p>{repo.description}</p>
                </div>
                <div className="col-md-6">
                  <span className="badge bg-info mr-1">
                    Stars:{repo.stargazers_count}
                  </span>
                  <span className="badge bg-secondary mr-1">
                    Watchers:{repo.watchers_count}
                  </span>
                  <span className="badge bg-success">
                    Forks:{repo.forks_count}
                  </span>
                </div>
              </div>
            </div>
          ));
    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGihub.propTypes = {
  username: PropTypes.string.isRequired,
};
export default ProfileGihub;
