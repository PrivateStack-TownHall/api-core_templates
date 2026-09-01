export class HealthResponseDto {
  status!: 'UP' | 'DOWN';

  application!: string;

  database!: 'CONNECTED' | 'DISCONNECTED';

  version!: string;

  timestamp!: string;

  uptime!: number;
}
