import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { usePets } from './PetContext';
import { format, addHours } from 'date-fns';

export type AppointmentType = 'checkup' | 'vaccination' | 'exam' | 'emergency' | 'surgery';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl?: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  type: 'clinic' | 'hospital' | 'lab';
}

export interface Appointment {
  id: string;
  petId: string;
  doctorId: string;
  locationId: string;
  type: AppointmentType;
  date: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  doctors: Doctor[];
  locations: Location[];
  loading: boolean;
  scheduleAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  completeAppointment: (id: string) => Promise<void>;
  getAppointment: (id: string) => Appointment | undefined;
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
  getDoctor: (id: string) => Doctor | undefined;
  getLocation: (id: string) => Location | undefined;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const { pets } = usePets();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for doctors and locations
  const doctors: Doctor[] = [
    {
      id: 'd1',
      name: 'Dra. Maria Silva',
      specialty: 'Clínica Geral',
      imageUrl: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg'
    },
    {
      id: 'd2',
      name: 'Dr. João Santos',
      specialty: 'Ortopedia',
      imageUrl: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg'
    },
    {
      id: 'd3',
      name: 'Dra. Ana Costa',
      specialty: 'Dermatologia',
      imageUrl: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg'
    },
    {
      id: 'd4',
      name: 'Dr. Roberto Ferreira',
      specialty: 'Cardiologia',
      imageUrl: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg'
    }
  ];

  const locations: Location[] = [
    {
      id: 'l1',
      name: 'Clínica PetVida',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      type: 'clinic'
    },
    {
      id: 'l2',
      name: 'Hospital Veterinário 24h',
      address: 'Rua Augusta, 500',
      city: 'São Paulo',
      type: 'hospital'
    },
    {
      id: 'l3',
      name: 'Laboratório PetExame',
      address: 'Av. Rebouças, 200',
      city: 'São Paulo',
      type: 'lab'
    },
    {
      id: 'l4',
      name: 'Clínica PetBem',
      address: 'Rua Oscar Freire, 800',
      city: 'São Paulo',
      type: 'clinic'
    }
  ];

  // Load appointments from localStorage when user or pets change
  useEffect(() => {
    if (currentUser && pets.length > 0) {
      const storedAppointments = localStorage.getItem(`appointments_${currentUser.id}`);
      if (storedAppointments) {
        const parsedAppointments = JSON.parse(storedAppointments);
        // Convert string dates back to Date objects
        parsedAppointments.forEach((appt: any) => {
          appt.date = new Date(appt.date);
        });
        setAppointments(parsedAppointments);
      } else {
        // Set some demo appointments for new users
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const demoAppointments: Appointment[] = [
          {
            id: '1',
            petId: pets[0]?.id || '1',
            doctorId: 'd1',
            locationId: 'l1',
            type: 'checkup',
            date: tomorrow,
            duration: 30,
            status: 'scheduled'
          },
          {
            id: '2',
            petId: pets[0]?.id || '1',
            doctorId: 'd3',
            locationId: 'l4',
            type: 'exam',
            date: nextWeek,
            duration: 45,
            status: 'scheduled'
          },
          {
            id: '3',
            petId: pets[1]?.id || '2',
            doctorId: 'd2',
            locationId: 'l2',
            type: 'vaccination',
            date: lastWeek,
            duration: 15,
            status: 'completed',
            notes: 'Vacina antirrábica aplicada. Próxima dose em 1 ano.'
          }
        ];
        setAppointments(demoAppointments);
        localStorage.setItem(`appointments_${currentUser.id}`, JSON.stringify(demoAppointments));
      }
    } else {
      setAppointments([]);
    }
    setLoading(false);
  }, [currentUser, pets]);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (currentUser && appointments.length > 0) {
      localStorage.setItem(`appointments_${currentUser.id}`, JSON.stringify(appointments));
    }
  }, [appointments, currentUser]);

  async function scheduleAppointment(appointment: Omit<Appointment, 'id' | 'status'>) {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAppointment: Appointment = {
        ...appointment,
        id: Math.random().toString(36).substring(2, 9),
        status: 'scheduled'
      };
      
      setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(id: string) {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function completeAppointment(id: string) {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === id ? { ...appointment, status: 'completed' } : appointment
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function getAppointment(id: string) {
    return appointments.find(appointment => appointment.id === id);
  }

  function getUpcomingAppointments() {
    const now = new Date();
    return appointments
      .filter(appointment => 
        appointment.status === 'scheduled' && 
        new Date(appointment.date) > now
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  function getPastAppointments() {
    const now = new Date();
    return appointments
      .filter(appointment => 
        appointment.status === 'completed' || 
        (appointment.status === 'scheduled' && new Date(appointment.date) < now)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  function getDoctor(id: string) {
    return doctors.find(doctor => doctor.id === id);
  }

  function getLocation(id: string) {
    return locations.find(location => location.id === id);
  }

  const value = {
    appointments,
    doctors,
    locations,
    loading,
    scheduleAppointment,
    cancelAppointment,
    completeAppointment,
    getAppointment,
    getUpcomingAppointments,
    getPastAppointments,
    getDoctor,
    getLocation
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}