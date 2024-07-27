from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.post("/users/", response_model=schemas.User, tags=['users'])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@router.get("/users/", response_model=list[schemas.User], tags=['users'])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users
