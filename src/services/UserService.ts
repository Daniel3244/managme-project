// User type and demo service
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: "admin" | "devops" | "developer";
}

// Service for getting current user (demo only)
class UserService {
  static currentUser: User = { id: 1, firstName: "Jan", lastName: "Kowalski", role: "admin" };
  static getCurrentUser(): User {
    // Return static demo user
    return this.currentUser;
  }
}
export default UserService;
