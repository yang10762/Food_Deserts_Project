import pandas as pd
import numpy as np

pd.options.display.max_columns = None
pd.options.display.max_rows = None

def main():
    file_name = "./archive/FoodDeserts.csv"
    df = pd.read_csv(file_name)
    print("Number of rows: {}".format(df.shape[0]))

    keep_columns = [0, 3, 4, 5, 53, 79, 105, 131]

    new_df = df.iloc[:, keep_columns]


    print("Number of rows: {}".format(new_df.shape[0]))

    new_df.columns = ['GeoId', 'Urban', 'Population', 'HousingUnits', 'NoCarHalfMile', 'NoCar1Mile', 'NoCar10Miles', 'NoCar20Miles']

    new_df.to_csv('cleaned.csv', index=False)


if __name__ == "__main__":
    main()