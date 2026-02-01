/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	AccommodationRecords = "accommodation_records",
	AccommodationUnits = "accommodation_units",
	Activities = "activities",
	Articles = "articles",
	Beneficiaries = "beneficiaries",
	BeneficiaryDocuments = "beneficiary_documents",
	BeneficiaryMedia = "beneficiary_media",
	FamilyMembers = "family_members",
	Media = "media",
	News = "news",
	ServiceConsultations = "service_consultations",
	Services = "services",
	SiteSettings = "site_settings",
	Staff = "staff",
	Users = "users",
	VolunteerApplications = "volunteer_applications",
}

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export enum AccommodationRecordsRecordTypeOptions {
	"Check-in" = "Check-in",
	"Extension" = "Extension",
	"Check-out" = "Check-out",
	"Transfer" = "Transfer",
}
export type AccommodationRecordsRecord = {
	beneficiary: RecordIdString
	end_date?: IsoDateString
	id: string
	notes?: string
	record_type: AccommodationRecordsRecordTypeOptions
	room_number: string
	start_date: IsoDateString
}

export enum AccommodationUnitsTypeOptions {
	"building" = "building",
	"floor" = "floor",
	"room" = "room",
	"bed" = "bed",
}

export enum AccommodationUnitsStatusOptions {
	"active" = "active",
	"maintenance" = "maintenance",
	"occupied" = "occupied",
}
export type AccommodationUnitsRecord = {
	capacity?: number
	id: string
	name: string
	parent?: RecordIdString
	status?: AccommodationUnitsStatusOptions
	tags?: string
	type: AccommodationUnitsTypeOptions
}

export enum ActivitiesStatusOptions {
	"planning" = "planning",
	"recruiting" = "recruiting",
	"ongoing" = "ongoing",
	"review" = "review",
	"completed" = "completed",
}

export enum ActivitiesCategoryOptions {
	"home_care" = "home_care",
	"festival" = "festival",
	"school_visit" = "school_visit",
	"home_visit" = "home_visit",
	"training" = "training",
	"other" = "other",
}
export type ActivitiesRecord<Texternal_links = unknown> = {
	category?: ActivitiesCategoryOptions
	created: IsoAutoDateString
	documents?: FileNameString[]
	end_time?: IsoDateString
	external_links?: null | Texternal_links
	id: string
	lead_staff?: RecordIdString
	location?: string
	photos?: FileNameString[]
	start_time?: IsoDateString
	status?: ActivitiesStatusOptions
	summary?: string
	title: string
	updated: IsoAutoDateString
	videos?: FileNameString[]
}

export enum ArticlesCategoryOptions {
	"news" = "news",
	"media" = "media",
	"policy" = "policy",
}
export type ArticlesRecord = {
	category?: ArticlesCategoryOptions
	content?: HTMLString
	cover_image?: FileNameString
	description?: string
	id: string
	title: string
}

export enum BeneficiariesStatusOptions {
	"active" = "active",
	"archived" = "archived",
}

export enum BeneficiariesGenderOptions {
	"男" = "男",
	"女" = "女",
}

export enum BeneficiariesTreatmentStageOptions {
	"initial" = "initial",
	"chemo" = "chemo",
	"transplant" = "transplant",
	"rehab" = "rehab",
	"palliative" = "palliative",
}

export enum BeneficiariesTypeOptions {
	"illness_child" = "illness_child",
	"girl_student" = "girl_student",
	"other" = "other",
}
export type BeneficiariesRecord<Tfamily_members = unknown> = {
	birth_date?: IsoDateString
	created: IsoAutoDateString
	diagnosis?: string
	documents?: FileNameString[]
	family_members?: null | Tfamily_members
	gender?: BeneficiariesGenderOptions
	guardian_name?: string
	guardian_phone?: string
	guardian_relation?: string
	hometown?: string
	hospital?: string
	id: string
	id_card?: string
	name: string
	phone: string
	photo_usage_consent?: boolean
	photos?: FileNameString[]
	status?: BeneficiariesStatusOptions
	treatment_stage?: BeneficiariesTreatmentStageOptions
	type?: BeneficiariesTypeOptions
	updated: IsoAutoDateString
}

export type BeneficiaryDocumentsRecord = {
	id: string
}

export enum BeneficiaryMediaCategoryOptions {
	"Life" = "Life",
	"Medical" = "Medical",
	"Document" = "Document",
	"Other" = "Other",
}
export type BeneficiaryMediaRecord = {
	beneficiary: RecordIdString
	caption?: string
	captured_date?: IsoDateString
	category: BeneficiaryMediaCategoryOptions
	created: IsoAutoDateString
	file: FileNameString
	id: string
	is_public?: boolean
	updated: IsoAutoDateString
}

export enum FamilyMembersRelationOptions {
	"Father" = "Father",
	"Mother" = "Mother",
	"Brother" = "Brother",
	"Sister" = "Sister",
	"Grandparent" = "Grandparent",
	"Other" = "Other",
}
export type FamilyMembersRecord = {
	age?: number
	beneficiary: RecordIdString
	created: IsoAutoDateString
	health_status?: string
	id: string
	income_contribution?: boolean
	name: string
	notes?: string
	occupation?: string
	relation: FamilyMembersRelationOptions
	updated: IsoAutoDateString
}

