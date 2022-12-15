# %%
import pandas as pd
import numpy as np

path = 'C:/Users/matth/Documents/MCIT/CIS5500/Project/Project-Data/'

#   This function takes a string geo_id and if it is of length 10,
#   prefixes it with a 0. Ensures all geo_id values are of length 11
def fix_size(id):
    if len(id) == 10:
        return '0' + id
    return id

#   Race and Ethnicity Dataset
#    -fix geo_id column
raceEth = pd.read_csv(path + 'race_ethnicity.csv')
raceEthGeoId = pd.Series(raceEth.get('geo_id')).astype('string')
raceEthGeoId = raceEthGeoId.apply(lambda x: fix_size(x))
raceEth.drop('geo_id', axis=1, inplace=True)
raceEth.insert(0, 'geo_id', raceEthGeoId)
raceEth.to_csv(path + 'race_ethnicity.csv', index=False)

#   Household Size Dataset
#   -fix geo_id column
householdSize = pd.read_csv(path + 'household_size.csv')
householdSizeGeoId = pd.Series(householdSize.get('geo_id')).astype('string')
householdSizeGeoId = householdSizeGeoId.apply(lambda x: fix_size(x))
householdSize.drop('geo_id', axis=1, inplace=True)
householdSize.insert(0, 'geo_id', householdSizeGeoId)
householdSize.to_csv(path + 'household_size.csv', index=False)

#   Median Income Dataset
#   -fix geo_id column
income = pd.read_csv(path + 'income.csv')
incomeGeoId = pd.Series(income.get('geo_id')).astype('string')
incomeGeoId = incomeGeoId.apply(lambda x: fix_size(x))
income.drop('geo_id', axis=1, inplace=True)
income.insert(0, 'geo_id', incomeGeoId)
income.to_csv(path + 'income.csv', index=False)

#   Age and Sex Dataset
#   -fix geo_id column
ageSex = pd.read_csv(path + 'age_sex.csv')
ageSexGeoId = pd.Series(ageSex.get('geo_id')).astype('string')
ageSexGeoId = ageSexGeoId.apply(lambda x: fix_size(x))
ageSex.drop('geo_id', axis=1, inplace=True)
ageSex.insert(0, 'geo_id', ageSexGeoId)
ageSex.to_csv(path + 'age_sex.csv', index=False)

#   Food Assistance Dataset
#   -fix geo_id column
foodAssistance = pd.read_csv(path + 'food_assistance.csv')
foodAssistanceGeoId = pd.Series(foodAssistance.get('geo_id')).astype('string')
foodAssistanceGeoId = foodAssistanceGeoId.apply(lambda x: fix_size(x))
foodAssistance.drop('geo_id', axis=1, inplace=True)
foodAssistance.insert(0, 'geo_id', foodAssistanceGeoId)
foodAssistance.to_csv(path + 'food_assistance.csv', index=False)

#   Food Deserts Dataset
#   -Rename columns
#   -fix geo_id column
foodDeserts = pd.read_csv(path + 'food_deserts.csv')
foodDeserts.rename(columns={'CensusTract':'geo_id', 'Urban':'urban', 'Population':'population','HousingUnits':'housing_units','NoCarHalfMile':'no_car_half_mile','NoCar1Mile':'no_car_1_mile', 'NoCar10Mile':'no_car_10_mile','NoCar20Mile':'no_car_20_mile'}, inplace=True)
foodDesertsGeoId = pd.Series(foodDeserts.get('geo_id')).astype('string')
foodDesertsGeoId = foodDesertsGeoId.apply(lambda x: fix_size(x))
foodDeserts.drop('geo_id', axis=1, inplace=True)
foodDeserts.insert(0, 'geo_id', foodDesertsGeoId)
foodDeserts.to_csv(path_or_buf=(path + 'food_deserts.csv'), index=False)


