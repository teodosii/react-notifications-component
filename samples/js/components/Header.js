import React from "react";

export default function Header({ instance }) {
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">React-Notifications</h1>
        <p className="header-desc">Notifications for React. Highly configurable and easy to use</p>
        <div className="header-buttons">
          <button type="button" className="btn btn-primary no-corner">View on GitHub</button>
        </div>
      </div>
    </div>
  );
}