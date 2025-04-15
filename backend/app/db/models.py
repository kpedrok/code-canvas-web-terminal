from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    username = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="projects")
    files = relationship("File", back_populates="project", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name}, user_id={self.user_id})>"


class File(Base):
    __tablename__ = "files"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    path = Column(String, nullable=False)
    is_directory = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    
    # Relationships
    project = relationship("Project", back_populates="files")
    
    def __repr__(self):
        return f"<File(id={self.id}, path={self.path}, project_id={self.project_id})>"