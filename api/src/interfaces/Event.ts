export interface Event {
    event_id: number;
    user_id: number;
    title: string;
    description: string;
    location: string;
    startTime: Date;
    endTime: Date;
}
