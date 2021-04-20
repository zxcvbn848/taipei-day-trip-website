import mysql.connector
from dotenv import load_dotenv
import os
import json

load_dotenv()

websiteDB = mysql.connector.connect(
   host = os.getenv("SERVER_HOST"),
   port = os.getenv("SERVER_PORT"),
   user = os.getenv("SERVER_USER"),
   password = os.getenv("SERVER_PASSWORD"),
   database = "taipei",
   charset = "utf8"
)

webCursor = websiteDB.cursor()

def selectAttractions(**kwargs):
   attractionsDataList = []
   try:
      pageStart = kwargs["page"] * 12
      pageInterval = 12 

      sql_cmd = """
               SELECT * 
               FROM attractions 
               LIMIT %s, %s
               """
      value = (pageStart, pageInterval)

      if kwargs["keyword"]:
         sql_cmd = """
               SELECT * 
               FROM attractions 
               WHERE name REGEXP %s
               LIMIT %s, %s
               """
         value = (kwargs["keyword"], pageStart, pageInterval)

      webCursor.execute(sql_cmd, value)

      webResults = webCursor.fetchall()
      if webResults:
         for webResult in webResults:
            attractionsData = dict(zip(webCursor.column_names, webResult))
            attractionsData["images_url"] = json.loads(attractionsData["images_url"])
            attractionsDataList.append(attractionsData)
         # print(attractionsDataList)
         return attractionsDataList
      else:
         return None
   except Exception as e:
      print(e)
      return None

# selectAttractions()

def selectAttraction(attractionId):
   try:
      sql_cmd = f"""
               SELECT *
               FROM attractions
               WHERE id = { attractionId }
               """

      webCursor.execute(sql_cmd)

      webResult = webCursor.fetchone()

      if webResult:
         attractionData = dict(zip(webCursor.column_names, webResult))
         attractionData["images_url"] = json.loads(attractionData["images_url"])
         return attractionData
      else:
         return None
   except Exception as e:
      print(e)
      return None
