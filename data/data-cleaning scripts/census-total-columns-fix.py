import pandas as pd
import numpy as np

path = 'C:/Users/matth/Documents/MCIT/CIS5500/Project/Project-Data/'

# this was done for all census data files
raceEth = pd.read_csv(path + 'race_ethnicity.csv')

#   logic used to fix values in the format (\d+\(r\d+\)) and keep only the leading digits
totalCol = pd.Series(raceEth.get('total')).str.replace('\(r\d+\)', '', regex=True).astype('int64')

raceEth.drop('total', axis=1, inplace=True)
raceEth.insert(1,'total',totalCol)

raceEth.to_csv(path_or_buf=(path+'race_ethnicity.csv'), index=False)