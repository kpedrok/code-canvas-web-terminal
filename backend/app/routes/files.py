from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..db.repository import FileRepository, ProjectRepository
from ..schemas.projects import File, FileCreate

router = APIRouter()


@router.get("/projects/{project_id}/files", response_model=List[File])
def get_project_files(project_id: str, db: Session = Depends(get_db)):
    """Get all files for a project"""
    # Check if project exists
    project = ProjectRepository.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return FileRepository.get_project_files(db, project_id)


@router.get("/files/{file_id}", response_model=File)
def get_file(file_id: str, db: Session = Depends(get_db)):
    """Get file details"""
    file = FileRepository.get_file(db, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return file


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


@router.put("/files/{file_id}/content", response_model=File)
def update_file_content(file_id: str, content: dict, db: Session = Depends(get_db)):
    """Update file content"""
    file = FileRepository.get_file(db, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    return FileRepository.update_file_content(db, file_id, content.get("content", ""))


@router.put("/files/{file_id}/rename", response_model=File)
def rename_file(file_id: str, name_data: dict, db: Session = Depends(get_db)):
    """Rename a file"""
    file = FileRepository.get_file(db, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    new_name = name_data.get("name", "")
    if not new_name:
        raise HTTPException(status_code=400, detail="Name cannot be empty")

    # Update file path with new name
    path_parts = file.path.split("/")
    path_parts[-1] = new_name
    new_path = "/".join(path_parts)

    # Check if new path already exists
    existing_file = FileRepository.get_file_by_path(db, file.project_id, new_path)
    if existing_file and existing_file.id != file_id:
        raise HTTPException(
            status_code=400,
            detail="File with this name already exists in the same directory",
        )

    # Update file name and path
    return FileRepository.update_file_name_and_path(db, file_id, new_name, new_path)


@router.delete("/files/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(file_id: str, db: Session = Depends(get_db)):
    """Delete a file"""
    file = FileRepository.get_file(db, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    result = FileRepository.delete_file(db, file_id)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to delete file")
    return None
