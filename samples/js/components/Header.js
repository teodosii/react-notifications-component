import React from "react";
import "react-github-button/assets/style.css";
import GitHubButton from "react-github-button";

export default function Header() {
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">React-Notifications</h1>
        <p className="header-desc">Notifications for React. Highly configurable and easy to use</p>
        <div className="header-buttons">
          <GitHubButton type="stargazers" size="large" namespace="teodosii" repo="react-notifications-component" />
        </div>
      </div>
    </div>
  );
}