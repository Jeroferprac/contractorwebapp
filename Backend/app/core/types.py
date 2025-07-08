from sqlalchemy.types import TypeDecorator, String
from pydantic import HttpUrl

class HttpUrlType(TypeDecorator):
    impl = String(2083)
    cache_ok = True
    python_type = HttpUrl

    def process_bind_param(self, value, dialect) -> str:
        return str(value) if value is not None else None

    def process_result_value(self, value, dialect) -> HttpUrl:
        return HttpUrl(value) if value is not None else None

    def process_literal_param(self, value, dialect) -> str:
        return str(value) if value is not None else None
