export class CreateMembershipDto {
  userId: string;
  tenantId: string;
  role: string;
  invitedBy: string | null;
  status: string;
  createdAt: Date;
}
