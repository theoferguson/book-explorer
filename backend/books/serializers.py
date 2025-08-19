from rest_framework import serializers
from .models import Book
from notes.models import Note

class BookSerializer(serializers.ModelSerializer):
    user_note = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = '__all__'
    
    def get_user_note(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                note = Note.objects.get(user=request.user, book=obj)
                return {
                    'id': note.id,
                    'content': note.content,
                    'updated_at': note.updated_at
                }
            except Note.DoesNotExist:
                return None
        return None