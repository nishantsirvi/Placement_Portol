from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse, JsonResponse
from django.urls import include, path
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
def api_root(request):
    """Root API endpoint with available routes"""
    return JsonResponse(
        {
            "message": "Placement Tracking System API",
            "version": "1.0",
            "endpoints": {
                "admin": "/admin/",
                "api": {
                    "auth": {
                        "register": "/api/auth/register/",
                        "login": "/api/auth/login/",
                        "logout": "/api/auth/logout/",
                        "refresh": "/api/auth/token/refresh/",
                        "profile": "/api/auth/profile/",
                    },
                    "students": "/api/students/",
                    "companies": "/api/companies/",
                    "stages": "/api/stages/",
                    "placement_progress": "/api/placement-progress/",
                    "stage_progress": "/api/stage-progress/",
                    "important_dates": "/api/important-dates/",
                    "statistics": "/api/placement-progress/statistics/",
                    "recent_updates": "/api/placement-progress/recent_updates/",
                },
            },
            "documentation": "Visit /api/ for browsable API",
        }
    )


@require_http_methods(["GET"])
def favicon(request):
    """Return empty response for favicon to prevent 404 errors"""
    return HttpResponse(status=204)


urlpatterns = [
    path("", api_root, name="api-root"),
    path("favicon.ico", favicon, name="favicon"),
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/", include("placements.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
