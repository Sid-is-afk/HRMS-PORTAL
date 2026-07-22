import { queueManager } from '@/core/offline/queueManager';
import { useOfflineStore } from '@/shared/stores/offlineStore';
import { createOfflineAction } from '../models/offlineModels';

/**
 * Wraps an API call with queue fallback if offline.
 * @param {Function} apiCall The actual API request promise
 * @param {string} actionType From SYNC_EVENTS
 * @param {string} endpoint The API URL
 * @param {string} method HTTP Method (POST, PUT, DELETE)
 * @param {Object} payload The request body
 */
export const executeOrQueue = async (apiCall, actionType, endpoint, method, payload) => {
  const isOnline = useOfflineStore.getState().isOnline;

  if (isOnline) {
    try {
      return await apiCall();
    } catch (error) {
      // If error is network related, we could fallback to queue here as well
      if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
        return queueOfflineFallback(actionType, endpoint, method, payload);
      }
      throw error; // Re-throw business errors (e.g. 400 Bad Request)
    }
  } else {
    return queueOfflineFallback(actionType, endpoint, method, payload);
  }
};

const queueOfflineFallback = (type, endpoint, method, payload) => {
  const action = createOfflineAction(type, endpoint, method, payload);
  queueManager.enqueueAction(action);
  console.log(`[OfflineUtils] Action queued for offline sync: ${type}`);
  return { offline: true, actionId: action.id, message: 'Action queued for offline sync.' };
};
