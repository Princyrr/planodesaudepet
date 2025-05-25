import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments, AppointmentType } from '../contexts/AppointmentContext';
import { usePets } from '../contexts/PetContext';
import { format, addDays, startOfDay, setHours, setMinutes } from 'date-fns';
import { Calendar, MapPin, Clock, FileText, Check } from 'lucide-react';

function AppointmentScheduling() {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { doctors, locations, scheduleAppointment, loading } = useAppointments();
  
  const [step, setStep] = useState(1);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<AppointmentType>('checkup');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  
  // Generate available dates (next 14 days)
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i + 1));
  
  // Generate available times (9am to 6pm, 30 min intervals)
  const availableTimes = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });
  
  const appointmentTypes: { id: AppointmentType; name: string; icon: JSX.Element; duration: number }[] = [
    {
      id: 'checkup',
      name: 'Consulta de Rotina',
      icon: <Check className="text-green-500" />,
      duration: 30
    },
    {
      id: 'vaccination',
      name: 'Vacinação',
      icon: <FileText className="text-blue-500" />,
      duration: 15
    },
    {
      id: 'exam',
      name: 'Exames',
      icon: <FileText className="text-purple-500" />,
      duration: 45
    },
    {
      id: 'emergency',
      name: 'Emergência',
      icon: <Clock className="text-red-500" />,
      duration: 60
    }
  ];
  
  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedPetId || !selectedDoctorId || !selectedLocationId || !selectedDate || !selectedTime) {
      return;
    }
    
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes);
    
    const appointmentDuration = appointmentTypes.find(type => type.id === selectedAppointmentType)?.duration || 30;
    
    await scheduleAppointment({
      petId: selectedPetId,
      doctorId: selectedDoctorId,
      locationId: selectedLocationId,
      type: selectedAppointmentType,
      date: appointmentDate,
      duration: appointmentDuration,
      notes
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-fade-in">
      <div className="container-custom mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  1
                </div>
                <div className={`h-1 w-12 mx-2 ${step > 1 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  2
                </div>
                <div className={`h-1 w-12 mx-2 ${step > 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  3
                </div>
                <div className={`h-1 w-12 mx-2 ${step > 3 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 4 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  4
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Passo {step} de 4
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Step 1: Select Pet and Appointment Type */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Selecione seu pet e o tipo de atendimento</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione seu pet:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pets.map((pet) => (
                      <div
                        key={pet.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedPetId === pet.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPetId(pet.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                            {pet.imageUrl ? (
                              <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-700">
                                {pet.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{pet.name}</p>
                            <p className="text-sm text-gray-500">{pet.species} • {pet.breed}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de atendimento:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {appointmentTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedAppointmentType === type.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedAppointmentType(type.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {type.icon}
                          </div>
                          <div>
                            <p className="font-medium">{type.name}</p>
                            <p className="text-sm text-gray-500">Duração: {type.duration} min</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Select Doctor and Location */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Escolha o veterinário e a clínica</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o veterinário:
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedDoctorId === doctor.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedDoctorId(doctor.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                            {doctor.imageUrl ? (
                              <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-700">
                                {doctor.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione a clínica:
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedLocationId === location.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedLocationId(location.id)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <MapPin className="text-teal-500" />
                          </div>
                          <div>
                            <p className="font-medium">{location.name}</p>
                            <p className="text-sm text-gray-500">{location.address}, {location.city}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Select Date and Time */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Escolha a data e horário</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione a data:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`p-2 border rounded-md text-center min-w-[90px] ${
                          selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                            ? 'bg-teal-500 text-white border-teal-500'
                            : 'bg-white border-gray-200 hover:border-teal-300'
                        }`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="text-xs">{format(date, 'EEE', { locale: { code: 'pt-BR' } })}</div>
                        <div className="font-medium">{format(date, 'dd/MM')}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o horário:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`p-2 border rounded-md text-center ${
                          selectedTime === time
                            ? 'bg-teal-500 text-white border-teal-500'
                            : 'bg-white border-gray-200 hover:border-teal-300'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Confirme seu agendamento</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Pet</h3>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                          {pets.find(p => p.id === selectedPetId)?.imageUrl ? (
                            <img 
                              src={pets.find(p => p.id === selectedPetId)?.imageUrl} 
                              alt={pets.find(p => p.id === selectedPetId)?.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-700">
                              {pets.find(p => p.id === selectedPetId)?.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="font-medium">
                          {pets.find(p => p.id === selectedPetId)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Tipo de Atendimento</h3>
                      <div className="font-medium">
                        {appointmentTypes.find(t => t.id === selectedAppointmentType)?.name}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Veterinário</h3>
                      <div className="font-medium">
                        {doctors.find(d => d.id === selectedDoctorId)?.name}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Local</h3>
                      <div className="font-medium">
                        {locations.find(l => l.id === selectedLocationId)?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {locations.find(l => l.id === selectedLocationId)?.address}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Data</h3>
                      <div className="font-medium">
                        {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Horário</h3>
                      <div className="font-medium">
                        {selectedTime}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Observações adicionais (opcional):
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="input"
                    placeholder="Informe aqui quaisquer detalhes importantes sobre o atendimento..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Calendar className="text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Lembrete</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Você receberá um email de confirmação com os detalhes do agendamento. 
                        Chegue com 15 minutos de antecedência.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <button
              type="button"
              className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              onClick={handleBack}
              disabled={step === 1}
            >
              Voltar
            </button>
            
            <button
              type="button"
              className="btn-primary"
              onClick={handleContinue}
              disabled={
                (step === 1 && (!selectedPetId || !selectedAppointmentType)) ||
                (step === 2 && (!selectedDoctorId || !selectedLocationId)) ||
                (step === 3 && (!selectedDate || !selectedTime)) ||
                loading
              }
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
              ) : step < 4 ? (
                'Continuar'
              ) : (
                'Confirmar Agendamento'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentScheduling;