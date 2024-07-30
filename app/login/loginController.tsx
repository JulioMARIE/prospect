import { LoginModel } from './loginModel';

export class LoginController {
  static async handleLogin(email: string, password: string): Promise<boolean> {
    try {
      const loginModel = new LoginModel(email, password);
      const result = await loginModel.login();
      
      if (result) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur dans le contrôleur de connexion:', error);
      return false;
    }
  }
}