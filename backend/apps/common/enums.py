from enum import Enum


class EnumBaseModel(Enum):
    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
