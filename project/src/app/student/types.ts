export interface Class {
  id: string
  name: string
  description: string
  imageUrl: string
  daysOfWeek: string[]
  startTime: string
  endTime: string
  capacity: number
  location: string
  semester: string
  modalityId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  modality: Modality
  classTargetAudiences: ClassTargetAudience[]
}

export interface Modality {
  id: string
  name: string
  description: string
  iconUrl: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface ClassTargetAudience {
  id: string
  classId: string
  targetAudienceId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  targetAudience: TargetAudience
}

export interface TargetAudience {
  id: string
  name: string
  minAge: number
  maxAge: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}
