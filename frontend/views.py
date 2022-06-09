from django.shortcuts import render


def index(request, *args, **kwargs):
    # Finds the template beacause of this:
    # https://docs.djangoproject.com/en/4.0/topics/templates/#django.template.backends.django.DjangoTemplates
    return render(request, 'frontend/index.html')
