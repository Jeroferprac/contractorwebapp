from sqlalchemy import Column, String, Float, Date, Integer, Text, ForeignKey
from .base import Base
import uuid
from sqlalchemy.orm import relationship

class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    project_title = Column(String, nullable=False)
    estimated_budget_min = Column(Float, nullable=False)
    estimated_budget_max = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    deadline = Column(Date, nullable=False)

    attachments = relationship("QuotationAttachment", back_populates="quotation")


class QuotationAttachment(Base):
    __tablename__ = "quotation_attachments"

    id = Column(Integer, primary_key=True, index=True)
    quotation_id = Column(String, ForeignKey("quotations.id", ondelete="CASCADE"))
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    data_b64 = Column(Text, nullable=False)

    quotation = relationship("Quotation", back_populates="attachments")