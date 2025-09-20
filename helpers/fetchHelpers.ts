// Common fetch function with support for different HTTP methods
export const apiService = {
    // Generic fetch function
    fetch: async <T = any>(
      url: string, 
      options: RequestInit = {}
    ): Promise<T> => {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('API fetch error:', error);
        throw error;
      }
    },
  
    // GET method
    get: async <T = any>(url: string): Promise<T> => {
      return apiService.fetch<T>(url, { method: 'GET' });
    },
  
    // POST method
    post: async <T = any>(url: string, data: any): Promise<T> => {
      return apiService.fetch<T>(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  
    // PUT method
    put: async <T = any>(url: string, data: any): Promise<T> => {
      return apiService.fetch<T>(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  
    // DELETE method
    delete: async <T = any>(url: string): Promise<T> => {
      return apiService.fetch<T>(url, { method: 'DELETE' });
        },
}