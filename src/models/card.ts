
export enum Diff {
    easy,
    medium,
    hard
} //user can rate difficulty for each flashcard

export interface Card {
    id?:string;
    timestamp?: firebase.firestore.Timestamp;
    front: string;
    back:string;
    diff:Diff;
}