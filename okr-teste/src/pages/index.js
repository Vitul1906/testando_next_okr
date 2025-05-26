// src/pages/index.js
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { objectiveService } from '../services/api';
import ObjectiveForm from '../components/ObjectiveForm';
import { useRouter } from 'next/router'; 

export default function Home() {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);
  const router = useRouter(); 

  const fetchObjectives = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await objectiveService.getAll();
      setObjectives(data);
    } catch (err) {
      setError(`Falha ao carregar objetivos: ${err.message}. Verifique o console.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjectives();
  }, []);

  const handleCreateObjective = async (newObjectiveData) => {
    try {
      await objectiveService.create(newObjectiveData);
      setShowCreateForm(false);
      await fetchObjectives();
      alert('Objetivo criado com sucesso!');
    } catch (err) {
      alert(`Erro ao criar objetivo: ${err.message}`);
      console.error(err);
    }
  };

  const handleUpdateObjective = async (updatedObjectiveData) => {
    try {
      await objectiveService.update(editingObjective.id, updatedObjectiveData);
      setEditingObjective(null); 
      await fetchObjectives(); 
      alert('Objetivo atualizado com sucesso!');
    } catch (err) {
      alert(`Erro ao atualizar objetivo: ${err.message}`);
      console.error(err);
    }
  };

  const handleDeleteObjective = async (objectiveId, objectiveTitle) => {
    if (window.confirm(`Tem certeza que deseja deletar o Objetivo "${objectiveTitle}" e TODOS os seus Key Results e Iniciativas? Esta ação é irreversível.`)) {
      try {
        await objectiveService.delete(objectiveId);
        await fetchObjectives(); 
        alert(`Objetivo "${objectiveTitle}" deletado com sucesso!`);
      } catch (err) {
        alert(`Erro ao deletar Objetivo: ${err.message}`);
        console.error(err);
      }
    }
  };

  const handleObjectivePercentageChange = async (objectiveId, newPercentage) => {
    try {
      await objectiveService.updatePercentage(objectiveId, newPercentage);
      await fetchObjectives(); 
    } catch (err) {
      alert(`Erro ao atualizar porcentagem do objetivo: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Head><title>Carregando Objetivos...</title></Head>
        <main>
          <h1 className="title">Carregando Objetivos...</h1>
          <p className="noItemsMessage">Aguarde enquanto os objetivos são carregados.</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Head><title>Erro</title></Head>
        <main>
          <h1 className="title">Erro</h1>
          <p className="errorMessage">{error}</p>
          <button onClick={fetchObjectives} className="reloadButton">Tentar Novamente</button>
        </main>
      </div>
    );
  }

  return (
    <div className="container"> 
      <Head>
        <title>Meus Objetivos e Key Results</title>
      </Head>

      <main>
        <h1 className="title">Meus Objetivos e Key Results</h1> 

        <button onClick={() => {
          setShowCreateForm(true);
          setEditingObjective(null);
        }} className="createButton" style={{ marginBottom: '20px' }}> 
          + Novo Objetivo
        </button>

        {showCreateForm && (
          <div className="formOverlay"> 
            <ObjectiveForm
              onSubmit={handleCreateObjective}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {objectives.length === 0 ? (
          <p className="noItemsMessage">Nenhum objetivo encontrado. Crie um novo!</p> 
        ) : (
          <ul className="listContainer"> 
            {objectives.map((objective) => (
              <li key={objective.id} className="listItem"> 
                {editingObjective && editingObjective.id === objective.id ? (
                  <div className="formOverlay"> 
                    <ObjectiveForm
                      initialData={editingObjective}
                      onSubmit={handleUpdateObjective}
                      onCancel={() => setEditingObjective(null)}
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="objectiveTitle">{objective.titulo}</h2> 
                    <p className="objectiveDescription">{objective.descricao}</p>
                    <p className="objectivePercentage">Progresso: **{objective.porcentagemConclusao.toFixed(2)}%**</p> 
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={objective.porcentagemConclusao || 0}
                        onChange={(e) => handleObjectivePercentageChange(objective.id, parseFloat(e.target.value))}
                        className="formRange" 
                    />
                    <div className="itemActions"> 
                      <button onClick={() => router.push(`/objetivos/${objective.id}`)} className="editButton">
                        Ver Detalhes
                      </button>
                      <button onClick={() => setEditingObjective(objective)} className="editButton"> 
                        Editar
                      </button>
                      <button onClick={() => handleDeleteObjective(objective.id, objective.titulo)} className="deleteButton"> 
                        Deletar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <footer className="footer">
        Vitor, Magno e Riki | Projeto OKR de PS II
      </footer>
    </div>
  );
}