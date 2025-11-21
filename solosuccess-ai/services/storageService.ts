import { UserProgress, Task, ChatMessage, CompetitorReport, BusinessContext, BrandDNA } from '../types';
import { api } from './api';

export const storageService = {
    // --- User Progress ---
    async getUserProgress(): Promise<UserProgress> {
        const data = await api.get('/user');
        if (data) {
            return {
                level: data.level,
                currentXP: data.xp, // Map backend 'xp' to frontend 'currentXP'
                nextLevelXP: 100 * Math.pow(1.5, data.level),
                rankTitle: 'Unknown',
                totalActions: data.totalActions
            };
        }
        return { level: 1, currentXP: 0, nextLevelXP: 100, rankTitle: 'Garage Hacker', totalActions: 0 };
    },

    async saveUserProgress(progress: Partial<UserProgress>): Promise<void> {
        await api.post('/user/progress', progress);
    },

    // --- Tasks ---
    async getTasks(): Promise<Task[]> {
        const data = await api.get('/tasks');
        return data || [];
    },

    async saveTasks(tasks: Task[]): Promise<void> {
        // The backend expects a batch or individual. 
        // For this prototype migration where we might save the whole list, let's use the batch endpoint.
        await api.post('/tasks/batch', tasks);
    },

    async updateTask(taskId: string, updates: Partial<Task>): Promise<Task[]> {
        // Optimistic update locally? No, let's just save to DB and re-fetch or return updated.
        // The backend `updateTask` logic in `gameService` calls `saveTasks` with the whole list currently.
        // But we can optimize to just update one task.
        // Let's use the single task endpoint.
        await api.post('/tasks', { id: taskId, ...updates });
        return this.getTasks();
    },

    async deleteTask(taskId: string): Promise<void> {
        await api.delete(`/tasks/${taskId}`);
    },

    async clearTasks(): Promise<void> {
        await api.delete('/tasks');
    },

    // --- Chat History ---
    async getChatHistory(agentId: string): Promise<ChatMessage[]> {
        const data = await api.get(`/chat/${agentId}`);
        return data || [];
    },

    async saveChatHistory(agentId: string, messages: ChatMessage[]): Promise<void> {
        await api.post('/chat', { agentId, messages });
    },

    async clearChatHistory(agentId: string): Promise<void> {
        await api.post('/chat', { agentId, messages: [] });
    },

    // --- Business Context ---
    async getContext(): Promise<BusinessContext | null> {
        const data = await api.get('/context');
        // The backend returns the context row which might have companyName etc directly, 
        // OR it might be nested if we didn't flatten it.
        // Schema: companyName, founderName...
        // Frontend expects: { companyName, ... }
        return data;
    },

    async saveContext(context: Partial<BusinessContext>): Promise<void> {
        await api.post('/context', context);
    },

    // --- Brand DNA ---
    async getBrandDNA(): Promise<BrandDNA | null> {
        const ctx = await this.getContext();
        return ctx?.brandDna || null;
    },

    async saveBrandDNA(dna: BrandDNA): Promise<void> {
        // We need to merge this into the context update
        const ctx = await this.getContext() || {};
        await api.post('/context', { ...ctx, brandDna: dna });
    },

    // --- Competitor Reports ---
    async getCompetitorReports(): Promise<CompetitorReport[]> {
        const data = await api.get('/reports');
        return data || [];
    },

    async saveCompetitorReport(report: CompetitorReport): Promise<void> {
        await api.post('/reports', report);
    }
};
