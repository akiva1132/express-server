import jsonfile from "jsonfile";
import path from "path";
import { connectToDatabase } from "./mongo"
import { handleJsonfileError } from "../utils/handleErrors";
const DB_URL = path.join(__dirname, "../../DB/users.json");
import mongoose, { Schema, Document, model, InferSchemaType } from 'mongoose';
import { string } from "joi";
type CollectionResult = Promise<Record<string, unknown>[] | Error>;

interface UserInterface {
  _id?: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
});

const UserModel = model('product', UserSchema);
const product = new Schema({
  price: {
    type: Number
  },
  name: {
    type: String
  }
}
)
const productModel = model('user', product)



export const getCollectionFromJsonFile = async (
) => {
  try {
    return UserModel.find({})
  } catch (error) {
    return handleJsonfileError(error);
  }
};


export const getByIdFromJsonFile = async (
  userId: string
): Promise<Error | Record<string, unknown>[] | null> => {
  try {
    return UserModel.findById(userId)
  } catch (error) {
    return handleJsonfileError(error);
  }
};



type DatabaseResult = Promise<Record<string, unknown> | Error>;
// export const getDatabase = async (): DatabaseResult => {
//   try {
//     const data = await jsonfile.readFile(DB_URL);
//     return data;
//   } catch (error) {
//     return handleJsonfileError(error);
//   }
// };


export const addUser = async (
  user: UserInterface
) => {
  try {
    const newUser = new UserModel(user)
    return newUser.save()
  } catch (error) {
    return handleJsonfileError(error);
  }
};

export const updateUser = async (
  user: UserInterface,
  userId: string
) => {
  try {
    // const newUser = new UserModel(user)
    return UserModel.findByIdAndUpdate(userId, user)
  } catch (error) {
    return handleJsonfileError(error);
  }
};


export const deletUser = async (
  userId: string
) => {
  try {
    return UserModel.deleteOne({userId});
  } catch (error) {
    return handleJsonfileError(error);
  }
};

// export const modifyCollection = async (
//   collection: string,
//   documents: Record<string, unknown>[]
// ): CollectionResult => {
//   try {
//     const data = await getDatabase();
//     const newData = { ...data, [collection]: documents };
//     await jsonfile.writeFile(DB_URL, newData);
//     return documents;
//   } catch (error) {
//     return handleJsonfileError(error);
//   }
// };
