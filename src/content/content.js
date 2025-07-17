class PaymentSiteTracker {
    constructor() {
        this.observers = new Set();
        this.intervals = new Set();
        this.timeouts = new Set();
        this.isActive = true;
        this.currentSite = this.detectSite();
        this.init();
    }

    init() {
        if (this.currentSite) {
            console.log(`Findom Elite Tracker 2 - Tracking ${this.currentSite}`);
            this.setupTracking();
            this.setupCleanup();
        }
    }

    detectSite() {
        const hostname = window.location.hostname;
        const siteMap = {
            'throne.com': 'throne',
            'www.throne.com': 'throne',
            'cashapp.com': 'cashapp',
            'cash.app': 'cashapp',
            'venmo.com': 'venmo',
            'account.venmo.com': 'venmo',
            'paypal.com': 'paypal',
            'www.paypal.com': 'paypal',
            'amazon.com': 'amazon',
            'www.amazon.com': 'amazon'
        };
        
        return siteMap[hostname] || null;
    }

    setupTracking() {
        this.trackPaymentInputs();
        this.trackPaymentButtons();
        this.enhancedPaymentDetection();
        this.trackClientInfo();
        this.addEnhancedVisualIndicator();
        this.checkGoalProgress();
        this.trackPaymentAnalytics();
        this.setupMessageListener();
    }

    trackPaymentInputs() {
        const paymentSelectors = {
            throne: 'input[type="number"], input[placeholder*="amount"], input[placeholder*="$"]',
            cashapp: 'input[data-testid="amount-input"], input[placeholder*="$"]',
            venmo: 'input[name="amount"], input[placeholder*="amount"]',
            paypal: 'input[name="amount"], input[id*="amount"]',
            amazon: 'input[name="amount"], input[id*="amount"]'
        };

        const selector = paymentSelectors[this.currentSite];
        if (selector) {
            this.observeElements(selector, (element) => {
                this.trackInput(element);
            });
        }
    }

    trackPaymentButtons() {
        const buttonSelectors = {
            throne: 'button[class*="gift"], button[class*="pay"]',
            cashapp: 'button[data-testid="pay-button"]',
            venmo: 'button[type="submit"], button[class*="pay"]',
            paypal: 'button[id*="pay"], button[class*="pay"]',
            amazon: 'button[name="add-to-cart"], button[id*="buy"]'
        };

        const selector = buttonSelectors[this.currentSite];
        if (selector) {
            this.observeElements(selector, (element) => {
                this.trackButton(element);
            });
        }
    }

    observeElements(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const elements = node.querySelectorAll ? 
                            node.querySelectorAll(selector) : 
                            (node.matches && node.matches(selector) ? [node] : []);
                        
                        elements.forEach(callback);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        this.observers.add(observer);

        // Track existing elements
        document.querySelectorAll(selector).forEach(callback);
    }

    trackInput(element) {
        const trackingHandler = (event) => {
            if (!this.isActive) return;
            
            const data = {
                type: 'payment_input',
                site: this.currentSite,
                value: event.target.value,
                timestamp: new Date().toISOString(),
                url: window.location.href
            };

            this.sendToBackground(data);
        };

        element.addEventListener('input', trackingHandler);
        element.addEventListener('change', trackingHandler);
    }

    trackButton(element) {
        const trackingHandler = (event) => {
            if (!this.isActive) return;
            
            const data = {
                type: 'payment_button_click',
                site: this.currentSite,
                buttonText: element.textContent || element.value,
                timestamp: new Date().toISOString(),
                url: window.location.href
            };

            this.sendToBackground(data);
        };

        element.addEventListener('click', trackingHandler);
    }

    // Enhanced Payment Tracking Features
    trackPaymentAnalytics() {
        // Track payment patterns and analytics
        const paymentData = {
            timestamp: new Date().toISOString(),
            site: this.currentSite,
            url: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100)
        };

        // Send analytics to background script
        chrome.runtime.sendMessage({
            action: 'trackPayment',
            data: paymentData
        });
    }

    trackClientInfo() {
        // Track client information based on page context
        const clientSelectors = {
            throne: '[data-testid="username"], .username, .user-name',
            cashapp: '[data-testid="display-name"], .display-name',
            venmo: '[data-testid="user-name"], .user-name',
            paypal: '[data-testid="name"], .name',
            amazon: '.a-profile-name, .username'
        };

        const selector = clientSelectors[this.currentSite];
        if (selector) {
            const clientElement = document.querySelector(selector);
            if (clientElement) {
                const clientName = clientElement.textContent.trim();
                if (clientName) {
                    this.logClientActivity(clientName);
                }
            }
        }
    }

    async logClientActivity(clientName) {
        try {
            const result = await chrome.storage.local.get(['clientData']);
            const clientData = result.clientData || {};
            
            if (!clientData[clientName]) {
                clientData[clientName] = {
                    name: clientName,
                    firstSeen: new Date().toISOString(),
                    totalPayments: 0,
                    totalAmount: 0,
                    lastActivity: new Date().toISOString(),
                    sites: []
                };
            }

            // Update client data
            clientData[clientName].lastActivity = new Date().toISOString();
            if (!clientData[clientName].sites.includes(this.currentSite)) {
                clientData[clientName].sites.push(this.currentSite);
            }

            await chrome.storage.local.set({ clientData });
        } catch (error) {
            console.error('Error logging client activity:', error);
        }
    }

    // Enhanced payment amount detection
    enhancedPaymentDetection() {
        const amountSelectors = {
            throne: [
                'input[name="amount"]',
                'input[placeholder*="amount"]',
                'input[placeholder*="$"]',
                '.amount-input',
                '[data-testid="amount-input"]'
            ],
            cashapp: [
                'input[data-testid="amount-input"]',
                'input[placeholder*="$"]',
                '.amount-input',
                '[aria-label*="amount"]'
            ],
            venmo: [
                'input[name="amount"]',
                'input[placeholder*="amount"]',
                '.amount-input',
                '[data-testid="amount"]'
            ],
            paypal: [
                'input[name="amount"]',
                'input[id*="amount"]',
                '.amount-input',
                '[data-testid="amount"]'
            ],
            amazon: [
                'input[name="amount"]',
                'input[id*="amount"]',
                '.a-price-amount',
                '[data-testid="price"]'
            ]
        };

        const selectors = amountSelectors[this.currentSite] || [];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.hasAttribute('data-tracked')) {
                    element.setAttribute('data-tracked', 'true');
                    this.attachPaymentListener(element);
                }
            });
        });
    }

    attachPaymentListener(element) {
        const events = ['input', 'change', 'blur'];
        
        events.forEach(event => {
            element.addEventListener(event, (e) => {
                const value = e.target.value;
                if (value && this.isValidAmount(value)) {
                    this.logPaymentAmount(value);
                }
            });
        });
    }

    isValidAmount(value) {
        const amount = parseFloat(value.replace(/[$,]/g, ''));
        return !isNaN(amount) && amount > 0;
    }

    async logPaymentAmount(amount) {
        try {
            const numericAmount = parseFloat(amount.replace(/[$,]/g, ''));
            
            const paymentLog = {
                id: Date.now(),
                amount: numericAmount,
                site: this.currentSite,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                detected: true
            };

            const result = await chrome.storage.local.get(['paymentLogs']);
            const paymentLogs = result.paymentLogs || [];
            paymentLogs.push(paymentLog);

            await chrome.storage.local.set({ paymentLogs });

            // Send notification
            chrome.runtime.sendMessage({
                action: 'paymentDetected',
                data: paymentLog
            });

        } catch (error) {
            console.error('Error logging payment amount:', error);
        }
    }

    // Goal tracking
    async checkGoalProgress() {
        try {
            const result = await chrome.storage.local.get(['settings', 'paymentLogs']);
            const settings = result.settings || {};
            const paymentLogs = result.paymentLogs || [];

            const today = new Date().toDateString();
            const thisWeek = this.getWeekStart();
            const thisMonth = new Date().getMonth();

            const todayTotal = paymentLogs
                .filter(log => new Date(log.timestamp).toDateString() === today)
                .reduce((sum, log) => sum + log.amount, 0);

            const weekTotal = paymentLogs
                .filter(log => new Date(log.timestamp) >= thisWeek)
                .reduce((sum, log) => sum + log.amount, 0);

            const monthTotal = paymentLogs
                .filter(log => new Date(log.timestamp).getMonth() === thisMonth)
                .reduce((sum, log) => sum + log.amount, 0);

            // Check if goals are met
            if (settings.dailyGoal && todayTotal >= settings.dailyGoal) {
                this.showGoalNotification('Daily goal reached!', todayTotal);
            }
            if (settings.weeklyGoal && weekTotal >= settings.weeklyGoal) {
                this.showGoalNotification('Weekly goal reached!', weekTotal);
            }
            if (settings.monthlyGoal && monthTotal >= settings.monthlyGoal) {
                this.showGoalNotification('Monthly goal reached!', monthTotal);
            }

        } catch (error) {
            console.error('Error checking goal progress:', error);
        }
    }

    getWeekStart() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const numDaysPastSunday = dayOfWeek === 0 ? 0 : dayOfWeek;
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - numDaysPastSunday);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    }

    showGoalNotification(message, amount) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <div>🎉 ${message}</div>
            <div style="font-size: 14px; margin-top: 5px;">Total: $${amount.toFixed(2)}</div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Enhanced visual indicator
    addEnhancedVisualIndicator() {
        if (document.getElementById('findom-tracker-indicator')) return;

        const indicator = document.createElement('div');
        indicator.id = 'findom-tracker-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                left: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                👑 Elite Tracker Active
            </div>
        `;

        document.body.appendChild(indicator);

        // Add click handler for quick stats
        indicator.addEventListener('click', () => {
            this.showQuickStats();
        });
    }

    async showQuickStats() {
        try {
            const result = await chrome.storage.local.get(['paymentLogs']);
            const paymentLogs = result.paymentLogs || [];

            const today = new Date().toDateString();
            const todayLogs = paymentLogs.filter(log => new Date(log.timestamp).toDateString() === today);
            const todayTotal = todayLogs.reduce((sum, log) => sum + log.amount, 0);

            const statsPopup = document.createElement('div');
            statsPopup.style.cssText = `
                position: fixed;
                top: 50px;
                left: 10px;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 20px;
                border-radius: 15px;
                font-size: 14px;
                z-index: 10000;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                min-width: 200px;
            `;

            statsPopup.innerHTML = `
                <h3 style="margin: 0 0 10px 0;">📊 Today's Stats</h3>
                <p>Payments: ${todayLogs.length}</p>
                <p>Total: $${todayTotal.toFixed(2)}</p>
                <p>Site: ${this.currentSite}</p>
                <button style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                " onclick="this.parentElement.remove()">Close</button>
            `;

            document.body.appendChild(statsPopup);

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (statsPopup.parentElement) {
                    statsPopup.remove();
                }
            }, 10000);

        } catch (error) {
            console.error('Error showing quick stats:', error);
        }
    }

    sendPageData(sendResponse) {
        const data = {
            site: this.currentSite,
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            paymentElements: this.getPaymentElementsCount()
        };

        sendResponse(data);
    }

    getPaymentElementsCount() {
        const selectors = {
            throne: 'input[type="number"], button[class*="gift"]',
            cashapp: 'input[data-testid="amount-input"], button[data-testid="pay-button"]',
            venmo: 'input[name="amount"], button[type="submit"]',
            paypal: 'input[name="amount"], button[id*="pay"]',
            amazon: 'input[name="amount"], button[name="add-to-cart"]'
        };

        const selector = selectors[this.currentSite];
        return selector ? document.querySelectorAll(selector).length : 0;
    }

    toggleTracking(sendResponse) {
        this.isActive = !this.isActive;
        const indicator = document.getElementById('findom-tracker-indicator');
        
        if (indicator) {
            indicator.style.opacity = this.isActive ? '1' : '0.5';
        }

        sendResponse({ active: this.isActive });
    }

    sendToBackground(data) {
        chrome.runtime.sendMessage({
            action: "trackingData",
            data: data
        }).catch(error => {
            console.log("Background communication error:", error);
        });
    }

    setupCleanup() {
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Cleanup on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanup();
            }
        });
    }

    cleanup() {
        this.isActive = false;
        
        // Clear all observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();

        // Clear all intervals
        this.intervals.forEach(interval => {
            clearInterval(interval);
        });
        this.intervals.clear();

        // Clear all timeouts
        this.timeouts.forEach(timeout => {
            clearTimeout(timeout);
        });
        this.timeouts.clear();

        console.log("Content script cleaned up - memory freed");
    }
}

// Initialize the tracker
const tracker = new PaymentSiteTracker();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    tracker.cleanup();
});