from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class Project(ProjectBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class FileBase(BaseModel):
    name: str
    path: str
    is_directory: bool = False
    content: Optional[str] = None


class FileCreate(FileBase):
    pass


class File(FileBase):
    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
