// 🔥 SPICY FINDOM/FEMDOM ENHANCED POPUP SCRIPT 🔥
console.log('=== SPICY ENHANCED POPUP LOADING ===');

// ===== ENHANCED PERFORMANCE OPTIMIZATION SYSTEM =====
// Advanced CPU and memory leak prevention

// Environment detection
const isExtensionEnvironment = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
const isVSCodeEnvironment = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
const isDevelopmentMode = isVSCodeEnvironment || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

console.log('🔧 Environment detection:', {
    extension: isExtensionEnvironment,
    vscode: isVSCodeEnvironment,
    development: isDevelopmentMode
});

// Performance optimization initialization
let performanceOptimizer = null;
let memoryLeakDetector = null;
let cpuUsageMonitor = null;

// Initialize performance optimization system
function initializePerformanceSystem() {
    try {
        // Use global performance optimizer if available
        if (typeof window.performanceOptimizer !== 'undefined') {
            performanceOptimizer = window.performanceOptimizer;
            console.log('✅ Performance optimizer initialized');
        }
        
        // Use global memory leak detector if available
        if (typeof window.memoryLeakDetector !== 'undefined') {
            memoryLeakDetector = window.memoryLeakDetector;
            console.log('✅ Memory leak detector initialized');
        }
        
        // Use global CPU usage monitor if available
        if (typeof window.cpuUsageMonitor !== 'undefined') {
            cpuUsageMonitor = window.cpuUsageMonitor;
            console.log('✅ CPU usage monitor initialized');
        }
        
        // Setup performance monitoring
        setupPerformanceMonitoring();
        
        console.log('🚀 Performance optimization system fully initialized');
    } catch (error) {
        console.error('❌ Error initializing performance system:', error);
        // Fallback to basic optimization
        setupBasicPerformanceOptimization();
    }
}

// Setup performance monitoring
function setupPerformanceMonitoring() {
    // Monitor performance every 30 seconds
    const performanceCheck = () => {
        if (performanceOptimizer) {
            const stats = performanceOptimizer.getPerformanceStats();
            
            // Log performance stats in development mode
            if (isDevelopmentMode) {
                console.log('📊 Performance stats:', stats);
            }
            
            // Take action if performance is degraded
            if (stats.memoryUsage && stats.memoryUsage.used > 50 * 1024 * 1024) {
                console.warn('⚠️ High memory usage detected, performing cleanup...');
                performanceOptimizer.performCleanup();
            }
        }
        
        if (cpuUsageMonitor) {
            const cpuReport = cpuUsageMonitor.getUsageReport();
            
            // Adjust operations based on CPU usage
            if (cpuReport.level === 'warning' || cpuReport.level === 'critical') {
                console.warn('⚠️ High CPU usage detected:', cpuReport.current + '%');
                throttleOperations();
            }
        }
    };
    
    // Run performance check
    performanceCheck();
    
    // Schedule regular performance checks
    if (performanceOptimizer) {
        performanceOptimizer.createInterval(performanceCheck, 30000, 'performanceCheck');
    } else {
        setInterval(performanceCheck, 30000);
    }
}

// Throttle operations during high CPU usage
function throttleOperations() {
    // Reduce animation frequency
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
        element.style.animationDuration = '2s'; // Slow down animations
    });
    
    // Reduce update frequency
    if (window.updateProgressBars) {
        window.updateProgressBars = throttle(window.updateProgressBars, 2000);
    }
    
    if (window.updateTaskList) {
        window.updateTaskList = throttle(window.updateTaskList, 3000);
    }
}

// Throttle function utility
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Basic performance optimization fallback
function setupBasicPerformanceOptimization() {
    console.log('⚠️ Using basic performance optimization fallback');
    
    // Basic memory cleanup
    window.addEventListener('beforeunload', () => {
        // Clear all intervals and timeouts
        for (let i = 1; i < 99999; i++) {
            clearInterval(i);
            clearTimeout(i);
        }
        
        // Clear caches
        if (window.caches) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }
    });
    
    // Basic memory monitoring
    setInterval(() => {
        if (performance.memory && performance.memory.usedJSHeapSize > 50 * 1024 * 1024) {
            console.warn('⚠️ High memory usage detected');
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
        }
    }, 60000);
}

// Memory monitoring initialization
const useMemoryMonitor = typeof memoryMonitor !== 'undefined';
let globalMemoryTracker = null;

// Fallback memory tracking for development environments
let intervalIds = new Set();
let timeoutIds = new Set();
let eventListeners = new Map();

// Global session timer variable
let sessionTimerInterval = null;
let timerSetupInProgress = false;

// Initialize memory tracker based on environment
function initializeMemoryTracker() {
    if (useMemoryMonitor) {
        globalMemoryTracker = memoryMonitor;
        console.log('✅ Advanced memory monitor initialized');
    } else {
        // Use fallback tracking for development
        globalMemoryTracker = {
            trackedSetTimeout: fallbackSetTimeout,
            trackedSetInterval: fallbackSetInterval,
            trackedAddEventListener: fallbackAddEventListener,
            cleanup: fallbackCleanup,
            getMemoryStats: () => ({
                timeouts: timeoutIds.size,
                intervals: intervalIds.size,
                eventListeners: eventListeners.size,
                isActive: true
            })
        };
        console.log('⚠️ Using fallback memory tracker (development mode)');
    }
    
    // Setup environment-specific cleanup
    setupEnvironmentCleanup();
}

// Fallback memory tracking functions
function fallbackSetTimeout(callback, delay) {
    const id = setTimeout(() => {
        timeoutIds.delete(id);
        try {
            callback();
        } catch (error) {
            console.error('❌ Error in tracked timeout:', error);
        }
    }, delay);
    timeoutIds.add(id);
    return id;
}

function fallbackSetInterval(callback, delay) {
    const id = setInterval(() => {
        try {
            callback();
        } catch (error) {
            console.error('❌ Error in tracked interval:', error);
        }
    }, delay);
    intervalIds.add(id);
    return id;
}

function fallbackAddEventListener(element, event, handler) {
    if (!element) {
        console.warn('⚠️ Cannot add event listener to null element');
        return;
    }
    
    element.addEventListener(event, handler);
    
    if (!eventListeners.has(element)) {
        eventListeners.set(element, new Map());
    }
    
    if (!eventListeners.get(element).has(event)) {
        eventListeners.get(element).set(event, new Set());
    }
    
    eventListeners.get(element).get(event).add(handler);
}

function fallbackCleanup() {
    console.log('🧹 Fallback cleanup starting...');
    
    // Clear all tracked timeouts
    timeoutIds.forEach(id => clearTimeout(id));
    timeoutIds.clear();
    
    // Clear all tracked intervals
    intervalIds.forEach(id => clearInterval(id));
    intervalIds.clear();
    
    // Remove all tracked event listeners
    eventListeners.forEach((eventMap, element) => {
        eventMap.forEach((handlerSet, event) => {
            handlerSet.forEach(handler => {
                try {
                    element.removeEventListener(event, handler);
                } catch (error) {
                    console.warn('⚠️ Error removing event listener:', error);
                }
            });
        });
    });
    eventListeners.clear();
    
    console.log('✅ Fallback cleanup completed');
}

// Enhanced tracked functions with error handling
function trackedSetTimeout(callback, delay) {
    if (!globalMemoryTracker) {
        console.warn('⚠️ Memory tracker not initialized, using fallback');
        return setTimeout(callback, delay);
    }
    
    return globalMemoryTracker.trackedSetTimeout(callback, delay);
}

function trackedSetInterval(callback, delay) {
    if (!globalMemoryTracker) {
        console.warn('⚠️ Memory tracker not initialized, using fallback');
        return setInterval(callback, delay);
    }
    
    return globalMemoryTracker.trackedSetInterval(callback, delay);
}

function trackedAddEventListener(element, event, handler) {
    if (!element) {
        console.warn('⚠️ Cannot add event listener to null element');
        return;
    }
    
    if (!globalMemoryTracker) {
        console.warn('⚠️ Memory tracker not initialized, using fallback');
        element.addEventListener(event, handler);
        return;
    }
    
    return globalMemoryTracker.trackedAddEventListener(element, event, handler);
}

// Environment-specific cleanup setup
function setupEnvironmentCleanup() {
    console.log('🔧 Setting up environment-specific cleanup handlers...');
    
    // Universal cleanup handlers
    window.addEventListener('beforeunload', cleanupMemoryLeaks);
    window.addEventListener('unload', cleanupMemoryLeaks);
    
    // Cleanup on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('🙈 Page hidden, performing cleanup...');
            cleanupMemoryLeaks();
        }
    });
    
    // Extension-specific cleanup
    if (isExtensionEnvironment) {
        if (chrome.runtime && chrome.runtime.onSuspend) {
            chrome.runtime.onSuspend.addListener(() => {
                console.log('🔄 Extension suspending, cleaning up...');
                cleanupMemoryLeaks();
            });
        }
    }
    
    // VS Code development cleanup
    if (isVSCodeEnvironment) {
        window.addEventListener('blur', () => {
            console.log('🔄 VS Code preview lost focus, performing cleanup...');
            cleanupMemoryLeaks();
        });
    }
}

// Enhanced cleanup function
function cleanupMemoryLeaks() {
    console.log('🧹 Starting comprehensive memory cleanup...');
    
    // Cleanup performance optimization system
    if (performanceOptimizer) {
        performanceOptimizer.performCleanup();
        console.log('✅ Performance optimizer cleaned up');
    }
    
    if (memoryLeakDetector) {
        memoryLeakDetector.performCleanup();
        console.log('✅ Memory leak detector cleaned up');
    }
    
    if (cpuUsageMonitor) {
        cpuUsageMonitor.performCleanup();
        console.log('✅ CPU usage monitor cleaned up');
    }
    
    // Cleanup global session timer
    if (sessionTimerInterval) {
        clearInterval(sessionTimerInterval);
        sessionTimerInterval = null;
        console.log('✅ Session timer cleared');
    }
    
    // Cleanup global session timer variable
    if (typeof sessionTimer !== 'undefined' && sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
        console.log('✅ Session timer cleared');
    }
    
    // Cleanup memory tracker
    if (globalMemoryTracker) {
        globalMemoryTracker.cleanup();
    }
    
    // Environment-specific cleanup
    if (isExtensionEnvironment) {
        cleanupExtensionResources();
    } else if (isVSCodeEnvironment) {
        cleanupVSCodeResources();
    }
    
    // Force garbage collection if available
    if (window.gc) {
        window.gc();
        console.log('✅ Garbage collection forced');
    }
    
    console.log('✅ Memory cleanup completed');
}

// Extension-specific resource cleanup
function cleanupExtensionResources() {
    console.log('🔧 Cleaning up extension-specific resources...');
    
    try {
        // Clear Chrome storage listeners if any
        if (chrome.storage && chrome.storage.onChanged) {
            chrome.storage.onChanged.removeListener();
        }
    } catch (error) {
        console.warn('⚠️ Chrome storage cleanup warning:', error);
    }
}

// VS Code development resource cleanup
function cleanupVSCodeResources() {
    console.log('🔧 Cleaning up VS Code development resources...');
    
    try {
        // Clear localStorage for development
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('devState');
            localStorage.removeItem('debugMode');
        }
    } catch (error) {
        console.warn('⚠️ VS Code cleanup warning:', error);
    }
}

// ===== END ENHANCED MEMORY MANAGEMENT SYSTEM =====

// Tribute item URLs (configure these for your specific items)
const TRIBUTE_URLS = {
    tribute25: "https://throne.com/girlbossvixxen/item/01c8b279-d4b3-4c76-b793-d4c8cbf0e628",
    tribute50: "https://throne.com/girlbossvixxen/item/tribute-50",
    tribute100: "https://throne.com/girlbossvixxen/item/tribute-100"
};

// Discord webhook URL (configure this for your Discord server)
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL_HERE";

// Enhanced user data collection for tribute tracking
let cachedUserData = null;
let userSessionData = null;

