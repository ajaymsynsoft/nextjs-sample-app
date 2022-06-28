import { Prisma } from '@prisma/client';
import {prisma} from '.';
export class PreferenceRepo {
    /**
     * Objective: This function retirves preferences from preference table
     * @returns preferences array
     */
    public static async getAllPreferences(): Promise<Prisma.PreferencesCreateInput[] | null> {
        return await prisma.preferences.findMany({});
    }

    /**
     * Objective: This function retirves preferences of user based on the user id provided
     * @param userId 
     * @returns user preference
     */
    public static async getUserPreferences(userId: number): Promise<any | null> {
        return await prisma.userPreferences.findMany({
            where: { userId: Number(userId) }, include: {
                preference: true,
            },
        })
    }

    /**
     * Objective: This function updates user preferences given preference data and user id
     * @param data 
     * @param userId 
     * @returns updated count
     */
    public static async updateUserPreferences(data: number[], userId: number): Promise<any | null> {
        await prisma.userPreferences.deleteMany({
            where: {
                userId: Number(userId)
            },
        })
        let items: any = [];
        data.map((i: number) => {
            items.push({ userId:Number(userId), preferenceId: Number(i) })
        });

        await Promise.all(items.map(async(item)=>{
            return await prisma.userPreferences.create({
                data: item
            })
        }))
       
    }
}