export class CreateSubscriptionDto {
  user_id: string;
  plan_id: string;
  status: string;
  start_date: Date;
  end_date: Date;
}
