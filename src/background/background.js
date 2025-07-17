// Enhanced Background Script for Findom Elite Tracker - Memory Leak Prevention
console.log('🚀 Enhanced Background script loaded');

// Global memory leak tracking
let backgroundIntervals = new Set();
let backgroundTimeouts = new Set();

// Enhanced setTimeout with tracking
function trackedSetTimeout(callback, delay) {
    const id = setTimeout(() => {
        backgroundTimeouts.delete(id);
        callback();
    }, delay);
    backgroundTimeouts.add(id);
    return id;
}

// Enhanced setInterval with tracking
function trackedSetInterval(callback, delay) {
    const id = setInterval(callback, delay);
    backgroundIntervals.add(id);
    return id;
}

// Memory leak cleanup function
function cleanupBackgroundMemory() {
    console.log('🧹 Cleaning up background memory...');
    
    // Clear all tracked timeouts
    backgroundTimeouts.forEach(id => clearTimeout(id));
    backgroundTimeouts.clear();
    
    // Clear all tracked intervals
    backgroundIntervals.forEach(id => clearInterval(id));
    backgroundIntervals.clear();
    
    // Clear all alarms
    chrome.alarms.clearAll();
    
    console.log('✅ Background memory cleaned up');
}

// Setup cleanup on extension events
chrome.runtime.onSuspend.addListener(cleanupBackgroundMemory);
chrome.runtime.onSuspendCanceled.addListener(cleanupBackgroundMemory);

// Storage health monitoring - with memory leak prevention
let storageHealthInterval;
let activationCheckInterval;

// Initialize background services
chrome.runtime.onStartup.addListener(() => {
    console.log('🔄 Extension startup');
    initializeBackgroundServices();
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('📦 Extension installed/updated');
    initializeBackgroundServices();
});

// Initialize background services
function initializeBackgroundServices() {
    console.log('🔧 Initializing background services...');
    
    // Start storage health monitoring
    startStorageHealthMonitoring();
    
    // Start activation monitoring
    startActivationMonitoring();
    
    // Set up alarm for periodic tasks
    setupPeriodicAlarms();
}

// Storage health monitoring - Memory leak safe
function startStorageHealthMonitoring() {
    console.log('💾 Starting storage health monitoring...');
    
    if (storageHealthInterval) {
        clearInterval(storageHealthInterval);
        backgroundIntervals.delete(storageHealthInterval);
    }
    
    storageHealthInterval = trackedSetInterval(async () => {
        try {
            // Monitor storage usage
            const result = await chrome.storage.local.get(null);
            const dataSize = JSON.stringify(result).length;
            
            console.log(`📊 Storage usage: ${dataSize} bytes`);
            
            // Clean up old data if needed
            if (dataSize > 1000000) { // 1MB limit
                await cleanupOldData();
            }
            
        } catch (error) {
            console.error('❌ Storage health check failed:', error);
        }
    }, 300000); // Check every 5 minutes
}

// Activation monitoring
function startActivationMonitoring() {
    console.log('👤 Starting activation monitoring...');
    
    if (activationCheckInterval) {
        clearInterval(activationCheckInterval);
    }
    
    activationCheckInterval = trackedSetInterval(async () => {
        try {
            const result = await chrome.storage.local.get(['userActivated', 'activationExpiry']);
            
            if (result.userActivated && result.activationExpiry) {
                if (Date.now() > result.activationExpiry) {
                    console.log('⏰ Activation expired, resetting...');
                    await resetActivation();
                }
            }
            
        } catch (error) {
            console.error('❌ Activation check failed:', error);
        }
    }, 60000); // Check every minute
}

// Setup periodic alarms
function setupPeriodicAlarms() {
    chrome.alarms.create('dailyCleanup', {
        delayInMinutes: 60, // First cleanup in 1 hour
        periodInMinutes: 1440 // Then every 24 hours
    });
    
    chrome.alarms.create('syncReminder', {
        delayInMinutes: 30, // First reminder in 30 minutes
        periodInMinutes: 360 // Then every 6 hours
    });
}

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    switch (alarm.name) {
        case 'dailyCleanup':
            performDailyCleanup();
            break;
        case 'syncReminder':
            sendSyncReminder();
            break;
    }
});

// Clean up old data
async function cleanupOldData() {
    try {
        console.log('🧹 Cleaning up old data...');
        
        const result = await chrome.storage.local.get(['tributes', 'taskHistory', 'logs']);
        
        // Clean up old tributes (keep last 100)
        if (result.tributes && result.tributes.length > 100) {
            const recentTributes = result.tributes.slice(-100);
            await chrome.storage.local.set({ tributes: recentTributes });
        }
        
        // Clean up old task history (keep last 7 days)
        if (result.taskHistory) {
            const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            const recentHistory = result.taskHistory.filter(item => item.timestamp > weekAgo);
            await chrome.storage.local.set({ taskHistory: recentHistory });
        }
        
        // Clean up old logs (keep last 3 days)
        if (result.logs) {
            const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
            const recentLogs = result.logs.filter(log => log.timestamp > threeDaysAgo);
            await chrome.storage.local.set({ logs: recentLogs });
        }
        
        console.log('✅ Data cleanup completed');
        
    } catch (error) {
        console.error('❌ Data cleanup failed:', error);
    }
}

