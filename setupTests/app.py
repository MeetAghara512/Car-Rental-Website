from flask import Flask, request, jsonify, session
from flask_cors import CORS
import pymysql.cursors
import re
from datetime import datetime
app = Flask(__name__)
CORS(app, resources={
    r"/signup": {"origins": "http://localhost:3000"},
    r"/login": {"origins": "http://localhost:3000"},
    r"/sell-car": {"origins": "http://localhost:3000"},
    r"/submit": {"origins": "http://localhost:3000"},
    r"/get-token-email": {"origins": "http://localhost:3000"},
    r"/get-sell-car-data": {"origins": "http://localhost:3000"},
    r"/submit_car": {"origins": "http://localhost:3000"},
    r"/add-transaction": {"origins": "http://localhost:3000"},
    r"/user-transactions": {"origins": "http://localhost:3000"},
    r"/get-account-data": {"origins": "http://localhost:3000"},
    r"/profile-data": {"origins": "http://localhost:3000"},
    r"/check-login-status": {"origins": "http://localhost:3000"},
    r"/get-user-details": {"origins": "http://localhost:3000"},
    r"/get-user-car-details": {"origins": "http://localhost:3000"},
    r"/get-transaction-data": {"origins": "http://localhost:3000"},
    r"/sell-car-data-tokens": {"origins": "http://localhost:3000"},
    r"/remove_sell_car_data": {"origins": "http://localhost:3000"},
})


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Abhay@123'
app.config['MYSQL_DB'] = 'car_rental'

mysql = pymysql.connect(
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    db=app.config['MYSQL_DB'],
    cursorclass=pymysql.cursors.DictCursor
)


SECRET_KEY = "your_secret_key_here"

@app.route('/signup', methods=['POST'])
def signup():
    try:
        
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        phone_number = data.get('phone_number')
        email = data.get('email')
        password = data.get('password')

        if not first_name or not last_name or not email or not password:
            return jsonify({'success': False, 'message': 'Please fill out all required fields.'}), 400
        

        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            return jsonify({'success': False, 'message': 'Invalid email address.'}), 400

        cursor = mysql.cursor()
        cursor.execute('INSERT INTO users (first_name, last_name, phone_number, email, password) VALUES (%s, %s, %s, %s, %s)', 
                       (first_name, last_name, phone_number, email, password,))
        mysql.commit()

        return jsonify({'success': True, 'message': 'User registered successfully.'}), 200
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'}), 500

