from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from typing import Optional, List
from app.core.database import get_db
from app.models.contractor import (
    ContractorProfile as ProfileModel,
    Project as ProjectModel,
    ProjectMedia as MediaModel
)
from app.schemas.contractor import (
    ContractorProfile,
    ContractorProfileCreate,
    ProjectCreate,
    Project
)
from app.api.deps import get_current_company

router = APIRouter(prefix="/company", tags=["company"])

# — Profile endpoints only —
@router.post("/", response_model=ContractorProfile, status_code=status.HTTP_201_CREATED)
def create_company_profile(
    payload: ContractorProfileCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_company)
):
    existing = db.query(ProfileModel).filter_by(user_id=user.id).first()
    if existing:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Profile already exists")
    profile = ProfileModel(
        user_id=user.id,
        profile_type="company",
        **payload.dict(exclude={"projects", "profile_type"})
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/", response_model=ContractorProfile)
def get_company_profile(
    db: Session = Depends(get_db),
    user=Depends(get_current_company)
):
    profile = db.query(ProfileModel).filter_by(user_id=user.id).first()
    if not profile:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")
    return profile

@router.patch("/", response_model=ContractorProfile)
def update_company_profile(
    payload: ContractorProfileCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_company)
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

# — Project-specific endpoints only —
@router.post("/projects/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_company_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_company)
):
    profile = db.query(ProfileModel).filter_by(user_id=user.id).first()
    if not profile:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Company profile not found")
    proj = ProjectModel(**payload.dict(exclude={"media"}))
    for m in payload.media or []:
        proj.media.append(MediaModel(**m.dict()))
    profile.projects.append(proj)
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj

@router.get(
    "/projects/",
    response_model=List[Project],
    summary="List all projects for the authenticated company"
)
def list_company_projects(
    db: Session = Depends(get_db),
    user=Depends(get_current_company),
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
def get_company_project(
    project_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_company),
):
    proj = (
        db.query(ProjectModel)
        .join(ProfileModel)
        .filter(
            ProfileModel.user_id == user.id,
            ProjectModel.id == project_id,
        )
        .options(selectinload(ProjectModel.media))
        .first()
    )
    if not proj:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    return proj


@router.patch("/projects/{project_id}", response_model=Project)
def update_company_project(
    project_id: str,
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_company)
):
    proj = (
        db.query(ProjectModel)
        .join(ProfileModel)
        .filter(ProfileModel.user_id == user.id, ProjectModel.id == project_id)
        .first()
    )
    if not proj:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    update_data = payload.dict(exclude_unset=True, exclude={"media"})
    for k, v in update_data.items():
        setattr(proj, k, v)
    # media sync optional
    db.commit()
    db.refresh(proj)
    return proj




# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.models.contractor import ContractorProfile as ProfileModel, Project as ProjectModel, ProjectMedia
# from app.schemas.contractor import ContractorProfile, ContractorProfileCreate
# from app.api.deps import get_current_company

# router = APIRouter(prefix="/company", tags=["company"])

# @router.post("/", response_model=ContractorProfile, status_code=status.HTTP_201_CREATED)
# def create_company_profile(
#     payload: ContractorProfileCreate,
#     db: Session = Depends(get_db),
#     user=Depends(get_current_company)
# ):
#     existing = db.query(ProfileModel).filter_by(user_id=user.id).first()
#     if existing:
#         raise HTTPException(status.HTTP_400_BAD_REQUEST, "Profile exists")

#     profile = ProfileModel(
#         user_id=user.id,
#         profile_type="company",
#         **payload.dict(exclude={"projects", "profile_type"})
#     )
#     for proj in payload.projects or []:
#         pm = ProjectModel(**proj.dict(exclude={"media"}))
#         for m in proj.media or []:
#             pm.media.append(ProjectMedia(**m.dict()))
#         profile.projects.append(pm)

#     db.add(profile)
#     db.commit()
#     db.refresh(profile)
#     return profile

# @router.get("/", response_model=ContractorProfile)
# def get_company_profile(
#     db: Session = Depends(get_db),
#     user=Depends(get_current_company)
# ):
#     profile = db.query(ProfileModel).filter_by(user_id=user.id).first()
#     if not profile:
#         raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")
#     return profile

# @router.patch(
#     "/",
#     response_model=ContractorProfile,
#     summary="Update the company's profile"
# )
# def update_company_profile(
#     payload: ContractorProfileCreate,
#     db: Session = Depends(get_db),
#     user=Depends(get_current_company)
# ):
#     profile = db.query(ProfileModel).filter_by(user_id=user.id).first()
#     if not profile:
#         raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

#     update_data = payload.dict(exclude_unset=True, exclude={"projects", "profile_type"})
#     for k, v in update_data.items():
#         setattr(profile, k, v)

#     # Optional: add logic for nested projects/media if needed

#     db.commit()
#     db.refresh(profile)
#     return profile

