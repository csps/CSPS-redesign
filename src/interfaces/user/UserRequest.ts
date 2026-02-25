// User Request DTO
export interface UserRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string; // ISO format date string
  email: string;
}