// Initialize popup functionality
function initializePopup() {
    console.log('🚀 Initializing spicy enhanced popup...');
    
    // Check if ToS has been accepted
    checkTosAcceptance();
    
    // Setup login functionality
    setupLoginEvents();
    
    // Setup dashboard functionality
    setupDashboard();
    
    // Setup button synchronization
    setupButtonSync();
    
    // Setup ToS modal functionality
    setupTosModal();
    
    // NOTE: Timer setup is handled by session manager, not here
    
    console.log('✅ Spicy enhanced popup initialized');
}

// Check if Terms of Service has been accepted
function checkTosAcceptance() {
    chrome.storage.local.get(['tosAccepted'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('❌ Error checking ToS acceptance:', chrome.runtime.lastError);
            return;
        }
        
        if (!result.tosAccepted) {
            console.log('📋 ToS not accepted, user needs to accept terms');
            // ToS modal will be shown when login is attempted
        } else {
            console.log('✅ ToS already accepted');
        }
    });
}

// Setup ToS modal functionality
function setupTosModal() {
    console.log('📋 Setting up ToS modal...');
    
    const acceptTosButton = document.getElementById('acceptTosButton');
    const rejectTosButton = document.getElementById('rejectTosButton');
    const viewFullTosLink = document.getElementById('viewFullTosLink');
    const tosModal = document.getElementById('tosModal');
    
    if (acceptTosButton) {
        trackedAddEventListener(acceptTosButton, 'click', function(e) {
            e.preventDefault();
            console.log('✅ ToS accepted by user');
            acceptTermsOfService();
        });
    }
    
    if (rejectTosButton) {
        trackedAddEventListener(rejectTosButton, 'click', function(e) {
            e.preventDefault();
            console.log('❌ ToS rejected by user');
            rejectTermsOfService();
        });
    }
    
    if (viewFullTosLink) {
        trackedAddEventListener(viewFullTosLink, 'click', function(e) {
            e.preventDefault();
            console.log('📋 Opening full ToS document');
            const tosUrl = chrome.runtime.getURL('src/popup/terms-of-service.html');
            window.open(tosUrl, '_blank', 'width=700,height=800,scrollbars=yes');
        });
    }
    
    console.log('✅ ToS modal setup complete');
}

// Accept Terms of Service
function acceptTermsOfService() {
    console.log('📋 Processing ToS acceptance...');
    
    // Store ToS acceptance
    chrome.storage.local.set({
        tosAccepted: true,
        tosAcceptedDate: new Date().toISOString()
    }, function() {
        if (chrome.runtime.lastError) {
            console.error('❌ Error storing ToS acceptance:', chrome.runtime.lastError);
            return;
        }
        
        console.log('✅ ToS acceptance stored');
        
        // Hide ToS modal
        const tosModal = document.getElementById('tosModal');
        if (tosModal) {
            tosModal.style.display = 'none';
        }
        
        // Proceed with login
        proceedWithLogin();
    });
}

// Reject Terms of Service
function rejectTermsOfService() {
    console.log('❌ ToS rejected, showing rejection message');
    
    const tosModal = document.getElementById('tosModal');
    if (tosModal) {
        tosModal.style.display = 'none';
    }
    
    // Show rejection message
    showErrorMessage('You must accept the Terms of Service to use this extension');
    
    // Reset login button
    showLoadingState(false);
}

// Show ToS modal
function showTosModal() {
    console.log('📋 Showing ToS modal...');
    
    const tosModal = document.getElementById('tosModal');
    if (tosModal) {
        tosModal.style.display = 'flex';
    }
}

// Proceed with login after ToS acceptance
function proceedWithLogin() {
    console.log('🚀 Proceeding with login after ToS acceptance...');
    
    // Collect user data (IP, location, ISP)
    collectUserData().then(userData => {
        console.log('📊 User data collected:', userData);
        
        // Perform the actual login
        performActualLogin(userData);
    }).catch(error => {
        console.error('❌ Error collecting user data:', error);
        // Proceed with login anyway
        performActualLogin({});
    });
}

// Enhanced comprehensive user data collection for tribute tracking
async function collectUserData() {
    console.log('🌍 Collecting comprehensive user data...');
    
    if (cachedUserData) {
        console.log('📋 Using cached user data');
        return cachedUserData;
    }
    
    try {
        // Use ipapi.co for comprehensive location and ISP data
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Collect browser and system information
        const browserInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            cookiesEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            localTime: new Date().toLocaleString(),
            connectionType: navigator.connection ? navigator.connection.effectiveType : 'Unknown'
        };
        
        const userData = {
            // IP and Location Data
            ip: data.ip || 'Unknown',
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
            countryCode: data.country_code || 'Unknown',
            continent: data.continent_code || 'Unknown',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            postal: data.postal || 'Unknown',
            
            // ISP and Network Data
            isp: data.org || 'Unknown',
            asn: data.asn || 'Unknown',
            
            // Additional Location Data
            timezone: data.timezone || 'Unknown',
            utcOffset: data.utc_offset || 'Unknown',
            callingCode: data.country_calling_code || 'Unknown',
            currency: data.currency || 'Unknown',
            currencyName: data.currency_name || 'Unknown',
            
            // Browser and System Data
            browserInfo: browserInfo,
            
            // Tracking Data
            timestamp: new Date().toISOString(),
            sessionId: generateSessionId(),
            
            // Additional Security Data
            vpnDetected: data.threat || 'Unknown',
            version: data.version || 'Unknown'
        };
        
        cachedUserData = userData;
        console.log('✅ Comprehensive user data collected successfully');
        console.log('📊 User Data Summary:', {
            ip: userData.ip,
            location: `${userData.city}, ${userData.region}, ${userData.country}`,
            isp: userData.isp,
            timezone: userData.timezone,
            browser: userData.browserInfo.userAgent.split(' ')[0],
            sessionId: userData.sessionId
        });
        
        return userData;
    } catch (error) {
        console.error('❌ Error collecting user data:', error);
        const fallbackData = {
            ip: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            country: 'Unknown',
            countryCode: 'Unknown',
            continent: 'Unknown',
            latitude: 0,
            longitude: 0,
            postal: 'Unknown',
            isp: 'Unknown',
            asn: 'Unknown',
            timezone: 'Unknown',
            utcOffset: 'Unknown',
            callingCode: 'Unknown',
            currency: 'Unknown',
            currencyName: 'Unknown',
            browserInfo: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages,
                platform: navigator.platform,
                cookiesEnabled: navigator.cookieEnabled,
                onlineStatus: navigator.onLine,
                screenResolution: `${screen.width}x${screen.height}`,
                colorDepth: screen.colorDepth,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                localTime: new Date().toLocaleString(),
                connectionType: navigator.connection ? navigator.connection.effectiveType : 'Unknown'
            },
            timestamp: new Date().toISOString(),
            sessionId: generateSessionId(),
            vpnDetected: 'Unknown',
            version: 'Unknown'
        };
        
        cachedUserData = fallbackData;
        return fallbackData;
    }
}

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Perform actual login with user data
function performActualLogin(userData) {
    console.log('🔥 === SPICY ENHANCED LOGIN WITH USER DATA ===');
    
    const usernameInput = document.getElementById('username');
    const codeInput = document.getElementById('code');
    const loginButton = document.getElementById('loginButton');
    
    if (!usernameInput || !codeInput || !loginButton) {
        console.error('❌ Required login elements not found');
        console.error('Missing elements:', {
            username: !usernameInput,
            code: !codeInput,
            loginButton: !loginButton
        });
        showErrorMessage('Login form elements not found');
        return;
    }
    
    const username = usernameInput.value.trim();
    const code = codeInput.value.trim();
    
    if (!username || !code) {
        console.log('⚠️ Username or code is empty');
        showErrorMessage('Please enter both username and access code');
        return;
    }
    
    console.log('Login credentials:', { username, passwordLength: code.length });
    console.log('User data:', userData);
    
    // Show loading state
    showLoadingState(true);
    
    // Simulate authentication with visual feedback
    trackedSetTimeout(() => {
        try {
            // Create persistent session first (this will determine the correct expiry time)
            createPersistentSession(username, userData);
            
            // Store additional user data WITHOUT overriding session expiry
            const completeUserData = {
                username: username,
                loginTime: new Date().toISOString(),
                userData: userData,
                tosAccepted: true,
                tosAcceptedDate: new Date().toISOString()
                // NOTE: sessionExpiry is handled by createPersistentSession
            };
            
            // Store additional user data
            chrome.storage.local.set(completeUserData, function() {
                if (chrome.runtime.lastError) {
                    console.error('❌ Storage error:', chrome.runtime.lastError);
                    showErrorMessage('Storage error occurred');
                    showLoadingState(false);
                    return;
                }
                
                console.log('✅ User data stored successfully');
                
                // Send login data to Discord webhook
                sendLoginDataToDiscord(completeUserData);
                
                // Show success state
                showSuccessState();
                
                // Switch to dashboard after success animation
                trackedSetTimeout(() => {
                    switchToDashboard();
                }, 1500);
            });
        } catch (error) {
            console.error('❌ Error in performActualLogin:', error);
            showErrorMessage('Login processing error');
            showLoadingState(false);
        }
    }, 1000);
}

// Setup login events
function setupLoginEvents() {
    console.log('Setting up enhanced login events...');
    
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const codeInput = document.getElementById('code');
    
    if (!loginForm || !loginButton) {
        console.error('❌ Login elements not found');
        return;
    }
    
    // Form submit handler
    trackedAddEventListener(loginForm, 'submit', function(e) {
        e.preventDefault();
        console.log('🔥 Form submitted - preventing default and logging in');
        performLogin();
    });
    
    // Button click handler
    trackedAddEventListener(loginButton, 'click', function(e) {
        e.preventDefault();
        console.log('🔥 Login button clicked');
        performLogin();
    });
    
    // Enter key handlers
    if (usernameInput) {
        trackedAddEventListener(usernameInput, 'keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performLogin();
            }
        });
    }
    
    if (codeInput) {
        trackedAddEventListener(codeInput, 'keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performLogin();
            }
        });
    }
    
    console.log('✅ Login events setup complete');
}

// Perform login with enhanced visual feedback
function performLogin() {
    console.log('🔥 === SPICY ENHANCED LOGIN STARTED ===');
    
    const usernameInput = document.getElementById('username');
    const codeInput = document.getElementById('code');
    
    if (!usernameInput || !codeInput) {
        console.error('❌ Username or code input not found');
        showErrorMessage('Login form elements not found');
        return;
    }
    
    const username = usernameInput.value.trim();
    const code = codeInput.value.trim();
    
    if (!username || !code) {
        console.log('⚠️ Username or code is empty');
        showErrorMessage('Please enter both username and access code');
        return;
    }
    
    console.log('📝 Login credentials:', { username, codeLength: code.length });
    
    // Show loading state
    showLoadingState(true);
    
    // Auto-accept ToS for debugging and proceed with login
    chrome.storage.local.set({
        tosAccepted: true,
        tosAcceptedDate: new Date().toISOString()
    }, function() {
        if (chrome.runtime.lastError) {
            console.error('❌ Error setting ToS acceptance:', chrome.runtime.lastError);
            showErrorMessage('Error processing login');
            showLoadingState(false);
            return;
        }
        
        console.log('✅ ToS auto-accepted, proceeding with login');
        proceedWithLogin();
    });
}

// Show loading state
function showLoadingState(show) {
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const loginButton = document.getElementById('loginButton');
    
    if (!loginButton) {
        console.warn('⚠️ Login button not found for loading state');
        return;
    }
    
    if (show) {
        if (buttonText) buttonText.style.display = 'none';
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
        loginButton.style.background = 'linear-gradient(45deg, #4B0082, #8B008B)';
        loginButton.disabled = true;
        
        // Fallback if spinner element doesn't exist
        if (!loadingSpinner && buttonText) {
            buttonText.innerHTML = '⏳ Loading...';
            buttonText.style.display = 'block';
        }
    } else {
        if (buttonText) {
            buttonText.style.display = 'block';
            buttonText.innerHTML = '👑 ENTER THE CHAMBERS 👑';
        }
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        loginButton.style.background = 'linear-gradient(45deg, #C8A2C8, #8B008B)';
        loginButton.disabled = false;
    }
}

