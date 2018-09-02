import React from "react";

export default function Header() {
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">React-Notifications</h1>
        <p className="header-desc">Notifications for React. Highly configurable and easy to use</p>
        <div className="header-buttons">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary no-corner"
            href={"https://github.com/teodosii/react-notifications-component"}
          >
            View on Github
          </a>
        </div>
      </div>
    </div>
  );
}