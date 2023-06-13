from threading import local

_user = local()

class UserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _user.value = request.user
        response = self.get_response(request)
        return response


def get_current_user():
    if hasattr(_user, 'value') and _user.value:
        return _user.value
