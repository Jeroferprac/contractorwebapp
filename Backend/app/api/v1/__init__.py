from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .quotation.quote import router as quotation_router
from .contractor import router as contractor_router
from .company import router as company_router
from .inventory import router as inventory_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(quotation_router, prefix="/quotation", tags=["quotation"])
api_router.include_router(contractor_router, prefix="/contractor", tags=["contractor"])
api_router.include_router(company_router, prefix="/company", tags=["company"])
api_router.include_router(inventory_router, prefix="/inventory", tags=["inventory"])
