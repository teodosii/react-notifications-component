import { parseNotification } from './helpers';
import { validateTransition, validators } from './validators';

function Store() {
  this.types = null;
  this.add = () => {};

  this.addNotification = (notification) => {
    const { types } = this;

    if (process.env.NODE_ENV === 'development') {
      const transitions = ['slidingEnter','slidingExit', 'touchSlidingBack', 'touchSlidingExit'];
      transitions.forEach((transition) => validateTransition(notification, transition));
      validators.forEach((validator) => validator(notification, types));
    }

    return this.add(parseNotification(notification, types));
  };
  
  this.removeNotification = () => {};
  this.register = ({ addNotification, removeNotification, types }) => {
    this.add = addNotification;
    this.removeNotification = removeNotification;
    this.userDefinedTypes = types;
  };

  return this;
}

export default new Store();