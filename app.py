from flask import Flask, Blueprint, render_template, session
from datetime import timedelta
import os

from mysql_connect import selectAttractions, selectAttraction

from api.attraction import appAttraction
from api.user import appUser
from api.booking import appBooking
from api.order import appOrder

app=Flask(__name__)
app.register_blueprint(appAttraction, url_prefix="/api")
app.register_blueprint(appUser, url_prefix="/api")
app.register_blueprint(appBooking, url_prefix="/api")
app.register_blueprint(appOrder, url_prefix="/api")

app.config["JSON_SORT_KEYS"] = False
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

app.config["SECRET_KEY"] = os.urandom(24)
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days = 1)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

# Signin-up
@app.route("/signin")
def signin():
	pass

@app.route("/signup")
def signup():
	pass

if __name__ == "__main__":
	app.config['TEMPLATES_AUTO_RELOAD'] = True
	app.run(host="0.0.0.0", port=3000)