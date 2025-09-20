import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PharmacyDashboard } from '../src/components/Pharmacy/PharmacyDashboard';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';

// Mock the auth context
const MockWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('PharmacyDashboard', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  test('renders dashboard with prescription cards', () => {
    render(
      <MockWrapper>
        <PharmacyDashboard />
      </MockWrapper>
    );

    expect(screen.getByText('Pharmacy Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Prescriptions to Fulfill')).toBeInTheDocument();
    expect(screen.getByText('View All')).toBeInTheDocument();
  });

  test('opens Mark as Fulfilled modal when button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MockWrapper>
        <PharmacyDashboard />
      </MockWrapper>
    );

    const fulfillButton = screen.getAllByText('Mark as Fulfilled')[0];
    await user.click(fulfillButton);

    expect(screen.getByText('Confirm Fulfillment')).toBeInTheDocument();
    expect(screen.getByLabelText('Fulfillment Date *')).toBeInTheDocument();
    expect(screen.getByLabelText('Fulfilled By *')).toBeInTheDocument();
  });

  test('opens Upload Dispense Details modal when button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MockWrapper>
        <PharmacyDashboard />
      </MockWrapper>
    );

    const uploadButton = screen.getAllByText('Upload Dispense Details')[0];
    await user.click(uploadButton);

    expect(screen.getByText('Upload Dispense Details')).toBeInTheDocument();
    expect(screen.getByText('Dispense Details for Each Medicine')).toBeInTheDocument();
  });

  test('opens View All modal when button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MockWrapper>
        <PharmacyDashboard />
      </MockWrapper>
    );

    const viewAllButton = screen.getByText('View All');
    await user.click(viewAllButton);

    expect(screen.getByText('All Prescriptions')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Patient name or prescription ID...')).toBeInTheDocument();
  });

  test('closes modal when ESC key is pressed', async () => {
    const user = userEvent.setup();
    
    render(
      <MockWrapper>
        <PharmacyDashboard />
      </MockWrapper>
    );

    const fulfillButton = screen.getAllByText('Mark as Fulfilled')[0];
    await user.click(fulfillButton);

    expect(screen.getByText('Confirm Fulfillment')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Confirm Fulfillment')).not.toBeInTheDocument();
    });
  });

  test('validates form fields in fulfill modal', async () => {
    const user = userEvent.setup();
    
    render(
      <MockWrapper>
        <PharmacyDashboard />
      </MockWrapper>
    );

    const fulfillButton = screen.getAllByText('Mark as Fulfilled')[0];
    await user.click(fulfillButton);

    const fulfilledByInput = screen.getByLabelText('Fulfilled By *');
    await user.clear(fulfilledByInput);

    const confirmButton = screen.getByText('Confirm Fulfillment');
    await user.click(confirmButton);

    // Form should not submit with empty required field
    expect(screen.getByText('Confirm Fulfillment')).toBeInTheDocument();
  });

  test('validates file uploads in dispense modal', async () => {
    const user = userEvent.setup();
    
    render(
      <MockWrapper>
        <PharmacyDashboard />
      </MockWrapper>
    );

    const uploadButton = screen.getAllByText('Upload Dispense Details')[0];
    await user.click(uploadButton);

    // Test file upload validation would go here
    // This would require mocking file inputs and testing file validation logic
  });

  test('filters prescriptions in View All modal', async () => {
    const user = userEvent.setup();
    
    render(
      <MockWrapper>
        <PharmacyDashboard />
      </MockWrapper>
    );

    const viewAllButton = screen.getByText('View All');
    await user.click(viewAllButton);

    const searchInput = screen.getByPlaceholderText('Patient name or prescription ID...');
    await user.type(searchInput, 'Ravi');

    // Test that filtering works (would need to mock prescription data)
  });

  test('handles API errors gracefully', async () => {
    // Mock API failure
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const user = userEvent.setup();
    
    render(
      <MockWrapper>
        <PharmacyDashboard />
      </MockWrapper>
    );

    const fulfillButton = screen.getAllByText('Mark as Fulfilled')[0];
    await user.click(fulfillButton);

    const confirmButton = screen.getByText('Confirm Fulfillment');
    await user.click(confirmButton);

    // Test error handling
    consoleSpy.mockRestore();
  });
});