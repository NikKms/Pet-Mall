import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Console } from 'console';
import { WebsocketStream } from '@binance/connector';
import { ClientKafka } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService implements OnModuleInit {
  private price: number;

  private logger = new Console({
    stdout: process.stdout,
    stderr: process.stderr,
  });

  private callbacks = {
    open: () => this.logger.debug('Connected with Websocket server'),
    close: () => this.logger.debug('Disconnected with Websocket server'),
    message: (data: any) => {
      const price = JSON.parse(data);
      // this.logger.info(price.c);
      this.price = price.c;
    },
  };

  private websocketStreamClient: { ticker: (arg0: string) => void };

  constructor(
    @Inject('SOLANA_SERVICE') private readonly solanaClient: ClientKafka,
  ) {
    this.websocketStreamClient = new WebsocketStream({
      loger: this.logger,
      callbacks: this.callbacks,
    });
  }

  onModuleInit() {
    this.websocketStreamClient.ticker('SOLUSDT');
  }

  @Cron('*/10 * * * * *')
  getSol() {
    this.solanaClient.emit('get_sol', { sol: this.price });
  }
}
