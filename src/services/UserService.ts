export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
class UserService {
  static currentUser: User = { id: 1, firstName: "Jan", lastName: "Kowalski" };
  static getCurrentUser(): User {
    return this.currentUser;
  }
}
export default UserService;
