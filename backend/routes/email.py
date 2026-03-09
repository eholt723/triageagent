from fastapi import APIRouter, HTTPException
from models.schemas import SendEmailRequest
from services.gmail import send_email

router = APIRouter()


@router.post("/send")
async def send(request: SendEmailRequest):
    try:
        message_id = send_email(
            to=request.to,
            subject=request.subject,
            body=request.body,
        )
        return {"success": True, "message_id": message_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
