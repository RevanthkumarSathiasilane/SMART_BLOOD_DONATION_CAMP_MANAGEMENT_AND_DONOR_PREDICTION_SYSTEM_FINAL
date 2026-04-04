# Run this if you need to retrain the models
import pandas as pd, numpy as np, joblib, os
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans

os.makedirs('models', exist_ok=True)
np.random.seed(42); n=300

df1=pd.DataFrame({'age':np.random.randint(18,65,n),'total_donations':np.random.randint(0,20,n),
    'days_since_last':np.random.randint(0,500,n),'blood_group_enc':np.random.randint(0,8,n),'city_enc':np.random.randint(0,15,n)})
df1['will_return']=((df1['days_since_last']<200)&(df1['total_donations']>2)).astype(int)
m1=RandomForestClassifier(n_estimators=100,random_state=42)
m1.fit(df1.drop('will_return',axis=1),df1['will_return'])
joblib.dump(m1,'models/donor_model.pkl'); print("Donor model saved")

df2=pd.DataFrame({'current_units':np.random.uniform(2,100,n),'daily_usage':np.random.uniform(0.3,8,n),
    'camps_this_month':np.random.randint(0,12,n),'season_enc':np.random.randint(0,4,n)})
df2['units_7d']=(df2['current_units']-(df2['daily_usage']*7)+(df2['camps_this_month']*6)).clip(0,250)
m2=LinearRegression(); m2.fit(df2.drop('units_7d',axis=1),df2['units_7d'])
joblib.dump(m2,'models/stock_model.pkl'); print("Stock model saved")

cities={'Chennai':(13.08,80.27),'Coimbatore':(11.01,76.97),'Madurai':(9.93,78.12),
        'Trichy':(10.80,78.69),'Salem':(11.67,78.15)}
locs=[{'lat':lat+np.random.normal(0,0.2),'lon':lon+np.random.normal(0,0.2),'donor_density':np.random.randint(10,120)}
      for city,(lat,lon) in cities.items() for _ in range(30)]
loc_df=pd.DataFrame(locs)
m3=KMeans(n_clusters=5,random_state=42,n_init=10); m3.fit(loc_df[['lat','lon','donor_density']])
joblib.dump(m3,'models/location_model.pkl'); joblib.dump(loc_df,'models/location_data.pkl')
print("Location model saved - All done!")
