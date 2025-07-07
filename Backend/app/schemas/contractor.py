from pydantic import BaseModel, HttpUrl, ConfigDict
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime
from enum import Enum

class ProjectMediaBase(BaseModel):
    media_type: str
    media_data: str
    media_mimetype: str
    caption: Optional[str] = None
    display_order: Optional[int] = 0

class ProjectMediaCreate(ProjectMediaBase):
    pass

class ProjectMedia(ProjectMediaBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    completion_date: Optional[date] = None
    project_value: Optional[float] = None
    status: Optional[str] = "completed"

class ProjectCreate(ProjectBase):
    media: Optional[List[ProjectMediaCreate]] = []

class Project(ProjectBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    media: List[ProjectMedia] = []

    model_config = ConfigDict(from_attributes=True)

class ProfileType(str, Enum):
    contractor = "contractor"
    company = "company"

class ContractorProfileBase(BaseModel):
    company_name: str
    profile_type: ProfileType
    business_license: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[HttpUrl] = None
    services: Optional[List[str]] = None
    location: Optional[dict] = None
    verified: bool = False
    rating: float = 0.0
    total_reviews: int = 0

class ContractorProfileCreate(ContractorProfileBase):
    projects: Optional[List[ProjectCreate]] = []

class ContractorProfile(ContractorProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    projects: List[Project] = []

    model_config = ConfigDict(from_attributes=True)