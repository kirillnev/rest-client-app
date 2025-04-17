'use client';

import { useTranslation } from 'react-i18next';
import { useVariablesLogic } from './hooks/useVariablesLogic';
import './Variables.css';

export default function Variables() {
  const { t } = useTranslation();
  const {
    variables,
    newName,
    setNewName,
    newValue,
    setNewValue,
    saveVariable,
    deleteVariable,
  } = useVariablesLogic();

  return (
    <div className="container">
      <h1 className="title">{t('variables.title')}</h1>
      <div className="form">
        <input
          type="text"
          placeholder={t('variables.namePlaceholder')}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder={t('variables.valuePlaceholder')}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="input"
        />
        <button
          onClick={saveVariable}
          disabled={!newName || !newValue}
          className="add-btn"
        >
          {t('variables.addButton')}
        </button>
      </div>
      <table className="table">
        <thead>
          <tr className="table-header">
            <th>{t('variables.name')}</th>
            <th>{t('variables.value')}</th>
            <th>{t('variables.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(variables).map(([name, value]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{value}</td>
              <td>
                <button
                  onClick={() => deleteVariable(name)}
                  className="delete-btn"
                >
                  {t('variables.deleteButton')}
                </button>
              </td>
            </tr>
          ))}
          {Object.keys(variables).length === 0 && (
            <tr>
              <td colSpan={3} className="empty">
                {t('variables.noVariables')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
