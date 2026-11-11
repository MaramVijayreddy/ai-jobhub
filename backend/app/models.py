from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class Company(BaseModel):
    id: Optional[int] = Field(None, description="Primary key")
    name: str = Field(..., max_length=255)
    logo_url: Optional[str] = None
    website: Optional[str] = None

class JobSource(BaseModel):
    id: Optional[int] = Field(None, description="Primary key")
    name: str = Field(..., max_length=255)
    source_url: Optional[str] = None

class Job(BaseModel):
    id: Optional[int] = Field(None, description="Primary key")
    company_id: int = Field(..., description="Foreign key to companies")
    source_id: int = Field(..., description="Foreign key to job_sources")
    title: str = Field(..., max_length=255)
    description: str
    eligibility: Optional[str] = None
    skills: List[str] = []
    experience_years: Optional[int] = None
    location: Optional[str] = None
    work_mode: Optional[str] = None  # e.g., "Remote", "Onsite", "Hybrid"
    employment_type: Optional[str] = None  # e.g., "Full-time", "Part-time", "Internship"
    salary: Optional[str] = None
    posting_date: Optional[date] = None
    apply_url: Optional[str] = None
    published: bool = False

class AdminUser(BaseModel):
    id: Optional[int] = Field(None, description="Primary key")
    email: str = Field(..., max_length=255)
    # Password is stored in Supabase Auth, not in DB
    is_superadmin: bool = False
