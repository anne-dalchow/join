import { Timestamp } from "firebase/firestore";

export interface Tasks {
    id?: string | undefined;
    assignedTo?: string[];
    category?: string;
    date?: Timestamp;
    description?: string;
    priority?: string;
    subtasks?: string[];
    title?: string;
    status?: string;
}

export interface TasksFirestoreData {
    assignedTo?: string[];
    category?: string;
    date?: Timestamp;
    description?: string;
    priority?: string;
    subtasks?: string[];
    title?: string;
    status?: string;
}

export interface Subtasks {
    title: string;
    done: boolean;
}