import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre('save' , async function (next){
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password =await bcrypt.hash(user.password , Number(config.bcrypt_salt_rounds))
  next()
})

userSchema.post('save' , async function (doc,next) {
  doc.password = '######';
  next()
})
export const UserModel = model<IUser>('user', userSchema);
