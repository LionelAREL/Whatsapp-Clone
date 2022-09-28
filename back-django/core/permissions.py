from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        if request.method not in ['POST','PUT','DELETE','PATCH']:
            return True
        if obj.authors.filter(id__contains=request.user.id).exists() :
            return True
        return False