// Show success state
function showSuccessState() {
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const loginButton = document.getElementById('loginButton');
    
    if (!loginButton) {
        console.warn('⚠️ Login button not found for success state');
        return;
    }
    
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    
    if (buttonText) {
        buttonText.style.display = 'block';
        buttonText.innerHTML = '✅ WELCOME TO THE CHAMBERS! ✅';
    } else {
        loginButton.innerHTML = '✅ WELCOME TO THE CHAMBERS! ✅';
    }
    
    loginButton.style.background = 'linear-gradient(45deg, #32CD32, #00FF00)';
    loginButton.style.color = '#1A1A1A';
    
    // Add success glow animation
    loginButton.style.boxShadow = '0 0 30px rgba(50, 205, 50, 0.8)';
    loginButton.style.animation = 'pulse 0.5s ease-in-out infinite alternate';
}

// Show error message
function showErrorMessage(message) {
    const loginButton = document.getElementById('loginButton');
    const buttonText = document.getElementById('buttonText');
    
    if (!loginButton) {
        console.error('❌ Cannot show error message: login button not found');
        console.error('❌ Error message was:', message);
        return;
    }
    
    if (buttonText) {
        buttonText.innerHTML = `❌ ${message}`;
    } else {
        loginButton.innerHTML = `❌ ${message}`;
    }
    
    loginButton.style.background = 'linear-gradient(45deg, #FF4D4D, #FF6B6B)';
    loginButton.style.color = '#FFFFFF';
    
    trackedSetTimeout(() => {
        if (buttonText) {
            buttonText.innerHTML = '👑 ENTER THE CHAMBERS 👑';
        } else {
            loginButton.innerHTML = '👑 ENTER THE CHAMBERS 👑';
        }
        loginButton.style.background = 'linear-gradient(45deg, #C8A2C8, #8B008B)';
        loginButton.style.color = '#EAEAEA';
    }, 3000);
}

// Switch to dashboard
function switchToDashboard() {
    console.log('🔥 === SWITCHING TO SPICY DASHBOARD ===');
    
    const authScreen = document.getElementById('authScreen');
    const mainDashboard = document.getElementById('mainDashboard');
    
    if (!authScreen || !mainDashboard) {
        console.error('❌ Screen elements not found');
        return;
    }
    
    // Hide auth screen
    authScreen.style.display = 'none';
    
    // Show dashboard with animation
    mainDashboard.style.display = 'block';
    mainDashboard.style.opacity = '0';
    mainDashboard.style.transform = 'translateY(20px)';
    
    // Trigger animation
    trackedSetTimeout(() => {
        mainDashboard.style.transition = 'all 0.5s ease-out';
        mainDashboard.style.opacity = '1';
        mainDashboard.style.transform = 'translateY(0)';
    }, 10);
    
    // Update user data in dashboard
    updateDashboardData();
    
    // Setup session timer for dashboard
    setupTimers();
    
    // Initialize progress bars
    initializeProgressBars();
    
    console.log('✅ Dashboard switch complete');
}

// Update dashboard data
function updateDashboardData() {
    chrome.storage.local.get(['username', 'loginTime', 'sessionExpiry'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('❌ Error retrieving user data:', chrome.runtime.lastError);
            return;
        }
        
        // Update profile section if data exists
        if (result.username) {
            const profileSection = document.querySelector('.profile-section h1');
            if (profileSection) {
                profileSection.textContent = `Welcome back, ${result.username}`;
            }
        }
        
        console.log('✅ Dashboard data updated');
    });
}

