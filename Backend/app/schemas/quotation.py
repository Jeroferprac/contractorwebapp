from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import date
from typing import List, Annotated

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
    project_title: str
    estimated_budget_min: float
    estimated_budget_max: float
    description: str
    deadline: date
    attachments: List[QuotationAttachmentOut] = []
    # No validators here!
