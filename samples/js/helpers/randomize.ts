const containers = [
  'top-left',
  'top-right',
  'top-center',
  'center',
  'bottom-left',
  'bottom-right',
  'bottom-center'
];

const types = ['success', 'danger', 'warning', 'default', 'info', 'awesome'];

const successMessages = [
  'All your data has been successfully updated',
  'Your meeting has been successfully attended',
  'Document has been successfully updated'
];

const errorMessages = [
  'You have no access rights',
  'An error occurred while saving',
  'Document has been permanently removed'
];

const warningMessages = [
  'Your connection is not private',
  "Your local datetime is not in sync with server's date",
  "You've already done this action"
];

const defaultMessages = [
  'All your messages have been logged',
  'A new issue has been reported by Office Desk'
];

const infoMessages = [
  'A new appointment has been created in your agenda',
  'You have an appointment at 4PM today'
];

const customMessages = [
  'Custom types can be used as well. Pretty cool, huh!?',
  'Types are easily configurable. Nice, huh?!'
];

export function getContainer() {
  return containers[Math.floor(Math.random() * containers.length)];
}

export function getType() {
  return types[Math.floor(Math.random() * types.length)];
}

export function getTitle(type: string) {
  switch (type) {
    case 'success':
      return 'Success';
    case 'danger':
      return 'Error';
    case 'warning':
      return 'Warning';
    case 'info':
      return undefined;
    case 'default':
    case 'awesome':
      return undefined;
  }
}

export function getMessage(type: string) {
  switch (type) {
    case 'success':
      return successMessages[Math.floor(Math.random() * successMessages.length)];
    case 'danger':
      return errorMessages[Math.floor(Math.random() * errorMessages.length)];
    case 'warning':
      return warningMessages[Math.floor(Math.random() * warningMessages.length)];
    case 'info':
      return infoMessages[Math.floor(Math.random() * infoMessages.length)];
    case 'default':
      return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
    case 'awesome':
      return customMessages[Math.floor(Math.random() * customMessages.length)];
  }
}
