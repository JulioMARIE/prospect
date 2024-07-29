// export interface LoginResponse {
//     token: string;
//   }
  
  export class LoginModel {
    constructor(private email: string, private password: string) {}
  
    async login(): Promise<string> {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/responsableLogin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            mot_de_passe: this.password,
          }),
        });
  
        if (!response) {
          throw new Error('Erreur de connexion');
        }
  
        const data = await response.json();
        
        return data;
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
      }
    }
  }