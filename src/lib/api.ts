import { Message } from "@/components/MessageModal";
import scholarshipsData from "../../backend/data/scholarships.json";
import { debounce } from "lodash";

// Use a relative URL that works both in development and in the Lovable environment
const API_BASE_URL = "/api";

// Keep track of ongoing requests to prevent duplicates
const ongoingRequests = new Map();

// Generic fetch function with improved error handling and fallback data
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  // Check if we already have an ongoing request for this endpoint + method
  const requestKey = `${endpoint}-${options.method || 'GET'}`;
  
  if (ongoingRequests.has(requestKey)) {
    console.log(`Request for ${endpoint} already in progress, waiting...`);
    return ongoingRequests.get(requestKey);
  }

  // Create a new promise for this request
  const requestPromise = new Promise<T>(async (resolve, reject) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Fetching ${url}...`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Check response content type to catch HTML errors
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error(`API returned HTML instead of JSON for ${endpoint}`);
        throw new Error('Invalid response format (HTML)');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || `API error: ${response.status}`);
      }

      const data = await response.json() as T;
      resolve(data);
    } catch (error) {
      console.error(`API fetch error for ${endpoint}:`, error);
      
      // Return fallback data if provided
      if (fallbackData !== undefined) {
        console.log(`Using fallback data for ${endpoint}`);
        resolve(fallbackData);
      }
      
      // Special case for scholarships endpoint
      else if (endpoint === '/scholarships' && Array.isArray(scholarshipsData)) {
        console.log("Using local scholarships data");
        resolve(scholarshipsData as unknown as T);
      }
      else if (endpoint.startsWith('/scholarships/') && Array.isArray(scholarshipsData)) {
        // For single scholarship requests, find by ID
        const id = endpoint.split('/').pop();
        const scholarship = scholarshipsData.find(s => s.id === id);
        if (scholarship) {
          console.log(`Using local scholarship data for ID: ${id}`);
          resolve(scholarship as unknown as T);
        } else {
          reject(error);
        }
      }
      else {
        reject(error);
      }
    } finally {
      // Remove the request from ongoing requests
      ongoingRequests.delete(requestKey);
    }
  });

  // Store the promise
  ongoingRequests.set(requestKey, requestPromise);
  return requestPromise;
}

// Debounced version of getScholarships to prevent multiple requests
const debouncedGetScholarships = debounce(() => {
  return fetchApi<any[]>('/scholarships', {}, scholarshipsData);
}, 300);

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
  return debouncedGetScholarships();
};

export const getScholarshipById = (id: string) => {
  return fetchApi<any>(`/scholarships/${id}`, {}, 
    scholarshipsData.find(s => s.id === id)
  );
};

export const createScholarship = (scholarshipData: any) => {
  return fetchApi<any>('/scholarships', {
    method: 'POST',
    body: JSON.stringify(scholarshipData),
  }, {
    id: `local-${Date.now()}`,
    ...scholarshipData,
    status: "open"
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
  }, {
    id: `app-${Date.now()}`,
    ...applicationData,
    status: "pending",
    submitted_at: new Date().toISOString()
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
  }, {
    id: `tx-${Date.now()}`,
    ...transactionData,
    timestamp: new Date().toISOString(),
    status: "completed"
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
  }, {
    id: `contract-${Date.now()}`,
    ...contractData,
    created_at: new Date().toISOString()
  });
};

// Add a new function to get grants specifically
export const getGrants = () => {
  const grantsFilter = (s: any) => 
    s.title.toLowerCase().includes('grant') || 
    s.description.toLowerCase().includes('grant');
    
  return fetchApi<any[]>('/scholarships', {}, 
    Array.isArray(scholarshipsData) ? scholarshipsData.filter(grantsFilter) : []
  );
};

// Add a function to get scholarships by sponsor
export const getScholarshipsBySponsor = (sponsorName: string) => {
  return fetchApi<any[]>('/scholarships', {}, 
    scholarshipsData.filter(s => s.sponsor.toLowerCase().includes(sponsorName.toLowerCase()))
  );
};
