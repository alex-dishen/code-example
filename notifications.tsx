import { toast, Id, ToastContent, ToastOptions } from 'react-toastify';
import checkGreenIcon from 'icons/svg/check-green.svg';
import noWayIcon from 'icons/svg/no-way.svg';

const defaultOptions: ToastOptions = {
  autoClose: 6000,
  draggable: true,
  closeOnClick: false,
  hideProgressBar: true,
  closeButton: false,
  position: 'top-center',
  theme: 'colored',
};

export const notify = {
  default: (content: ToastContent<unknown>, options?: ToastOptions): Id => {
    const successOptions: ToastOptions = {
      ...defaultOptions,
      type: 'default',
      ...options,
    };
    if (typeof content === 'function') {
      return toast(({ ...props }) => content({ ...props }), successOptions);
    }
    return toast(content, successOptions);
  },
  info: (content: ToastContent<unknown>, options?: ToastOptions): Id => {
    const successOptions: ToastOptions = {
      ...defaultOptions,
      type: 'info',
      ...options,
    };
    if (typeof content === 'function') {
      return toast(({ ...props }) => content({ ...props }), successOptions);
    }
    return toast(content, successOptions);
  },
  success: (content: ToastContent<unknown>, options?: ToastOptions): Id => {
    const successOptions: ToastOptions = {
      ...defaultOptions,
      type: 'success',
      icon: <img src={checkGreenIcon} alt="icon" />,
      ...options,
    };
    if (typeof content === 'function') {
      return toast(({ ...props }) => content({ ...props }), successOptions);
    }
    return toast(content, successOptions);
  },
  warning: (content: ToastContent<unknown>, options?: ToastOptions): Id => {
    const successOptions: ToastOptions = {
      ...defaultOptions,
      type: 'warning',
      ...options,
    };
    if (typeof content === 'function') {
      return toast(({ ...props }) => content({ ...props }), successOptions);
    }
    return toast(content, successOptions);
  },
  error: (content?: ToastContent<unknown>, options?: ToastOptions): Id => {
    const successOptions: ToastOptions = {
      ...defaultOptions,
      type: 'error',
      icon: <img src={noWayIcon} alt="icon" />,
      ...options,
    };
    if (typeof content === 'function') {
      return toast(({ ...props }) => content({ ...props }), successOptions);
    }
    return toast(content || 'Something went wrong', successOptions);
  },
};
