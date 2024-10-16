import { WebsocketResponseMessageForProductionWorkflowT } from 'pages/production/controllers/production-list-controller/types';
import { WebSocketHook } from 'react-use-websocket/dist/lib/types';

export type UseWebsocketType = Omit<
  WebSocketHook<MessageEvent<WebsocketResponseMessageForProductionWorkflowT>>,
  'lastJsonMessage'
> & {
  lastJsonMessage: WebsocketResponseMessageForProductionWorkflowT;
};
