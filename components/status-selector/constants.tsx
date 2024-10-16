import { ProductionStatusEnum, TaskStatusEnum, UserStatusEnum } from 'types/status-enums';
import { ToDoIcon } from 'icons/to-do';
import { BlockedIcon } from 'icons/blocked';
import { PlayCircleIcon } from 'icons/play-circle';
import { DoneIcon } from 'icons/done';
import { CanceledIcon } from 'icons/canceled';
import { StockIcon } from 'icons/stock';
import { PauseCircleIcon } from 'icons/pause-circle';
import { RestoreIcon } from 'icons/restore';
import { DeactivatedIcon } from 'icons/deactivated';
import { InactivatedIcon } from 'icons/inactivated';
import PendingIcon from 'icons/pending-icon';
import { CircularProgress } from '@mui/material';

export const statuses = {
  [ProductionStatusEnum.To_Do]: {
    text: 'To do',
    color: 'light_blue',
    className: 'to_do',
    value: ProductionStatusEnum.To_Do,
    iconLeft: <ToDoIcon width="16px" height="16px" />,
  },
  [ProductionStatusEnum.Launching]: {
    text: 'Launching',
    color: 'light_blue',
    className: 'launching',
    value: ProductionStatusEnum.Launching,
    iconLeft: <CircularProgress size={13} style={{ marginRight: '4px' }} />,
  },
  [ProductionStatusEnum.Stopped]: {
    text: 'Stopped',
    color: 'red',
    className: 'stopped',
    value: ProductionStatusEnum.Stopped,
    iconLeft: <BlockedIcon width="16px" height="16px" />,
  },
  [ProductionStatusEnum.In_Progress]: {
    text: 'In progress',
    color: 'blue',
    className: 'in_progress',
    value: ProductionStatusEnum.In_Progress,
    iconLeft: <PlayCircleIcon width="16px" height="16px" />,
  },
  [ProductionStatusEnum.Done]: {
    text: 'Done',
    color: 'green',
    className: 'done',
    value: ProductionStatusEnum.Done,
    iconLeft: <DoneIcon width="16px" height="16px" />,
  },
  [ProductionStatusEnum.Canceled]: {
    text: 'Canceled',
    color: 'green',
    className: 'canceled',
    value: ProductionStatusEnum.Canceled,
    iconLeft: <CanceledIcon width="16px" height="16px" />,
  },
  [ProductionStatusEnum.From_Stock]: {
    text: 'From stock',
    color: 'green',
    className: 'from_stock',
    value: ProductionStatusEnum.From_Stock,
    iconLeft: <StockIcon width="16px" height="16px" />,
  },
  [TaskStatusEnum.On_Hold]: {
    text: 'On hold',
    color: 'blue',
    className: 'on_hold',
    value: TaskStatusEnum.On_Hold,
    iconLeft: <PauseCircleIcon width="16px" height="16px" />,
  },
  [TaskStatusEnum.Blocked]: {
    text: 'Blocked',
    color: 'red',
    className: 'blocked',
    value: TaskStatusEnum.Blocked,
    iconLeft: <BlockedIcon width="16px" height="16px" />,
  },
  [TaskStatusEnum.Reopened]: {
    text: 'Reopened',
    color: 'light_blue',
    className: 'reopened',
    value: TaskStatusEnum.Reopened,
    iconLeft: <RestoreIcon width="16px" height="16px" />,
  },
  [UserStatusEnum.Active]: {
    text: 'Active',
    className: 'active',
    value: UserStatusEnum.Active,
    iconLeft: <DeactivatedIcon width="16px" height="16px" />,
  },
  [UserStatusEnum.Inactive]: {
    text: 'Inactive',
    className: 'inactive',
    value: UserStatusEnum.Inactive,
    iconLeft: <InactivatedIcon width="16px" height="16px" />,
  },
  [UserStatusEnum.Pending]: {
    text: 'Pending',
    className: 'pending',
    value: UserStatusEnum.Pending,
    iconLeft: <PendingIcon width="16px" height="16px" />,
  },
};

export const configurableStatuses = {
  user_pending: {
    [UserStatusEnum.Pending]: [statuses[UserStatusEnum.Inactive]],
  },
  user_activated: {
    [UserStatusEnum.Active]: [statuses[UserStatusEnum.Inactive]],
    [UserStatusEnum.Inactive]: [statuses[UserStatusEnum.Active]],
  },
  users: {
    [UserStatusEnum.Active]: [statuses[UserStatusEnum.Inactive]],
    [UserStatusEnum.Inactive]: [statuses[UserStatusEnum.Active]],
  },
  production: {
    [ProductionStatusEnum.To_Do]: [statuses[ProductionStatusEnum.In_Progress], statuses[ProductionStatusEnum.Canceled]],
    [ProductionStatusEnum.From_Stock]: [statuses[ProductionStatusEnum.In_Progress], statuses[ProductionStatusEnum.Canceled]],
    [ProductionStatusEnum.In_Progress]: [statuses[ProductionStatusEnum.Stopped], statuses[ProductionStatusEnum.Canceled]],
    [ProductionStatusEnum.Stopped]: [statuses[ProductionStatusEnum.In_Progress], statuses[ProductionStatusEnum.Canceled]],
  },
  task: {
    [TaskStatusEnum.To_Do]: [
      statuses[TaskStatusEnum.Blocked],
      statuses[TaskStatusEnum.In_Progress],
      statuses[TaskStatusEnum.On_Hold],
      statuses[TaskStatusEnum.Canceled],
    ],
    [TaskStatusEnum.In_Progress]: [
      statuses[TaskStatusEnum.Blocked],
      statuses[TaskStatusEnum.On_Hold],
      statuses[TaskStatusEnum.Done],
      statuses[TaskStatusEnum.Canceled],
    ],
    [TaskStatusEnum.On_Hold]: [
      statuses[TaskStatusEnum.Blocked],
      statuses[TaskStatusEnum.In_Progress],
      statuses[TaskStatusEnum.Canceled],
    ],
    [TaskStatusEnum.Blocked]: [
      statuses[TaskStatusEnum.In_Progress],
      statuses[TaskStatusEnum.On_Hold],
      statuses[TaskStatusEnum.Canceled],
    ],
    [TaskStatusEnum.Canceled]: [
      statuses[TaskStatusEnum.To_Do],
      statuses[TaskStatusEnum.Blocked],
      statuses[TaskStatusEnum.On_Hold],
    ],
    [TaskStatusEnum.Reopened]: [
      statuses[TaskStatusEnum.Blocked],
      statuses[TaskStatusEnum.In_Progress],
      statuses[TaskStatusEnum.On_Hold],
      statuses[TaskStatusEnum.Canceled],
    ],
    [TaskStatusEnum.Done]: [statuses[TaskStatusEnum.In_Progress], statuses[TaskStatusEnum.Reopened]],
  },
};
