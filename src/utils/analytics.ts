// Analytics utility for tracking user interactions
interface AnalyticsEvent {
  event_name: string;
  properties: Record<string, any>;
  timestamp: string;
  user_id?: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];

  track(eventName: string, properties: Record<string, any> = {}, userId?: string) {
    const event: AnalyticsEvent = {
      event_name: eventName,
      properties,
      timestamp: new Date().toISOString(),
      user_id: userId
    };

    this.events.push(event);
    
    // Log to console for development
    console.log('Analytics Event:', event);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('analytics_events');
    const allEvents = stored ? JSON.parse(stored) : [];
    allEvents.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(allEvents.slice(-100))); // Keep last 100 events
    
    // In production, you would send this to your analytics service
    // this.sendToAnalyticsService(event);
  }

  // Pharmacy-specific events
  modalOpen(modalType: string, prescriptionId?: string) {
    this.track('modal_open', {
      modal_type: modalType,
      prescription_id: prescriptionId
    });
  }

  fulfillRequest(prescriptionId: string) {
    this.track('fulfill_request', {
      prescription_id: prescriptionId
    });
  }

  fulfillSuccess(prescriptionId: string) {
    this.track('fulfill_success', {
      prescription_id: prescriptionId
    });
  }

  fulfillFailure(prescriptionId: string, error: string) {
    this.track('fulfill_failure', {
      prescription_id: prescriptionId,
      error_message: error
    });
  }

  dispenseUploadStart(prescriptionId: string) {
    this.track('dispense_upload_start', {
      prescription_id: prescriptionId
    });
  }

  dispenseUploadSuccess(prescriptionId: string, dispenseId: string) {
    this.track('dispense_upload_success', {
      prescription_id: prescriptionId,
      dispense_id: dispenseId
    });
  }

  dispenseUploadFailure(prescriptionId: string, error: string) {
    this.track('dispense_upload_failure', {
      prescription_id: prescriptionId,
      error_message: error
    });
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  clearEvents() {
    this.events = [];
    localStorage.removeItem('analytics_events');
  }
}

export const analytics = new Analytics();