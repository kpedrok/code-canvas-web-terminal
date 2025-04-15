from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..db.database import get_db
from ..db.repository import UserRepository, ProjectRepository, FileRepository
from ..schemas.projects import Project, ProjectCreate, File, FileCreate

router = APIRouter()


@router.get("/users/{user_id}/projects", response_model=List[Project])
def get_user_projects(user_id: str, db: Session = Depends(get_db)):
    """Get all projects for a user"""
    # Check if user exists
    user = UserRepository.get_user(db, user_id)
    if not user:
        # Create user if not exists (for POC simplicity)
        user = UserRepository.create_user(db, user_id)

    return ProjectRepository.get_user_projects(db, user_id)


@router.post(
    "/users/{user_id}/projects",
    response_model=Project,
    status_code=status.HTTP_201_CREATED,
)
def create_project(user_id: str, project: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project for a user"""
    # Check if user exists
    user = UserRepository.get_user(db, user_id)
    if not user:
        # Create user if not exists (for POC simplicity)
        user = UserRepository.create_user(db, user_id)

    return ProjectRepository.create_project(
        db, name=project.name, user_id=user_id, description=project.description
    )


@router.get("/projects/{project_id}", response_model=Project)
def get_project(project_id: str, db: Session = Depends(get_db)):
    """Get project details"""
    project = ProjectRepository.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str, db: Session = Depends(get_db)):
    """Delete a project"""
    result = ProjectRepository.delete_project(db, project_id)
    if not result:
        raise HTTPException(status_code=404, detail="Project not found")
    return None


@router.get("/projects/{project_id}/files", response_model=List[File])
def get_project_files(project_id: str, db: Session = Depends(get_db)):
    """Get all files for a project"""
    # Check if project exists
    project = ProjectRepository.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return FileRepository.get_project_files(db, project_id)


@router.post(
    "/projects/{project_id}/files",
    response_model=File,
    status_code=status.HTTP_201_CREATED,
)
def create_file(project_id: str, file: FileCreate, db: Session = Depends(get_db)):
    """Create a new file for a project"""
    # Check if project exists
    project = ProjectRepository.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check if file with the same path already exists
    existing_file = FileRepository.get_file_by_path(db, project_id, file.path)
    if existing_file:
        raise HTTPException(
            status_code=400, detail="File with this path already exists"
        )

    return FileRepository.create_file(
        db,
        project_id=project_id,
        name=file.name,
        path=file.path,
        content=file.content,
        is_directory=file.is_directory,
    )
