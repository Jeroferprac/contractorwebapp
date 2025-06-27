from fastapi import APIRouter, HTTPException,Depends
from pydantic import BaseModel, Field, conint, confloat
from datetime import date, datetime
from typing import Annotated
from app.models.quotation import Quotation
from app.schemas.quotation import QuotationCreate, QuotationRead
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()

@router.post("/", response_model=QuotationRead)
def create_quote(q: QuotationCreate,   db: Session = Depends(get_db)):
    if q.deadline < date.today():
        raise HTTPException(400, "Deadline must be in the future")
    db_q = Quotation(**q.dict())
    db.add(db_q)
    db.commit()
    db.refresh(db_q)
    return db_q
            