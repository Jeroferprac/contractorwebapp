from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from typing import Optional, List
from datetime import date
import base64
from sqlalchemy.orm import Session

from app.schemas.quotation import QuotationCreate, QuotationOut, QuotationAttachmentOut
from app.models.quotation import Quotation, QuotationAttachment
from app.api.deps import get_db

router = APIRouter()

MAX_SIZE = 10 * 1024 * 1024
ALLOWED = {"image/jpeg", "image/png", "application/pdf"}

@router.post("/quote", response_model=QuotationOut, status_code=status.HTTP_201_CREATED)
async def create_quotation(
    payload: QuotationCreate = Depends(),
    attachments: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
):
    if payload.deadline < date.today():
        raise HTTPException(status_code=400, detail="Deadline must be in the future")

    quote = Quotation(
        estimated_budget_min=payload.estimated_budget_min,
        estimated_budget_max=payload.estimated_budget_max,
        description=payload.description,
        deadline=payload.deadline,
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)

    saved_attachments = []
    if attachments:
        for file in attachments:
            if file.content_type not in ALLOWED:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")
            content = await file.read()
            if len(content) > MAX_SIZE:
                raise HTTPException(status_code=400, detail=f"'{file.filename}' exceeds 10 MB limit")
            data_b64 = base64.b64encode(content).decode()
            att = QuotationAttachment(
                quotation_id=quote.id,
                filename=file.filename,
                content_type=file.content_type,
                data_b64=data_b64,
            )
            db.add(att)
            saved_attachments.append(att)
        db.commit()

    return QuotationOut(
        id=quote.id,
        estimated_budget_min=quote.estimated_budget_min,
        estimated_budget_max=quote.estimated_budget_max,
        description=quote.description,
        deadline=quote.deadline,
        attachments=[
            QuotationAttachmentOut(
                filename=a.filename,
                content_type=a.content_type,
                data_b64=a.data_b64
            ) for a in saved_attachments
        ]
    )





# from fastapi import APIRouter, HTTPException,Depends
# from pydantic import BaseModel, Field, conint, confloat
# from datetime import date, datetime
# from typing import Annotated
# from app.models.quotation import Quotation
# from app.schemas.quotation import QuotationCreate, QuotationRead
# from sqlalchemy.orm import Session
# from app.core.database import get_db

# router = APIRouter()

# @router.post("/", response_model=QuotationRead)
# def create_quote(q: QuotationCreate,   db: Session = Depends(get_db)):
#     if q.deadline < date.today():
#         raise HTTPException(400, "Deadline must be in the future")
#     db_q = Quotation(**q.dict())
#     db.add(db_q)
#     db.commit()
#     db.refresh(db_q)
#     return db_q
            