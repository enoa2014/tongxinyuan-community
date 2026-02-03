
export interface Activity {
    id: string;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
    title: string;
    category: 'home_care' | 'festival' | 'school_visit' | 'home_visit' | 'training' | 'other';
    status: 'planning' | 'recruiting' | 'ongoing' | 'review' | 'completed';
    start_time?: string;
    end_time?: string;
    location?: string;
    lead_staff?: string; // Relation ID
    summary?: string;

    // Registration
    registration_type?: 'offline' | 'form' | 'external';
    registration_url?: string;
    qrcode?: string;

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

export interface News {
    id: string;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
    title: string;
    slug: string;
    description: string;
    author: string;
    category: 'news' | 'story_official' | 'story_volunteer' | 'media_report' | 'notice';
    content: string;
    cover?: string;
    published: boolean;
}

export interface Donation {
    id: string;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
    project_name: string;
    donor_name: string;
    amount: string;
    donate_date: string;
    description?: string;
    status: 'draft' | 'published';
    images?: string[];
}
