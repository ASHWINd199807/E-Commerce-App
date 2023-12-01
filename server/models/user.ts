import { Schema, model } from "mongoose";

export interface IUser {
  _id?: string;
  username: string;
  password: string;
  availableMoney: number;
  purchasedItems: string[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  availableMoney: { type: Number, default: 5000 },
  purchasedItems: [
    { type: Schema.Types.ObjectId, ref: "product", default: [] }, // type is objectID REFERENCING ANOTHER COLLECTION , 2:23:00
  ],
});

export const UserModel = model<IUser>("user", UserSchema);
