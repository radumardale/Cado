  export class APIClient {
    private static async fetchNewToken() {
    const response = await fetch(`${process.env.API_BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        username: process.env.API_USERNAME!,
        password: process.env.API_PASSWORD!,
        grant_type: 'password'
      })
    });
      
      if (!response.ok) {
        throw new Error(`Token fetch failed: ${response.statusText}`);
      }
      
      return response.json();
    }
    
    static async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
      const tokenData = await this.fetchNewToken();

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        }
      });
    }
  }