@app.route('/sell-car', methods=['POST'])
def sell_car():
    try:
        car_data = request.json

        cursor = mysql.cursor()


        sql = """
            INSERT INTO sell_car_data (first_name, last_name, phone, email, car_brand, car_model, car_number_plate, car_fuel, car_gear, price, country, state, district)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(sql, (
            car_data['first_name'],
            car_data['last_name'],
            car_data['phone'],
            car_data['email'],
            car_data['car_brand'],
            car_data['car_model'],
            car_data['car_number_plate'],
            car_data['car_fuel'],
            car_data['car_gear'],
            car_data['price'],
            car_data['country'],
            car_data['state'],
            car_data['district']
        ))
        mysql.commit()
        cursor.close()
        mysql.close()

        return jsonify({'message': 'Car data saved successfully'}), 201
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'success': False, 'message': 'Please provide both email and password.'}), 400

        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            return jsonify({'success': False, 'message': 'Invalid email address.'}), 400

        cursor = mysql.cursor()
        cursor.execute('SELECT * FROM tokens WHERE email = %s', (email,))
        logged_in_user = cursor.fetchone()
        if logged_in_user:
            return jsonify({'success': False, 'message': 'You are already logged in.'}), 403

        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()

        if user:
            if user['password'] == password:
                token = 5

                cursor.execute('TRUNCATE TABLE tokens;')
                cursor.execute('INSERT INTO tokens (email, token) VALUES (%s, %s)', (email, token))
                mysql.commit()
                return jsonify({'success': True, 'message': 'Login successful.'}), 200
            else:
                return jsonify({'success': False, 'message': 'Incorrect password.'}), 401
        else:
            return jsonify({'success': False, 'message': 'User not found.'}), 404
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': 'An error occurred. Please try again.'}), 500 


@app.route('/profile-data')
def fetch_user_data():
    try:
        cursor = mysql.cursor()
        cursor.execute('SELECT u.* FROM users u JOIN tokens t ON u.email = t.email ORDER BY t.token LIMIT 1;')
        user_data = cursor.fetchone()

        if user_data:
            return jsonify({'user_data': user_data})
        else:
            return jsonify({'error': 'User data not found.'}), 404
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred while fetching user data'}), 500

@app.route('/check-login-status')
def check_login_status():
    try:
        cursor = mysql.cursor()
        cursor.execute('SELECT COUNT(*) FROM tokens')
        count = cursor.fetchone()[0]

        if count > 0:
            return 'true'  
        else:
            return 'false'  
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred while checking login status'}), 500  

@app.route('/get-user-details', methods=['GET'])
def get_user_details():
    try:
        cursor = mysql.cursor()
        cursor.execute('SELECT * FROM tokens LIMIT 1')
        token_row = cursor.fetchone()
        if not token_row:
            return jsonify({'error': 'No token found'}), 404

        email = token_row['email']

        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user_data = cursor.fetchone()
        if not user_data:
            return jsonify({'error': 'User not found'}), 404

        return jsonify(user_data), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/get-account-data', methods=['GET'])
def get_account_data():
    try:
        cursor = mysql.cursor()
        cursor.execute('SELECT * FROM sell_car_data')
        account_data = cursor.fetchall()
        cursor.close()
        return jsonify(account_data), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/add-to-account', methods=['POST'])
def add_to_account():
    try:
        car_details = request.json
        print(car_details)
        cursor=mysql.cursor()
        sql = """INSERT INTO account 
                     (first_name, last_name, phone, email, car_brand, car_model, 
                     car_number_plate, car_fuel, car_gear, price, country, state, district) 
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(sql, (car_details['first_name'], car_details['last_name'], car_details['phone'],
                                  car_details['email'], car_details['car_brand'], car_details['car_model'],
                                  car_details['car_number_plate'], car_details['car_fuel'], car_details['car_gear'],
                                  car_details['price'], car_details['country'], car_details['state'],
                                  car_details['district']))
        mysql.commit()

        return jsonify({'message': 'Car details added successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get-sell-car-data', methods=['GET'])
def get_sell_car_data():
    try:
        cursor = mysql.cursor()
        cursor.execute('''SELECT * FROM sell_car_data WHERE id NOT IN ( SELECT car_id FROM transactions 
        WHERE rented = 1)''')
        sell_car_data = cursor.fetchall()
        cursor.close()

        return jsonify(sell_car_data), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Internal server error'}), 500
    
    
@app.route('/add-transaction', methods=['POST'])
def add_transaction():
    try:
        car_id = request.json['carId']
        transaction_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor = mysql.cursor()
        cursor.execute('SELECT scd.price FROM sell_car_data scd WHERE id = %s;', (car_id,))
        price_data = cursor.fetchone()  # Assuming there's only one price foun
        if price_data:
            price = price_data['price']
            print(price)
            cursor.execute('SELECT u.* FROM users u JOIN tokens t ON u.email = t.email;')
            user_data = cursor.fetchone()  # Assuming there's only one user found
            
            if user_data:
                user_email = user_data['email']
                first_name = user_data['first_name']
                last_name = user_data['last_name']
                user_phone = user_data['phone_number']
                rented='1' 
                cursor.execute('INSERT INTO transactions (car_id, user_email, user_first_name, user_last_name, user_phone, price, transaction_date, rented) VALUES (%s, %s, %s, %s, %s, %s, %s,%s)', 
                               (car_id, user_email, first_name, last_name, user_phone, price, transaction_date,rented))
                
                mysql.commit()

                return jsonify({'message': 'Transaction added successfully'}), 200
            else:
                return jsonify({'error': 'User data not found'}), 404
        else:
            return jsonify({'error': 'Price data not found'}), 404
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Internal server error'}), 500
    
@app.route('/get-user-car-details', methods=['GET'])
def get_user_car_details():
    try:
        cursor = mysql.cursor()
        cursor.execute('''
            SELECT  sell_car_data.car_model, sell_car_data.car_number_plate, sell_car_data.car_brand, sell_car_data.price
            FROM tokens
            JOIN sell_car_data ON tokens.email=sell_car_data.email
        ''')
        car_data = cursor.fetchall()
        cursor.close()

        return jsonify(car_data), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Internal server error'}), 500
    
@app.route('/user-transactions', methods=['GET'])
def get_user_transactions():
    try:
        email_query = "SELECT email FROM tokens"
        with mysql.cursor() as cursor:
            cursor.execute(email_query)
            email_result = cursor.fetchone()
            if email_result:
                user_email = email_result['email']
            else:
                return jsonify({'error': 'User email not found in tokens table'}), 404
        sql_query = """SELECT scd.car_brand, scd.car_model, scd.price,tr.transaction_date FROM transactions tr JOIN sell_car_data scd ON tr.car_id = scd.id WHERE tr.user_email = %s AND tr.rented = 1
        """
        with mysql.cursor() as cursor:
            cursor.execute(sql_query, (user_email,))
            user_transactions = cursor.fetchall()
        return jsonify(user_transactions), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Internal server error'}), 500
    
@app.route('/sell-car-data-tokens', methods=['GET'])
def sell_car_data_tokens():
    try:
        cursor = mysql.cursor()
        cursor.execute('''
            SELECT sell_car_data.car_model, sell_car_data.car_number_plate, sell_car_data.car_brand, sell_car_data.price
            FROM tokens
            JOIN sell_car_data ON tokens.email = sell_car_data.email
        ''')
        car_data = cursor.fetchall()
        cursor.close()

        return jsonify(car_data), 200
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Internal server error'}), 500
        
@app.route('/submit_car', methods=['POST'])
def submit():
    try:
        transaction_data = request.get_json()
        transaction_price = transaction_data.get('price')
        cursor = mysql.cursor()
        cursor.execute("""UPDATE transactions SET rented = 0 WHERE transactions.rented = 1 AND transactions.price = %s """, (transaction_price))            
        mysql.commit()
        cursor.close()
        return jsonify({'message': 'Transactions rented status updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
    
@app.route('/remove_sell_car_data', methods=['POST'])
def remove_sell_car_data():
    try:
        data = request.get_json()
        price = data.get('price')
        car_model = data.get('car_model')
        cursor = mysql.cursor()
        cursor.execute("DELETE FROM sell_car_data WHERE price = %s AND car_model = %s", (price, car_model))
        mysql.commit()
        cursor.close()
        return jsonify({'message': 'Sell car data removed successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
    
    
    
    