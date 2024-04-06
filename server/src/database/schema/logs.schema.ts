import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../entity/admins.entity';

export type LogsDocument = HydratedDocument<Logs>;

export enum Action {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Resource {
  PRODUCT = 'good',
  APPOINT = 'appoint',
  MANUFACTURE = 'manufacture',
  TAGS = 'tag',
  ORDER = 'order',
  // ADMINS = 'admins',
}

@Schema({ timestamps: true, versionKey: false })
class Logs {
  _id: Types.ObjectId;

  @Prop()
  userId: number;

  @Prop({ enum: UserRole })
  role: string;

  @Prop({ enum: Action })
  action: string;

  @Prop({ enum: Resource })
  resource: string;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);
export default Logs;
