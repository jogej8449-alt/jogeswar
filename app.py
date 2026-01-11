from flask import Flask, request, jsonify, send_from_directory, render_template, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SECRET_KEY'] = 'web-study-hub-2026-jogeswar-login'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///web.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 15 * 1024 * 1024  # 15MB max

# Create directories
os.makedirs('static/uploads', exist_ok=True)
os.makedirs('static', exist_ok=True)

db = SQLAlchemy()
CORS(app)
db.init_app(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(200), nullable=False)
    filepath = db.Column(db.String(500), nullable=False)
    filesize = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(50), default='general')
    mimetype = db.Column(db.String(100))
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def to_dict(self):
        return {
            'id': self.id, 
            'name': self.filename, 
            'size': self.filesize,
            'subject': self.subject,
            'timestamp': int(self.upload_date.timestamp() * 1000)
        }

with app.app_context():
    db.create_all()

# === ROUTES ===
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['username'] = username
            return redirect(url_for('dashboard'))
        elif username in ['joge', 'admin'] and password in ['joge', 'admin']:
            if not user:
                user = User(username=username, password=generate_password_hash(password))
                db.session.add(user)
                db.session.commit()
            session['user_id'] = user.id
            session['username'] = username
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials!')
    
    return render_template('index.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('dashboard.html', username=session['username'])

# API ENDPOINTS
@app.route('/api/files/study')
def get_study_files():
    if 'user_id' not in session:
        return jsonify([])
    files = File.query.filter_by(user_id=session['user_id'], category='study').order_by(File.upload_date.desc()).limit(50).all()
    return jsonify([f.to_dict() for f in files])

@app.route('/api/files/labs')
def get_labs_files():
    if 'user_id' not in session:
        return jsonify([])
    files = File.query.filter_by(user_id=session['user_id'], category='labs').order_by(File.upload_date.desc()).limit(50).all()
    return jsonify([f.to_dict() for f in files])

@app.route('/api/files/syllabus')
def get_syllabus_files():
    if 'user_id' not in session:
        return jsonify([])
    files = File.query.filter_by(user_id=session['user_id'], category='syllabus').order_by(File.upload_date.desc()).limit(50).all()
    return jsonify([f.to_dict() for f in files])

@app.route('/api/files/tests')
def get_tests_files():
    if 'user_id' not in session:
        return jsonify([])
    files = File.query.filter_by(user_id=session['user_id'], category='tests').order_by(File.upload_date.desc()).limit(50).all()
    return jsonify([f.to_dict() for f in files])

@app.route('/api/files/upload', methods=['POST'])
def api_upload_file():
    if not session.get('user_id'):
        return jsonify({'error': 'Login required'}), 401

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({'error': 'No filename'}), 400

    try:
        os.makedirs('static/uploads', exist_ok=True)
        filename = secure_filename(file.filename)
        filepath = os.path.join('static/uploads', filename)
        file.save(filepath)
        filesize = os.path.getsize(filepath)
        
        db_file = File(
            filename=filename, 
            filepath=filepath, 
            filesize=filesize,
            category=request.form.get('category', 'study'),
            subject=request.form.get('subject', 'general'),
            mimetype=file.content_type,
            user_id=session['user_id']
        )
        db.session.add(db_file)
        db.session.commit()
        
        return jsonify(db_file.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/<int:file_id>', methods=['DELETE'])
def api_delete_file(file_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    file = File.query.get_or_404(file_id)
    if file.user_id != session['user_id']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        if os.path.exists(file.filepath):
            os.remove(file.filepath)
        db.session.delete(file)
        db.session.commit()
        return jsonify({'success': True})
    except:
        return jsonify({'error': 'Delete failed'}), 500
@app.route('/api/files/blogs')
def get_blogs_files():
    if 'user_id' not in session:
        return jsonify([])
    files = File.query.filter_by(user_id=session['user_id'], category='blogs').order_by(File.upload_date.desc()).limit(50).all()
    return jsonify([f.to_dict() for f in files])

@app.route('/files/<int:file_id>')
def serve_file(file_id):
    if 'user_id' not in session:
        return redirect(url_for('index'))
    file = File.query.get_or_404(file_id)
    if file.user_id != session['user_id']:
        return "Unauthorized", 403
    return send_from_directory(os.path.dirname(file.filepath), os.path.basename(file.filepath))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
