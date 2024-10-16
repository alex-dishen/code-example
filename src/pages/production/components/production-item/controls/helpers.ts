import { ProductionStatusEnum } from 'types/status-enums';

export const returnProgressColor = (progress: number, status?: string) => {
  switch (true) {
    case status === ProductionStatusEnum.Stopped:
      return 'red';
    case status === ProductionStatusEnum.Canceled:
      return 'green';
    case progress <= 30:
      return 'light_blue';
    case progress > 30 && progress <= 99:
      return 'blue';
    case progress === 100:
      return 'green';
    default:
      return 'blue';
  }
};
