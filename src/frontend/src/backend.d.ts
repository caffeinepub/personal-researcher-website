import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface ResearchInterest {
    id: string;
    name: string;
}
export interface Publication {
    id: string;
    pdf?: ExternalBlob;
    title: string;
    link?: string;
    description: string;
    timestamp: Time;
}
export interface ProfileData {
    name: string;
    biography: string;
    photo?: ExternalBlob;
}
export interface ContactInfo {
    email: string;
    affiliation: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPublication(title: string, description: string, link: string | null, pdf: ExternalBlob | null): Promise<string>;
    addResearchInterest(name: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearData(): Promise<void>;
    deletePublication(publicationId: string): Promise<void>;
    deleteResearchInterest(interestId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo | null>;
    getProfile(): Promise<ProfileData | null>;
    getPublication(id: string): Promise<Publication>;
    getPublications(): Promise<Array<Publication>>;
    getResearchInterests(): Promise<Array<ResearchInterest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isOwner(): Promise<boolean>;
    saveCallerUserProfile(userProfile: UserProfile): Promise<void>;
    setContactInfo(email: string, affiliation: string): Promise<void>;
    setProfile(name: string, biography: string, photo: ExternalBlob | null): Promise<void>;
    updatePublication(publicationId: string, title: string, description: string, link: string | null, pdf: ExternalBlob | null): Promise<void>;
}
