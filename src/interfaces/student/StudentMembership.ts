/**
 * Request DTO for creating or updating a student membership.
 * The server auto-determines the `active` flag based on whether
 * the provided yearStart/yearEnd matches the current academic year.
 *
 * @field studentId  - 8-character student identifier
 * @field yearStart  - start calendar year of the membership (e.g. 2025)
 * @field yearEnd    - end calendar year of the membership (e.g. 2026)
 */
export interface StudentMembershipRequest {
  studentId: string;
  yearStart: number;
  yearEnd: number;
}

/**
 * Response DTO representing a persisted student membership record.
 *
 * @field membershipId - unique membership identifier
 * @field studentId    - owning student's ID
 * @field dateJoined   - ISO datetime when the membership was created
 * @field active       - whether this membership is currently active
 * @field yearStart    - start calendar year (e.g. 2025)
 * @field yearEnd      - end calendar year (e.g. 2026)
 */
export interface StudentMembershipResponse {
  membershipId: number;
  studentId: string;
  dateJoined: string;
  active: boolean;
  yearStart: number;
  yearEnd: number;
}

/**
 * Response DTO wrapping a student record together with all of their memberships.
 *
 * @field studentId  - the student's ID
 * @field yearLevel  - academic standing (1-4)
 * @field firstName  - student's first name
 * @field lastName   - student's last name
 * @field middleName - student's middle name
 * @field email      - student's email address
 * @field role       - the user role (e.g. "STUDENT")
 * @field memberships - list of all membership records for this student
 */
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
