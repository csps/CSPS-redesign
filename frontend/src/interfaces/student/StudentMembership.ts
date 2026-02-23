// Student Membership Request DTO
export interface StudentMembershipRequest {
  studentId: string; // 8 characters, required
  active: boolean; // required
  academicYear: number; // 1-4, required
  semester: number; // 1-2, required
}

// Student Membership Response DTO
export interface StudentMembershipResponse {
  membershipId: number;
  studentId: string;
  dateJoined: string; // ISO datetime
  active: boolean;
  academicYear: number; // 1-4
  semester: number; // 1-2
}

// Student with Memberships Response DTO
export interface StudentWithMembershipsResponse {
  studentId: string;
  yearLevel: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  role: string;
  memberships: StudentMembershipResponse[];
}