// Start session timer with specific expiry time
function startSessionTimer(expiryTime) {
    console.log('🚀 Starting session timer with expiry:', expiryTime.toLocaleString());
    
    let previousTimerText = '';
    
    const updateTimer = () => {
        const now = new Date();
        const timeRemaining = expiryTime - now;
        
        if (timeRemaining <= 0) {
            console.log('⏰ Session expired, cleaning up...');
            
            // Session expired
            const sessionTimerElement = document.getElementById('sessionTimer');
            const dashboardTimerElement = document.getElementById('dashboardTimer');
            
            if (sessionTimerElement) sessionTimerElement.textContent = 'Session Expired';
            if (dashboardTimerElement) dashboardTimerElement.textContent = 'Session Expired';
            
            // Clear timer
            if (sessionTimerInterval) {
                clearInterval(sessionTimerInterval);
                sessionTimerInterval = null;
            }
            
            // Clear storage and show auth screen
            chrome.storage.local.clear();
            showAuthScreen();
            return;
        }
        
        // Calculate time components
        const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
        
        // Format with consistent padding for stable display
        const formattedDays = days.toString().padStart(2, '0');
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        const timerText = `${formattedDays}d ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
        
        // Only update DOM if text has changed (prevents flashy behavior)
        if (timerText !== previousTimerText) {
            const sessionTimerElement = document.getElementById('sessionTimer');
            const dashboardTimerElement = document.getElementById('dashboardTimer');
            
            if (sessionTimerElement) sessionTimerElement.textContent = timerText;
            if (dashboardTimerElement) dashboardTimerElement.textContent = timerText;
            
            previousTimerText = timerText;
        }
    };
    
    // Update timer immediately and then every second
    updateTimer();
    sessionTimerInterval = setInterval(updateTimer, 1000);
    
    console.log('✅ Session timer started, interval ID:', sessionTimerInterval);
}

// Setup timers
function setupTimers() {
    console.log('⏰ Setting up timers...');
    
    // Prevent multiple simultaneous setups
    if (timerSetupInProgress) {
        console.log('⚠️ Timer setup already in progress, skipping...');
        return;
    }
    
    timerSetupInProgress = true;
    
    // Clear existing timer if running
    if (sessionTimerInterval) {
        console.log('🔄 Clearing existing timer interval');
        clearInterval(sessionTimerInterval);
        sessionTimerInterval = null;
    }
    
    // Get session expiry from storage - use stored timestamp for accuracy
    chrome.storage.local.get(['sessionExpiry', 'expiryTimestamp'], function(result) {
        if (!result.sessionExpiry) {
            console.log('⚠️ No session expiry found, skipping timer setup');
            timerSetupInProgress = false;
            return;
        }
        
        // Use stored timestamp if available, otherwise parse the ISO string
        const expiryTime = result.expiryTimestamp ? 
            new Date(result.expiryTimestamp) : 
            new Date(result.sessionExpiry);
        
        const now = new Date();
        
        console.log('📅 Session expiry time:', expiryTime.toLocaleString());
        console.log('⏰ Current time:', now.toLocaleString());
        console.log('⏳ Time remaining:', Math.floor((expiryTime - now) / 1000), 'seconds');
        
        // Start the real-time timer
        startSessionTimer(expiryTime);
        
        // Reset setup flag
        timerSetupInProgress = false;
    });
    
    console.log('✅ Timers setup complete');
}

// Setup dashboard functionality
function setupDashboard() {
    console.log('📊 Setting up dashboard...');
    
    // Points animation
    animatePoints();
    
    // Obedience bar animation
    animateObedienceBar();
    
    // Task status updates
    updateTaskStatus();
    
    console.log('✅ Dashboard setup complete');
}

// Animate points counter
function animatePoints() {
    const pointsElement = document.getElementById('pointsDisplay');
    if (!pointsElement) return;
    
    let currentPoints = 0;
    const targetPoints = 1247;
    const increment = Math.ceil(targetPoints / 50);
    
    const animateNumber = () => {
        currentPoints += increment;
        if (currentPoints >= targetPoints) {
            currentPoints = targetPoints;
            pointsElement.textContent = currentPoints.toLocaleString();
            return;
        }
        
        pointsElement.textContent = currentPoints.toLocaleString();
        trackedSetTimeout(animateNumber, 50);
    };
    
    trackedSetTimeout(animateNumber, 1000);
}

// Animate obedience bar - synced with tasks/challenges/tributes progress
function animateObedienceBar() {
    const obedienceBar = document.querySelector('.obedience-bar-fill');
    const obedienceText = document.querySelector('.obedience-level');
    if (!obedienceBar) return;
    
    // Calculate obedience level based on completed tasks and tributes
    chrome.storage.local.get(['completedTasks', 'completedTributes'], function(result) {
        const completedTasks = result.completedTasks || 0;
        const completedTributes = result.completedTributes || 0;
        
        // Total progress out of 20 (10 tasks + 10 tributes)
        const totalProgress = completedTasks + completedTributes;
        const obediencePercentage = Math.min((totalProgress / 20) * 100, 100);
        
        console.log('📊 Obedience calculation:', {
            tasks: completedTasks,
            tributes: completedTributes,
            total: totalProgress,
            percentage: obediencePercentage
        });
        
        // Store current obedience level
        chrome.storage.local.set({
            obedienceLevel: obediencePercentage,
            lastObedienceUpdate: new Date().toISOString()
        }, function() {
            console.log('✅ Obedience level synchronized:', obediencePercentage + '%');
        });
        
        // Animate the bar
        trackedSetTimeout(() => {
            obedienceBar.style.transition = 'width 2s ease-out';
            obedienceBar.style.width = `${obediencePercentage}%`;
            
            // Update text display
            if (obedienceText) {
                obedienceText.textContent = `${Math.round(obediencePercentage)}%`;
            }
            
            // Update color based on progress
            if (obediencePercentage < 25) {
                obedienceBar.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
            } else if (obediencePercentage < 50) {
                obedienceBar.style.background = 'linear-gradient(90deg, #ffaa00, #ffcc00)';
            } else if (obediencePercentage < 75) {
                obedienceBar.style.background = 'linear-gradient(90deg, #00aa44, #00cc66)';
            } else {
                obedienceBar.style.background = 'linear-gradient(90deg, #4CAF50, #81C784)';
            }
        }, 1500);
    });
}

// Update task status
function updateTaskStatus() {
    const taskCards = document.querySelectorAll('.task-card');
    
    taskCards.forEach((card, index) => {
        trackedSetTimeout(() => {
            card.style.transform = 'translateX(0)';
            card.style.opacity = '1';
        }, 500 + (index * 200));
    });
}

// Setup button synchronization
function setupButtonSync() {
    console.log('🔗 Setting up button synchronization...');
    
    // Wait for DOM to be ready
    trackedSetTimeout(() => {
        // Offer Tribute Button
        const offerTributeButton = document.getElementById('offerTributeButton');
        if (offerTributeButton) {
            console.log('✅ Tribute button found');
            trackedAddEventListener(offerTributeButton, 'click', function(e) {
                e.preventDefault();
                console.log('💰 Tribute button clicked');
                openTributeWindow();
            });
        } else {
            console.log('❌ Tribute button not found');
        }
        
        // Sync Button
        const syncButton = document.getElementById('syncButton');
        if (syncButton) {
            console.log('✅ Sync button found');
            trackedAddEventListener(syncButton, 'click', function(e) {
                e.preventDefault();
                console.log('⚡ Sync button clicked');
                performSync();
            });
        } else {
            console.log('❌ Sync button not found');
        }
        
        // Her Commands Button
        const herCommandsButton = document.getElementById('herCommandsButton');
        if (herCommandsButton) {
            console.log('✅ Her Commands button found');
            trackedAddEventListener(herCommandsButton, 'click', function(e) {
                e.preventDefault();
                console.log('👑 Her Commands button clicked');
                openCommandsWindow();
            });
        } else {
            console.log('❌ Her Commands button not found');
        }
        
        // Orders to Obey Button
        const ordersToObeyButton = document.getElementById('ordersToObeyButton');
        if (ordersToObeyButton) {
            console.log('✅ Orders button found');
            trackedAddEventListener(ordersToObeyButton, 'click', function(e) {
                e.preventDefault();
                console.log('📋 Orders button clicked');
                showOrdersSection();
            });
        } else {
            console.log('❌ Orders button not found');
        }
        
        // Submit Proof Button
        const submitProofButton = document.getElementById('submitProofButton');
        if (submitProofButton) {
            console.log('✅ Submit Proof button found');
            trackedAddEventListener(submitProofButton, 'click', function(e) {
                e.preventDefault();
                console.log('📸 Submit Proof button clicked');
                openProofSubmission();
            });
        } else {
            console.log('❌ Submit Proof button not found');
        }
        
        // Claim Bonus Button
        const claimBonusButton = document.getElementById('claimBonusButton');
        if (claimBonusButton) {
            console.log('✅ Claim Bonus button found');
            trackedAddEventListener(claimBonusButton, 'click', function(e) {
                e.preventDefault();
                console.log('🎁 Claim Bonus button clicked');
                claimDailyBonus();
            });
        } else {
            console.log('❌ Claim Bonus button not found');
        }
        
        // Logout Button
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            console.log('✅ Logout button found');
            trackedAddEventListener(logoutButton, 'click', function(e) {
                e.preventDefault();
                console.log('🚪 Logout button clicked');
                logoutUser();
            });
        } else {
            console.log('❌ Logout button not found');
        }
        
        console.log('✅ Button synchronization setup complete');
    }, 100);
}

// Open tribute window
function openTributeWindow() {
    console.log('💰 Opening tribute window...');
    
    const tributeButton = document.getElementById('offerTributeButton');
    if (!tributeButton) {
        console.error('❌ Tribute button not found');
        return;
    }
    
    const originalText = tributeButton.innerHTML;
    
    tributeButton.innerHTML = '<i class="icon">⏳</i> <span>Opening Tribute...</span>';
    tributeButton.disabled = true;
    tributeButton.style.background = 'linear-gradient(45deg, #4B0082, #8B008B)';
    
    try {
        // Open Throne tribute page
        const newWindow = window.open(TRIBUTE_URLS.tribute25, "_blank", "width=800,height=600");
        
        if (newWindow) {
            console.log('✅ Tribute window opened successfully');
        } else {
            console.log('⚠️ Popup may have been blocked');
            alert('Please allow popups for this extension to open the tribute page.');
        }
    } catch (error) {
        console.error('❌ Error opening tribute window:', error);
        alert('Error opening tribute page. Please try again.');
    }
    
    // Reset button after delay
    trackedSetTimeout(() => {
        tributeButton.innerHTML = originalText;
        tributeButton.disabled = false;
        tributeButton.style.background = 'linear-gradient(145deg, rgba(200, 162, 200, 0.8), rgba(139, 0, 139, 0.8))';
        
        // Track tribute completion in progress system
        submitTribute();
    }, 3000);
}

// Perform sync operation
function performSync() {
    console.log('⚡ Performing sync operation...');
    
    const syncButton = document.getElementById('syncButton');
    if (!syncButton) {
        console.error('❌ Sync button not found');
        return;
    }
    
    const originalText = syncButton.innerHTML;
    
    syncButton.innerHTML = '<i class="icon">🔄</i> <span>Syncing...</span>';
    syncButton.disabled = true;
    syncButton.style.animation = 'spin 1s linear infinite';
    syncButton.style.background = 'linear-gradient(45deg, #4B0082, #8B008B)';
    
    // Simulate sync process
    trackedSetTimeout(() => {
        syncButton.innerHTML = '<i class="icon">✅</i> <span>Synced!</span>';
        syncButton.style.animation = 'none';
        syncButton.style.background = 'linear-gradient(45deg, #32CD32, #00FF00)';
        
        // Reset button
        trackedSetTimeout(() => {
            syncButton.innerHTML = originalText;
            syncButton.disabled = false;
            syncButton.style.background = 'linear-gradient(145deg, rgba(200, 162, 200, 0.8), rgba(139, 0, 139, 0.8))';
        }, 1500);
    }, 2000);
}

// Open commands window
function openCommandsWindow() {
    console.log('👑 Opening commands window...');
    
    const commandsButton = document.getElementById('herCommandsButton');
    if (!commandsButton) {
        console.error('❌ Commands button not found');
        return;
    }
    
    const originalText = commandsButton.innerHTML;
    
    commandsButton.innerHTML = '<i class="icon">⏳</i> <span>Opening Commands...</span>';
    commandsButton.disabled = true;
    commandsButton.style.background = 'linear-gradient(45deg, #4B0082, #8B008B)';
    
    try {
        // You can customize this to open a specific commands page
        const commandsUrl = "https://discord.com/channels/YOUR_SERVER_ID/YOUR_CHANNEL_ID";
        const newWindow = window.open(commandsUrl, "_blank", "width=600,height=400");
        
        if (newWindow) {
            console.log('✅ Commands window opened successfully');
        } else {
            console.log('⚠️ Popup may have been blocked');
            alert('Please allow popups for this extension to open the commands page.');
        }
    } catch (error) {
        console.error('❌ Error opening commands window:', error);
        alert('Error opening commands page. Please try again.');
    }
    
    // Reset button after delay
    trackedSetTimeout(() => {
        commandsButton.innerHTML = originalText;
        commandsButton.disabled = false;
        commandsButton.style.background = 'linear-gradient(145deg, rgba(200, 162, 200, 0.8), rgba(139, 0, 139, 0.8))';
    }, 2000);
}

// Show orders section
function showOrdersSection() {
    console.log('📋 Showing orders section...');
    
    // Animate task cards
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach((card, index) => {
        trackedSetTimeout(() => {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 5px 20px rgba(255, 215, 0, 0.3)';
            
            trackedSetTimeout(() => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = 'none';
            }, 200);
        }, index * 100);
    });
}

// Enhanced proof submission with comprehensive user data tracking
function openProofSubmission() {
    console.log('📸 Opening enhanced proof submission...');
    
    const proofButton = document.getElementById('submitProofButton');
    if (!proofButton) {
        console.error('❌ Proof button not found');
        return;
    }
    
    const originalText = proofButton.innerHTML;
    
    proofButton.innerHTML = '<i class="icon">📤</i> <span>Preparing...</span>';
    proofButton.disabled = true;
    proofButton.style.background = 'linear-gradient(45deg, #4B0082, #8B008B)';
    
    // Collect fresh user data for each submission
    trackedSetTimeout(async () => {
        try {
            console.log('🔍 Collecting user data for proof submission...');
            
            // Collect comprehensive user data
            const currentUserData = await collectUserData();
            
            // Get stored user session data
            chrome.storage.local.get(['username', 'loginTime', 'sessionId'], function(result) {
                const proofData = {
                    // Basic submission data
                    username: result.username || "anonymous",
                    timestamp: new Date().toISOString(),
                    proofType: "tribute_receipt",
                    sessionId: result.sessionId || currentUserData.sessionId,
                    loginTime: result.loginTime || 'Unknown',
                    
                    // Comprehensive user data
                    userLocation: {
                        ip: currentUserData.ip,
                        city: currentUserData.city,
                        region: currentUserData.region,
                        country: currentUserData.country,
                        countryCode: currentUserData.countryCode,
                        continent: currentUserData.continent,
                        latitude: currentUserData.latitude,
                        longitude: currentUserData.longitude,
                        postal: currentUserData.postal,
                        timezone: currentUserData.timezone,
                        utcOffset: currentUserData.utcOffset,
                        currency: currentUserData.currency,
                        currencyName: currentUserData.currencyName
                    },
                    
                    // Network and ISP data
                    networkInfo: {
                        isp: currentUserData.isp,
                        asn: currentUserData.asn,
                        vpnDetected: currentUserData.vpnDetected
                    },
                    
                    // Browser and device data
                    deviceInfo: {
                        userAgent: currentUserData.browserInfo.userAgent,
                        language: currentUserData.browserInfo.language,
                        languages: currentUserData.browserInfo.languages,
                        platform: currentUserData.browserInfo.platform,
                        screenResolution: currentUserData.browserInfo.screenResolution,
                        colorDepth: currentUserData.browserInfo.colorDepth,
                        connectionType: currentUserData.browserInfo.connectionType,
                        cookiesEnabled: currentUserData.browserInfo.cookiesEnabled,
                        onlineStatus: currentUserData.browserInfo.onlineStatus,
                        localTime: currentUserData.browserInfo.localTime
                    },
                    
                    // Additional tracking
                    submissionId: generateSubmissionId(),
                    version: currentUserData.version
                };
                
                console.log('📊 Proof submission data prepared:', {
                    username: proofData.username,
                    location: `${proofData.userLocation.city}, ${proofData.userLocation.country}`,
                    ip: proofData.userLocation.ip,
                    isp: proofData.networkInfo.isp,
                    submissionId: proofData.submissionId
                });
                
                // Send to Discord webhook (if configured)
                if (DISCORD_WEBHOOK_URL.includes('discord.com')) {
                    sendTributeToDiscord(proofData);
                } else {
                    console.log('⚠️ Discord webhook not configured');
                }
                
                // Store submission data locally
                storeSubmissionData(proofData);
                
                proofButton.innerHTML = '<i class="icon">✅</i> <span>Submitted!</span>';
                proofButton.style.background = 'linear-gradient(45deg, #32CD32, #00FF00)';
                
                // Reset button
                trackedSetTimeout(() => {
                    proofButton.innerHTML = originalText;
                    proofButton.disabled = false;
                    proofButton.style.background = 'linear-gradient(145deg, rgba(200, 162, 200, 0.8), rgba(139, 0, 139, 0.8))';
                    
                    // Track task completion in progress system
                    completeTask();
                }, 2000);
            });
        } catch (error) {
            console.error('❌ Error in proof submission:', error);
            proofButton.innerHTML = '<i class="icon">❌</i> <span>Error</span>';
            proofButton.style.background = 'linear-gradient(45deg, #FF4D4D, #FF6B6B)';
            
            // Reset button
            trackedSetTimeout(() => {
                proofButton.innerHTML = originalText;
                proofButton.disabled = false;
                proofButton.style.background = 'linear-gradient(145deg, rgba(200, 162, 200, 0.8), rgba(139, 0, 139, 0.8))';
            }, 2000);
        }
    }, 1500);
}

// Generate unique submission ID
function generateSubmissionId() {
    return 'tribute_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Store submission data locally for tracking
function storeSubmissionData(proofData) {
    chrome.storage.local.get(['submissions'], function(result) {
        const submissions = result.submissions || [];
        submissions.push(proofData);
        
        // Keep only last 100 submissions to avoid storage bloat
        if (submissions.length > 100) {
            submissions.splice(0, submissions.length - 100);
        }
        
        chrome.storage.local.set({ submissions: submissions }, function() {
            if (chrome.runtime.lastError) {
                console.error('❌ Error storing submission data:', chrome.runtime.lastError);
            } else {
                console.log('✅ Submission data stored locally');
            }
        });
    });
}

// Enhanced Discord webhook for tribute submissions with comprehensive data
function sendTributeToDiscord(proofData) {
    console.log('📤 Sending comprehensive tribute data to Discord...');
    
    const webhookData = {
        embeds: [{
            title: "🔥 New Tribute Submission",
            description: `**User:** ${proofData.username}\n**Submission ID:** ${proofData.submissionId}\n**Time:** ${new Date(proofData.timestamp).toLocaleString()}`,
            color: 0x8B008B,
            timestamp: proofData.timestamp,
            fields: [
                {
                    name: "🌍 Location Details",
                    value: `**IP:** ${proofData.userLocation.ip}\n**City:** ${proofData.userLocation.city}\n**Region:** ${proofData.userLocation.region}\n**Country:** ${proofData.userLocation.country} (${proofData.userLocation.countryCode})\n**Continent:** ${proofData.userLocation.continent}\n**Postal:** ${proofData.userLocation.postal}\n**Timezone:** ${proofData.userLocation.timezone}\n**Currency:** ${proofData.userLocation.currencyName} (${proofData.userLocation.currency})`,
                    inline: true
                },
                {
                    name: "🌐 Network & ISP",
                    value: `**ISP:** ${proofData.networkInfo.isp}\n**ASN:** ${proofData.networkInfo.asn}\n**VPN Detected:** ${proofData.networkInfo.vpnDetected}\n**Connection:** ${proofData.deviceInfo.connectionType}`,
                    inline: true
                },
                {
                    name: "📱 Device Information",
                    value: `**Platform:** ${proofData.deviceInfo.platform}\n**Language:** ${proofData.deviceInfo.language}\n**Screen:** ${proofData.deviceInfo.screenResolution}\n**Color Depth:** ${proofData.deviceInfo.colorDepth}bit\n**Cookies:** ${proofData.deviceInfo.cookiesEnabled ? 'Enabled' : 'Disabled'}\n**Online:** ${proofData.deviceInfo.onlineStatus ? 'Yes' : 'No'}`,
                    inline: false
                },
                {
                    name: "🕒 Session Details",
                    value: `**Session ID:** ${proofData.sessionId}\n**Login Time:** ${proofData.loginTime ? new Date(proofData.loginTime).toLocaleString() : 'Unknown'}\n**Local Time:** ${proofData.deviceInfo.localTime}`,
                    inline: false
                },
                {
                    name: "🔍 Browser Details",
                    value: `**User Agent:** ${proofData.deviceInfo.userAgent.substring(0, 100)}${proofData.deviceInfo.userAgent.length > 100 ? '...' : ''}\n**Languages:** ${proofData.deviceInfo.languages ? proofData.deviceInfo.languages.join(', ') : 'N/A'}`,
                    inline: false
                }
            ],
            footer: {
                text: `Tribute Tracking System v${proofData.version || '1.0'}`
            }
        }]
    };
    
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
    }).then(response => {
        if (response.ok) {
            console.log('✅ Enhanced tribute data sent to Discord successfully');
        } else {
            console.error('❌ Discord webhook failed:', response.status);
        }
    }).catch(error => {
        console.error('❌ Discord webhook error:', error);
    });
}

// Legacy function for backward compatibility
function sendToDiscord(data) {
    console.log('📤 Sending basic tribute data to Discord...');
    
    const webhookData = {
        embeds: [{
            title: "🔥 Tribute Proof Submitted",
            description: `User: ${data.username}\nTime: ${data.timestamp}\nType: ${data.proofType}`,
            color: 0x8B008B,
            timestamp: data.timestamp
        }]
    };
    
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
    }).then(response => {
        if (response.ok) {
            console.log('✅ Discord webhook sent successfully');
        } else {
            console.error('❌ Discord webhook failed');
        }
    }).catch(error => {
        console.error('❌ Discord webhook error:', error);
    });
}

// Enhanced login data Discord webhook with comprehensive user tracking
function sendLoginDataToDiscord(userData) {
    if (!DISCORD_WEBHOOK_URL.includes('discord.com')) {
        console.log('⚠️ Discord webhook not configured for login data');
        return;
    }
    
    console.log('📤 Sending comprehensive login data to Discord...');
    
    const loginData = {
        embeds: [{
            title: "🏰 New User Login",
            description: `**Username:** ${userData.username}\n**Login Time:** ${new Date(userData.loginTime).toLocaleString()}\n**Session ID:** ${userData.sessionId || 'N/A'}`,
            color: 0x4B0082,
            fields: [
                {
                    name: "🌍 Location Details",
                    value: `**IP:** ${userData.userData.ip}\n**City:** ${userData.userData.city}\n**Region:** ${userData.userData.region}\n**Country:** ${userData.userData.country} (${userData.userData.countryCode || 'N/A'})\n**Continent:** ${userData.userData.continent || 'N/A'}\n**Postal:** ${userData.userData.postal || 'N/A'}\n**Timezone:** ${userData.userData.timezone}\n**Currency:** ${userData.userData.currencyName || 'N/A'} (${userData.userData.currency || 'N/A'})`,
                    inline: true
                },
                {
                    name: "🌐 Network & ISP",
                    value: `**ISP:** ${userData.userData.isp}\n**ASN:** ${userData.userData.asn || 'N/A'}\n**VPN Detected:** ${userData.userData.vpnDetected || 'N/A'}\n**Connection:** ${userData.userData.browserInfo ? userData.userData.browserInfo.connectionType : 'N/A'}`,
                    inline: true
                },
                {
                    name: "📱 Device Information",
                    value: `**Platform:** ${userData.userData.browserInfo ? userData.userData.browserInfo.platform : 'N/A'}\n**Language:** ${userData.userData.browserInfo ? userData.userData.browserInfo.language : 'N/A'}\n**Screen:** ${userData.userData.browserInfo ? userData.userData.browserInfo.screenResolution : 'N/A'}\n**Cookies:** ${userData.userData.browserInfo ? (userData.userData.browserInfo.cookiesEnabled ? 'Enabled' : 'Disabled') : 'N/A'}\n**Online:** ${userData.userData.browserInfo ? (userData.userData.browserInfo.onlineStatus ? 'Yes' : 'No') : 'N/A'}`,
                    inline: false
                },
                {
                    name: "📋 Terms of Service",
                    value: `**Accepted:** ✅ Yes\n**Date:** ${new Date(userData.tosAcceptedDate).toLocaleString()}\n**Session Expires:** ${new Date(userData.sessionExpiry).toLocaleString()}`,
                    inline: false
                },
                {
                    name: "🔍 Browser Details",
                    value: `**User Agent:** ${userData.userData.browserInfo ? userData.userData.browserInfo.userAgent.substring(0, 100) : 'N/A'}${userData.userData.browserInfo && userData.userData.browserInfo.userAgent.length > 100 ? '...' : ''}\n**Languages:** ${userData.userData.browserInfo && userData.userData.browserInfo.languages ? userData.userData.browserInfo.languages.join(', ') : 'N/A'}`,
                    inline: false
                }
            ],
            timestamp: userData.loginTime,
            footer: {
                text: `Findom Elite Tracker - Login System v${userData.userData.version || '1.0'}`
            }
        }]
    };
    
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
    }).then(response => {
        if (response.ok) {
            console.log('✅ Enhanced login data sent to Discord successfully');
        } else {
            console.error('❌ Failed to send login data to Discord:', response.status);
        }
    }).catch(error => {
        console.error('❌ Discord login data error:', error);
    });
}

// Claim daily bonus
function claimDailyBonus() {
    console.log('🎁 Claiming daily bonus...');
    
    const claimButton = document.getElementById('claimBonusButton');
    if (!claimButton) {
        console.error('❌ Claim button not found');
        return;
    }
    
    const originalText = claimButton.innerHTML;
    
    claimButton.innerHTML = '<i class="icon">⏳</i> Claiming...';
    claimButton.disabled = true;
    claimButton.style.background = 'linear-gradient(45deg, #4B0082, #8B008B)';
    
    // Simulate bonus claiming
    trackedSetTimeout(() => {
        try {
            claimButton.innerHTML = '<i class="icon">✅</i> Claimed +25 Points!';
            claimButton.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
            
            // Update points display
            const pointsDisplay = document.getElementById('pointsDisplay');
            if (pointsDisplay) {
                const currentPoints = parseInt(pointsDisplay.textContent.replace(/,/g, ''));
                const newPoints = currentPoints + 25;
                pointsDisplay.textContent = newPoints.toLocaleString();
                
                // Add animation to points display
                pointsDisplay.style.animation = 'pulse 0.5s ease-in-out';
                trackedSetTimeout(() => {
                    pointsDisplay.style.animation = 'none';
                }, 500);
            }
            
            // Store the bonus claim in Chrome storage
            chrome.storage.local.set({
                lastBonusClaim: new Date().toISOString(),
                totalPoints: pointsDisplay ? parseInt(pointsDisplay.textContent.replace(/,/g, '')) : 1272
            }, function() {
                if (chrome.runtime.lastError) {
                    console.error('❌ Error storing bonus data:', chrome.runtime.lastError);
                } else {
                    console.log('✅ Bonus claim stored successfully');
                }
            });
            
            // Reset button after delay
            trackedSetTimeout(() => {
                claimButton.innerHTML = originalText;
                claimButton.style.background = 'linear-gradient(45deg, #32CD32, #00FF00)';
                claimButton.disabled = false;
            }, 3000);
        } catch (error) {
            console.error('❌ Error claiming bonus:', error);
            claimButton.innerHTML = '<i class="icon">❌</i> Error';
            claimButton.style.background = 'linear-gradient(45deg, #FF4D4D, #FF6B6B)';
            
            // Reset button
            trackedSetTimeout(() => {
                claimButton.innerHTML = originalText;
                claimButton.style.background = 'linear-gradient(45deg, #32CD32, #00FF00)';
                claimButton.disabled = false;
            }, 2000);
        }
    }, 1500);
}

// ===== PERSISTENT SESSION MANAGEMENT SYSTEM =====

// Session configuration
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const TIMER_UPDATE_INTERVAL = 1000; // Update every second
const WARNING_THRESHOLDS = [86400000, 3600000, 300000]; // 24h, 1h, 5min warnings

// Session timer variables
let sessionTimer = null;
let sessionWarningShown = [];

// Initialize progress tracking system
function initializeProgressTracking() {
    console.log('📊 Initializing progress tracking...');
    
    chrome.storage.local.get(['completedTasks', 'completedTributes', 'obedienceLevel', 'progressInitialized'], function(result) {
        // Set defaults for new sessions
        const defaults = {
            completedTasks: result.completedTasks || 0,
            completedTributes: result.completedTributes || 0,
            obedienceLevel: result.obedienceLevel || 0,
            progressInitialized: true,
            lastProgressUpdate: new Date().toISOString()
        };
        
        // Only set defaults if not already initialized
        if (!result.progressInitialized) {
            chrome.storage.local.set(defaults, function() {
                console.log('✅ Progress tracking initialized with defaults:', defaults);
                
                // Update obedience bar to reflect current progress
                animateObedienceBar();
            });
        } else {
            console.log('📈 Progress tracking already initialized');
            
            // Update obedience bar to reflect current progress
            animateObedienceBar();
        }
    });
}

// Initialize persistent session management
function initializeSessionManager() {
    console.log('🔐 Initializing persistent session management...');
    
    // Check for existing session (including logged out sessions with valid expiry)
    chrome.storage.local.get(['sessionExpiry', 'username', 'sessionActive', 'sessionCreated'], function(result) {
        if (chrome.runtime.lastError) {
            console.error('❌ Error checking session:', chrome.runtime.lastError);
            return;
        }
        
        if (result.sessionExpiry && result.username) {
            const expiryTime = new Date(result.sessionExpiry);
            const now = new Date();
            
            if (now < expiryTime) {
                // Session time is still valid - check if user was logged in
                if (result.sessionActive) {
                    // User was logged in - automatically restore session
                    console.log('✅ Valid active session found, restoring automatically');
                    console.log('📅 Session expires:', expiryTime.toLocaleString());
                    console.log('👤 Username:', result.username);
                    
                    // Hide auth screen and show dashboard immediately
                    const authScreen = document.getElementById('authScreen');
                    const mainDashboard = document.getElementById('mainDashboard');
                    
                    if (authScreen) authScreen.style.display = 'none';
                    if (mainDashboard) {
                        mainDashboard.style.display = 'flex';
                        mainDashboard.style.opacity = '1';
                        mainDashboard.classList.add('active');
                    }
                    
                    // Setup session timer
                    setupTimers();
                    
                    // Initialize progress bars
                    initializeProgressBars();
                    
                    // Initialize progress tracking if not exists
                    initializeProgressTracking();
                    
                    // Send session resume notification to Discord
                    sendSessionResumeToDiscord(result.username, expiryTime);
                    
                    console.log('🎉 User automatically logged in successfully');
                } else {
                    // User was logged out but session is still valid - show login screen with preserved data
                    console.log('🔄 Valid session found but user was logged out');
                    console.log('📅 Session expires:', expiryTime.toLocaleString());
                    console.log('👤 Username:', result.username);
                    
                    // Pre-fill username field
                    const usernameInput = document.getElementById('username');
                    if (usernameInput) {
                        usernameInput.value = result.username;
                    }
                    
                    showAuthScreen();
                    
                    // Show info about remaining time
                    const daysRemaining = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
                    showSessionNotification(`⏰ Session continues: ${daysRemaining} days remaining. Enter your code to log back in.`, 'info');
                }
            } else {
                // Session expired
                console.log('⏰ Session expired, clearing data');
                clearExpiredSession();
                showAuthScreen();
            }
        } else {
            console.log('📝 No session found - showing login screen');
            showAuthScreen();
        }
    });
}

// Start real-time session countdown timer
function startSessionTimer(expiryTime) {
    console.log('⏰ Starting session countdown timer...');
    
    // Clear existing timer
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }
    
    // Reset warning flags
    sessionWarningShown = [];
    
    // Update timer immediately
    updateSessionDisplay(expiryTime);
    
    // Set up interval to update every second
    sessionTimer = setInterval(() => {
        updateSessionDisplay(expiryTime);
    }, TIMER_UPDATE_INTERVAL);
}

// Update session display with real-time countdown
function updateSessionDisplay(expiryTime) {
    const now = new Date();
    const timeRemaining = expiryTime.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
        // Session expired
        handleSessionExpiry();
        return;
    }
    
    // Calculate time components
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Format countdown display
    const countdownText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    
    // Update dashboard timer display only (no timer on login screen)
    const dashboardTimerElement = document.getElementById('dashboardTimer');
    if (dashboardTimerElement) {
        dashboardTimerElement.textContent = `${countdownText}`;
    }
    
    // Update top session display if it exists
    const topSessionDisplay = document.querySelector('.session-expires');
    if (topSessionDisplay) {
        topSessionDisplay.textContent = `Session expires in: ${countdownText}`;
    }
    
    // Check for warnings
    checkSessionWarnings(timeRemaining);
}

// Check and show session warnings
function checkSessionWarnings(timeRemaining) {
    WARNING_THRESHOLDS.forEach((threshold, index) => {
        if (timeRemaining <= threshold && !sessionWarningShown[index]) {
            sessionWarningShown[index] = true;
            showSessionWarning(threshold);
        }
    });
}

// Show session warning notification
function showSessionWarning(threshold) {
    const warningTitles = {
        86400000: '⚠️ Session Warning - 24 Hours',
        3600000: '⚠️ Session Warning - 1 Hour',
        300000: '🚨 Session Warning - 5 Minutes'
    };
    
    const warningMessages = {
        86400000: 'Your session expires in 24 hours',
        3600000: 'Your session expires in 1 hour',
        300000: 'Your session expires in 5 minutes'
    };
    
    const title = warningTitles[threshold];
    const message = warningMessages[threshold];
    const type = threshold <= 300000 ? 'error' : 'warning';
    
    // Show visual notification
    showSessionNotification(message, type);
    
    // Send warning to Discord
    sendSessionWarningToDiscord(threshold);
}

// Show session notification
function showSessionNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `session-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'error' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 320px;
        animation: slideInRight 0.3s ease-out;
        border: 1px solid ${type === 'error' ? '#ff4444' : type === 'warning' ? '#ffaa00' : '#4CAF50'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    trackedSetTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        trackedSetTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 5000);
    
    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
}

// Initialize streaks system
function initializeStreaks() {
    console.log('🔥 Initializing streaks system...');
    
    // Update daily streak
    updateStreak();
    
    // Set up daily streak checking (every 24 hours)
    trackedSetInterval(updateStreak, 24 * 60 * 60 * 1000);
}// Update streak system
function updateStreak() {
    console.log('📈 Updating streak system...');
    
    chrome.storage.local.get(['lastStreakUpdate', 'dailyStreak'], function(result) {
        const now = new Date();
        const lastUpdate = result.lastStreakUpdate ? new Date(result.lastStreakUpdate) : null;
        let dailyStreak = result.dailyStreak || 0;
        
        // Check if it's been 24 hours since last update
        if (!lastUpdate || (now - lastUpdate) >= 24 * 60 * 60 * 1000) {
            dailyStreak++;
            
            chrome.storage.local.set({
                dailyStreak: dailyStreak,
                lastStreakUpdate: now.toISOString()
            }, function() {
                console.log('✅ Streak updated:', dailyStreak);
            });
        }
    });
}

// Enhanced Discord webhook integration with detailed user info
async function sendDetailedProofToDiscord(proofText, proofFile) {
    console.log('📤 Sending detailed proof to Discord...');
    
    try {
        // Get user data and location info
        const userData = await collectUserData();
        const userInfo = await chrome.storage.local.get(['username', 'userRank', 'userPoints', 'dailyStreak']);
        
        // Create rich embed for Discord
        const embed = {
            title: '🔥 Proof of Devotion Submitted',
            description: `**${userInfo.username}** has submitted proof of devotion`,
            color: 0x9C27B0, // Purple color
            fields: [
                {
                    name: '👤 User Info',
                    value: `**Rank:** ${userInfo.userRank || 'Obedient Pet'}\n**Points:** ${userInfo.userPoints || 0}\n**Streak:** ${userInfo.dailyStreak || 0} days`,
                    inline: true
                },
                {
                    name: '🌍 Location',
                    value: `**IP:** ${userData.ip}\n**City:** ${userData.city}, ${userData.region}\n**Country:** ${userData.country}`,
                    inline: true
                },
                {
                    name: '🌐 Technical Info',
                    value: `**ISP:** ${userData.isp}\n**Timezone:** ${userData.timezone}\n**Browser:** ${userData.browserInfo.userAgent.split(' ')[0]}`,
                    inline: true
                },
                {
                    name: '📝 Proof Details',
                    value: proofText || 'No text provided',
                    inline: false
                },
                {
                    name: '⏰ Submission Time',
                    value: new Date().toLocaleString(),
                    inline: true
                }
            ],
            footer: {
                text: 'Findom Elite Tracker',
                icon_url: 'https://cdn.discordapp.com/emojis/example.png'
            },
            timestamp: new Date().toISOString()
        };
        
        // Prepare webhook payload
        const webhookPayload = {
            content: `🔥 **NEW PROOF SUBMISSION** 🔥`,
            embeds: [embed]
        };
        
        // Send to Discord webhook
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhookPayload)
        });
        
        if (response.ok) {
            console.log('✅ Detailed proof sent to Discord successfully');
            showDiscordConfirmation('Proof submitted successfully!');
        } else {
            console.error('❌ Failed to send proof to Discord:', response.status);
            showDiscordError('Failed to submit proof. Please try again.');
        }
    } catch (error) {
        console.error('❌ Error sending detailed proof to Discord:', error);
        showDiscordError('Error submitting proof. Please try again.');
    }
}

