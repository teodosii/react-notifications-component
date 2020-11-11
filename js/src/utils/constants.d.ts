export declare const DEFAULT_CONTAINER_VALUES: {
    isMobile: boolean;
    breakpoint: number;
    defaultNotificationWidth: number;
};
export declare const NOTIFICATION_BASE_CLASS = "notification__item";
export declare enum NOTIFICATION_CONTAINER {
    BOTTOM_LEFT = "bottom-left",
    BOTTOM_RIGHT = "bottom-right",
    BOTTOM_CENTER = "bottom-center",
    TOP_LEFT = "top-left",
    TOP_RIGHT = "top-right",
    TOP_CENTER = "top-center",
    CENTER = "center",
    TOP_FULL = "top-full",
    BOTTOM_FULL = "bottom-full"
}
export declare enum INSERTION {
    TOP = "top",
    BOTTOM = "bottom"
}
export declare enum NOTIFICATION_TYPE {
    SUCCESS = "success",
    DANGER = "danger",
    INFO = "info",
    DEFAULT = "default",
    WARNING = "warning"
}
export declare enum REMOVAL {
    TIMEOUT = "timeout",
    CLICK = "click",
    TOUCH = "touch",
    MANUAL = "manual"
}
export declare const ERROR: {
    ANIMATION_IN: string;
    ANIMATION_OUT: string;
    DISMISS_REQUIRED: string;
    DISMISS_NUMBER: string;
    DISMISS_POSITIVE: string;
    DISMISS_CLICK_BOOL: string;
    DISMISS_TOUCH_BOOL: string;
    DISMISS_WAIT: string;
    DISMISS_PAUSE_BOOL: string;
    DISMISS_ONSCREEN_BOOL: string;
    DISMISS_ICON: string;
    TITLE_STRING: string;
    TITLE_ELEMENT: string;
    MESSAGE_REQUIRED: string;
    MESSAGE_STRING: string;
    MESSAGE_ELEMENT: string;
    TYPE_REQUIRED: string;
    TYPE_STRING: string;
    TYPE_NOT_EXISTENT: string;
    CONTAINER_REQUIRED: string;
    CONTAINER_STRING: string;
    CONTENT_INVALID: string;
    WIDTH_NUMBER: string;
    INSERT_STRING: string;
    TRANSITION_DURATION_NUMBER: string;
    TRANSITION_TIMING_FUNCTION: string;
    TRANSITION_DELAY_NUMBER: string;
    TYPE_NOT_FOUND: string;
    REMOVAL_FUNC: string;
};
