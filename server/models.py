from typing import List

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

from server.database import Base


class User(Base):
    """
    Represents a user entity with unique fields such as email, hashed password,
    and an activity status. It has a one-to-many relationship with the `Token`
    class, allowing multiple tokens to be associated with each user.

    Attributes:
        __tablename__ (str): Used to specify the name of the table where this
            class's instances will be stored. In this case, it is set to `"users"`,
            indicating that instances of the `User` class will be stored in a
            database table named "users".
        id (Mapped[int]): Mapped to a column named "id" in the table "users". It
            is declared as primary key, indicating that it uniquely identifies
            each row in the table.
        email (Mapped[str]): Mapped to a column named "email" in the "users" table.
            It has two constraints: uniqueness and indexing, ensuring that each
            email address is unique and can be efficiently queried.
        hashed_password (Mapped[str]): Mapped to a column in the "users" table.
            The hashed_password is not unique, does not have an index, and defaults
            to None when no value is provided.
        is_active (Mapped[bool]): Initialized with a default value of True,
            indicating that the user account is active by default.
        token (Mapped[List["Token"]]): Referenced by a relationship with the "Token"
            class, indicating that a user has multiple tokens associated with them,
            and each token belongs to one specific user.

    """
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column()
    is_active: Mapped[bool] = mapped_column(default=True)
    token: Mapped[List["Token"]] = relationship("Token", back_populates="user")


class Token(Base):
    """
    Defines a table for storing authentication tokens in a database, with unique
    access token and type, foreign key referencing the `users.id`, and a relationship
    with the `User` model for bidirectional linking.

    Attributes:
        __tablename__ (str): Set to `"tokens"`, which specifies the name of the
            table in the database that this class represents.
        id (Mapped[int]): Mapped to a column named "id" in the "tokens" table. It
            serves as the primary key for the table, ensuring each token has a
            unique identifier.
        access_token (Mapped[str]): Mapped to a column named "access_token" in the
            "tokens" table, with unique constraint enforced on it.
        token_type (Mapped[str]): Mapped to a column in the "tokens" table. It
            stores a string value without any constraints or defaults.
        user_id (Mapped[int]): Mapped to a column in the database table named
            "tokens". It is a foreign key that references the "id" column in the
            "users" table.
        user (Mapped["User"]): Established through a relationship with the "User"
            class, using the foreign key "id" of the "users" table and populating
            it from the other side ("back_populates").

    """
    __tablename__ = "tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    access_token: Mapped[str] = mapped_column(unique=True)
    token_type: Mapped[str] = mapped_column()

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))  # Added foreign key
    user: Mapped["User"] = relationship("User", back_populates="token")
