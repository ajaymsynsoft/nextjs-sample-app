import { Prisma } from '@prisma/client';
import {prisma} from '.';
// users in JSON file for simplicity, store in a db for production applications
// let users = require('data/users.json');


export class usersRepo {
    // contains critical information of the user
    /**
      * Objective: This function finds the user information based on the id passed
      * @param id 
      * @returns user
      */
    public static async findById(id: number): Promise<any | null> {
      return await prisma.user.findUnique({
        where: { id: Number(id) }
      })
    }
  
    /**
      * Objective: This function inserts user
      * @param user 
      * @returns user
      */
    public static async create(user: Prisma.UserCreateInput): Promise<Prisma.UserCreateInput | null> {
      return await prisma.user.create({
        data: user
      })
    }
  
    /**
     * Objective: This function finds the user information based on the email
     * @param email 
     * @returns user
     */
    public static async findByEmail(email: string): Promise<Prisma.UserCreateInput | null> {
      return await prisma.user.findUnique({
        where: { email }
      })
    }
  
    /**
     * Objective: This function finds the user based on token passed
     * @param token 
     * @returns user
     */
    public static async findByToken(token: string): Promise<Prisma.UserActivationTokenCreateInput | null> {
      return await prisma.userActivationToken.findUnique({
        where: { token }
      })
    }
  
    /**
     * Objective: This function updates an account token for a user
     * @param userId 
     * @param token 
     * @returns user
     */
    public static async addAccountActivationToken(userId: number, token: string): Promise<Prisma.UserActivationTokenCreateInput | null> {
      return await prisma.userActivationToken.create({
        data: {
          userId,
          token: token
        }
      })
    }
  
    /**
     * Objective: It will mark user as activated also removed activation entry from the token table.
     * @param userActivationEntry 
     * @param password 
     * @returns 
     */
    public static async activateAccount(userActivationEntry: any, password: string): Promise<any | null> {
      return await prisma.$transaction([
        prisma.user.update({ where: { id: userActivationEntry.userId }, data: { active: true, password } }),
        prisma.userActivationToken.delete({ where: { id: userActivationEntry.id } }),
      ]);
    }
  
    /**
     * Objective: It will update the user password on user table
     * @param userId 
     * @param passwordHash 
     * @returns user
     */
    public static async resetPassword(userId: number, passwordHash: string): Promise<any | null> {
      return await prisma.user.update({ where: { id: userId }, data: { password: passwordHash } });
    }
  
    /**
     * Objective: It will return the user information along with preferences
     * @param userId 
     * @returns user
     */
    public static async getUserProfile(userId: number): Promise<any | null> {
      let user: any = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
          id:true,
          email: true,
          name: true,
          dob: true,
          preferences: {
            select: {
              preference: true,
            }
          }
        }
      })
  
      user.preferences = user.preferences.map(({ preference }: any) => preference.id);
      return user
    }

    /**
      * Objective: This function inserts user
      * @param user 
      * @returns user
      */
     public static async update(userId: number,user: Prisma.UserCreateInput): Promise<Prisma.UserCreateInput | null> {
      return await prisma.user.update({ where: { id: Number(userId) }, data: user });
    }
  }
