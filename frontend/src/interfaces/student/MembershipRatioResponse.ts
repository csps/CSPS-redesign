/**
 * Membership ratio response from GET /api/student-memberships/ratio.
 * Provides at-a-glance membership insights for the dashboard.
 *
 * @field totalStudents - total registered students
 * @field paidMembersCount - students with active memberships
 * @field nonMembersCount - students without active memberships
 * @field memberPercentage - (paidMembersCount / totalStudents) × 100
 */
export interface MembershipRatioResponse {
  totalStudents: number;
  paidMembersCount: number;
  nonMembersCount: number;
  memberPercentage: number;
}
