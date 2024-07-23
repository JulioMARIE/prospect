import { LoginModel } from './loginModel';

export class LoginController {
  static async handleLogin(email: string, password: string): Promise<boolean> {
    try {
      const loginModel = new LoginModel(email, password);
      const token = await loginModel.login();
      
      if (token) {
        localStorage.setItem('token', token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur dans le contrôleur de connexion:', error);
      return false;
    }
  }
}