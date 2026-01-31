
export interface Activity {
    id: string;
    created: string;
    updated: string;
    title: string;
    category: 'home_care' | 'festival' | 'school_visit' | 'home_visit' | 'training' | 'other';
    status: 'planning' | 'recruiting' | 'ongoing' | 'review' | 'completed';
    start_time?: string;
    end_time?: string;
    location?: string;
    lead_staff?: string; // Relation ID
    summary?: string;

    // Archives
    photos?: string[];
    documents?: string[];
    videos?: string[];
    external_links?: { title: string, url: string }[];

    expand?: {
        lead_staff?: {
            name: string;
            avatar: string;
        }
    }
}
