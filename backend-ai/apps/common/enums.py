from enum import Enum


class EnumBaseModel(Enum):
    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class MealTimeChoices(EnumBaseModel):
    BREAKFAST = 'breakfast'
    LUNCH = 'lunch'
    DINNER = 'dinner'

class GenderChoices(EnumBaseModel):
    MALE = 'male'
    FEMALE = 'female'

class GoalChoices(EnumBaseModel):
    WEIGHT_LOSS = "weight_loss"
    MUSCLE_GAIN = "muscle_gain"
    MAINTAIN = "maintain"

class ActivityLevelChoices(EnumBaseModel):
    SEDENTARY = "sedentary"
    LIGHT_ACTIVE = "lightly_active"
    MODERATE_ACTIVE = "moderately_active"
    VERY_ACTIVE = "very_active"
    EXTREMELY_ACTIVE = "extremely_active"


