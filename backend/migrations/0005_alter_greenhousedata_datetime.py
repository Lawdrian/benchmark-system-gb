# Generated by Django 4.0.3 on 2022-05-11 19:23

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_alter_greenhousedata_datetime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='greenhousedata',
            name='datetime',
            field=models.DateTimeField(default=datetime.datetime(2022, 5, 11, 19, 23, 48, 336975, tzinfo=utc)),
        ),
    ]
