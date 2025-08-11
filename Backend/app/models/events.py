from datetime import date
from sqlalchemy import event,inspect
from sqlalchemy.orm import Session
from app.models.inventory import Product, Sale
from app.models.shipping import Shipment
from app.models.notification import Notification
from app.models.user import User
from app.CRUD.notification import notify_admins

# @event.listens_for(Session, "after_flush")
# def notify_events(session, flush_context):
@event.listens_for(Session, "before_flush")
def notify_events(session, flush_context, instances):
    # 1. Low stock & reorder: When a Sale is created
    for obj in session.new:
        if isinstance(obj, Sale):
            for item in obj.items:
                product = session.get(Product, item.product_id)
                if product.current_stock <= product.min_stock_level:
                    notify_admins(
                        db=session,
                        notif_type="low_stock",
                        title=f"Low Stock: {product.name}",
                        message=f"Only {product.current_stock} left for {product.name}.",
                        reference_id=product.id,
                        reference_type="product"
                    )
                if product.current_stock <= product.reorder_point:
                    notify_admins(
                        db=session,
                        notif_type="reorder",
                        title=f"Reorder Needed: {product.name}",
                        message=f"{product.name} stock is low; please reorder.",
                        reference_id=product.id,
                        reference_type="product"
                    )

    # 2. Shipment notifications
    for obj in session.new.union(session.dirty):
        if isinstance(obj, Shipment):
            history = inspect(obj).attrs.status.history
            if history.has_changes() and obj.status == "shipped":
                if obj.sale:  # Safely check sale relationship
                    notify_admins(
                        db=session,
                        notif_type="shipment",
                        title=f"Shipment Sent for Sale {obj.sale.sale_number}",
                        message=(
                            f"Shipment {obj.tracking_number} via {obj.carrier_name} has been shipped."
                        ),
                        reference_id=obj.id,
                        reference_type="shipment"
                    )

    # 3. Payment due notifications
    for obj in session.new.union(session.dirty):
        if isinstance(obj, Sale):
            if obj.due_date and obj.due_date <= date.today() and obj.payment_status.value != "paid":
                notify_admins(
                    db=session,
                    notif_type="payment_due",
                    title=f"Payment Due for Sale {obj.sale_number}",
                    message=f"Payment for sale {obj.sale_number} is due on {obj.due_date}.",
                    reference_id=obj.id,
                    reference_type="sale"
                )
