import { IsEnum } from 'class-validator';

export enum TransferResponse {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

export class RespondTransferDto {
  @IsEnum(TransferResponse)
  response: TransferResponse;
}
