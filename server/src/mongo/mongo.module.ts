import { Module } from '@nestjs/common';

import * as mongoose from 'mongoose';

export const databaseProvider = [
  {
    provide: 'DB_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.DB_MONGO),
  },
];

@Module({
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class MongoModule {}
