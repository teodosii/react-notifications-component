## Examples

#### Custom notification type
Following example shows usage of custom notification type defined as option

```jsx
import React from "react";
import ReactNotification from "react-notifications-component";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addNotification = this.addNotification.bind(this);
  }

  addNotification() {
    this.notificationDOMRef.addNotification({
      // other properties have been omitted for brevity
      type: "awesome",
      title: "Custom",
      message: "Notifications can be customized to suit your needs",
      container: "top-right"
    }));
  }

  render() {
    return (
      <div className="app-content">
        <ReactNotification
          types={[{
            htmlClasses: ["notification-awesome"],
            name: "awesome"
          }]}
          ref={input => this.notificationDOMRef = input}
        />
      </div>
    );
  }
}
```

Custom types need to use custom CSS (not included in `react-notifications-component`)

```scss
.notification-awesome {
  background-color: #685dc3;
  border-left: 8px solid darken(#685dc3, 15%);
}
```

#### Custom content with FontAwesome's check mark
This example shows usage of Font Awesome check mark to be included in your notification along with desired custom content

```jsx
this.reactNotificationRef.addNotification({
  // other properties have been omitted for brevity
  container: "top-right",
  content: (
    <div className="notification-custom-success">
      <div className="notification-custom-icon">
        <i className="fa fa-check" />
      </div>
      <div className="notification-custom-content">
        <p className="notification-message">GitHub is awesome!</p>
      </div>
    </div>
  )
}));
```

You also need to update your CSS correspondingly to your custom markup

```scss
.notification-custom-icon {
  flex-basis: 20%;
  position: relative;
  display: inline-block;
  padding: 8px 8px 8px 12px;

  .fa {
    top: 50%;
    left: 50%;
    color: #fff;
    font-size: 28px;
    position: relative;
    transform: translate(-50%, -50%);
  }
}

.notification-custom-success {
  width: 100%;
  display: flex;
  background-color: #28a745;

  .notification-custom-icon {
    border-left: 8px solid darken(#28a745, 15%);
  }
}
```