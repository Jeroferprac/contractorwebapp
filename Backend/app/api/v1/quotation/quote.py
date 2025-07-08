from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException, status, Query
from typing import Annotated, List, Optional
from datetime import date
import base64
from sqlalchemy.orm import Session, joinedload

from app.schemas.quotation import QuotationOut, QuotationAttachmentOut, PaginatedQuotationResponse
from app.models.quotation import Quotation, QuotationAttachment
from app.api.deps import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from sqlalchemy import func

router = APIRouter()

MAX_SIZE = 10 * 1024 * 1024
ALLOWED = {"image/jpeg", "image/png", "application/pdf"}

@router.post("/quote", response_model=QuotationOut, status_code=status.HTTP_201_CREATED)
async def create_quotation(
    project_title: Annotated[str, Form(...)],
    estimated_budget_min: Annotated[float, Form(..., ge=0)],
    estimated_budget_max: Annotated[float, Form(..., ge=0)],
    description: Annotated[str, Form(...)],
    deadline: Annotated[date, Form(...)],
    attachments: List[UploadFile] = File([]),
    db: Session = Depends(get_db),current_user: User = Depends(get_current_active_user),
):
    # Validate deadline and budget logic
    if deadline < date.today():
        raise HTTPException(status_code=400, detail="Deadline must be in the future")
    if estimated_budget_max < estimated_budget_min:
        raise HTTPException(status_code=400, detail="Max must be >= min")
    if estimated_budget_max / (estimated_budget_min or 1) > 10:
        raise HTTPException(status_code=400, detail="Budget range too wide (max/min > 10)")

    # Save the Quotation
    quote = Quotation(
        user_id=current_user.id,
        project_title=project_title,
        estimated_budget_min=estimated_budget_min,
        estimated_budget_max=estimated_budget_max,
        description=description,
        deadline=deadline,
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)

    saved_attachments = []
    if attachments:
        for file in attachments:
            # Content type and size validation
            if file.content_type not in ALLOWED:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
            content = await file.read()
            if len(content) > MAX_SIZE:
                raise HTTPException(status_code=400, detail=f"'{file.filename}' exceeds 10 MB limit")
            encoded = base64.b64encode(content).decode()
            att = QuotationAttachment(
                quotation_id=quote.id,
                filename=file.filename,
                content_type=file.content_type,
                base64=encoded,
            )
            db.add(att)
            saved_attachments.append(att)
        db.commit()

    # Return all required fields for QuotationOut
    return QuotationOut(
        id=str(quote.id),
        user_id=str(quote.user_id),
        project_title=quote.project_title,
        estimated_budget_min=quote.estimated_budget_min,
        estimated_budget_max=quote.estimated_budget_max,
        description=quote.description,
        deadline=quote.deadline,
        created_at=quote.created_at, 
        attachments=[
            QuotationAttachmentOut(
                filename=a.filename,
                content_type=a.content_type,
                base64=a.base64
            ) for a in saved_attachments
        ]
    )

      ### Pagination route

@router.get("/quotes", response_model=PaginatedQuotationResponse,tags=["quotation"],summary="Get my submitted quotations (paginated)")
def list_my_quotations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
     # Total count
        total = db.query(func.count(Quotation.id))\
              .filter(Quotation.user_id == current_user.id)\
              .scalar()
     # Paginated fetch
        quotes = (
        db.query(Quotation)
          .options(joinedload(Quotation.attachments))
          .filter(Quotation.user_id == current_user.id)
          .order_by(Quotation.created_at.desc())
          .limit(limit)
          .offset(offset)
          .all()
        )
        items = [
    {
        "id": str(q.id),
        "user_id": str(q.user_id) if q.user_id is not None else None,
        "project_title": q.project_title,
        "estimated_budget_min": q.estimated_budget_min,
        "estimated_budget_max": q.estimated_budget_max,
        "description": q.description,
        "deadline": q.deadline,
        "created_at": q.created_at,
        "attachments": [
            {
                "filename": a.filename,
                "content_type": a.content_type,
                "base64": a.base64
            }
            for a in q.attachments
        ],
    }
    for q in quotes
]
        return PaginatedQuotationResponse(
        total=total,
        items=items,
        limit=limit,
        offset=offset,
    )

