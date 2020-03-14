import React from 'react';
import notification from 'helpers/notification';
import reactImage from 'images/react.png';
import { getContainer } from 'helpers/randomize';
import { store } from 'rc-notifications';

export default class CustomContentExample extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
    this.addCustomIcon = this.addCustomIcon.bind(this);
    this.cachedImage = null;
  }

  componentDidMount() {
    this.cachedImage = new Image();
    this.cachedImage.src = reactImage;
  }

  addCustomIcon(type, iconClassName) {
    let message;
    if (type === 'success') {
      message = 'Your agenda has been successfully synced';
    } else if (type === 'warning') {
      message = 'Warning! All your data will be lost if you proceed';
    } else if (type === 'danger') {
      message = 'Error! You have no update rights';
    }

    store.addNotification(
      Object.assign({}, notification, {
        width: 275,
        container: getContainer(),
        content: (
          <div className={`notification-custom-${type}`}>
            <div className="notification-custom-icon">
              <i className={iconClassName} />
            </div>
            <div className="notification-custom-content">
              <p className="notification-message">{message}</p>
            </div>
          </div>
        )
      })
    );
  }

  add() {
    store.addNotification(
      Object.assign({}, notification, {
        width: 325,
        container: getContainer(),
        content: () => (
          <div className="custom-image-content">
            <img src={this.cachedImage.src} alt="" />
          </div>
        )
      })
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
          <h6>Custom Content</h6>
          <div>
            With <code className="white-code">react-notifications-component</code>{' '}
            {"notification's"} content can be customised to suit your needs.
          </div>
          <div>
            <button className="btn btn-outline-secondary" onClick={this.add}>
              Custom Image Content
            </button>
            <div>
              <button
                className="btn btn-outline-secondary"
                onClick={() => this.addCustomIcon('success', 'fa fa-check-circle')}
              >
                Success with Icon
              </button>{' '}
              <button
                className="btn btn-outline-secondary"
                onClick={() => this.addCustomIcon('danger', 'fa fa-exclamation-circle')}
              >
                Danger with Icon
              </button>{' '}
              <button
                className="btn btn-outline-secondary"
                onClick={() => this.addCustomIcon('warning', 'fa fa-exclamation-triangle')}
              >
                Warning with Icon
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
