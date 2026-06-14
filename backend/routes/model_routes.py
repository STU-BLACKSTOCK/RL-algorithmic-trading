from fastapi import APIRouter

from backend.services.model_service import (
    ModelService
)

router = APIRouter()

service = ModelService()


@router.get("/model-info")
def get_model_info():

    return service.get_model_info()