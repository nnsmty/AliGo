# Generated by Django 2.2.6 on 2019-11-05 02:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ali', '0007_auto_20191101_1305'),
    ]

    operations = [
        migrations.AddField(
            model_name='ali',
            name='stock',
            field=models.CharField(default=None, max_length=300, verbose_name='库存'),
        ),
    ]
