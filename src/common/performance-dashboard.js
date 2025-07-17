// Performance Dashboard for Admin Panel
class PerformanceDashboard {
    constructor() {
        this.isVisible = false;
        this.updateInterval = null;
        this.chartData = {
            memory: [],
            cpu: [],
            operations: []
        };
        this.init();
    }

    init() {
        this.createDashboard();
        this.setupEventListeners();
        console.log('📊 Performance Dashboard initialized');
    }

    createDashboard() {
        // Create dashboard container
        const dashboard = document.createElement('div');
        dashboard.id = 'performanceDashboard';
        dashboard.className = 'performance-dashboard';
        dashboard.style.display = 'none';
        
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <h3>🚀 Performance Monitor</h3>
                <div class="dashboard-controls">
                    <button class="dashboard-btn" id="refreshPerformance">🔄 Refresh</button>
                    <button class="dashboard-btn" id="clearPerformance">🧹 Clear</button>
                    <button class="dashboard-btn" id="exportPerformance">📊 Export</button>
                    <button class="dashboard-btn close" id="closeDashboard">❌</button>
                </div>
            </div>
            
            <div class="dashboard-content">
                <!-- Memory Usage Section -->
                <div class="performance-section">
                    <div class="section-header">
                        <h4>💾 Memory Usage</h4>
                        <div class="memory-status" id="memoryStatus">Normal</div>
                    </div>
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-value" id="memoryUsed">0 MB</div>
                            <div class="metric-label">Used</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="memoryTotal">0 MB</div>
                            <div class="metric-label">Total</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="memoryLimit">0 MB</div>
                            <div class="metric-label">Limit</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="memoryPercentage">0%</div>
                            <div class="metric-label">Usage</div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="memoryChart" width="400" height="200"></canvas>
                    </div>
                </div>
                
                <!-- CPU Usage Section -->
                <div class="performance-section">
                    <div class="section-header">
                        <h4>⚡ CPU Usage</h4>
                        <div class="cpu-status" id="cpuStatus">Normal</div>
                    </div>
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-value" id="cpuCurrent">0%</div>
                            <div class="metric-label">Current</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="cpuAverage">0%</div>
                            <div class="metric-label">Average</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="cpuPeak">0%</div>
                            <div class="metric-label">Peak</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="cpuLevel">Normal</div>
                            <div class="metric-label">Level</div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="cpuChart" width="400" height="200"></canvas>
                    </div>
                </div>
                
                <!-- Operations Section -->
                <div class="performance-section">
                    <div class="section-header">
                        <h4>🔧 Operations</h4>
                        <div class="operations-status" id="operationsStatus">Active</div>
                    </div>
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-value" id="activeTimers">0</div>
                            <div class="metric-label">Timers</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="activeListeners">0</div>
                            <div class="metric-label">Listeners</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="activeObservers">0</div>
                            <div class="metric-label">Observers</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value" id="activeAnimations">0</div>
                            <div class="metric-label">Animations</div>
                        </div>
                    </div>
                </div>
                
                <!-- Memory Leaks Section -->
                <div class="performance-section">
                    <div class="section-header">
                        <h4>🔍 Memory Leaks</h4>
                        <div class="leaks-status" id="leaksStatus">None</div>
                    </div>
                    <div class="leaks-list" id="leaksList">
                        <div class="no-leaks">No memory leaks detected</div>
                    </div>
                </div>
                
                <!-- Performance Recommendations -->
                <div class="performance-section">
                    <div class="section-header">
                        <h4>💡 Recommendations</h4>
                    </div>
                    <div class="recommendations-list" id="recommendationsList">
                        <div class="recommendation">Performance is optimal</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dashboard);
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshPerformance').addEventListener('click', () => {
            this.refreshData();
        });
        
        // Clear button
        document.getElementById('clearPerformance').addEventListener('click', () => {
            this.clearData();
        });
        
        // Export button
        document.getElementById('exportPerformance').addEventListener('click', () => {
            this.exportData();
        });
        
        // Close button
        document.getElementById('closeDashboard').addEventListener('click', () => {
            this.hide();
        });
    }

    show() {
        this.isVisible = true;
        document.getElementById('performanceDashboard').style.display = 'block';
        
        // Start updating data
        this.startUpdating();
        
        // Initial data load
        this.refreshData();
    }

    hide() {
        this.isVisible = false;
        document.getElementById('performanceDashboard').style.display = 'none';
        
        // Stop updating data
        this.stopUpdating();
    }

    startUpdating() {
        if (this.updateInterval) return;
        
        this.updateInterval = setInterval(() => {
            this.updateData();
        }, 2000); // Update every 2 seconds
    }

    stopUpdating() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    refreshData() {
        this.updateData();
        this.updateCharts();
    }

    updateData() {
        // Update memory data
        this.updateMemoryData();
        
        // Update CPU data
        this.updateCPUData();
        
        // Update operations data
        this.updateOperationsData();
        
        // Update memory leaks data
        this.updateMemoryLeaksData();
        
        // Update recommendations
        this.updateRecommendations();
    }

    updateMemoryData() {
        if (!window.performanceOptimizer) return;
        
        const memoryInfo = window.performanceOptimizer.getCurrentMemoryUsage();
        if (!memoryInfo) return;
        
        const usedMB = Math.round(memoryInfo.used / 1024 / 1024);
        const totalMB = Math.round(memoryInfo.total / 1024 / 1024);
        const limitMB = Math.round(memoryInfo.limit / 1024 / 1024);
        const percentage = Math.round((memoryInfo.used / memoryInfo.limit) * 100);
        
        document.getElementById('memoryUsed').textContent = usedMB + ' MB';
        document.getElementById('memoryTotal').textContent = totalMB + ' MB';
        document.getElementById('memoryLimit').textContent = limitMB + ' MB';
        document.getElementById('memoryPercentage').textContent = percentage + '%';
        
        // Update status
        const memoryStatus = document.getElementById('memoryStatus');
        if (percentage > 80) {
            memoryStatus.textContent = 'Critical';
            memoryStatus.className = 'memory-status critical';
        } else if (percentage > 60) {
            memoryStatus.textContent = 'Warning';
            memoryStatus.className = 'memory-status warning';
        } else {
            memoryStatus.textContent = 'Normal';
            memoryStatus.className = 'memory-status normal';
        }
        
        // Add to chart data
        this.chartData.memory.push({
            timestamp: Date.now(),
            used: usedMB,
            percentage: percentage
        });
        
        // Keep only last 30 data points
        if (this.chartData.memory.length > 30) {
            this.chartData.memory.shift();
        }
    }

    updateCPUData() {
        if (!window.cpuUsageMonitor) return;
        
        const cpuReport = window.cpuUsageMonitor.getUsageReport();
        if (!cpuReport) return;
        
        document.getElementById('cpuCurrent').textContent = Math.round(cpuReport.current) + '%';
        document.getElementById('cpuAverage').textContent = Math.round(cpuReport.average) + '%';
        document.getElementById('cpuPeak').textContent = Math.round(cpuReport.peak) + '%';
        document.getElementById('cpuLevel').textContent = cpuReport.level;
        
        // Update status
        const cpuStatus = document.getElementById('cpuStatus');
        if (cpuReport.level === 'critical' || cpuReport.level === 'emergency') {
            cpuStatus.textContent = 'Critical';
            cpuStatus.className = 'cpu-status critical';
        } else if (cpuReport.level === 'warning') {
            cpuStatus.textContent = 'Warning';
            cpuStatus.className = 'cpu-status warning';
        } else {
            cpuStatus.textContent = 'Normal';
            cpuStatus.className = 'cpu-status normal';
        }
        
        // Add to chart data
        this.chartData.cpu.push({
            timestamp: Date.now(),
            current: cpuReport.current,
            level: cpuReport.level
        });
        
        // Keep only last 30 data points
        if (this.chartData.cpu.length > 30) {
            this.chartData.cpu.shift();
        }
    }

    updateOperationsData() {
        if (!window.performanceOptimizer) return;
        
        const stats = window.performanceOptimizer.getPerformanceStats();
        if (!stats) return;
        
        document.getElementById('activeTimers').textContent = stats.activeTimers || 0;
        document.getElementById('activeListeners').textContent = stats.activeListeners || 0;
        document.getElementById('activeObservers').textContent = stats.activeObservers || 0;
        document.getElementById('activeAnimations').textContent = stats.activeAnimationFrames || 0;
        
        // Update status
        const operationsStatus = document.getElementById('operationsStatus');
        const totalOperations = (stats.activeTimers || 0) + (stats.activeListeners || 0) + 
                              (stats.activeObservers || 0) + (stats.activeAnimationFrames || 0);
        
        if (totalOperations > 100) {
            operationsStatus.textContent = 'High';
            operationsStatus.className = 'operations-status high';
        } else if (totalOperations > 50) {
            operationsStatus.textContent = 'Medium';
            operationsStatus.className = 'operations-status medium';
        } else {
            operationsStatus.textContent = 'Low';
            operationsStatus.className = 'operations-status low';
        }
    }

    updateMemoryLeaksData() {
        if (!window.memoryLeakDetector) return;
        
        const leakReport = window.memoryLeakDetector.getLeakReport();
        if (!leakReport) return;
        
        const leaksList = document.getElementById('leaksList');
        const leaksStatus = document.getElementById('leaksStatus');
        
        if (leakReport.detectedLeaks.length === 0) {
            leaksList.innerHTML = '<div class="no-leaks">No memory leaks detected</div>';
            leaksStatus.textContent = 'None';
            leaksStatus.className = 'leaks-status none';
        } else {
            leaksList.innerHTML = leakReport.detectedLeaks.map(leak => `
                <div class="leak-item">
                    <div class="leak-type">${leak.type}</div>
                    <div class="leak-details">${leak.details}</div>
                </div>
            `).join('');
            
            leaksStatus.textContent = leakReport.detectedLeaks.length;
            leaksStatus.className = 'leaks-status detected';
        }
    }

    updateRecommendations() {
        const recommendations = [];
        
        // Memory recommendations
        if (window.performanceOptimizer) {
            const memoryInfo = window.performanceOptimizer.getCurrentMemoryUsage();
            if (memoryInfo) {
                const percentage = (memoryInfo.used / memoryInfo.limit) * 100;
                if (percentage > 80) {
                    recommendations.push('Memory usage is high. Consider clearing caches or reducing data storage.');
                }
            }
        }
        
        // CPU recommendations
        if (window.cpuUsageMonitor) {
            const cpuReport = window.cpuUsageMonitor.getUsageReport();
            if (cpuReport && cpuReport.level === 'warning') {
                recommendations.push('CPU usage is elevated. Consider reducing animation frequency or background operations.');
            }
        }
        
        // Operations recommendations
        if (window.performanceOptimizer) {
            const stats = window.performanceOptimizer.getPerformanceStats();
            if (stats) {
                if (stats.activeTimers > 20) {
                    recommendations.push('High number of active timers. Consider consolidating timer operations.');
                }
                if (stats.activeListeners > 100) {
                    recommendations.push('High number of event listeners. Consider using event delegation.');
                }
            }
        }
        
        // Memory leak recommendations
        if (window.memoryLeakDetector) {
            const leakReport = window.memoryLeakDetector.getLeakReport();
            if (leakReport && leakReport.detectedLeaks.length > 0) {
                recommendations.push('Memory leaks detected. Automatic cleanup will be performed.');
            }
        }
        
        // Update recommendations display
        const recommendationsList = document.getElementById('recommendationsList');
        if (recommendations.length === 0) {
            recommendationsList.innerHTML = '<div class="recommendation">Performance is optimal</div>';
        } else {
            recommendationsList.innerHTML = recommendations.map(rec => `
                <div class="recommendation">${rec}</div>
            `).join('');
        }
    }

    updateCharts() {
        this.updateMemoryChart();
        this.updateCPUChart();
    }

    updateMemoryChart() {
        const canvas = document.getElementById('memoryChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.chartData.memory.length === 0) return;
        
        // Draw memory usage chart
        const data = this.chartData.memory;
        const maxUsage = Math.max(...data.map(d => d.used));
        const width = canvas.width;
        const height = canvas.height;
        
        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw memory usage line
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = (width / (data.length - 1)) * index;
            const y = height - (point.used / maxUsage) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    updateCPUChart() {
        const canvas = document.getElementById('cpuChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.chartData.cpu.length === 0) return;
        
        // Draw CPU usage chart
        const data = this.chartData.cpu;
        const width = canvas.width;
        const height = canvas.height;
        
        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw CPU usage line
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = (width / (data.length - 1)) * index;
            const y = height - (point.current / 100) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    clearData() {
        this.chartData = {
            memory: [],
            cpu: [],
            operations: []
        };
        
        // Clear charts
        const memoryCanvas = document.getElementById('memoryChart');
        const cpuCanvas = document.getElementById('cpuChart');
        
        memoryCanvas.getContext('2d').clearRect(0, 0, memoryCanvas.width, memoryCanvas.height);
        cpuCanvas.getContext('2d').clearRect(0, 0, cpuCanvas.width, cpuCanvas.height);
        
        console.log('📊 Performance data cleared');
    }

    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            memory: this.chartData.memory,
            cpu: this.chartData.cpu,
            operations: this.chartData.operations,
            currentStats: {
                memory: window.performanceOptimizer ? window.performanceOptimizer.getCurrentMemoryUsage() : null,
                cpu: window.cpuUsageMonitor ? window.cpuUsageMonitor.getUsageReport() : null,
                performance: window.performanceOptimizer ? window.performanceOptimizer.getPerformanceStats() : null,
                leaks: window.memoryLeakDetector ? window.memoryLeakDetector.getLeakReport() : null
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('📊 Performance data exported');
    }

    destroy() {
        this.stopUpdating();
        const dashboard = document.getElementById('performanceDashboard');
        if (dashboard) {
            dashboard.remove();
        }
        
        console.log('📊 Performance Dashboard destroyed');
    }
}

// Initialize performance dashboard
window.performanceDashboard = new PerformanceDashboard();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceDashboard;
}
