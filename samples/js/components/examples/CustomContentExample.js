import React from "react";
import notification from "../../helpers/notification";
import reactImage from "../../../images/react.png";

export default class CustomContentExample extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
  }

  add() {
    const { addNotification } = this.props;

    addNotification(Object.assign({}, notification, {
      type: undefined,
      width: 275,
      content: (
        <div className="custom-image-content">
          <img
            src={reactImage}
            alt=""
          />
        </div>
      )
    }))
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-6 offset-lg-3 column col-md-10 offset-md-1 col-sm-12">
          <h6>Custom Content</h6>
          <div className="alert alert-warning alert-transparent">
            With <code className="white-code">react-notifications-component</code> notification's content can be customised to suit your needs.
          </div>
          <div>
            <button className="btn btn-outline-secondary" onClick={this.add}>
              Custom Image Content
            </button>
          </div>
        </div>
      </div>
    );
  }
}