/**
 * TaskFlow Enterprise — Client Telemetry & Web Vitals Monitor
 * 
 * Provides real-time network health diagnostics, client latency measurement,
 * and browser performance telemetry.
 */

class TelemetryService {
  constructor() {
    this.subscribers = new Set();
    this.metrics = {
      fps: 60,
      latencyMs: 0,
      online: typeof navigator !== 'undefined' ? navigator.onLine : true,
      lastPingTimestamp: null,
      memoryUsageMb: null
    };

    if (typeof window !== 'undefined') {
      this.initListeners();
    }
  }

  initListeners() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));

    // Sample performance timing when document is fully loaded
    if (document.readyState === 'complete') {
      this.recordNavigationTiming();
    } else {
      window.addEventListener('load', () => this.recordNavigationTiming());
    }
  }

  updateOnlineStatus(isOnline) {
    this.metrics.online = isOnline;
    this.notifySubscribers();
  }

  recordNavigationTiming() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      if (loadTime > 0) {
        this.metrics.pageLoadTimeMs = loadTime;
        this.notifySubscribers();
      }
    }
  }

  /**
   * Ping backend health endpoint to measure client-to-server latency
   */
  async pingServer(healthUrl = '/api/health') {
    const start = performance.now();
    try {
      const response = await fetch(healthUrl, { method: 'HEAD', cache: 'no-store' });
      const elapsed = Math.round(performance.now() - start);
      this.metrics.latencyMs = elapsed;
      this.metrics.lastPingTimestamp = new Date().toISOString();
      this.notifySubscribers();
      return { ok: response.ok, latencyMs: elapsed };
    } catch {
      this.metrics.latencyMs = -1;
      this.notifySubscribers();
      return { ok: false, latencyMs: -1 };
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.metrics);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => {
      try {
        cb({ ...this.metrics });
      } catch (err) {
        console.error('Telemetry subscriber error:', err);
      }
    });
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

export const telemetry = new TelemetryService();
