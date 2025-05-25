import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  age: number;
  weight: number;
  imageUrl?: string;
}

interface PetContextType {
  pets: Pet[];
  loading: boolean;
  addPet: (pet: Omit<Pet, 'id'>) => Promise<void>;
  updatePet: (id: string, pet: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPet: (id: string) => Pet | undefined;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}

export function PetProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Load pets from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      const storedPets = localStorage.getItem(`pets_${currentUser.id}`);
      if (storedPets) {
        setPets(JSON.parse(storedPets));
      } else {
        // Set some demo pets for new users
        const demoPets: Pet[] = [
          {
            id: '1',
            name: 'Max',
            species: 'dog',
            breed: 'Golden Retriever',
            age: 3,
            weight: 30,
            imageUrl: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'
          },
          {
            id: '2',
            name: 'Luna',
            species: 'cat',
            breed: 'Siamese',
            age: 2,
            weight: 4,
            imageUrl: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg'
          }
        ];
        setPets(demoPets);
        localStorage.setItem(`pets_${currentUser.id}`, JSON.stringify(demoPets));
      }
    } else {
      setPets([]);
    }
    setLoading(false);
  }, [currentUser]);

  // Save pets to localStorage whenever they change
  useEffect(() => {
    if (currentUser && pets.length > 0) {
      localStorage.setItem(`pets_${currentUser.id}`, JSON.stringify(pets));
    }
  }, [pets, currentUser]);

  async function addPet(pet: Omit<Pet, 'id'>) {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPet: Pet = {
        ...pet,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      setPets(prevPets => [...prevPets, newPet]);
    } finally {
      setLoading(false);
    }
  }

  async function updatePet(id: string, petUpdates: Partial<Pet>) {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPets(prevPets => 
        prevPets.map(pet => 
          pet.id === id ? { ...pet, ...petUpdates } : pet
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function deletePet(id: string) {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPets(prevPets => prevPets.filter(pet => pet.id !== id));
    } finally {
      setLoading(false);
    }
  }

  function getPet(id: string) {
    return pets.find(pet => pet.id === id);
  }

  const value = {
    pets,
    loading,
    addPet,
    updatePet,
    deletePet,
    getPet
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
}