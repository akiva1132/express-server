import UserInterface from "../interfaces/UserInterface";
import { v1 as uuid1 } from "uuid";
import { comparePassword, generateUserPassword } from "../helpers/bcrypt";
import {
  updateUser,
  addUser,
  getByIdFromJsonFile,
  getCollectionFromJsonFile,
  deletUser
  // modifyCollection,
} from "../../dataAccess/jsonfileDAL";
import chalk from "chalk";
import userValidation from "../models/joi/userValidation";
import { getDataFromDummy } from "../../dataAccess/dummyjson";
import { addDataToJsonPlaceHolder } from "../../dataAccess/jsonPlaceHolder";

type UserResult = Promise<UserInterface | null>;

export const getUsers = async () => {
  try {
    const users = await getCollectionFromJsonFile();
    if (!users) throw new Error("no users in the database");
    return users;
  } catch (error) {
    console.log(chalk.redBright(error));
    return Promise.reject(error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const users = await getByIdFromJsonFile(userId);
    if (users instanceof Error)
      throw new Error("Oops... Could not get the users from the Database");
    const userFromDB = users
    if (!userFromDB) throw new Error("No user with this id in the database!");
    return userFromDB;
  } catch (error) {
    console.log(chalk.redBright(error));
    return Promise.reject(error);
  }
};

export const register = async (user: UserInterface) => {
  try {
    const users = await getCollectionFromJsonFile();
    if (users instanceof Error)
      throw new Error("Oops... Could not get the users from the Database");
    const userRegistered = users.find((us) => us.email === user.email)
    if (userRegistered) throw new Error("This user is allready registered!");
    user.password = generateUserPassword(user.password);
    return await addUser(user)
  } catch (error) {
    console.log(chalk.redBright(error));
    return Promise.reject(error);
  }
};

export const editUser = async (
  userId: string,
  userForUpdate: UserInterface
) => {
  try {
    const users = await getCollectionFromJsonFile();
    if (users instanceof Error)
      throw new Error("Oops... Could not get the users from the Database");
    const data = await updateUser(userForUpdate, userId);
    if (!data)
      throw new Error("Oops... something went wrong Could not Edit this user");
    return data;
  } catch (error) {
    console.log(chalk.redBright(error));
    return Promise.reject(error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    return await deletUser(userId)
  } catch (error) {
    console.log(chalk.redBright(error));
    return Promise.reject(error);
  }
};

export const login = async (userFromClient: UserInterface) => {
  try {
    const users = (await getCollectionFromJsonFile(
    ))
    if (!users.length)
      throw new Error("Oops... Could not get the users from the Database");
    const userInDB = users.find((user) => userFromClient.email === user.email);
    if (!userInDB) throw new Error("The email or password is incorrect!");
    if (!comparePassword(userFromClient.password, (userInDB as unknown as UserInterface).password))
      throw new Error("The email or password is incorrect!");
    return "You are logged in!";
  } catch (error) {
    console.log(chalk.redBright(error));
    return Promise.reject(error);
  }
};

export const addProductToUser = async (
  userId: string,
  productFromClient: string
) => {
  try {
    const user = await getUser(userId);
    if (!user) throw new Error("Could not find this user!");

    const data = await getDataFromDummy();
    if (!data?.data) throw new Error("Could not get the data!");
    const { data: dataFromDummy } = data;

    const productFromDB = dataFromDummy.products.find(
      (product: Record<string, unknown>) =>
        typeof product.title === "string" &&
        product.title
          .toLowerCase()
          .trim()
          .includes(productFromClient.toLowerCase().trim())
    );

    if (!productFromDB) throw new Error("Could not found this product");
    user.product = productFromDB;

    const userFromJsonPlaceHolder = await addDataToJsonPlaceHolder(
      user,
      "users"
    );
    if (!userFromJsonPlaceHolder)
      throw new Error("Could not add this user to jsonplaceholder database");

    return userFromJsonPlaceHolder;
  } catch (error) {
    if (error && typeof error === "object" && "message" in error)
      console.log(chalk.redBright(error.message));
    return Promise.reject(error);
  }
};
