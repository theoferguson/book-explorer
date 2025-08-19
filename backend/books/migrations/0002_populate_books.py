from django.db import migrations
from datetime import date

def populate_books(apps, schema_editor):
    Book = apps.get_model('books', 'Book')
    
    books_data = [
        {
            'title': 'The Great Gatsby',
            'author': 'F. Scott Fitzgerald',
            'isbn': '9780743273565',
            'publication_date': date(1925, 4, 10),
            'page_count': 180,
            'genre': 'Fiction',
            'description': 'A classic American novel set in the Jazz Age.'
        },
        {
            'title': '1984',
            'author': 'George Orwell',
            'isbn': '9780451524935',
            'publication_date': date(1949, 6, 8),
            'page_count': 328,
            'genre': 'Dystopian',
            'description': 'A dystopian social science fiction novel.'
        },
        {
            'title': 'To Kill a Mockingbird',
            'author': 'Harper Lee',
            'isbn': '9780061120084',
            'publication_date': date(1960, 7, 11),
            'page_count': 324,
            'genre': 'Fiction',
            'description': 'A novel about racial injustice in the American South.'
        },
        {
            'title': 'Pride and Prejudice',
            'author': 'Jane Austen',
            'isbn': '9780141439518',
            'publication_date': date(1813, 1, 28),
            'page_count': 432,
            'genre': 'Romance',
            'description': 'A romantic novel of manners.'
        },
        {
            'title': 'The Catcher in the Rye',
            'author': 'J.D. Salinger',
            'isbn': '9780316769174',
            'publication_date': date(1951, 7, 16),
            'page_count': 277,
            'genre': 'Fiction',
            'description': 'A story about teenage rebellion and alienation.'
        }
    ]
    
    for book_data in books_data:
        Book.objects.create(**book_data)

def reverse_populate_books(apps, schema_editor):
    Book = apps.get_model('books', 'Book')
    Book.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('books', '0001_initial'),
    ]
    
    operations = [
        migrations.RunPython(populate_books, reverse_populate_books),
    ]
