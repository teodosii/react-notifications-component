import { iNotification, iNotificationCustomType, iNotificationStoreParams, iStore } from 'src/types'
import { parseNotification } from 'src/utils/helpers'
import { validateTransition, validators } from 'src/utils/validators'

class Store implements iStore {
  constructor() {
    this.counter = 0
    this.add = null
  }

  public removeNotification: (id: string) => void
  public removeAllNotifications: () => void

  private types: iNotificationCustomType[]
  private add: (notification: iNotification) => string
  private defaultNotificationWidth: number
  private counter: number

  private incrementCounter = () => (this.counter += 1)

  public addNotification(notification: iNotification) {
    if (process.env.NODE_ENV === 'development') {
      const transitions = ['slidingEnter', 'slidingExit', 'touchRevert', 'touchSlidingExit']
      transitions.forEach((transition) => validateTransition(notification, transition))
      validators.forEach((validator) => validator(notification, this.types))
    }

    this.incrementCounter()

    const parsedNotification = parseNotification(
      notification,
      this.types,
      this.defaultNotificationWidth
    )


    return this.add(parsedNotification)
  }

  public getCounter = () => this.counter

  public register(parameters: iNotificationStoreParams) {
    const {
      addNotification,
      removeNotification,
      removeAllNotifications,
      types,
      defaultNotificationWidth
    } = parameters

    this.add = addNotification
    this.removeNotification = removeNotification
    this.removeAllNotifications = removeAllNotifications
    this.defaultNotificationWidth = defaultNotificationWidth
    this.types = types
  }
}

export default new Store()
