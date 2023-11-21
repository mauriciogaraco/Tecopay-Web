export interface Role {
    name: string;
    code: string;
    description: string;
}

export interface IssueEntity {
    name: string;
    color: string;
}

export interface Item {
    id: number;
    fullName: string;
    account: null;
    issueEntity: IssueEntity | null;
    roles: Role[];
    email: String
}

export type Items = Item[];
