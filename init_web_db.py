from app import app, db, User
from werkzeug.security import generate_password_hash

print("🔨 Creating web.db (SQLAlchemy)...")

with app.app_context():
    db.drop_all()
    db.create_all()
    
    # Create users
    joge = User(username='joge', password=generate_password_hash('joge'))
    admin = User(username='admin', password=generate_password_hash('admin'))
    
    db.session.add_all([joge, admin])
    db.session.commit()
    
    print("✅ web.db CREATED!")
    print(f"👤 joge ID: {joge.id}")
    print(f"👤 admin ID: {admin.id}")
