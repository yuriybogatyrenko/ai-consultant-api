export class CreatePaymentDto {
  user_id: number;
  subscription_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
}
