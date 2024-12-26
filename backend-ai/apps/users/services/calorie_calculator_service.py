
class CalorieCalculatorService:
    
    def __init__(self, height, weight, age, activity, gender, goal):
        self.height = height
        self.weight = weight
        self.age = age
        self.activity = activity
        self.gender = gender
        self.goal = goal

    def calculate(self):
        calories = self.calculate_calories()
        macros = self.calculate_macros(calorie_needed=calories)
        percentage = self.get_nutrition_percentage
        data = {
            'calories': calories,
            'macros': macros,
            'percentage': percentage,
        }
        return data

    def calculate_calories(self):
        if self.gender == 'male':
            bmr = 10 * float(self.weight) + 6.25 * float(self.height) - 5 * self.age + 5
        else:
            bmr = 10 * float(self.weight) + 6.25 * float(self.height) - 5 * self.age - 161
        
        activity_factors = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extremely_active': 1.9
        } 
        tdee = bmr * activity_factors[self.activity.lower()]
        
        if self.goal == 'weight_loss':
            calories_needed = tdee * 0.80
        elif self.goal == "maintain":
            calories_needed = tdee
        elif self.goal == "muscle_gain":
            calories_needed = tdee * 1.10
        return round(calories_needed)
    
    @property
    def get_nutrition_percentage(self):
        data = {
            "protein": self.get_nutiriton_ratio['protein_ratio'] * 100,
            "carb": self.get_nutiriton_ratio['carb_ratio'] * 100,
            "fat": self.get_nutiriton_ratio['fat_ratio'] * 100,
        }
        return data

    @property
    def get_nutiriton_ratio(self):
        if self.goal == 'weight_loss':
            data = {
                "protein_ratio": 0.4,
                "carb_ratio": 0.3,
                "fat_ratio": 0.3
            }
        elif self.goal == 'maintain':
            data = {
                "protein_ratio": 0.3,
                "carb_ratio": 0.45,
                "fat_ratio": 0.25,
            }
        elif self.goal == 'muscle_gain':
            data = {
                "protein_ratio": 0.2,
                "carb_ratio": 0.55,
                "fat_ratio": 0.25,
            }
        return data

    
    def calculate_macros(self, calorie_needed): 
        nutrition_ratio = self.get_nutiriton_ratio
        protein = (calorie_needed * nutrition_ratio['protein_ratio']) / 4
        carb = (calorie_needed * nutrition_ratio['carb_ratio']) / 4
        fat = (calorie_needed * nutrition_ratio['fat_ratio']) / 9
        data = {
            "protein": round(protein),
            "carb": round(carb),
            "fat": round(fat),
        }
        return data

    

    

