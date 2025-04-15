from sqlalchemy.orm import Session
import uuid
import bcrypt
from typing import List, Optional
from . import models


class UserRepository:
    @staticmethod
    def get_user(db: Session, user_id: str):
        return db.query(models.User).filter(models.User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(models.User).filter(models.User.email == email).first()

    @staticmethod
    def create_user(db: Session, name: str, email: str, password: str, username: Optional[str] = None):
        # Hash the password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create a unique ID
        user_id = str(uuid.uuid4())
        
        # Create the user
        db_user = models.User(
            id=user_id, 
            username=username or email.split('@')[0], 
            email=email,
            name=name,
            password_hash=password_hash
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        user = UserRepository.get_user_by_email(db, email)
        if not user:
            return None
        
        # Verify password
        if bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return user
        
        return None


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
