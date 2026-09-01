export class MonitoringResponseDto {
  application!: string;

  node!: {
    version: string;
    uptime: number;
    platform: string;
    environment: string;
  };

  memory!: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };

  database!: {
    status: 'CONNECTED' | 'DISCONNECTED';
    latency: number;
  };

  response!: {
    generatedAt: string;
  };
}
