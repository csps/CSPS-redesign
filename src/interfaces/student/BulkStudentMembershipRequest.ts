/**
 * Request DTO for batch-creating student memberships.
 * All students in the batch share the same academic year range.
 * The server auto-determines the `active` flag per membership
 * based on whether yearStart/yearEnd matches the current academic year.
 *
 * @field studentIds - list of 8-character student identifiers
 * @field yearStart  - shared start calendar year (e.g. 2025)
 * @field yearEnd    - shared end calendar year (e.g. 2026)
 */
export interface BulkStudentMembershipRequest {
  studentIds: string[];
  yearStart: number;
  yearEnd: number;
}
