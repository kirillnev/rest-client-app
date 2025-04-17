import { useEffect, useState } from 'react';

export const useVariablesLogic = () => {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [newName, setNewName] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');

  useEffect(() => {
    const savedVariables = JSON.parse(
      localStorage.getItem('variables') || '{}'
    );
    setVariables(savedVariables);
  }, []);

  const saveVariable = () => {
    if (newName && newValue) {
      const updatedVariables = { ...variables, [newName]: newValue };
      setVariables(updatedVariables);
      localStorage.setItem('variables', JSON.stringify(updatedVariables));
      setNewName('');
      setNewValue('');
    }
  };

  const deleteVariable = (name: string) => {
    const updatedVariables = Object.fromEntries(
      Object.entries(variables).filter(([key]) => key !== name)
    );
    setVariables(updatedVariables);
    localStorage.setItem('variables', JSON.stringify(updatedVariables));
  };

  return {
    variables,
    newName,
    setNewName,
    newValue,
    setNewValue,
    saveVariable,
    deleteVariable,
  };
};
