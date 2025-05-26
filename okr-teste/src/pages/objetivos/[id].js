// src/pages/objetivos/[id].js
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { objectiveService, keyResultService, initiativeService } from '../../services/api';
import ObjectiveForm from '../../components/ObjectiveForm'; 
import KeyResultForm from '../../components/KeyResultForm';
import InitiativeForm from '../../components/InitiativeForm'; // AGORA COM O NOME CERTO!

// Importa os módulos de estilo novamente
import styles from '../../styles/ObjectiveDetails.module.css';
import formStyles from '../../styles/Form.module.css';

export default function ObjectiveDetailsPage() {
  const router = useRouter();
  const { id } = router.query; 

  const [objective, setObjective] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showEditObjectiveForm, setShowEditObjectiveForm] = useState(false);
  const [showCreateKrForm, setShowCreateKrForm] = useState(false);
  const [editingKr, setEditingKr] = useState(null); 
  const [showCreateInitiativeForm, setShowCreateInitiativeForm] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState(null); 
  const [currentKrIdForInitiative, setCurrentKrIdForInitiative] = useState(null); 

  const fetchObjective = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await objectiveService.getById(id);
      setObjective(data);
    } catch (err) {
      setError(`Falha ao carregar objetivo: ${err.message}. Verifique o console.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) { 
      fetchObjective();
    }
  }, [id, router.isReady]); 

  const handleUpdateObjective = async (updatedObjectiveData) => {
    try {
      await objectiveService.update(objective.id, updatedObjectiveData);
      setShowEditObjectiveForm(false);
      await fetchObjective(); 
      alert('Objetivo atualizado com sucesso!');
    } catch (err) {
      alert(`Erro ao atualizar objetivo: ${err.message}`);
      console.error(err);
    }
  };

  const handleDeleteObjective = async (objectiveId, objectiveTitle) => {
    if (window.confirm(`ATENÇÃO: Tem certeza que deseja deletar o Objetivo "${objectiveTitle}" e TODOS os seus Key Results e Iniciativas? Esta ação é irreversível.`)) {
      try {
        await objectiveService.delete(objectiveId);
        alert(`Objetivo "${objectiveTitle}" deletado com sucesso!`);
        router.push('/');
      } catch (err) {
        alert(`Erro ao deletar Objetivo: ${err.message}`);
        console.error(err);
      }
    }
  };

  const handleCreateKeyResult = async (newKrData) => {
    try {
      await keyResultService.create(objective.id, newKrData);
      setShowCreateKrForm(false);
      await fetchObjective(); 
      alert('Key Result criado com sucesso!');
    } catch (err) {
      alert(`Erro ao criar Key Result: ${err.message}`);
      console.error(err);
    }
  };

  const handleUpdateKeyResult = async (updatedKrData) => {
    try {
      await keyResultService.update(editingKr.id, updatedKrData);
      setEditingKr(null); 
      await fetchObjective(); 
      alert('Key Result atualizado com sucesso!');
    } catch (err) {
      alert(`Erro ao atualizar Key Result: ${err.message}`);
      console.error(err);
    }
  };

  const handleDeleteKeyResult = async (krId, krDescription) => {
    if (window.confirm(`Tem certeza que deseja deletar o Key Result "${krDescription}" e todas as suas iniciativas?`)) {
      try {
        await keyResultService.delete(krId);
        await fetchObjective(); 
        alert(`Key Result "${krDescription}" deletado com sucesso!`);
      } catch (err) {
        alert(`Erro ao deletar Key Result: ${err.message}`);
        console.error(err);
      }
    }
  };

  const handleCreateInitiative = async (newInitiativeData) => {
    try {
      await initiativeService.create(currentKrIdForInitiative, newInitiativeData);
      setShowCreateInitiativeForm(false);
      setCurrentKrIdForInitiative(null); 
      await fetchObjective();
      alert('Iniciativa criada com sucesso!');
    } catch (err) {
      alert(`Erro ao criar iniciativa: ${err.message}`);
      console.error(err);
    }
  };

  const handleUpdateInitiative = async (updatedInitiativeData) => {
    try {
      await initiativeService.update(editingInitiative.id, updatedInitiativeData);
      setEditingInitiative(null); 
      await fetchObjective();
      alert('Iniciativa atualizada com sucesso!');
    } catch (err) {
      alert(`Erro ao atualizar iniciativa: ${err.message}`);
      console.error(err);
    }
  };

  const handleInitiativePercentageChange = async (initiativeId, newPercentage) => {
    try {
      await initiativeService.updatePercentage(initiativeId, newPercentage);
      await fetchObjective();
    } catch (err) {
      alert(`Erro ao atualizar porcentagem da iniciativa: ${err.message}`);
      console.error(err);
    }
  };

  const handleDeleteInitiative = async (initiativeId, initiativeTitle) => {
    if (window.confirm(`Tem certeza que deseja deletar a iniciativa "${initiativeTitle}"?`)) {
      try {
        await initiativeService.delete(initiativeId);
        await fetchObjective();
        alert(`Iniciativa "${initiativeTitle}" deletada com sucesso!`);
      } catch (err) {
        alert(`Erro ao deletar iniciativa: ${err.message}`);
        console.error(err);
      }
    }
  };

  const handleItemPercentageChange = async (type, itemId, newPercentage) => {
    try {
        if (type === 'objective') {
            await objectiveService.updatePercentage(itemId, newPercentage);
        } else if (type === 'keyResult') {
            await keyResultService.updatePercentage(itemId, newPercentage);
        }
        await fetchObjective();
    } catch (err) {
        alert(`Erro ao atualizar porcentagem de ${type}: ${err.message}`);
        console.error(err);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Head><title>Carregando Objetivo...</title></Head>
        <main>
          <h1>Carregando Objetivo...</h1>
          <p>Aguarde enquanto os detalhes do objetivo são carregados.</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Head><title>Erro</title></Head>
        <main>
          <h1>Erro</h1>
          <p className={styles.errorMessage}>{error}</p>
          <button onClick={fetchObjective} className={styles.reloadButton}>Tentar Novamente</button>
          <button onClick={() => router.push('/')} className={styles.backButton}>Voltar para Objetivos</button>
        </main>
      </div>
    );
  }

  if (!objective) {
    return (
      <div className={styles.container}>
        <Head><title>Objetivo Não Encontrado</title></Head>
        <main>
          <h1>Objetivo Não Encontrado</h1>
          <p>O objetivo com o ID {id} não foi encontrado.</p>
          <button onClick={() => router.push('/')} className={styles.backButton}>Voltar para Objetivos</button>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}> {/* Aplicando styles.container aqui */}
      <Head>
        <title>{objective.titulo} - Detalhes do Objetivo</title>
      </Head>

      <main>
        <div className={styles.header}> {/* Aplicando styles.header aqui */}
          <h1 className={styles.objectiveTitle}>{objective.titulo}</h1> {/* Aplicando styles.objectiveTitle aqui */}
          <p className={styles.objectiveDescription}>{objective.descricao}</p> {/* Aplicando styles.objectiveDescription aqui */}
          <p className={styles.objectivePercentage}>Progresso Geral: **{objective.porcentagemConclusao.toFixed(2)}%**</p> {/* Aplicando styles.objectivePercentage aqui */}
          <input
              type="range"
              min="0"
              max="100"
              value={objective.porcentagemConclusao || 0}
              onChange={(e) => handleItemPercentageChange('objective', objective.id, parseFloat(e.target.value))}
              className={styles.percentageSlider} 
          />
          <div className={styles.actions}> 
            <button
              onClick={() => setShowEditObjectiveForm(true)}
              className={styles.editButton} 
            >
              Editar Objetivo
            </button>
            <button onClick={() => handleDeleteObjective(objective.id, objective.titulo)} className={styles.deleteButton}>Deletar Objetivo</button>
            <button onClick={() => router.push('/')} className={styles.backButton}>Voltar para Objetivos</button> 
          </div>
        </div>

        {showEditObjectiveForm && (
          <div className={formStyles.formOverlay}> 
            <ObjectiveForm
              initialData={objective}
              onSubmit={handleUpdateObjective}
              onCancel={() => setShowEditObjectiveForm(false)}
            />
          </div>
        )}

        <hr className={styles.separator} />

        <h2 className={styles.sectionTitle}>Key Results ({objective.keyResults ? objective.keyResults.length : 0})</h2>
        <button
          onClick={() => {
            setShowCreateKrForm(true);
            setEditingKr(null); 
          }}
          className={styles.createButton}
          style={{ marginBottom: '20px' }}
        >
          + Novo Key Result
        </button>

        {showCreateKrForm && (
          <div className={formStyles.formOverlay}> 
            <KeyResultForm
              onSubmit={handleCreateKeyResult}
              onCancel={() => setShowCreateKrForm(false)}
            />
          </div>
        )}

        <div className={styles.keyResultsGrid}> 
          {objective.keyResults && objective.keyResults.length > 0 ? (
            objective.keyResults.map((kr) => (
              <div key={kr.id} className={styles.krCard}> 
                {editingKr && editingKr.id === kr.id ? ( 
                  <div className={formStyles.formOverlay}> 
                    <KeyResultForm
                      initialData={editingKr}
                      onSubmit={handleUpdateKeyResult}
                      onCancel={() => setEditingKr(null)}
                    />
                  </div>
                ) : ( 
                  <>
                    <h3 className={styles.krDescription}>{kr.descricao}</h3>
                    {kr.meta && <p className={styles.krMeta}>Meta: {kr.meta}</p>} 
                    <p className={styles.krPercentage}>Progresso: **{kr.porcentagemConclusao.toFixed(2)}%**</p> 
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={kr.porcentagemConclusao || 0}
                        onChange={(e) => handleItemPercentageChange('keyResult', kr.id, parseFloat(e.target.value))}
                        className={styles.percentageSlider} 
                    />
                    <div className={styles.krActions}> 
                      <button
                        onClick={() => setEditingKr(kr)}
                        className={styles.editButton} 
                      >
                        Editar KR
                      </button>
                      <button onClick={() => handleDeleteKeyResult(kr.id, kr.descricao)} className={styles.deleteButton}>Deletar KR</button> 
                    </div>
                  </>
                )}

                <h4 className={styles.initiativesTitle}>Iniciativas ({kr.iniciativas ? kr.iniciativas.length : 0})</h4> 
                <button
                  onClick={() => {
                    setShowCreateInitiativeForm(true);
                    setCurrentKrIdForInitiative(kr.id); 
                    setEditingInitiative(null); 
                  }}
                  className={styles.createButton} 
                  style={{ marginBottom: '10px' }}
                >
                  + Nova Iniciativa
                </button>

                {showCreateInitiativeForm && currentKrIdForInitiative === kr.id && (
                  <div className={formStyles.formOverlay}> 
                    <InitiativeForm
                      onSubmit={handleCreateInitiative}
                      onCancel={() => {
                        setShowCreateInitiativeForm(false);
                        setCurrentKrIdForInitiative(null);
                      }}
                    />
                  </div>
                )}
                
                <ul className={styles.initiativeList}> 
                  {kr.iniciativas && kr.iniciativas.length > 0 ? (
                    kr.iniciativas.map((initiative) => (
                      <li key={initiative.id} className={styles.initiativeItem}> 
                        {editingInitiative && editingInitiative.id === initiative.id ? ( 
                          <div className={formStyles.formOverlay}> 
                            <InitiativeForm
                              initialData={initiative}
                              onSubmit={handleUpdateInitiative}
                              onCancel={() => setEditingInitiative(null)}
                            />
                          </div>
                        ) : ( 
                          <div className={styles.initiativeContent}>
                            <h5 className={styles.initiativeTitle}>{initiative.titulo}</h5> 
                            <p className={styles.initiativeDescription}>{initiative.descricao}</p> 
                            <p className={styles.initiativePercentage}>Progresso: **{initiative.porcentagemConclusao.toFixed(2)}%**</p> 
                            <div className={styles.initiativeActions}> 
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={initiative.porcentagemConclusao || 0}
                                    onChange={(e) => handleInitiativePercentageChange(initiative.id, parseFloat(e.target.value))}
                                    className={styles.percentageSlider} 
                                />
                                <span className={styles.sliderValue}>{initiative.porcentagemConclusao.toFixed(0)}%</span> 
                                <button
                                    onClick={() => setEditingInitiative(initiative)}
                                    className={styles.editButton} 
                                >
                                    Editar Iniciativa
                                </button>
                                <button onClick={() => handleDeleteInitiative(initiative.id, initiative.titulo)} className={styles.deleteButton}>Deletar Iniciativa</button> 
                            </div>
                          </div>
                        )}
                      </li>
                    ))
                  ) : (
                    <p className={styles.noItemsMessage}>Nenhuma iniciativa para este Key Result.</p> 
                  )}
                </ul>
              </div>
            ))
          ) : (
            <p className={styles.noItemsMessage}>Nenhum Key Result para este Objetivo.</p>
          )}
        </div>
      </main>
      <footer className="footer">
        Vitor, Magno e Riki | Projeto OKR de PS II
      </footer>
    </div>
  );
}