// Send tribute confirmation to Discord
async function sendTributeConfirmationToDiscord(tributeId) {
    console.log('📤 Sending tribute confirmation to Discord...');
    
    try {
        const userData = await collectUserData();
        const userInfo = await chrome.storage.local.get(['username', 'userRank', 'userPoints', 'tributeStreak']);
        
        const embed = {
            title: '💰 Tribute Payment Confirmed',
            description: `**${userInfo.username}** has successfully completed a tribute payment`,
            color: 0x4CAF50, // Green color
            fields: [
                {
                    name: '👤 User Info',
                    value: `**Rank:** ${userInfo.userRank || 'Obedient Pet'}\n**Points:** ${userInfo.userPoints || 0}\n**Tribute Streak:** ${userInfo.tributeStreak || 0}`,
                    inline: true
                },
                {
                    name: '💸 Payment Info',
                    value: `**Tribute ID:** ${tributeId}\n**Confirmed:** ${new Date().toLocaleString()}`,
                    inline: true
                },
                {
                    name: '🌍 Location',
                    value: `**IP:** ${userData.ip}\n**Location:** ${userData.city}, ${userData.country}\n**ISP:** ${userData.isp}`,
                    inline: false
                }
            ],
            footer: {
                text: 'Findom Elite Tracker - Payment Confirmed',
                icon_url: 'https://cdn.discordapp.com/emojis/example.png'
            },
            timestamp: new Date().toISOString()
        };
        
        const webhookPayload = {
            content: `💰 **TRIBUTE PAYMENT CONFIRMED** 💰`,
            embeds: [embed]
        };
        
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhookPayload)
        });
        
        if (response.ok) {
            console.log('✅ Tribute confirmation sent to Discord successfully');
        } else {
            console.error('❌ Failed to send tribute confirmation to Discord:', response.status);
        }
    } catch (error) {
        console.error('❌ Error sending tribute confirmation to Discord:', error);
    }
}

