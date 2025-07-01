from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict
from datetime import date,  datetime
from typing import List, Annotated
from uuid import UUID

class QuotationAttachmentOut(BaseModel):
    filename: str
    content_type: str
    base64: str

class QuotationCreate(BaseModel):
    project_title: str = Field(..., min_length=1, max_length=200)
    estimated_budget_min: Annotated[float, Field(ge=0)]
    estimated_budget_max: Annotated[float, Field(ge=0)]
    description: str = Field(..., min_length=1, max_length=2000)
    deadline: date

    @field_validator("estimated_budget_max")
    @classmethod
    def validate_max_ge_min(cls, v, info):
        min_val = info.data.get("estimated_budget_min")
        if min_val is not None and v < min_val:
            raise ValueError("estimated_budget_max must be >= estimated_budget_min")
        return v

    @field_validator("deadline")
    @classmethod
    def validate_deadline_future(cls, v: date):
        if v < date.today():
            raise ValueError("deadline must be in the future")
        return v

    @model_validator(mode="after")
    @classmethod
    def validate_budget_ratio(cls, values):
        # In this context values is a dict, so .get works fine
        min_b = values.get("estimated_budget_min")
        max_b = values.get("estimated_budget_max")
        if min_b is not None and max_b is not None and max_b / (min_b or 1) > 10:
            raise ValueError("Budget range too wide (max/min > 10)")
        return values
    
class QuotationOut(BaseModel):
    id: str
    user_id: UUID | str                 
    project_title: str
    estimated_budget_min: float
    estimated_budget_max: float
    description: str
    deadline: date
    ##created_at: datetime       # Add this for ordering/pagination
    created_at: datetime = Field(default_factory=datetime.now)
    attachments: List[QuotationAttachmentOut] = []
    model_config = ConfigDict(from_attributes=True)

        #class Config:
        #orm_mode = True

class PaginatedQuotationResponse(BaseModel):
    total: int
    items: List[QuotationOut]
    limit: int
    offset: int
