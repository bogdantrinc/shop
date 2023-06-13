from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from rest_framework import routers
from knox import views as knox_views

from users.views import LoginView, UserRegisterViewSet
from customers.views import ProfileViewSet
from products.views import ProductViewSet


admin.site.site_header = admin.site.site_title = "Shop"

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"profiles", ProfileViewSet)
router.register(r"products", ProductViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    path("auth/register", UserRegisterViewSet.as_view({'post': 'create'}), name='user_register'),
    path("auth/login", LoginView.as_view(), name='knox_login'),
    path("auth/logout", knox_views.LogoutView.as_view(), name='knox_logout'),
    path("auth/logoutall", knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Django Rest Framework URLs
if settings.DEBUG:
    urlpatterns += [path("api/", include("rest_framework.urls", namespace="rest_framework"))]
