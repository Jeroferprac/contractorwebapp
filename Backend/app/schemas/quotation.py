
from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import date

class QuotationCreate(BaseModel):
    project_title: str = Field(..., min_length=1, max_length=200)
    estimated_budget_min: float = Field(..., ge=0, description="Minimum budget, ≥ 0")
    estimated_budget_max: float = Field(..., ge=0, description="Maximum budget, ≥ 0")
    description: str = Field(..., min_length=1, max_length=2000)
    deadline: date = Field(..., description="Deadline date; must be in the future")

    @field_validator("estimated_budget_max")
    def max_gte_min(cls, v, info):
        min_val = info.data.get("estimated_budget_min")
        if min_val is not None and v < min_val:
            raise ValueError("estimated_budget_max must be >= estimated_budget_min")
        return v

    @field_validator("deadline")
    def deadline_future(cls, v: date):
        if v < date.today():
            raise ValueError("deadline must be in the future")
        return v

    @model_validator(mode="after")
    def check_budget_and_deadline(cls, values):
        # Example of cross-field logic — e.g., budget spread no more than 10x
        min_budget = values.estimated_budget_min
        max_budget = values.estimated_budget_max
        if max_budget and min_budget and max_budget / (min_budget or 1) > 10:
            raise ValueError("Budget range too wide (max/min > 10)")
        return values

class QuotationRead(QuotationCreate):
    id: str
