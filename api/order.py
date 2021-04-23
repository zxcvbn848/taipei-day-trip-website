import sys
sys.path.append("..")

from flask import request, Blueprint, jsonify
from mysql_connect import selectAttractions, selectAttraction
 
appOrder = Blueprint("appOrder", __name__)

@appOrder.route("/orders", methods=["POST"])
def postOrders():
   pass

@appOrder.route("/order/<string:number>", methods=["GET"])
def getOrder(number):
   pass

