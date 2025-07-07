from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.contractor import (
    ContractorProfile as CPModel,
    Project as ProjectModel,
    ProjectMedia as MediaModel
)
from app.schemas.contractor import ContractorProfile, ContractorProfileCreate
from app.api.deps import get_current_contractor

router = APIRouter(prefix="/contractor", tags=["contractor"])

@router.post(
    "/",
    response_model=ContractorProfile,
    status_code=status.HTTP_201_CREATED,
    summary="Create a contractor profile with optional initial projects"
)
def create_profile(
    payload: ContractorProfileCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    existing = db.query(CPModel).filter_by(user_id=user.id).first()
    if existing:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Profile already exists")

    cp = CPModel(user_id=user.id, **payload.dict(exclude={"projects"}))
    for proj in payload.projects or []:
        pm = ProjectModel(**proj.dict(exclude={"media"}))
        for m in proj.media or []:
            pm.media.append(MediaModel(**m.dict()))
        cp.projects.append(pm)

    db.add(cp)
    db.commit()
    db.refresh(cp)
    return cp

@router.get(
    "/",
    response_model=ContractorProfile,
    summary="Retrieve the logged-in contractor's profile"
)
def get_profile(
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    cp = db.query(CPModel).filter_by(user_id=user.id).first()
    if not cp:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")
    return cp

@router.patch(
    "/",
    response_model=ContractorProfile,
    summary="Update the contractor profile (excluding nested project/media sync)"
)
def update_profile(
    payload: ContractorProfileCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_contractor)
):
    cp = db.query(CPModel).filter_by(user_id=user.id).first()
    if not cp:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

    update_data = payload.dict(exclude_unset=True, exclude={"projects"})
    for k, v in update_data.items():
        setattr(cp, k, v)

    # TODO: Implement nested project/media update logic here

    db.commit()
    db.refresh(cp)
    return cp
