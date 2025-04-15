from sqlalchemy.orm import Session
import uuid
from typing import List, Optional
from . import models


class UserRepository:
    @staticmethod
    def get_user(db: Session, user_id: str):
        return db.query(models.User).filter(models.User.id == user_id).first()

    @staticmethod
    def create_user(db: Session, user_id: str, username: Optional[str] = None):
        db_user = models.User(id=user_id, username=username)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user


class ProjectRepository:
    @staticmethod
    def get_project(db: Session, project_id: str):
        return db.query(models.Project).filter(models.Project.id == project_id).first()

    @staticmethod
    def get_user_projects(db: Session, user_id: str):
        return db.query(models.Project).filter(models.Project.user_id == user_id).all()

    @staticmethod
    def create_project(
        db: Session, name: str, user_id: str, description: Optional[str] = None
    ):
        project_id = str(uuid.uuid4())
        db_project = models.Project(
            id=project_id, name=name, description=description, user_id=user_id
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def delete_project(db: Session, project_id: str):
        project = (
            db.query(models.Project).filter(models.Project.id == project_id).first()
        )
        if project:
            db.delete(project)
            db.commit()
            return True
        return False


class FileRepository:
    @staticmethod
    def get_project_files(db: Session, project_id: str):
        return db.query(models.File).filter(models.File.project_id == project_id).all()

    @staticmethod
    def get_file(db: Session, file_id: str):
        return db.query(models.File).filter(models.File.id == file_id).first()

    @staticmethod
    def get_file_by_path(db: Session, project_id: str, path: str):
        return (
            db.query(models.File)
            .filter(models.File.project_id == project_id, models.File.path == path)
            .first()
        )

    @staticmethod
    def create_file(
        db: Session,
        project_id: str,
        name: str,
        path: str,
        content: Optional[str] = None,
        is_directory: bool = False,
    ):
        file_id = str(uuid.uuid4())
        db_file = models.File(
            id=file_id,
            name=name,
            path=path,
            content=content,
            is_directory=is_directory,
            project_id=project_id,
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        return db_file

    @staticmethod
    def update_file_content(db: Session, file_id: str, content: str):
        db_file = db.query(models.File).filter(models.File.id == file_id).first()
        if db_file:
            db_file.content = content
            db.commit()
            db.refresh(db_file)
            return db_file
        return None

    @staticmethod
    def delete_file(db: Session, file_id: str):
        db_file = db.query(models.File).filter(models.File.id == file_id).first()
        if db_file:
            db.delete(db_file)
            db.commit()
            return True
        return False

    @staticmethod
    def update_file_name_and_path(db: Session, file_id: str, new_name: str, new_path: str):
        db_file = db.query(models.File).filter(models.File.id == file_id).first()
        if db_file:
            db_file.name = new_name
            db_file.path = new_path
            db.commit()
            db.refresh(db_file)
            return db_file
        return None
