import { SerializedUser } from '../utilities/request.utilities.types';

export type NotificationContextType = {
  loading: boolean;
  requests: SerializedUser[] | undefined;
  getRequests: () => Promise<void>;
};
