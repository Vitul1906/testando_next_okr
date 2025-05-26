// src/components/InitiativeForm.js
import React, { useState, useEffect } from 'react';
import formStyles from '../styles/Form.module.css'; 

export default function InitiativeForm({ initialData, onSubmit, onCancel }) {
  const safeInitialData = initialData || {}; 

  const [formData, setFormData] = useState({
    titulo: safeInitialData.titulo || '',
    descricao: safeInitialData.descricao || '',
    porcentagemConclusao: safeInitialData.porcentagemConclusao || 0.0
  });

  useEffect(() => {
    setFormData({
      titulo: safeInitialData.titulo || '',
      descricao: safeInitialData.descricao || '',
      porcentagemConclusao: safeInitialData.porcentagemConclusao || 0.0
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'porcentagemConclusao' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={formStyles.formContainer}>
      <h2 className={formStyles.formTitle}>
        {safeInitialData.id ? 'Editar Iniciativa' : 'Criar Nova Iniciativa'}
      </h2>
      
      <div className={formStyles.formGroup}>
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className={formStyles.inputField} 
        />
      </div>

      <div className={formStyles.formGroup}>
        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          required
          className={formStyles.textareaField} 
        />
      </div>

      <div className={formStyles.formGroup}>
        <label htmlFor="porcentagemConclusao">Progresso:</label>
        <input
          type="range"
          id="porcentagemConclusao"
          name="porcentagemConclusao"
          min="0"
          max="100"
          step="0.01"
          value={formData.porcentagemConclusao}
          onChange={handleChange}
          className={formStyles.inputField} 
        />
        <span>{formData.porcentagemConclusao.toFixed(2)}%</span>
      </div>
      
      <div className={formStyles.formActions}>
        <button type="submit" className={formStyles.submitButton}>
          {safeInitialData.id ? 'Salvar Alterações' : 'Criar Iniciativa'}
        </button>
        <button type="button" onClick={onCancel} className={formStyles.cancelButton}>
          Cancelar
        </button>
      </div>
    </form>
  );
}