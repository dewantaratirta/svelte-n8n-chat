import { startNewSession, loadPreviousSession, deleteSession, currentSessionId } from '../plugins/session.js';
import { configStore, getConfig } from './config-store.js';

export function createOptions(options) {
  configStore.updateConfig(options);
  return getConfig();
}

export const sendMessage = async (sessionId, chatInput) => {
  const config = getConfig();
  const url = config.WEBHOOK_URL || 'https://cobacoba.tech/webhook/61719009-d0a2-4713-b34c-7b9a9f286a30/chat';
  const sid = sessionId || config.SESSION_ID || '';

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "content-type": "application/json",
        "x-instance-id": config.INSTANCE_ID || '',
        // Only include essential headers for the request
      },
      body: JSON.stringify({
        action: "sendMessage",
        sessionId: sid,
        chatInput: chatInput
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

export const loadPreviousChat = async (sessionId) => {
  const config = getConfig();
  const url = config.HISTORY_URL;
  const sid = sessionId || config.SESSION_ID || '';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'x-instance-id': config.INSTANCE_ID || '',
        // Add other necessary headers here
      },
      body: JSON.stringify({
        action: 'loadPreviousSession',
        sessionId: sid
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load previous chat:', error);
    throw error;
  }
};
