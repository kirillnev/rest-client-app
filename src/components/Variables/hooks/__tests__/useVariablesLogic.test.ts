import { renderHook, act } from '@testing-library/react';
import { useVariablesLogic } from '../useVariablesLogic';

interface MockLocalStorage {
  store: Record<string, string>;
  getItem: jest.Mock<string | null, [string]>;
  setItem: jest.Mock<void, [string, string]>;
  clear: jest.Mock<void, []>;
}

const mockLocalStorage: MockLocalStorage = {
  store: {},
  getItem: jest.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useVariablesLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  it('initializes with empty variables', () => {
    const { result } = renderHook(() => useVariablesLogic());
    expect(result.current.variables).toEqual({});
    expect(result.current.newName).toBe('');
    expect(result.current.newValue).toBe('');
  });

  it('loads variables from localStorage on mount', () => {
    mockLocalStorage.store['variables'] = JSON.stringify({
      key1: 'value1',
      key2: 'value2',
    });
    const { result } = renderHook(() => useVariablesLogic());
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('variables');
    expect(result.current.variables).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('saves a new variable and clears inputs', () => {
    const { result } = renderHook(() => useVariablesLogic());
    act(() => {
      result.current.setNewName('newKey');
    });
    act(() => {
      result.current.setNewValue('newValue');
    });
    act(() => {
      result.current.saveVariable();
    });
    expect(result.current.variables).toEqual({ newKey: 'newValue' });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'variables',
      JSON.stringify({ newKey: 'newValue' })
    );
    expect(result.current.newName).toBe('');
    expect(result.current.newValue).toBe('');
  });

  it('does not save variable if inputs are empty', () => {
    const { result } = renderHook(() => useVariablesLogic());
    act(() => {
      result.current.saveVariable();
    });
    expect(result.current.variables).toEqual({});
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('deletes a variable', () => {
    mockLocalStorage.store['variables'] = JSON.stringify({
      key1: 'value1',
      key2: 'value2',
    });
    const { result } = renderHook(() => useVariablesLogic());
    act(() => {
      result.current.deleteVariable('key1');
    });
    expect(result.current.variables).toEqual({ key2: 'value2' });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'variables',
      JSON.stringify({ key2: 'value2' })
    );
  });

  it('handles empty localStorage', () => {
    mockLocalStorage.store['variables'] = '{}';
    const { result } = renderHook(() => useVariablesLogic());
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('variables');
    expect(result.current.variables).toEqual({});
  });
});
