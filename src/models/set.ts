export interface Set {
    title?: string,
    description?: string,
    id?: string;
    user_id?: string,
    user_username?: string,
    user_email?: string,
    timestamp?: firebase.firestore.Timestamp
}