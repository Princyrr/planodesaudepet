import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type PlanType = 'basic' | 'intermediate' | 'premium';

interface Plan {
  id: PlanType;
  name: string;
  price: number;
  features: string[];
  description: string;
  colorClass: string;
}

interface Subscription {
  id: string;
  planId: PlanType;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  paymentMethod: {
    type: 'credit_card' | 'debit_card' | 'bank_account';
    lastFour: string;
  };
}

interface SubscriptionContextType {
  availablePlans: Plan[];
  currentSubscription: Subscription | null;
  loading: boolean;
  subscribeToPlan: (planId: PlanType, paymentMethod: Subscription['paymentMethod']) => Promise<void>;
  changePlan: (newPlanId: PlanType) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updatePaymentMethod: (paymentMethod: Subscription['paymentMethod']) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Define available plans
  const availablePlans: Plan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: 79.90,
      description: 'Consultas limitadas e descontos em exames',
      features: [
        'Até 4 consultas por ano',
        '20% de desconto em exames',
        'Atendimento em horário comercial',
        'Rede de clínicas parceiras'
      ],
      colorClass: 'bg-teal-100 border-teal-500 text-teal-800'
    },
    {
      id: 'intermediate',
      name: 'Intermediário',
      price: 129.90,
      description: 'Consultas ilimitadas e alguns exames incluídos',
      features: [
        'Consultas ilimitadas',
        'Exames laboratoriais básicos inclusos',
        'Atendimento estendido',
        'Rede ampliada de clínicas',
        'Descontos em medicamentos'
      ],
      colorClass: 'bg-purple-100 border-purple-500 text-purple-800'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 199.90,
      description: 'Consultas e exames inclusos + descontos em procedimentos',
      features: [
        'Consultas ilimitadas',
        'Exames laboratoriais e de imagem inclusos',
        'Atendimento 24h',
        'Rede completa de clínicas e hospitais',
        'Descontos em cirurgias e internações',
        'Cobertura para tratamentos odontológicos'
      ],
      colorClass: 'bg-orange-100 border-orange-500 text-orange-800'
    }
  ];

  // Load subscription from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      const storedSubscription = localStorage.getItem(`subscription_${currentUser.id}`);
      if (storedSubscription) {
        const parsedSub = JSON.parse(storedSubscription);
        // Convert string dates back to Date objects
        parsedSub.startDate = new Date(parsedSub.startDate);
        parsedSub.endDate = new Date(parsedSub.endDate);
        setCurrentSubscription(parsedSub);
      } else {
        // For demo, create a default subscription
        const demoSubscription: Subscription = {
          id: Math.random().toString(36).substring(2, 9),
          planId: 'basic',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          isActive: true,
          paymentMethod: {
            type: 'credit_card',
            lastFour: '4242'
          }
        };
        setCurrentSubscription(demoSubscription);
        localStorage.setItem(`subscription_${currentUser.id}`, JSON.stringify(demoSubscription));
      }
    } else {
      setCurrentSubscription(null);
    }
    setLoading(false);
  }, [currentUser]);

  // Save subscription to localStorage whenever it changes
  useEffect(() => {
    if (currentUser && currentSubscription) {
      localStorage.setItem(`subscription_${currentUser.id}`, JSON.stringify(currentSubscription));
    }
  }, [currentSubscription, currentUser]);

  async function subscribeToPlan(planId: PlanType, paymentMethod: Subscription['paymentMethod']) {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSubscription: Subscription = {
        id: Math.random().toString(36).substring(2, 9),
        planId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        paymentMethod
      };
      
      setCurrentSubscription(newSubscription);
    } finally {
      setLoading(false);
    }
  }

  async function changePlan(newPlanId: PlanType) {
    if (!currentSubscription) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentSubscription(prev => {
        if (!prev) return null;
        return {
          ...prev,
          planId: newPlanId,
          // In a real app, you might prorate or adjust dates based on billing cycle
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };
      });
    } finally {
      setLoading(false);
    }
  }

  async function cancelSubscription() {
    if (!currentSubscription) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentSubscription(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isActive: false
        };
      });
    } finally {
      setLoading(false);
    }
  }

  async function updatePaymentMethod(paymentMethod: Subscription['paymentMethod']) {
    if (!currentSubscription) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentSubscription(prev => {
        if (!prev) return null;
        return {
          ...prev,
          paymentMethod
        };
      });
    } finally {
      setLoading(false);
    }
  }

  const value = {
    availablePlans,
    currentSubscription,
    loading,
    subscribeToPlan,
    changePlan,
    cancelSubscription,
    updatePaymentMethod
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}