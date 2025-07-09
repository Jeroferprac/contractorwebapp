from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID
from pydantic import BaseModel, HttpUrl, ConfigDict

from app.core.database import get_db
from app.models.contractor import (
    ContractorProfile as ProfileModel,
    Project as ProjectModel,
    ProjectMedia as MediaModel
)
from app.schemas.contractor import (
    ContractorProfile,
    ProjectMediaCreate,
    ContractorProfileCreate,
    ProjectCreate,
    Project
)
from app.api.deps import get_current_contractor

router = APIRouter(prefix="/contractor", tags=["contractor"])

@router.post("/", response_model=ContractorProfile, status_code=status.HTTP_201_CREATED)
def create_contractor_profile(
    payload: ContractorProfileCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    existing = db.query(ProfileModel).filter_by(user_id=user.id).first()
    if existing:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Profile already exists")

    profile = ProfileModel(
        user_id=user.id,
        profile_type="contractor",
        **payload.dict(exclude={"projects", "profile_type"})
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/", response_model=ContractorProfile)
def get_contractor_profile(
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    profile = db.query(ProfileModel).filter_by(user_id=user.id).first()
    if not profile:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")
    return profile

@router.patch("/", response_model=ContractorProfile)
def update_contractor_profile(
    payload: ContractorProfileCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    profile = db.query(ProfileModel).filter_by(user_id=user.id).first()
    if not profile:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

    update_data = payload.dict(exclude_unset=True, exclude={"projects", "profile_type"})
    for k, v in update_data.items():
        setattr(profile, k, v)
    db.commit()
    db.refresh(profile)
    return profile

# --- Project-specific endpoints ---

class ProjectPayload(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    completion_date: Optional[date] = None
    project_value: Optional[float] = None
    status: Optional[str] = "completed"
    media: Optional[List[ProjectMediaCreate]] = []

@router.post("/projects/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    profile = db.query(ProfileModel).filter_by(user_id=user.id).first()
    if not profile:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

    proj = ProjectModel(**payload.dict(exclude={"media"}), contractor_id=profile.id)
    for m in payload.media or []:
        pm = MediaModel(**m.dict())
        proj.media.append(pm)
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj

@router.patch("/projects/{project_id}", response_model=Project)
def update_project(
    project_id: UUID,
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    proj = db.query(ProjectModel).filter_by(id=project_id).join(ProfileModel).filter(ProfileModel.user_id == user.id).first()
    if not proj:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")

    update_data = payload.dict(exclude_unset=True, exclude={"media"})
    for k, v in update_data.items():
        setattr(proj, k, v)
    # Note: nested media sync logic can be added later
    db.commit()
    db.refresh(proj)
    return proj

@router.get(
    "/projects/",
    response_model=List[Project],
    summary="List all projects for the authenticated contractor"
)
def list_contractor_projects(
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    projects = (
        db.query(ProjectModel)
          .join(ProfileModel)
          .filter(ProfileModel.user_id == user.id)
          .options(selectinload(ProjectModel.media))
          .all()
    )
    return projects


@router.get(
    "/projects/{project_id}",
    response_model=Project,
    summary="Get a specific project by ID"
)
def get_contractor_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    proj = (
        db.query(ProjectModel)
          .join(ProfileModel)
          .filter(ProfileModel.user_id == user.id, ProjectModel.id == project_id)
          .options(selectinload(ProjectModel.media))
          .first()
    )
    if not proj:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    return proj
