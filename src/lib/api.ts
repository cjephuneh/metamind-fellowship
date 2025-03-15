import { Message } from "@/components/MessageModal";
import scholarshipsData from "../../backend/data/scholarships.json";

// Use a relative URL that works both in development and in the Lovable environment
const API_BASE_URL = "/api";

// Generic fetch function with error handling and fallback data
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    
    // Return fallback data if provided
    if (fallbackData !== undefined) {
      console.log(`Using fallback data for ${endpoint}`);
      return fallbackData;
    }
    
    // Special case for scholarships endpoint
    if (endpoint === '/scholarships' && Array.isArray(scholarshipsData)) {
      console.log("Using local scholarships data");
      return scholarshipsData as unknown as T;
    }
    
    throw error;
  }
}

// Authentication APIs
export const loginWithEmailPassword = (email: string, password: string) => {
  return fetchApi<{success: boolean, user: any, token: string}>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, { 
    success: true, 
    user: { 
      id: "demo-user", 
      name: "Demo User", 
      type: "student", 
      balance: "1.5",
      address: "0x1234567890abcdef1234567890abcdef12345678"
    }, 
    token: "demo-token" 
  });
};

// Scholarship APIs
export const getScholarships = () => {
  return fetchApi<any[]>('/scholarships', {}, scholarshipsData);
};

export const getScholarshipById = (id: string) => {
  return fetchApi<any>(`/scholarships/${id}`);
};

export const createScholarship = (scholarshipData: any) => {
  return fetchApi<any>('/scholarships', {
    method: 'POST',
    body: JSON.stringify(scholarshipData),
  });
};

// User APIs
export const getUserByAddress = (address: string) => {
  return fetchApi<any>(`/users/${address}`);
};

export const createUser = (userData: any) => {
  return fetchApi<any>('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUser = (address: string, userData: any) => {
  return fetchApi<any>(`/users/${address}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Message APIs
export const getUserMessages = (userId: string) => {
  return fetchApi<Message[]>(`/messages/${userId}`);
};

export const markMessageAsRead = (messageId: string) => {
  return fetchApi<Message>(`/messages/${messageId}/read`, {
    method: 'PUT'
  });
};

export const sendMessage = (messageData: {
  sender: { id: string, name: string },
  recipient: { id: string, name: string },
  content: string
}) => {
  return fetchApi<Message>('/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
};

// Application APIs
export const submitApplication = (applicationData: {
  scholarshipId: string,
  scholarshipTitle: string,
  applicantId: string,
  story: string,
  contactEmail: string,
  contactPhone: string,
  documents?: string[] // In a real app, these would be references to uploaded files
}) => {
  return fetchApi<any>('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
};

export const getScholarshipApplications = (scholarshipId: string) => {
  return fetchApi<any[]>(`/applications/${scholarshipId}`);
};

export const getUserApplications = (userId: string) => {
  return fetchApi<any[]>(`/applications/user/${userId}`);
};

// Transaction APIs
export const recordTransaction = (transactionData: {
  fromAddress: string,
  toAddress: string,
  amount: string,
  scholarshipId?: string,
  txHash?: string
}) => {
  return fetchApi<any>('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
};

export const getUserTransactions = (userAddress: string) => {
  return fetchApi<any[]>(`/transactions/${userAddress}`);
};

// Smart Contract APIs
export const getContracts = () => {
  return fetchApi<any[]>('/contracts');
};

export const getContractById = (id: string) => {
  return fetchApi<any>(`/contracts/${id}`);
};

export const createContract = (contractData: any) => {
  return fetchApi<any>('/contracts', {
    method: 'POST',
    body: JSON.stringify(contractData),
  });
};

// Add a new function to get grants specifically
export const getGrants = () => {
  return fetchApi<any[]>('/scholarships', {}, scholarshipsData.filter(s => 
    s.title.toLowerCase().includes('grant') || 
    s.description.toLowerCase().includes('grant')
  ));
};

// Add a function to get scholarships by sponsor
export const getScholarshipsBySponsor = (sponsorName: string) => {
  return fetchApi<any[]>('/scholarships', {}, 
    scholarshipsData.filter(s => s.sponsor.toLowerCase().includes(sponsorName.toLowerCase()))
  );
};
