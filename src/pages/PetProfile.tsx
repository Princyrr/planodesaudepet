import React, { useState } from 'react';
import { usePets } from '../contexts/PetContext';
import { PlusCircle, Edit, Trash, X, AlertCircle } from 'lucide-react';

interface PetFormData {
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  age: string;
  weight: string;
  imageUrl: string;
}

function PetProfile() {
  const { pets, addPet, updatePet, deletePet, loading } = usePets();
  
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    weight: '',
    imageUrl: ''
  });
  
  const handleAddPet = () => {
    setEditingPetId(null);
    setFormData({
      name: '',
      species: 'dog',
      breed: '',
      age: '',
      weight: '',
      imageUrl: ''
    });
    setShowForm(true);
  };
  
  const handleEditPet = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;
    
    setEditingPetId(petId);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age.toString(),
      weight: pet.weight.toString(),
      imageUrl: pet.imageUrl || ''
    });
    setShowForm(true);
  };
  
  const handleDeletePet = (petId: string) => {
    setDeletingPetId(petId);
    setShowDeleteConfirm(true);
  };
  
  const confirmDeletePet = async () => {
    if (deletingPetId) {
      await deletePet(deletingPetId);
      setShowDeleteConfirm(false);
      setDeletingPetId(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const petData = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        imageUrl: formData.imageUrl || undefined
      };
      
      if (editingPetId) {
        await updatePet(editingPetId, petData);
      } else {
        await addPet(petData);
      }
      
      setShowForm(false);
      setEditingPetId(null);
    } catch (error) {
      console.error('Error saving pet:', error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-fade-in">
      <div className="container-custom mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Meus Pets</h1>
            <button
              type="button"
              className="btn-primary flex items-center"
              onClick={handleAddPet}
            >
              <PlusCircle size={18} className="mr-1" />
              Adicionar Pet
            </button>
          </div>
          
          {/* Pet List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {pets.length > 0 ? (
              <div className="space-y-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 mb-3 sm:mb-0">
                        {pet.imageUrl ? (
                          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-bold">
                            {pet.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{pet.name}</h3>
                        <p className="text-gray-600">{pet.species} • {pet.breed}</p>
                        <p className="text-sm text-gray-500">{pet.age} {pet.age === 1 ? 'ano' : 'anos'} • {pet.weight}kg</p>
                      </div>
                      
                      <div className="flex space-x-2 mt-3 sm:mt-0">
                        <button
                          type="button"
                          className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors duration-200"
                          onClick={() => handleEditPet(pet.id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                          onClick={() => handleDeletePet(pet.id)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-gray-400 mb-3">
                  <PlusCircle size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum pet cadastrado</h3>
                <p className="text-gray-500 mb-6">Adicione seu primeiro pet para começar</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAddPet}
                >
                  Adicionar Pet
                </button>
              </div>
            )}
          </div>
          
          {/* Pet Care Tips */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Dicas de Cuidados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h3 className="font-medium text-teal-800 mb-2">Vacinação</h3>
                <p className="text-sm text-teal-700">
                  Mantenha as vacinas do seu pet em dia. Consulte o calendário de vacinação recomendado para cães e gatos.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-2">Alimentação</h3>
                <p className="text-sm text-purple-700">
                  Ofereça uma alimentação balanceada e adequada para a idade, tamanho e nível de atividade do seu pet.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="font-medium text-orange-800 mb-2">Exercícios</h3>
                <p className="text-sm text-orange-700">
                  Mantenha seu pet ativo com passeios regulares e brincadeiras que estimulem física e mentalmente.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Visitas ao Veterinário</h3>
                <p className="text-sm text-blue-700">
                  Consultas de rotina são essenciais, mesmo quando seu pet parece saudável, para prevenção de doenças.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pet Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {editingPetId ? 'Editar Pet' : 'Adicionar Novo Pet'}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="label">Nome do Pet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input"
                  placeholder="Ex: Rex, Luna, Max..."
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="species" className="label">Espécie</label>
                <select
                  id="species"
                  name="species"
                  className="input"
                  required
                  value={formData.species}
                  onChange={handleChange}
                >
                  <option value="dog">Cachorro</option>
                  <option value="cat">Gato</option>
                  <option value="bird">Pássaro</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="breed" className="label">Raça</label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  className="input"
                  placeholder="Ex: Golden Retriever, Siamês..."
                  required
                  value={formData.breed}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="label">Idade (anos)</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="input"
                    placeholder="Ex: 3"
                    min="0"
                    step="1"
                    required
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="weight" className="label">Peso (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    className="input"
                    placeholder="Ex: 12.5"
                    min="0"
                    step="0.1"
                    required
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="label">URL da Imagem (opcional)</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className="input"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deixe em branco para usar a inicial do nome como avatar
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </span>
                  ) : (
                    'Salvar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold">Excluir pet?</h3>
              <p className="text-gray-600 mt-2">
                Tem certeza que deseja excluir este pet? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <button
                type="button"
                className="btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500 sm:w-1/2"
                onClick={confirmDeletePet}
                disabled={loading}
              >
                {loading ? 'Excluindo...' : 'Sim, excluir'}
              </button>
              <button
                type="button"
                className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 sm:w-1/2"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetProfile;