from sqlalchemy import Column, String, Boolean, DECIMAL, Integer, ForeignKey, Date, JSON, Text,DateTime, func
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
import uuid
from .base import Base
from app.core.types import HttpUrlType

class ContractorProfile(Base):
    __tablename__ = "contractor_profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(255), nullable=False)
    business_license = Column(String(255))
    description = Column(Text)
    website_url = Column(HttpUrlType, nullable=True)
    services = Column(ARRAY(Text))
    location = Column(JSON)
    verified = Column(Boolean, default=False)
    rating = Column(DECIMAL(3,2), default=0.00)
    total_reviews = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    contractor = relationship("User", back_populates="contractorprofile")
    projects = relationship("Project", back_populates="contractor", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contractor_id = Column(UUID(as_uuid=True), ForeignKey("contractor_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    location = Column(Text)
    completion_date = Column(Date)
    project_value = Column(DECIMAL(12,2))
    status = Column(String(20), default="completed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    media = relationship("ProjectMedia", back_populates="project", cascade="all, delete-orphan")
    contractor = relationship("ContractorProfile", back_populates="projects")

class ProjectMedia(Base):
    __tablename__ = "project_media"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    media_type = Column(String(20))
    media_data = Column(Text, nullable=False)
    media_mimetype = Column(String(100), nullable=False)
    file_size = Column(Integer)
    caption = Column(Text)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    project = relationship("Project", back_populates="media")