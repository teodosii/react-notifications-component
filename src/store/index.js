import { parseNotification } from '../utils/helpers';
import { validateTransition, validators } from '../utils/validators';

function Store() {
  this.types = null;
  this.counter = 0;
  this.add = () => {};

  this.addNotification = notification => {
    const { types } = this;

    if (process.env.NODE_ENV === 'development') {
      const transitions = ['slidingEnter', 'slidingExit', 'touchRevert', 'touchSlidingExit'];
      transitions.forEach(transition => validateTransition(notification, transition));
      validators.forEach(validator => validator(notification, types));
    }

    this.counter += 1;
    return this.add(parseNotification(notification, types));
  };

  this.removeNotification = () => {};
  this.register = ({ addNotification, removeNotification, types }) => {
    this.add = addNotification;
    this.removeNotification = removeNotification;
    this.types = types;
  };

  return this;
}

export default new Store();
