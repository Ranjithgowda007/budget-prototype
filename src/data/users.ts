// Dummy users for POC - Role-based authentication
export interface User {
    userId: string;
    password: string;
    name: string;
    designation: string;
    post: string;
    ddoCode: string;
    department: string;
    location: string;
    lastLogin: string;
    roles: ('creator' | 'verifier' | 'approver')[];
}

export const DUMMY_USERS: User[] = [
    {
        userId: "creator001",
        password: "creator123",
        name: "RAJESH KUMAR SHARMA",
        designation: "Accounts Officer",
        post: "DDO Creator",
        ddoCode: "0000442101",
        department: "DIRECTORATE OF TREASURIES AND ACCOUNTS",
        location: "BHOPAL",
        lastLogin: "16 Dec, 2025 10:30",
        roles: ["creator"]
    },
    {
        userId: "verifier001",
        password: "verifier123",
        name: "SANDEEP JAIN",
        designation: "Assistant Internal Audit Officer",
        post: "DDO Verifier",
        ddoCode: "0000442105",
        department: "DIRECTORATE OF TREASURIES AND ACCOUNTS",
        location: "BHOPAL",
        lastLogin: "11 Dec, 2025 14:29",
        roles: ["verifier"]
    },
    {
        userId: "approver001",
        password: "approver123",
        name: "PRIYA SINGH",
        designation: "Deputy Director",
        post: "DDO Approver",
        ddoCode: "0000442110",
        department: "DIRECTORATE OF TREASURIES AND ACCOUNTS",
        location: "BHOPAL",
        lastLogin: "15 Dec, 2025 09:45",
        roles: ["approver"]
    },
    {
        userId: "multi001",
        password: "multi123",
        name: "AMIT VERMA",
        designation: "Senior Accounts Officer",
        post: "DDO Verifier & Approver",
        ddoCode: "0000442115",
        department: "DIRECTORATE OF TREASURIES AND ACCOUNTS",
        location: "INDORE",
        lastLogin: "17 Dec, 2025 08:00",
        roles: ["verifier", "approver"]
    }
];

// Helper function to authenticate user
export function authenticateUser(userId: string, password: string): User | null {
    const user = DUMMY_USERS.find(
        u => u.userId.toLowerCase() === userId.toLowerCase() && u.password === password
    );
    return user || null;
}

// Helper function to get user by ID
export function getUserById(userId: string): User | null {
    return DUMMY_USERS.find(u => u.userId === userId) || null;
}
