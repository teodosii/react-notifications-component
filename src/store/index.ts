import { iNotification, iNotificationCustomType } from 'src/types/Notification';
import { parseNotification } from 'src/utils/helpers';
import { validateTransition, validators } from 'src/utils/validators';

interface iStore {
  addNotification(notification: iNotification): string;
  removeNotification(id: string): void;
  register(param: iRegisterParameter): void;
}

interface iRegisterParameter {
  addNotification: Function;
  removeNotification: () => void;
  types: iNotificationCustomType[];
}

class Store implements iStore {
  constructor() {
    this.counter = 0;
    this.add = null;
  }

  public counter: number;
  public removeNotification: (id: string) => void;

  private types: iNotificationCustomType[];
  private add: (notification: iNotification) => string;

  public addNotification(notification: iNotification) {
    if (process.env.NODE_ENV === 'development') {
      const transitions = ['slidingEnter', 'slidingExit', 'touchRevert', 'touchSlidingExit'];
      transitions.forEach((transition) => validateTransition(notification, transition));
      validators.forEach((validator) => validator(notification, this.types));
    }

    this.counter += 1;
    return this.add(parseNotification(notification, this.types));
  }

  public register({ addNotification, removeNotification, types }) {
    this.add = addNotification;
    this.removeNotification = removeNotification;
    this.types = types;
  }
}

export default new Store();
