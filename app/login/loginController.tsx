import { LoginModel } from './loginModel';

export class LoginController {
  static async handleLogin(email: string, password: string): Promise<boolean> {
    try {
      const loginModel = new LoginModel(email, password);
      const data = await loginModel.login();
      
      if (data) {
        // Afficher le contenu de la réponse
        console.log('Réponse de l\'API c:', data);
        
        localStorage.setItem('user', data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur dans le contrôleur de connexion:', error);
      return false;
    }
  }
}