export type MediaRecord = {
	alt?: string
	file: FileNameString
	id: string
}

export enum NewsCategoryOptions {
	"news" = "news",
	"story" = "story",
	"notice" = "notice",
	"activity" = "activity",
}
export type NewsRecord = {
	author?: string
	category?: NewsCategoryOptions
	content?: HTMLString
	cover?: FileNameString
	created: IsoAutoDateString
	description?: string
	id: string
	published?: boolean
	slug: string
	title: string
	updated: IsoAutoDateString
}

export enum ServiceConsultationsServiceTypeOptions {
	"Medical" = "Medical",
	"Education" = "Education",
	"Accommodation" = "Accommodation",
	"Financial" = "Financial",
}

export enum ServiceConsultationsStatusOptions {
	"pending" = "pending",
	"contacted" = "contacted",
	"resolved" = "resolved",
}
export type ServiceConsultationsRecord = {
	created: IsoAutoDateString
	description?: string
	id: string
	name: string
	phone: string
	service_type?: ServiceConsultationsServiceTypeOptions
	status?: ServiceConsultationsStatusOptions
	updated: IsoAutoDateString
}

export type ServicesRecord = {
	color_theme: string
	description: string
	icon: string
	id: string
	order?: number
	title: string
}

export type SiteSettingsRecord = {
	id: string
}

export enum StaffRoleOptions {
	"social_worker" = "social_worker",
	"web_admin" = "web_admin",
	"manager" = "manager",
}
export type StaffRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	role?: StaffRoleOptions
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type UsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export enum VolunteerApplicationsStatusOptions {
	"pending" = "pending",
	"approved" = "approved",
	"rejected" = "rejected",
}
export type VolunteerApplicationsRecord<Tskills = unknown> = {
	age?: number
	created: IsoAutoDateString
	email?: string
	id: string
	motivation?: string
	name: string
	phone: string
	skills?: null | Tskills
	status?: VolunteerApplicationsStatusOptions
	updated: IsoAutoDateString
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AccommodationRecordsResponse<Texpand = unknown> = Required<AccommodationRecordsRecord> & BaseSystemFields<Texpand>
export type AccommodationUnitsResponse<Texpand = unknown> = Required<AccommodationUnitsRecord> & BaseSystemFields<Texpand>
export type ActivitiesResponse<Texternal_links = unknown, Texpand = unknown> = Required<ActivitiesRecord<Texternal_links>> & BaseSystemFields<Texpand>
export type ArticlesResponse<Texpand = unknown> = Required<ArticlesRecord> & BaseSystemFields<Texpand>
export type BeneficiariesResponse<Tfamily_members = unknown, Texpand = unknown> = Required<BeneficiariesRecord<Tfamily_members>> & BaseSystemFields<Texpand>
export type BeneficiaryDocumentsResponse<Texpand = unknown> = Required<BeneficiaryDocumentsRecord> & BaseSystemFields<Texpand>
export type BeneficiaryMediaResponse<Texpand = unknown> = Required<BeneficiaryMediaRecord> & BaseSystemFields<Texpand>
export type FamilyMembersResponse<Texpand = unknown> = Required<FamilyMembersRecord> & BaseSystemFields<Texpand>
export type MediaResponse<Texpand = unknown> = Required<MediaRecord> & BaseSystemFields<Texpand>
export type NewsResponse<Texpand = unknown> = Required<NewsRecord> & BaseSystemFields<Texpand>
export type ServiceConsultationsResponse<Texpand = unknown> = Required<ServiceConsultationsRecord> & BaseSystemFields<Texpand>
export type ServicesResponse<Texpand = unknown> = Required<ServicesRecord> & BaseSystemFields<Texpand>
export type SiteSettingsResponse<Texpand = unknown> = Required<SiteSettingsRecord> & BaseSystemFields<Texpand>
export type StaffResponse<Texpand = unknown> = Required<StaffRecord> & AuthSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type VolunteerApplicationsResponse<Tskills = unknown, Texpand = unknown> = Required<VolunteerApplicationsRecord<Tskills>> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	accommodation_records: AccommodationRecordsRecord
	accommodation_units: AccommodationUnitsRecord
	activities: ActivitiesRecord
	articles: ArticlesRecord
	beneficiaries: BeneficiariesRecord
	beneficiary_documents: BeneficiaryDocumentsRecord
	beneficiary_media: BeneficiaryMediaRecord
	family_members: FamilyMembersRecord
	media: MediaRecord
	news: NewsRecord
	service_consultations: ServiceConsultationsRecord
	services: ServicesRecord
	site_settings: SiteSettingsRecord
	staff: StaffRecord
	users: UsersRecord
	volunteer_applications: VolunteerApplicationsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	accommodation_records: AccommodationRecordsResponse
	accommodation_units: AccommodationUnitsResponse
	activities: ActivitiesResponse
	articles: ArticlesResponse
	beneficiaries: BeneficiariesResponse
	beneficiary_documents: BeneficiaryDocumentsResponse
	beneficiary_media: BeneficiaryMediaResponse
	family_members: FamilyMembersResponse
	media: MediaResponse
	news: NewsResponse
	service_consultations: ServiceConsultationsResponse
	services: ServicesResponse
	site_settings: SiteSettingsResponse
	staff: StaffResponse
	users: UsersResponse
	volunteer_applications: VolunteerApplicationsResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