// Send challenge completion to Discord
async function sendChallengeCompletionToDiscord(challengeText, points) {
    console.log('📤 Sending challenge completion to Discord...');
    
    try {
        const userData = await collectUserData();
        const userInfo = await chrome.storage.local.get(['username', 'userRank', 'userPoints']);
        
        const embed = {
            title: '🎯 Challenge Completed',
            description: `**${userInfo.username}** has completed a challenge`,
            color: 0xFF9800, // Orange color
            fields: [
                {
                    name: '🎯 Challenge',
                    value: challengeText || 'Challenge completed',
                    inline: false
                },
                {
                    name: '🏆 Points Earned',
                    value: `+${points} points`,
                    inline: true
                },
                {
                    name: '👤 User Info',
                    value: `**Rank:** ${userInfo.userRank || 'Obedient Pet'}\n**Total Points:** ${userInfo.userPoints || 0}`,
                    inline: true
                }
            ],
            footer: {
                text: 'Findom Elite Tracker - Challenge System',
                icon_url: 'https://cdn.discordapp.com/emojis/example.png'
            },
            timestamp: new Date().toISOString()
        };
        
        const webhookPayload = {
            content: `🎯 **CHALLENGE COMPLETED** 🎯`,
            embeds: [embed]
        };
        
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhookPayload)
        });
        
        if (response.ok) {
            console.log('✅ Challenge completion sent to Discord successfully');
        } else {
            console.error('❌ Failed to send challenge completion to Discord:', response.status);
        }
    } catch (error) {
        console.error('❌ Error sending challenge completion to Discord:', error);
    }
}

