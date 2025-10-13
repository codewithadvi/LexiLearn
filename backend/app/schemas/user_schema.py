from pydantic import BaseModel, EmailStr, Field

# --- Schema for CREATING a new user (what the user sends during sign-up) ---
class UserCreate(BaseModel):
    email: EmailStr
    
    # This Field validation is the crucial fix that prevents the server crash.
    # It ensures the password is checked BEFORE it ever reaches the hashing function.
    password: str = Field(
        ...,  # The '...' means this field is required.
        min_length=8,
        max_length=72  # This rule prevents the bcrypt ValueError.
    )

# --- Schema for READING a user (what our API sends back) ---
# Notice it does NOT include the password for security.
class User(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

# --- Schema for the JWT token response ---
class Token(BaseModel):
    access_token: str
    token_type: str