from rest_framework import serializers
from .models import Note
from books.serializers import BookSerializer

class NoteSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)
    
    class Meta:
        model = Note
        fields = ['id', 'book', 'book_details', 'content', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)