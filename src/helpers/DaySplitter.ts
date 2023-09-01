import User, { IUser } from "../schemas/User";
import { addUserToLeaderboard } from "./LeaderboardBuilder";
import { TaskData } from "./TaskHelper";


export async function handleAllTasks(tasks: TaskData, wallet: string) {
    let user = await User.findOne({wallet: wallet});

    if(!user) throw new Error("Failed to find user");

    if(!tasks) throw new Error("Failed to find tasks");

    let points: number[] = [];
    let data: string[] = [];

    points.push(tasks.profits.points);
    data.push(JSON.stringify(tasks.profits.difference));

    points.push(tasks.gasSpent.points);
    data.push(JSON.stringify(tasks.gasSpent.gasSpent));

    points.push(tasks.topBought.points);
    data.push(JSON.stringify(tasks.topBought.topBuys));

    points.push(tasks.rektTokens.points);
    data.push(JSON.stringify(tasks.rektTokens.toReturn));

    points.push(tasks.sillyMints.points);
    data.push(JSON.stringify(tasks.sillyMints.mintData));

    points.push(tasks.stillHoldingSillyMints.points);
    data.push(JSON.stringify(tasks.stillHoldingSillyMints.stillHolding));

    points.push(tasks.dumpoors.points);
    data.push(JSON.stringify(tasks.dumpoors.allDumpedOn));

    points.push(tasks.unrealizedProfit.points);
    data.push(JSON.stringify(tasks.unrealizedProfit.totalUnrealisedLoss));

    user.rektFinished = true;

    user.totalPoints = tasks.totalPoints;
    user.points = points;
    user.dayData = data;

    await user.save();

    addUserToLeaderboard(user);
    
}

export function reorganiseTasksForDay(user: IUser, day: number) {
    let rektData: {data: string, points: number}[] = [];

    if(day < 0) day = 0;
    if(day > 8) day = 8;

    for(let i = 0; i < day; i++)
        rektData.push({ data: JSON.parse(user.dayData[i]), points: user.points[i] });

    return rektData;
}