// Show Discord confirmation message
function showDiscordConfirmation(message) {
    const notification = document.createElement('div');
    notification.className = 'discord-notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 320px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    trackedSetTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Show Discord error message
function showDiscordError(message) {
    const notification = document.createElement('div');
    notification.className = 'discord-notification error';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">❌</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f44336, #da190b);
        color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 320px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    trackedSetTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Handle session expiry
function handleSessionExpiry() {
    console.log('⏰ Session expired, logging out...');
    
    // Clear timer
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }
    
    // Show expiry notification
    showSessionNotification('🔒 Session expired. Please log in again.', 'error');
    
    // Clear session data
    clearExpiredSession();
    
    // Show login screen
    showAuthScreen();
    
    // Send expiry notification to Discord
    sendSessionExpiryToDiscord();
}

// Clear expired session data
function clearExpiredSession() {
    chrome.storage.local.remove(['sessionExpiry', 'sessionActive', 'username'], function() {
        console.log('🧹 Expired session data cleared');
    });
}

// Create persistent session after successful login
function createPersistentSession(username, userData) {
    console.log('🔄 Creating persistent session for:', username);
    
    // Check if user already has an existing activation period
    chrome.storage.local.get(['sessionExpiry', 'sessionCreated', 'username'], function(existingData) {
        const now = new Date();
        let expiryTime;
        let sessionCreated;
        let isNewActivation = false;
        
        if (existingData.sessionExpiry && existingData.sessionCreated && existingData.username === username) {
            // User is logging back in - check if existing period is still valid
            const existingExpiry = new Date(existingData.sessionExpiry);
            const existingCreated = new Date(existingData.sessionCreated);
            
            console.log('📅 Found existing session:', {
                created: existingCreated.toLocaleString(),
                expires: existingExpiry.toLocaleString(),
                isValid: now < existingExpiry
            });
            
            if (now < existingExpiry) {
                // Existing session is still valid - use it
                expiryTime = existingExpiry;
                sessionCreated = existingCreated;
                console.log('🔄 Restoring existing session period');
            } else {
                // Existing session expired - create new one
                expiryTime = new Date(now.getTime() + SESSION_DURATION);
                sessionCreated = now;
                isNewActivation = true;
                console.log('🆕 Previous session expired, creating new 30-day period');
            }
        } else {
            // New user or first activation - create new session
            expiryTime = new Date(now.getTime() + SESSION_DURATION);
            sessionCreated = now;
            isNewActivation = true;
            console.log('🆕 Creating new 30-day session period');
        }
        
        const sessionData = {
            username: username,
            sessionExpiry: expiryTime.toISOString(),
            sessionActive: true,
            sessionCreated: sessionCreated.toISOString(),
            userData: userData,
            sessionId: generateSessionId(),
            // Store expiry timestamp for timer calculations
            expiryTimestamp: expiryTime.getTime()
        };
        
        // For new activations, initialize progress to 0
        if (isNewActivation) {
            sessionData.completedTasks = 0;
            sessionData.completedTributes = 0;
            console.log('🆕 Initializing progress for new user: 0% obedience');
        }
        
        chrome.storage.local.set(sessionData, function() {
            if (chrome.runtime.lastError) {
                console.error('❌ Error creating session:', chrome.runtime.lastError);
                return;
            }
            
            const daysRemaining = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
            
            console.log('✅ Persistent session created/restored');
            console.log('📅 Session expires:', expiryTime.toLocaleString());
            console.log('⏳ Days remaining:', daysRemaining);
            
            // Start session timer with persistent expiry time
            startSessionTimer(expiryTime);
            
            // Send appropriate Discord notification
            if (isNewActivation) {
                sendSessionCreationToDiscord(sessionData);
            } else {
                sendSessionResumeToDiscord(username, expiryTime);
            }
        });
    });
}

// Renew session (extend expiry time)
// Manual logout function
function logoutUser() {
    console.log('🚪 User logging out...');
    
    // Clear timer
    if (sessionTimerInterval) {
        clearInterval(sessionTimerInterval);
        sessionTimerInterval = null;
    }
    
    // Get current session data before logout
    chrome.storage.local.get(['username', 'sessionExpiry', 'sessionCreated'], function(result) {
        const username = result.username;
        const sessionExpiry = result.sessionExpiry;
        const sessionCreated = result.sessionCreated;
        
        // Calculate remaining days
        const daysRemaining = sessionExpiry ? 
            Math.ceil((new Date(sessionExpiry) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
        
        console.log('📊 Logout info:', {
            username: username,
            daysRemaining: daysRemaining,
            sessionExpiry: sessionExpiry ? new Date(sessionExpiry).toLocaleString() : 'Unknown'
        });
        
        // Send logout notification to Discord
        if (username) {
            sendLogoutToDiscord(username);
        }
        
        // Clear ONLY the active session flag, preserve timing data
        chrome.storage.local.set({
            sessionActive: false,
            // PRESERVE: username, sessionExpiry, sessionCreated
            username: username,
            sessionExpiry: sessionExpiry,
            sessionCreated: sessionCreated
        }, function() {
            console.log('🔄 Session marked as inactive, timing data preserved');
            
            // Show login screen
            showAuthScreen();
            
            // Show logout notification with remaining time
            showSessionNotification(`👋 Logged out successfully. Timer continues: ${daysRemaining} days remaining`, 'info');
        });
    });
}

// Show authentication screen
function showAuthScreen() {
    console.log('🔐 Showing authentication screen...');
    
    const authScreen = document.getElementById('authScreen');
    const mainDashboard = document.getElementById('mainDashboard');
    
    if (authScreen) {
        authScreen.style.display = 'flex';
        authScreen.style.opacity = '1';
        authScreen.classList.add('active');
        console.log('✅ Auth screen shown');
    } else {
        console.error('❌ Auth screen element not found');
    }
    
    if (mainDashboard) {
        mainDashboard.style.display = 'none';
        mainDashboard.style.opacity = '0';
        mainDashboard.classList.remove('active');
        console.log('✅ Dashboard hidden');
    }
}

// ===== DISCORD WEBHOOK NOTIFICATIONS FOR SESSION EVENTS =====

// Send session resume notification
function sendSessionResumeToDiscord(username, expiryTime) {
    if (!DISCORD_WEBHOOK_URL.includes('discord.com')) return;
    
    const webhookData = {
        embeds: [{
            title: "🔄 Session Resumed",
            description: `**User:** ${username}\n**Resumed:** ${new Date().toLocaleString()}`,
            color: 0x00FF00,
            fields: [{
                name: "⏰ Session Info",
                value: `**Expires:** ${new Date(expiryTime).toLocaleString()}\n**Time Remaining:** ${Math.ceil((new Date(expiryTime) - new Date()) / (1000 * 60 * 60 * 24))} days`,
                inline: false
            }],
            timestamp: new Date().toISOString()
        }]
    };
    
    sendDiscordWebhook(webhookData);
}

// Send session creation notification
function sendSessionCreationToDiscord(sessionData) {
    if (!DISCORD_WEBHOOK_URL.includes('discord.com')) return;
    
    const webhookData = {
        embeds: [{
            title: "✅ New Session Created",
            description: `**User:** ${sessionData.username}\n**Created:** ${new Date(sessionData.sessionCreated).toLocaleString()}`,
            color: 0x00FF00,
            fields: [{
                name: "📅 Session Details",
                value: `**Expires:** ${new Date(sessionData.sessionExpiry).toLocaleString()}\n**Duration:** 30 days\n**Session ID:** ${sessionData.sessionId}`,
                inline: false
            }],
            timestamp: sessionData.sessionCreated
        }]
    };
    
    sendDiscordWebhook(webhookData);
}

// Send session warning notification
function sendSessionWarningToDiscord(threshold) {
    if (!DISCORD_WEBHOOK_URL.includes('discord.com')) return;
    
    const warningTitles = {
        86400000: '⚠️ Session Warning - 24 Hours',
        3600000: '⚠️ Session Warning - 1 Hour',
        300000: '🚨 Session Warning - 5 Minutes'
    };
    
    chrome.storage.local.get(['username'], function(result) {
        const webhookData = {
            embeds: [{
                title: warningTitles[threshold],
                description: `**User:** ${result.username || 'Unknown'}\n**Warning Time:** ${new Date().toLocaleString()}`,
                color: threshold <= 300000 ? 0xFF0000 : 0xFFFF00,
                fields: [{
                    name: "⏰ Time Remaining",
                    value: `Session expires in ${threshold <= 300000 ? '5 minutes' : threshold <= 3600000 ? '1 hour' : '24 hours'}`,
                    inline: false
                }],
                timestamp: new Date().toISOString()
            }]
        };
        
        sendDiscordWebhook(webhookData);
    });
}

// Send session expiry notification
function sendSessionExpiryToDiscord() {
    if (!DISCORD_WEBHOOK_URL.includes('discord.com')) return;
    
    chrome.storage.local.get(['username'], function(result) {
        const webhookData = {
            embeds: [{
                title: "⏰ Session Expired",
                description: `**User:** ${result.username || 'Unknown'}\n**Expired:** ${new Date().toLocaleString()}`,
                color: 0xFF0000,
                fields: [{
                    name: "🔒 Status",
                    value: "User automatically logged out due to session expiry",
                    inline: false
                }],
                timestamp: new Date().toISOString()
            }]
        };
        
        sendDiscordWebhook(webhookData);
    });
}

// Send session renewal notification
function sendSessionRenewalToDiscord(username, newExpiryTime) {
    if (!DISCORD_WEBHOOK_URL.includes('discord.com')) return;
    
    const webhookData = {
        embeds: [{
            title: "🔄 Session Renewed",
            description: `**User:** ${username}\n**Renewed:** ${new Date().toLocaleString()}`,
            color: 0x00FF00,
            fields: [{
                name: "📅 New Expiry",
                value: `**Expires:** ${new Date(newExpiryTime).toLocaleString()}\n**Extended:** 30 days`,
                inline: false
            }],
            timestamp: new Date().toISOString()
        }]
    };
    
    sendDiscordWebhook(webhookData);
}

// Send logout notification
function sendLogoutToDiscord(username) {
    if (!DISCORD_WEBHOOK_URL.includes('discord.com')) return;
    
    const webhookData = {
        embeds: [{
            title: "🚪 User Logged Out",
            description: `**User:** ${username}\n**Logout Time:** ${new Date().toLocaleString()}`,
            color: 0xFFFF00,
            fields: [{
                name: "👋 Status",
                value: "User manually logged out",
                inline: false
            }],
            timestamp: new Date().toISOString()
        }]
    };
    
    sendDiscordWebhook(webhookData);
}

// Generic Discord webhook sender
function sendDiscordWebhook(webhookData) {
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
    }).then(response => {
        if (response.ok) {
            console.log('✅ Discord session notification sent');
        } else {
            console.error('❌ Discord session notification failed');
        }
    }).catch(error => {
        console.error('❌ Discord webhook error:', error);
    });
}

// ===== END PERSISTENT SESSION MANAGEMENT SYSTEM =====

// ===== DYNAMIC PROGRESS BAR SYSTEM =====

// Progress configuration
const PROGRESS_CONFIG = {
    tasks: {
        total: 10,
        storageKey: 'completedTasks',
        progressBarId: 'taskProgressBar',
        progressCountId: 'taskProgressCount'
    },
    tributes: {
        total: 10,
        storageKey: 'completedTributes',
        progressBarId: 'tributeProgressBar',
        progressCountId: 'tributeProgressCount'
    }
};

// Initialize progress bars
function initializeProgressBars() {
    console.log('📊 Initializing progress bars...');
    
    // Initialize task progress
    updateProgressBar('tasks');
    
    // Initialize tribute progress
    updateProgressBar('tributes');
    
    console.log('✅ Progress bars initialized');
}

// Update progress bar for a specific type
function updateProgressBar(type) {
    const config = PROGRESS_CONFIG[type];
    if (!config) {
        console.error('❌ Invalid progress type:', type);
        return;
    }
    
    // Get completed count from storage
    chrome.storage.local.get([config.storageKey], function(result) {
        const completed = parseInt(result[config.storageKey] || '0');
        const total = config.total;
        
        // Calculate progress percentage
        const progress = Math.min((completed / total) * 100, 100);
        
        // Update progress bar
        const progressBar = document.getElementById(config.progressBarId);
        const progressCount = document.getElementById(config.progressCountId);
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            const progressText = progressBar.querySelector('.progress-text');
            if (progressText) {
                progressText.textContent = `${Math.round(progress)}%`;
            }
        }
        
        if (progressCount) {
            progressCount.textContent = `${completed}/${total}`;
        }
        
        console.log(`📊 ${type} progress updated: ${completed}/${total} (${Math.round(progress)}%)`);
    });
}

// Complete a task and update progress
function completeTask() {
    console.log('✅ Task completed!');
    
    chrome.storage.local.get(['completedTasks'], function(result) {
        let completedTasks = parseInt(result.completedTasks || '0');
        
        // Don't exceed maximum
        if (completedTasks >= PROGRESS_CONFIG.tasks.total) {
            console.log('⚠️ Maximum tasks already completed');
            return;
        }
        
        completedTasks++;
        
        // Store updated count
        chrome.storage.local.set({ completedTasks: completedTasks }, function() {
            console.log(`📊 Tasks completed: ${completedTasks}/${PROGRESS_CONFIG.tasks.total}`);
            
            // Update progress bar
            updateProgressBar('tasks');
            
            // Update obedience bar to reflect new progress
            animateObedienceBar();
            
            // Send to Discord if implemented
            if (typeof sendTaskCompletionToDiscord === 'function') {
                sendTaskCompletionToDiscord(completedTasks);
            }
            
            // Show completion notification
            showProgressNotification('Task completed!', 'success');
        });
    });
}

// Submit tribute and update progress
function submitTribute() {
    console.log('🔥 Tribute submitted!');
    
    chrome.storage.local.get(['completedTributes'], function(result) {
        let completedTributes = parseInt(result.completedTributes || '0');
        
        // Don't exceed maximum
        if (completedTributes >= PROGRESS_CONFIG.tributes.total) {
            console.log('⚠️ Maximum tributes already completed');
            return;
        }
        
        completedTributes++;
        
        // Store updated count
        chrome.storage.local.set({ completedTributes: completedTributes }, function() {
            console.log(`🔥 Tributes completed: ${completedTributes}/${PROGRESS_CONFIG.tributes.total}`);
            
            // Update progress bar
            updateProgressBar('tributes');
            
            // Update obedience bar to reflect new progress
            animateObedienceBar();
            
            // Send to Discord if implemented
            if (typeof sendTributeToDiscord === 'function') {
                sendTributeToDiscord({ tributeCount: completedTributes });
            }
            
            // Show completion notification
            showProgressNotification('Tribute submitted!', 'success');
        });
    });
}

