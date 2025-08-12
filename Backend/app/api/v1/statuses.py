from fastapi import APIRouter
from typing import List
from app.schemas.statuses import (
    SerialStatus, SalesStatus, ShippingStatus, TransferStatus, AllStatuses
)

router = APIRouter(prefix="/statuses", tags=["statuses"])

@router.get("/", response_model=AllStatuses)
async def get_all_statuses():
    return AllStatuses(
        serial=[status.value for status in SerialStatus],
        sales=[status.value for status in SalesStatus],
        shipping=[status.value for status in ShippingStatus],
        transfer=[status.value for status in TransferStatus],
    )
