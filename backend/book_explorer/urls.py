from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from books.views import BookViewSet
from notes.views import NoteViewSet
from users.views import register, login

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/register/', register, name='register'),
    path('api/auth/login/', login, name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]