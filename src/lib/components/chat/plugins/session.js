import { v4 as uuidv4 } from 'uuid';

// Create a ref for the current session ID
const currentSessionId = { value: '' };
const localStorageSessionIdKey = 'chatSessionId';

async function startNewSession() {
    currentSessionId.value = uuidv4();
    localStorage.setItem(localStorageSessionIdKey, currentSessionId.value);
    return currentSessionId.value;
}

async function loadPreviousSession(sessionId) {
    if (!sessionId) {
        // Try to get from localStorage if no sessionId provided
        sessionId = localStorage.getItem(localStorageSessionIdKey);
    }
    
    if (sessionId) {
        currentSessionId.value = sessionId;
        localStorage.setItem(localStorageSessionIdKey, sessionId);
        return currentSessionId.value;
    }
    
    return false;
}

async function deleteSession(sessionId) {
    if (!sessionId) {
        sessionId = currentSessionId.value;
    }
    
    if (sessionId === currentSessionId.value) {
        // If we're deleting the current session, start a new one
        await startNewSession();
    }
    return true;
}

export {
    startNewSession,
    loadPreviousSession,
    deleteSession,
    currentSessionId
};