// Reset activation
async function resetActivation() {
    try {
        await chrome.storage.local.set({
            userActivated: false,
            username: null,
            activationExpiry: null,
            activationTime: null
        });
        
        console.log('🔒 Activation reset completed');
        
        // Show expiration notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Findom Elite Tracker',
            message: 'Your activation has expired. Please activate again.'
        });
        
    } catch (error) {
        console.error('❌ Activation reset failed:', error);
    }
}

// Perform daily cleanup
async function performDailyCleanup() {
    console.log('🌅 Performing daily cleanup...');
    
    try {
        // Clean up old data
        await cleanupOldData();
        
        // Update daily stats
        const result = await chrome.storage.local.get(['dailyStats']);
        const today = new Date().toDateString();
        
        if (!result.dailyStats || result.dailyStats.date !== today) {
            await chrome.storage.local.set({
                dailyStats: {
                    date: today,
                    tributes: 0,
                    tasks: 0,
                    syncs: 0
                }
            });
        }
        
        console.log('✅ Daily cleanup completed');
        
    } catch (error) {
        console.error('❌ Daily cleanup failed:', error);
    }
}

// Send sync reminder
async function sendSyncReminder() {
    try {
        const result = await chrome.storage.local.get(['userActivated', 'lastSync']);
        
        if (result.userActivated) {
            const lastSync = result.lastSync || 0;
            const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
            
            if (lastSync < sixHoursAgo) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Findom Elite Tracker',
                    message: 'Time to sync your empire! Click to open the extension.'
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Sync reminder failed:', error);
    }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Background received message:', request);
    
    switch (request.action) {
        case 'syncEmpire':
            handleSyncEmpire(sendResponse);
            return true; // Keep message channel open
            
        case 'submitTribute':
            handleTributeSubmission(request.data, sendResponse);
            return true;
            
        case 'checkActivation':
            handleActivationCheck(sendResponse);
            return true;
            
        case 'performActivation':
            handleActivationRequest(request.data, sendResponse);
            return true;
            
        default:
            sendResponse({ success: false, error: 'Unknown action' });
    }
});

// Handle sync empire
async function handleSyncEmpire(sendResponse) {
    try {
        console.log('🔄 Syncing empire...');
        
        // Update last sync time
        await chrome.storage.local.set({ lastSync: Date.now() });
        
        // Simulate sync process
        trackedSetTimeout(() => {
            sendResponse({ 
                success: true, 
                message: 'Empire synchronized successfully',
                timestamp: Date.now()
            });
        }, 2000);
        
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

// Handle tribute submission
async function handleTributeSubmission(tributeData, sendResponse) {
    try {
        console.log('💰 Processing tribute submission...');
        
        // Get existing tributes
        const result = await chrome.storage.local.get(['tributes']);
        const tributes = result.tributes || [];
        
        // Add new tribute
        const newTribute = {
            ...tributeData,
            id: Date.now(),
            timestamp: Date.now(),
            status: 'submitted'
        };
        
        tributes.push(newTribute);
        await chrome.storage.local.set({ tributes });
        
        // Update daily stats
        const statsResult = await chrome.storage.local.get(['dailyStats']);
        if (statsResult.dailyStats) {
            statsResult.dailyStats.tributes++;
            await chrome.storage.local.set({ dailyStats: statsResult.dailyStats });
        }
        
        sendResponse({ 
            success: true, 
            message: 'Tribute submitted successfully',
            id: newTribute.id
        });
        
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

// Handle activation check
async function handleActivationCheck(sendResponse) {
    try {
        const result = await chrome.storage.local.get(['userActivated', 'username', 'activationExpiry']);
        
        const isValid = result.userActivated && 
                       result.activationExpiry && 
                       Date.now() < result.activationExpiry;
        
        sendResponse({
            success: true,
            isActivated: isValid,
            username: result.username,
            expiry: result.activationExpiry
        });
        
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

// Handle activation request
async function handleActivationRequest(activationData, sendResponse) {
    try {
        console.log('🔑 Processing activation request...');
        
        // Validate activation code
        const validCodes = ['ELITE2024', 'GODDESS', 'FINDOM123', 'TRIBUTE'];
        
        if (!validCodes.includes(activationData.code.toUpperCase())) {
            sendResponse({ success: false, error: 'Invalid activation code' });
            return;
        }
        
        // Set activation
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        
        await chrome.storage.local.set({
            userActivated: true,
            username: activationData.username,
            activationExpiry: expiryTime,
            activationTime: Date.now()
        });
        
        sendResponse({ 
            success: true, 
            message: 'Activation successful',
            expiry: expiryTime
        });
        
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

// Handle extension unload
chrome.runtime.onSuspend.addListener(() => {
    console.log('💤 Extension suspending...');
    
    // Clean up intervals
    if (storageHealthInterval) {
        clearInterval(storageHealthInterval);
    }
    
    if (activationCheckInterval) {
        clearInterval(activationCheckInterval);
    }
});

// Initialize on script load
initializeBackgroundServices();

console.log('✅ Enhanced Background script initialized');