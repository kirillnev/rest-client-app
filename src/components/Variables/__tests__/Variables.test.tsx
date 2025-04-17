import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import Variables from '../Variables';
import { useVariablesLogic } from '../hooks/useVariablesLogic';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../hooks/useVariablesLogic', () => ({
  useVariablesLogic: jest.fn(),
}));

describe('Variables Component', () => {
  const mockT = jest.fn((key) => key);
  const mockVariables = {
    var1: 'value1',
    var2: 'value2',
  };

  const mockUseVariablesLogic = {
    variables: {},
    newName: '',
    setNewName: jest.fn(),
    newValue: '',
    setNewValue: jest.fn(),
    saveVariable: jest.fn(),
    deleteVariable: jest.fn(),
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });

    (useVariablesLogic as jest.Mock).mockReturnValue(mockUseVariablesLogic);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with empty variables', () => {
    render(<Variables />);

    expect(screen.getByText('variables.title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('variables.namePlaceholder')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('variables.valuePlaceholder')
    ).toBeInTheDocument();
    expect(screen.getByText('variables.addButton')).toBeInTheDocument();
    expect(screen.getByText('variables.noVariables')).toBeInTheDocument();
  });

  it('renders variables list when variables exist', () => {
    (useVariablesLogic as jest.Mock).mockReturnValueOnce({
      ...mockUseVariablesLogic,
      variables: mockVariables,
    });

    render(<Variables />);

    expect(screen.getByText('var1')).toBeInTheDocument();
    expect(screen.getByText('value1')).toBeInTheDocument();
    expect(screen.getByText('var2')).toBeInTheDocument();
    expect(screen.getByText('value2')).toBeInTheDocument();
    expect(screen.getAllByText('variables.deleteButton')).toHaveLength(2);
    expect(screen.queryByText('variables.noVariables')).not.toBeInTheDocument();
  });

  it('calls saveVariable when add button is clicked', () => {
    (useVariablesLogic as jest.Mock).mockReturnValueOnce({
      ...mockUseVariablesLogic,
      newName: 'newVar',
      newValue: 'newValue',
    });

    render(<Variables />);
    const addButton = screen.getByText('variables.addButton');
    fireEvent.click(addButton);

    expect(mockUseVariablesLogic.saveVariable).toHaveBeenCalled();
  });

  it('add button is disabled when inputs are empty', () => {
    render(<Variables />);
    const addButton = screen.getByText('variables.addButton');

    expect(addButton).toBeDisabled();
  });

  it('calls deleteVariable when delete button is clicked', () => {
    (useVariablesLogic as jest.Mock).mockReturnValueOnce({
      ...mockUseVariablesLogic,
      variables: { testVar: 'testValue' },
    });

    render(<Variables />);
    const deleteButton = screen.getByText('variables.deleteButton');
    fireEvent.click(deleteButton);

    expect(mockUseVariablesLogic.deleteVariable).toHaveBeenCalledWith(
      'testVar'
    );
  });

  it('updates input values when typing', () => {
    render(<Variables />);
    const nameInput = screen.getByPlaceholderText('variables.namePlaceholder');
    const valueInput = screen.getByPlaceholderText(
      'variables.valuePlaceholder'
    );

    fireEvent.change(nameInput, { target: { value: 'test' } });
    fireEvent.change(valueInput, { target: { value: '123' } });

    expect(mockUseVariablesLogic.setNewName).toHaveBeenCalledWith('test');
    expect(mockUseVariablesLogic.setNewValue).toHaveBeenCalledWith('123');
  });

  it('renders table headers correctly', () => {
    render(<Variables />);

    expect(screen.getByText('variables.name')).toBeInTheDocument();
    expect(screen.getByText('variables.value')).toBeInTheDocument();
    expect(screen.getByText('variables.actions')).toBeInTheDocument();
  });
});
