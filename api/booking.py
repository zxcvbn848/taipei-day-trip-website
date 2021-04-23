import sys
sys.path.append("..")

from flask import request, Blueprint, jsonify, session

# TBD
from mysql_connect import selectBooking, insertBooking, deleteBooking
 
appBooking = Blueprint("appBooking", __name__)

@appBooking.route("/booking", methods=["GET"])
def getBooking():
   try:
   # if "email" in session:
      pass
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "自訂的錯誤訊息" })
      
@appBooking.route("/booking", methods=["POST"])
def postBooking():
   try:
      # if "email" in session:
      attractionId = request.form["attractionId"]
      data = request.form["data"]
      time = request.form["time"]
      price = request.form["price"]

      if not (attractionId and data and time and price):
         return jsonify({ "error": True, "message": "建立失敗，輸入不正確或其他原因" })
      
      # insertBooking()
      
      return jsonify({ "ok": True })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "自訂的錯誤訊息" })

@appBooking.route("/booking", methods=["DELETE"])
def deleteBooking():
   try:
   # if "email" in session:
      return jsonify({ "ok": True })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "自訂的錯誤訊息" })

