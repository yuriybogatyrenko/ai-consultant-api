export class CreateAccountTeamMemberDto {
  account_id: number;
  user_id: number;
  role: string;
  permissions: Record<string, any>;
}
