from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class Role(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    def __str__(self): return self.name

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True)
    role = models.ForeignKey('authentication_folder.Role', on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    company = models.ForeignKey('core.Company', on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def __str__(self):
        return f"{self.full_name} <{self.email}>"