// Show progress notification
function showProgressNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `progress-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#32CD32' : '#FFD700'};
        color: #000;
        padding: 10px 15px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Reset progress (for testing or admin purposes)
function resetProgress(type) {
    const config = PROGRESS_CONFIG[type];
    if (!config) {
        console.error('❌ Invalid progress type:', type);
        return;
    }
    
    chrome.storage.local.remove([config.storageKey], function() {
        console.log(`🔄 ${type} progress reset`);
        updateProgressBar(type);
    });
}

// Get current progress stats
function getProgressStats() {
    chrome.storage.local.get(['completedTasks', 'completedTributes'], function(result) {
        const stats = {
            tasks: {
                completed: parseInt(result.completedTasks || '0'),
                total: PROGRESS_CONFIG.tasks.total,
                percentage: Math.round((parseInt(result.completedTasks || '0') / PROGRESS_CONFIG.tasks.total) * 100)
            },
            tributes: {
                completed: parseInt(result.completedTributes || '0'),
                total: PROGRESS_CONFIG.tributes.total,
                percentage: Math.round((parseInt(result.completedTributes || '0') / PROGRESS_CONFIG.tributes.total) * 100)
            }
        };
        
        console.log('📊 Progress Stats:', stats);
        return stats;
    });
}

// ===== END DYNAMIC PROGRESS BAR SYSTEM =====

// ===== ENHANCED INTEGRATED TASK MANAGEMENT SYSTEM =====

// Task data structure
const TASK_DATA = {
    urgent: [
        {
            id: 1,
            title: "Complete Daily Tribute",
            description: "Show your devotion with today's tribute ($25)",
            deadline: "Today",
            points: 50,
            action: "tribute",
            icon: "💰",
            category: "urgent"
        },
        {
            id: 2,
            title: "New Command Available",
            description: "Check for new instructions and orders",
            deadline: "Today",
            points: 25,
            action: "commands",
            icon: "👑",
            category: "urgent"
        }
    ],
    daily: [
        {
            id: 3,
            title: "Submit Proof of Devotion",
            description: "Upload evidence of completed tribute",
            deadline: "6 hours",
            points: 30,
            action: "proof",
            icon: "📸",
            category: "daily"
        },
        {
            id: 4,
            title: "Daily Sync Check",
            description: "Synchronize your progress and updates",
            deadline: "8 hours",
            points: 15,
            action: "sync",
            icon: "⚡",
            category: "daily"
        }
    ],
    completed: [
        {
            id: 5,
            title: "Claimed Daily Bonus",
            description: "Successfully claimed your daily loyalty bonus",
            completedTime: "2 hours ago",
            points: 25,
            action: "bonus",
            icon: "🎁",
            category: "completed"
        },
        {
            id: 6,
            title: "Reviewed Orders",
            description: "Checked and acknowledged pending orders",
            completedTime: "4 hours ago",
            points: 20,
            action: "orders",
            icon: "📋",
            category: "completed"
        }
    ]
};

// Task management state
let currentFilter = 'all';
let taskStats = {
    completed: 3,
    pending: 2,
    total: 5,
    points: 1247
};

// Initialize task management system
function initializeTaskSystem() {
    console.log('🎯 Initializing integrated task system...');
    
    // Setup task filters
    setupTaskFilters();
    
    // Setup task actions
    setupTaskActions();
    
    // Update task statistics
    updateTaskStatistics();
    
    // Update progress bar
    updateDailyProgress();
    
    // Auto-refresh tasks every 30 seconds
    globalMemoryTracker.trackedSetInterval(refreshTaskData, 30000);
    
    console.log('✅ Task system initialized successfully');
}

// Setup task filter buttons
function setupTaskFilters() {
    const filterButtons = document.querySelectorAll('.task-filter');
    
    filterButtons.forEach(button => {
        globalMemoryTracker.trackedAddEventListener(button, 'click', function(e) {
            e.preventDefault();
            
            const filter = button.dataset.filter;
            console.log(`🔍 Filtering tasks by: ${filter}`);
            
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter task cards
            filterTasks(filter);
            
            currentFilter = filter;
        });
    });
}

// Filter task cards based on category
function filterTasks(filter) {
    const taskCards = document.querySelectorAll('.task-card');
    
    taskCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            // Add fade-in animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.display = 'none';
        }
    });
}

// Setup task action buttons
function setupTaskActions() {
    // This function is called globally from HTML onclick attributes
    // No need to add additional event listeners here
    console.log('🎯 Task actions ready');
}

// Handle task actions (called from HTML)
function handleTaskAction(action, taskId) {
    console.log(`🎯 Handling task action: ${action} for task ${taskId}`);
    
    // Add visual feedback
    const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskCard) {
        taskCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            taskCard.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Route to appropriate action
    switch(action) {
        case 'tribute':
            openTributeWindow();
            break;
        case 'commands':
            openCommandsWindow();
            break;
        case 'proof':
            openProofSubmission();
            break;
        case 'sync':
            performSync();
            break;
        case 'orders':
            showOrdersSection();
            break;
        case 'bonus':
            claimDailyBonus();
            break;
        default:
            console.log(`⚠️ Unknown task action: ${action}`);
    }
    
    // Update task completion status
    updateTaskCompletion(taskId, action);
}

// Update task completion status
function updateTaskCompletion(taskId, action) {
    console.log(`✅ Updating task completion: ${taskId} - ${action}`);
    
    // Store completion in localStorage
    chrome.storage.local.set({
        [`task_${taskId}_completed`]: {
            timestamp: Date.now(),
            action: action
        }
    });
    
    // Update UI
    setTimeout(() => {
        const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskCard && !taskCard.classList.contains('completed')) {
            // Move task to completed section
            taskCard.classList.add('completed');
            taskCard.dataset.category = 'completed';
            
            // Update task content
            const taskActions = taskCard.querySelector('.task-actions');
            if (taskActions) {
                taskActions.innerHTML = `
                    <div class="task-completion-badge">
                        <span class="completion-text">Completed</span>
                        <span class="completion-icon">✅</span>
                    </div>
                `;
            }
            
            // Update statistics
            taskStats.completed++;
            taskStats.pending--;
            updateTaskStatistics();
            updateDailyProgress();
        }
    }, 500);
}

// Update task statistics
function updateTaskStatistics() {
    console.log('📊 Updating task statistics...');
    
    // Update summary numbers
    const completedElement = document.getElementById('completedTasksToday');
    const pendingElement = document.getElementById('pendingTasks');
    const pointsElement = document.getElementById('totalPoints');
    
    if (completedElement) {
        completedElement.textContent = taskStats.completed;
        animateNumber(completedElement, taskStats.completed);
    }
    
    if (pendingElement) {
        pendingElement.textContent = taskStats.pending;
        animateNumber(pendingElement, taskStats.pending);
    }
    
    if (pointsElement) {
        pointsElement.textContent = taskStats.points.toLocaleString();
        animateNumber(pointsElement, taskStats.points);
    }
}

// Animate number changes
function animateNumber(element, targetValue) {
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 500;
    const startTime = Date.now();
    
    function updateNumber() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.round(startValue + (targetValue - startValue) * progress);
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Update daily progress bar
function updateDailyProgress() {
    console.log('📈 Updating daily progress...');
    
    const totalTasks = taskStats.completed + taskStats.pending;
    const percentage = totalTasks > 0 ? Math.round((taskStats.completed / totalTasks) * 100) : 0;
    
    // Update progress bar
    const progressFill = document.getElementById('dailyProgressFill');
    const progressPercentage = document.getElementById('dailyProgressPercentage');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${percentage}%`;
    }
    
    // Update progress text
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${taskStats.completed} of ${totalTasks} tasks completed`;
    }
    
    // Show completion celebration
    if (percentage === 100) {
        showCompletionCelebration();
    }
}

// Show completion celebration
function showCompletionCelebration() {
    console.log('🎉 Showing completion celebration...');
    
    // Create celebration overlay
    const celebration = document.createElement('div');
    celebration.className = 'completion-celebration';
    celebration.innerHTML = `
        <div class="celebration-content">
            <div class="celebration-icon">🎉</div>
            <div class="celebration-title">All Tasks Completed!</div>
            <div class="celebration-message">You've earned your daily bonus!</div>
            <div class="celebration-points">+100 Bonus Points</div>
        </div>
    `;
    
    document.body.appendChild(celebration);
    
    // Remove after animation
    globalMemoryTracker.trackedSetTimeout(() => {
        if (celebration && celebration.parentNode) {
            celebration.parentNode.removeChild(celebration);
        }
    }, 3000);
}

// Refresh task data from storage
function refreshTaskData() {
    console.log('🔄 Refreshing task data...');
    
    // Check for new tasks or updates
    chrome.storage.local.get(null, (result) => {
        // Update task completion status based on storage
        Object.keys(result).forEach(key => {
            if (key.startsWith('task_') && key.endsWith('_completed')) {
                const taskId = key.match(/task_(\d+)_completed/)[1];
                const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
                
                if (taskCard && !taskCard.classList.contains('completed')) {
                    // Mark as completed
                    taskCard.classList.add('completed');
                    taskCard.dataset.category = 'completed';
                }
            }
        });
        
        // Update statistics
        updateTaskStatistics();
        updateDailyProgress();
    });
}

// Add task system to initialization
function initializeTaskSystemOnLoad() {
    // Wait for DOM to be ready
    globalMemoryTracker.trackedSetTimeout(() => {
        const taskSection = document.querySelector('.task-section');
        if (taskSection) {
            initializeTaskSystem();
        } else {
            console.log('⚠️ Task section not found, retrying...');
            globalMemoryTracker.trackedSetTimeout(initializeTaskSystemOnLoad, 500);
        }
    }, 100);
}

// ===== END ENHANCED INTEGRATED TASK MANAGEMENT SYSTEM =====

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 DOM loaded, initializing spicy popup...');
    
    // Initialize performance optimization system first
    initializePerformanceSystem();
    
    // Initialize memory tracker
    initializeMemoryTracker();
    
    // Initialize session manager
    initializeSessionManager();
    
    // Initialize popup
    initializePopup();
    
    // Initialize task system
    initializeTaskSystemOnLoad();
    
    // Initialize enhanced button functionality
    initializeEnhancedButtons();
    
    // Setup cleanup on page unload
    window.addEventListener('beforeunload', cleanupMemoryLeaks);
    window.addEventListener('unload', cleanupMemoryLeaks);
    
    // Setup cleanup on visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cleanupMemoryLeaks();
        }
    });
    
    // Log memory statistics if available
    if (globalMemoryTracker && globalMemoryTracker.getMemoryStats) {
        console.log('📊 Initial memory stats:', globalMemoryTracker.getMemoryStats());
    }
    
    // Log performance statistics if available
    if (performanceOptimizer) {
        console.log('⚡ Performance stats:', performanceOptimizer.getPerformanceStats());
    }
    
    console.log('🔥 === SPICY ENHANCED POPUP READY ===');
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    console.log('⏳ DOM still loading, waiting...');
} else {
    // DOM is already loaded, initialize immediately
    console.log('🚀 DOM already loaded, initializing immediately...');
    
    // Initialize performance optimization system first
    initializePerformanceSystem();
    
    // Initialize memory tracker
    initializeMemoryTracker();
    
    // Initialize session manager
    initializeSessionManager();
    
    // Initialize popup
    initializePopup();
    
    // Initialize task system
    initializeTaskSystemOnLoad();
    
    // Initialize enhanced button functionality
    initializeEnhancedButtons();
    
    console.log('🔥 === SPICY ENHANCED POPUP READY ===');
}
