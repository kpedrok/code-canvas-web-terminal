import os
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.auth import get_current_user
from ..db.database import get_db
from ..db.models import User
from ..db.repository import ProjectRepository
from ..schemas.projects import Project, ProjectCreate

router = APIRouter()

# Get the data directory from the main app
DATA_DIR = os.environ.get("DATA_DIR") or os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "persistent_data/users",
)


# Projects endpoints with authentication
@router.get("/projects", response_model=List[Project])
async def get_user_projects(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get all projects for the current authenticated user"""
    return ProjectRepository.get_user_projects(db, current_user.id)


@router.post("/projects", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new project for the current authenticated user"""
    # Create project in database
    created_project = ProjectRepository.create_project(
        db, name=project.name, user_id=current_user.id, description=project.description
    )

    # Create project directory if it doesn't exist
    user_project_dir = os.path.join(DATA_DIR, current_user.id, created_project.id)
    os.makedirs(user_project_dir, exist_ok=True)

    return created_project


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get project details for the current authenticated user"""
    project = ProjectRepository.get_project(db, project_id)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check if the project belongs to the current user
    if project.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this project"
        )

    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a project for the current authenticated user"""
    # First check if project exists and belongs to user
    project = ProjectRepository.get_project(db, project_id)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this project"
        )

    # Delete the project
    ProjectRepository.delete_project(db, project_id)

    # For POC we'll keep files on disk as backup
    # In production you might want to delete them as well
